"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ChapterCard } from "@/components/ChapterCard";
import { chapters } from "@/data/chapters";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden px-5 pb-10 pt-5 sm:px-8 lg:px-12">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(120, 211, 255, 0.18), transparent 36%), radial-gradient(circle at 85% 5%, rgba(149, 255, 229, 0.12), transparent 30%), radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.08), transparent 42%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 50%", "0% 100%"],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-44 h-80 w-80 rounded-full bg-emerald-200/10 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex flex-col">
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="flex items-start justify-between gap-4 pt-2"
          >
            <p className="max-w-xs text-sm font-medium uppercase tracking-[0.14em] text-white/85">
              Musee des Technologies Vertes
            </p>
            <nav aria-label="Primary" className="flex items-center gap-3">
              <Link
                href="#about"
                className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white hover:text-black"
              >
                A propos
              </Link>
              <Link
                href="#support"
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Soutenir
              </Link>
              <Link
                href="/technologies-vertes"
                className="rounded-full border border-cyan-200/40 bg-cyan-200/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-cyan-100 transition-colors hover:bg-cyan-200 hover:text-slate-900"
              >
                Musee 3D
              </Link>
            </nav>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-10"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">
              Parcours Curatorial
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Explorez la transition vers un futur durable, salle par salle.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
              Quatre chapitres pour comprendre l'energie propre, les reseaux
              intelligents et les innovations climatiques.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#chapitres"
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Explorer les chapitres
              </Link>
              <Link
                href="/technologies-vertes"
                className="rounded-full border border-cyan-200/40 bg-cyan-200/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-cyan-100 transition-colors hover:bg-cyan-200 hover:text-slate-900"
              >
                Entrer dans le musee 3D
              </Link>
            </div>
          </motion.div>
        </section>

        <motion.section
          id="chapitres"
          aria-label="Chapitres du musee"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {chapters.map((chapter, index) => (
            <ChapterCard key={chapter.slug} chapter={chapter} index={index} />
          ))}
        </motion.section>

        <section className="grid gap-4 pb-2 md:grid-cols-2">
          <section
            id="about"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/75"
          >
            Une experience pedagogique qui relie science du climat, technologies
            vertes et design interactif.
          </section>

          <section
            id="support"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/75"
          >
            Votre soutien aide a maintenir ce musee comme ressource ouverte
            d'apprentissage.
          </section>
        </section>
      </main>
    </div>
  );
}
