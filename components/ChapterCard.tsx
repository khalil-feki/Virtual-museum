"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

import type { Chapter } from "@/types/content";

type ChapterCardProps = {
  chapter: Chapter;
  index: number;
};

export function ChapterCard({ chapter, index }: ChapterCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={clsx(
        "group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-colors",
        "focus-within:border-white/40 hover:border-white/30 hover:bg-white/10"
      )}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={chapter.coverImage}
          alt={`Visuel du chapitre ${chapter.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-white/60">
          {chapter.yearsRange}
        </p>
        <h2 className="mt-3 text-xl font-semibold">{chapter.title}</h2>
        <p className="mt-2 text-sm text-white/70">{chapter.subtitle}</p>
        <Link
          href={`/chapters/${chapter.slug}`}
          aria-label={`Ouvrir le chapitre ${chapter.title}`}
          className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.13em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Entrer
        </Link>
      </div>
    </motion.article>
  );
}
