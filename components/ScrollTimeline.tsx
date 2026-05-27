"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import type { TimelineItem } from "@/types/content";

type ScrollTimelineProps = {
  items: TimelineItem[];
};

const WHEEL_DELTA_THRESHOLD = 24;
const WHEEL_DEBOUNCE_MS = 70;
const NAV_COOLDOWN_MS = 240;

export function ScrollTimeline({ items }: ScrollTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelBufferRef = useRef(0);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queuedStepRef = useRef(0);
  const lastNavTimeRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorDrift, setCursorDrift] = useState({ x: 0, y: 0 });

  const total = items.length;

  useEffect(() => {
    if (activeIndex > total - 1) {
      setActiveIndex(Math.max(total - 1, 0));
    }
  }, [activeIndex, total]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    syncFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, []);

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), total - 1),
    [total]
  );

  const commitNavigation = useCallback(
    (step: number) => {
      setActiveIndex((prev) => {
        const next = clampIndex(prev + step);

        if (next === prev) {
          return prev;
        }

        setDirection(step > 0 ? 1 : -1);
        return next;
      });
    },
    [clampIndex]
  );

  const navigateBy = useCallback(
    (step: number) => {
      if (!total || step === 0) {
        return;
      }

      const now = Date.now();
      const elapsed = now - lastNavTimeRef.current;

      if (elapsed < NAV_COOLDOWN_MS) {
        queuedStepRef.current = step;

        if (!cooldownTimeoutRef.current) {
          cooldownTimeoutRef.current = setTimeout(() => {
            cooldownTimeoutRef.current = null;
            const queuedStep = queuedStepRef.current;
            queuedStepRef.current = 0;

            if (queuedStep !== 0) {
              lastNavTimeRef.current = Date.now();
              commitNavigation(queuedStep > 0 ? 1 : -1);
            }
          }, NAV_COOLDOWN_MS - elapsed);
        }

        return;
      }

      lastNavTimeRef.current = now;
      commitNavigation(step > 0 ? 1 : -1);
    },
    [commitNavigation, total]
  );

  const flushWheel = useCallback(() => {
    const delta = wheelBufferRef.current;
    wheelBufferRef.current = 0;

    if (Math.abs(delta) < WHEEL_DELTA_THRESHOLD) {
      return;
    }

    navigateBy(delta > 0 ? 1 : -1);
  }, [navigateBy]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !total) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      wheelBufferRef.current += event.deltaY;

      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      wheelTimeoutRef.current = setTimeout(() => {
        flushWheel();
      }, WHEEL_DEBOUNCE_MS);
    };

    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, [flushWheel, total]);

  const toggleFullscreen = useCallback(async () => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    try {
      if (document.fullscreenElement === section) {
        await document.exitFullscreen();
      } else {
        await section.requestFullscreen();
      }
    } catch {
      // Ignore unsupported fullscreen contexts.
    }
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      navigateBy(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      navigateBy(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setDirection(-1);
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setDirection(1);
      setActiveIndex(total - 1);
      return;
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      void toggleFullscreen();
    }
  };

  if (!total) {
    return null;
  }

  const activeItem = items[activeIndex];
  const years = items.map((item) => item.year);

  const gallerySlots = useMemo(
    () =>
      [-1, 0, 1].map((offset) => {
        const index = activeIndex + offset;

        if (index < 0 || index >= total) {
          return { offset, item: null as TimelineItem | null };
        }

        return { offset, item: items[index] };
      }),
    [activeIndex, items, total]
  );

  const chapterLabel = activeItem.title.toUpperCase();

  const depthGalleryItems = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index, distance: index - activeIndex }))
        .filter((entry) => Math.abs(entry.distance) <= 4),
    [activeIndex, items]
  );

  const handleHallMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setCursorDrift({ x, y });
  };

  const handleHallMouseLeave = () => {
    setCursorDrift({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Chronologie interactive"
      className={`relative overflow-hidden border border-white/30 bg-[linear-gradient(180deg,#efeaf0_0%,#e9e6ee_44%,#bca9bb_100%)] text-[#211d24] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
        isFullscreen ? "min-h-screen rounded-none" : "min-h-[86vh] rounded-[2rem]"
      }`}
    >
      {isFullscreen ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,95,131,0.52),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(192,127,162,0.45),transparent_32%),radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.72),rgba(255,255,255,0.36)_35%,rgba(175,151,170,0.38)_72%,rgba(86,70,92,0.8)_100%)]"
          />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={`arch-left-${index}`}
                className="absolute bottom-[22%] w-24 rounded-t-[5rem] border-[14px] border-b-0 border-[#a87992]/45 bg-white/75"
                style={{ left: `${index * 11 - 3}%`, height: `${64 - index * 6}%` }}
              />
            ))}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={`arch-right-${index}`}
                className="absolute bottom-[23%] w-20 rounded-t-[5rem] border-[12px] border-b-0 border-[#b0819e]/35 bg-white/75"
                style={{ right: `${index * 9 + 2}%`, height: `${58 - index * 6}%` }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-[22%] h-[22%] bg-[radial-gradient(ellipse_at_center,rgba(216,184,203,0.48),rgba(255,255,255,0.35)_50%,transparent_100%)]" />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col px-6 pb-24 pt-6 sm:px-10">
            <header className="flex items-start justify-between">
              <p className="max-w-[14rem] text-xl font-semibold uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Musee des
                <br />
                Technologies Vertes
              </p>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/35 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  A propos
                </span>
                <span className="rounded-full border border-white/35 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  Soutenir
                </span>
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  className="rounded-full border border-white/40 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                >
                  Quitter
                </button>
              </div>
            </header>

            <div
              className="relative mt-12 flex-1 overflow-hidden [perspective:1400px]"
              onMouseMove={handleHallMouseMove}
              onMouseLeave={handleHallMouseLeave}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ x: cursorDrift.x * -34, y: cursorDrift.y * -18 }}
                transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
              >
                {depthGalleryItems.map(({ item, distance }) => {
                  const abs = Math.abs(distance);
                  const isActive = distance === 0;
                  const side = distance === 0 ? 0 : distance > 0 ? 1 : -1;
                  const lateral =
                    side === 0
                      ? cursorDrift.x * 16
                      : side * (180 + abs * 145) + cursorDrift.x * (16 + abs * 8);
                  const vertical = 56 + abs * 42 + cursorDrift.y * (10 + abs * 6);
                  const scale = isActive ? 1 : Math.max(0.44, 0.95 - abs * 0.17);
                  const opacity = isActive ? 1 : Math.max(0.18, 0.86 - abs * 0.18);
                  const rotateY = side * -11;
                  const zIndex = 40 - abs;

                  return (
                    <motion.button
                      key={`depth-${item.id}`}
                      type="button"
                      onClick={() => {
                        setDirection(distance > 0 ? 1 : -1);
                        setActiveIndex((prev) => clampIndex(prev + distance));
                      }}
                      className="absolute left-1/2 top-0 w-[22rem] -translate-x-1/2 overflow-hidden border border-white/45 bg-white/40 shadow-[0_20px_58px_rgba(83,58,79,0.24)] backdrop-blur"
                      style={{
                        height: isActive ? "22.5rem" : "15rem",
                        zIndex,
                        transformStyle: "preserve-3d",
                      }}
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{
                        x: lateral,
                        y: vertical,
                        opacity,
                        scale,
                        rotateY,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 18 }}
                      aria-label={`Selectionner l'etape ${item.title}`}
                    >
                      <Image
                        src={item.image}
                        alt={`Visuel ${item.title}`}
                        fill
                        sizes="(max-width: 1280px) 80vw, 352px"
                        className="object-cover"
                      />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#3f3442]/72 via-[#5e4e60]/34 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-20 px-8 pb-8">
            <div className="rounded-[2.25rem] border border-white/30 bg-white/12 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-white/85">
                <span className="h-px w-24 border-t border-dotted border-white/70" />
                <div className="flex flex-1 items-center justify-between gap-4 px-4">
                  {years.map((year, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={`full-year-${year}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className="flex flex-col items-center gap-2"
                        aria-label={`Aller a l'annee ${year}`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full border ${
                            isActive
                              ? "border-[#ff4260] bg-[#ff4260] shadow-[0_0_0_3px_rgba(255,66,96,0.28)]"
                              : "border-white/55 bg-white/50"
                          }`}
                        />
                        <span className="text-sm text-white/85">{year}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="h-px w-24 border-t border-dotted border-white/70" />
              </div>

              <div className="mt-5 flex items-center justify-between text-white">
                <button type="button" className="h-11 w-11 rounded-full border border-white/45 text-xl">
                  i
                </button>
                <p className="text-5xl font-semibold uppercase tracking-[0.12em]">{chapterLabel}</p>
                <div className="flex items-center gap-3 text-lg">
                  <button type="button" className="h-11 w-11 rounded-full border border-white/45">
                    ◦
                  </button>
                  <button type="button" className="h-11 w-11 rounded-full border border-white/45">
                    ⌂
                  </button>
                  <button type="button" className="h-11 w-11 rounded-full border border-white/45">
                    ◉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(226,163,190,0.5),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(194,175,210,0.55),transparent_34%),radial-gradient(circle_at_50%_95%,rgba(255,255,255,0.5),transparent_38%)]"
          />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 [perspective:1400px]">
              <div className="absolute left-0 top-[12%] h-[72%] w-[24%] rounded-r-[1.75rem] border-r border-white/25 bg-[linear-gradient(135deg,rgba(132,93,121,0.26),rgba(238,226,236,0.34))] [transform:perspective(1200px)_rotateY(36deg)_translateX(-22%)]" />
              <div className="absolute right-0 top-[12%] h-[72%] w-[24%] rounded-l-[1.75rem] border-l border-white/25 bg-[linear-gradient(225deg,rgba(128,91,122,0.26),rgba(237,225,235,0.34))] [transform:perspective(1200px)_rotateY(-36deg)_translateX(22%)]" />
              <div className="absolute left-[20%] top-[12%] h-[60%] w-[60%] rounded-[1.5rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(242,236,244,0.15))] shadow-[inset_0_-20px_60px_rgba(90,76,102,0.14)]" />
              <div className="absolute bottom-[-11%] left-1/2 h-[34%] w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(250,243,248,0.72)_0%,rgba(213,194,208,0.45)_38%,rgba(122,97,125,0.18)_74%,transparent_100%)] [transform:perspective(900px)_rotateX(72deg)]" />
            </div>
          </div>

          <div className="relative z-10 px-5 pb-28 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3a3440]/80">
                  Musee des Technologies Vertes
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {activeItem.title}
                </h3>
                <p className="text-sm font-medium text-[#433b4c]/80">{activeItem.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#4a4354]/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#3a3342]/70">
                  Molette ou fleches
                </span>
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  className="rounded-full border border-[#4a4354]/25 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f2838] transition-colors hover:bg-white"
                >
                  Plein ecran
                </button>
              </div>
            </div>

            <div className="mt-8 grid items-end gap-6 xl:grid-cols-[1.4fr_340px]">
              <div className="grid min-h-[24rem] grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
                {gallerySlots.map(({ offset, item }) => {
                  if (!item) {
                    return (
                      <div
                        key={`slot-empty-${offset}`}
                        aria-hidden="true"
                        className="mx-auto h-72 w-full max-w-[280px] opacity-0"
                      />
                    );
                  }

                  const isActive = offset === 0;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDirection(offset > 0 ? 1 : -1);
                        setActiveIndex((prev) => clampIndex(prev + offset));
                      }}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{
                        opacity: isActive ? 1 : 0.78,
                        y: isActive ? 0 : 18,
                        scale: isActive ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="group relative mx-auto flex h-72 w-full max-w-[280px] flex-col overflow-hidden rounded-t-[999px] rounded-b-3xl border border-white/60 bg-white/60 text-left shadow-[0_15px_40px_rgba(50,42,57,0.18)] backdrop-blur"
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Selectionner l'etape ${item.title}`}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={item.image}
                          alt={`Visuel ${item.title}`}
                          fill
                          sizes="(max-width: 1024px) 90vw, 280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f4eef4]/85 via-[#f4eef45f] to-transparent" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-[#3f3948]/75">
                          {item.year}
                        </p>
                        <p className="text-base font-semibold text-[#26212d]">{item.title}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.aside
                  key={activeItem.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 30 : -30, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -30 : 30, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="rounded-[1.8rem] border border-[#3d3447]/20 bg-[linear-gradient(170deg,#2f2737_0%,#1f1a25_100%)] p-5 text-white shadow-[0_18px_48px_rgba(22,17,28,0.45)]"
                >
                  <div className="relative h-44 overflow-hidden rounded-2xl border border-white/20">
                    <Image
                      src={activeItem.image}
                      alt={`Detail ${activeItem.title}`}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/60">
                    Recit de periode
                  </p>
                  <h4 className="mt-1 text-3xl font-semibold tracking-tight">{activeItem.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{activeItem.description}</p>
                  {activeItem.audioUrl ? (
                    <audio className="mt-4 w-full" controls preload="none" src={activeItem.audioUrl}>
                      Votre navigateur ne prend pas en charge l'audio.
                    </audio>
                  ) : null}
                </motion.aside>
              </AnimatePresence>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2a242f]/45 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6 sm:px-8">
            <div className="rounded-[2rem] border border-white/30 bg-white/20 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="relative h-[2px] w-full bg-[#f3eef5]/80" />
              <ol className="mt-3 flex items-center justify-between gap-2" aria-label="Annees de la chronologie">
                {years.map((year, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <li key={`${year}-${index}`} className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDirection(index > activeIndex ? 1 : -1);
                          setActiveIndex(index);
                        }}
                        aria-label={`Aller a l'annee ${year}`}
                        aria-current={isActive ? "step" : undefined}
                        className="rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                      >
                        <span
                          className={`block h-2.5 w-2.5 rounded-full transition-all ${
                            isActive ? "scale-125 bg-[#ff4560]" : "bg-[#766a81]/70"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-[10px] uppercase tracking-[0.12em] ${
                          isActive ? "text-[#332b3d]" : "text-[#62566d]/80"
                        }`}
                      >
                        {year}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#52485f]/75">
                Defiler pour naviguer
              </p>
            </div>
          </div>
        </>
      )}

      <div className="sr-only" aria-live="polite">
        {activeItem.year}: {activeItem.title}
      </div>
    </section>
  );
}
