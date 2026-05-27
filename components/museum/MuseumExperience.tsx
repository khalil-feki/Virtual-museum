"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ecoRooms } from "@/data/greenRooms";
import { AmbientSoundToggle } from "@/components/museum/AmbientSoundToggle";
import { LoadingScreen } from "@/components/museum/LoadingScreen";

const LazyMuseumScene = lazy(() => import("@/components/museum/MuseumScene"));

gsap.registerPlugin(ScrollTrigger);

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export function MuseumExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const [progress, setProgress] = useState(0);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const activeRoom = ecoRooms[activeRoomIndex] ?? ecoRooms[0];

  useEffect(() => {
    const handleScroll = () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const startY = root.offsetTop;
      const maxMuseumScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      const relative = clamp((window.scrollY - startY) / maxMuseumScroll);

      setProgress(relative);

      const index = Math.min(ecoRooms.length - 1, Math.floor(relative * ecoRooms.length));
      setActiveRoomIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header || !rootRef.current) {
      return;
    }

    const tween = gsap.to(header, {
      y: -48,
      opacity: 0.45,
      ease: "none",
      scrollTrigger: {
        trigger: rootRef.current,
        start: "top top",
        end: "+=1600",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const triggers = sectionRefs.current
      .filter((section): section is HTMLElement => Boolean(section))
      .map((section) => {
        const block = section.querySelector(".tv-room-copy");

        if (!block) {
          return null;
        }

        return gsap.fromTo(
          block,
          { y: 46, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 73%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );
      })
      .filter((anim): anim is gsap.core.Tween => Boolean(anim));

    return () => {
      triggers.forEach((trigger) => {
        trigger.scrollTrigger?.kill();
        trigger.kill();
      });
    };
  }, []);

  useEffect(() => {
    if (focusMode) {
      return;
    }

    if (!infoRef.current) {
      return;
    }

    gsap.fromTo(
      infoRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [activeRoomIndex]);

  const jumpToRoom = (index: number) => {
    const section = sectionRefs.current[index];

    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rightProgressScale = useMemo(() => ({ transform: `scaleY(${progress})` }), [progress]);

  return (
    <div className="tv-root" ref={rootRef}>
      <div className="tv-canvas-layer" aria-hidden="true">
        <Canvas camera={{ position: [0, 2.8, 10], fov: 46 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <LazyMuseumScene
              rooms={ecoRooms}
              progress={progress}
              activeRoomIndex={activeRoomIndex}
            />
          </Suspense>
        </Canvas>
      </div>

      {!loaderHidden ? <LoadingScreen onComplete={() => setLoaderHidden(true)} /> : null}

      <div className="tv-overlay-shell">
        {!focusMode ? (
          <header className="tv-header" ref={headerRef}>
            <p className="tv-kicker">Musee Virtuel des Technologies Vertes</p>
            <h1 className="tv-title">Technologies Vertes</h1>
            <p className="tv-question">
              Comment les technologies numeriques et l'innovation peuvent-elles
              accelerer la transition vers un futur 100% renouvelable ?
            </p>
            <div className="tv-header-controls">
              <AmbientSoundToggle />
              <button
                type="button"
                className="tv-focus-toggle"
                onClick={() => setFocusMode(true)}
                aria-pressed={focusMode}
                aria-label="Activer le mode focus"
              >
                Mode focus
              </button>
            </div>
          </header>
        ) : null}

        {focusMode ? (
          <button
            type="button"
            className="tv-focus-fab"
            onClick={() => setFocusMode(false)}
            aria-label="Reafficher l'interface"
          >
            Afficher l'interface
          </button>
        ) : null}

        {!focusMode ? (
          <>
            <aside
              className="tv-info-panel"
              ref={infoRef}
              aria-label="Informations de la salle active"
            >
              <p className="tv-room-label">
                {activeRoom.label} - {activeRoom.title}
              </p>
              <p className="tv-room-challenge">{activeRoom.challenge}</p>

              <div className="tv-stat-grid">
                {activeRoom.stats.map((stat) => (
                  <article className="tv-stat-card" key={`${activeRoom.id}-${stat.label}`}>
                    <p className="tv-stat-label">{stat.label}</p>
                    <p className="tv-stat-value">{stat.value}</p>
                  </article>
                ))}
              </div>

              <ul className="tv-highlights">
                {activeRoom.highlights.map((highlight) => (
                  <li key={`${activeRoom.id}-${highlight}`}>{highlight}</li>
                ))}
              </ul>

              <p className="tv-sdg-row">Objectifs ODD: {activeRoom.sdg.join(" | ")}</p>

              <div className="tv-dot-nav" role="navigation" aria-label="Navigation rapide des salles">
                {ecoRooms.map((room, index) => (
                  <button
                    key={`dot-${room.id}`}
                    type="button"
                    onClick={() => jumpToRoom(index)}
                    className={`tv-dot ${activeRoomIndex === index ? "is-active" : ""}`}
                    aria-label={`Aller a ${room.title}`}
                  />
                ))}
              </div>
            </aside>

            <nav className="tv-timeline" aria-label="Chronologie du musee">
              {ecoRooms.map((room, index) => (
                <button
                  key={`timeline-${room.id}`}
                  type="button"
                  className={`tv-timeline-item ${activeRoomIndex === index ? "is-active" : ""}`}
                  onClick={() => jumpToRoom(index)}
                  aria-label={`Acceder a ${room.title}`}
                >
                  <span className="tv-timeline-label">{room.label}</span>
                  <span className="tv-timeline-title">{room.title}</span>
                </button>
              ))}
              <div className="tv-progress-rail" aria-hidden="true">
                <div className="tv-progress-fill" style={rightProgressScale} />
              </div>
            </nav>

            <footer className="tv-footer-msg">
              L'innovation durable commence maintenant. Soutenez la recherche,
              les politiques et l'education pour une energie propre.
            </footer>
          </>
        ) : null}
      </div>

      <main className={`tv-scroll-track ${focusMode ? "is-hidden-copy" : ""}`} aria-label="Sections narratives des salles">
        {ecoRooms.map((room, index) => (
          <section
            key={`section-${room.id}`}
            className="tv-room-section"
            ref={(element) => {
              sectionRefs.current[index] = element;
            }}
          >
            <div className="tv-room-copy" style={{ borderColor: `${room.color}66` }}>
              <p className="tv-room-copy-kicker">{room.label}</p>
              <h2>{room.title}</h2>
              <p>{room.challenge}</p>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
