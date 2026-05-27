"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";

import type { Chapter } from "@/types/content";

type ChapterSwitcherProps = {
  chapters: Chapter[];
  activeSlug: string;
};

export function ChapterSwitcher({ chapters, activeSlug }: ChapterSwitcherProps) {
  return (
    <LayoutGroup id="chapter-switcher">
      <nav
        aria-label="Navigation des chapitres"
        className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur"
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((chapter) => {
            const isActive = chapter.slug === activeSlug;

            return (
              <li key={chapter.slug}>
                <Link
                  href={`/chapters/${chapter.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-full min-h-16 items-center rounded-2xl border border-transparent px-4 py-3 text-sm transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="active-chapter-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                      className="absolute inset-0 rounded-2xl border border-white/30 bg-white/12"
                    />
                  ) : null}
                  <span className="relative z-10 flex flex-col">
                    <span className="text-xs uppercase tracking-[0.12em] text-white/60">
                      {chapter.yearsRange}
                    </span>
                    <span className="mt-1 font-medium text-white/90">{chapter.title}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </LayoutGroup>
  );
}
