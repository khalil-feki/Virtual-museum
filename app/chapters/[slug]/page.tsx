import Link from "next/link";

import { ChapterSwitcher } from "@/components/ChapterSwitcher";
import { ScrollTimeline } from "@/components/ScrollTimeline";
import { chapters, getChapterBySlug } from "@/data/chapters";

type ChapterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-16 sm:px-8">
        <section className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">
            Chapitre introuvable
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Cette salle n'existe pas.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">
            Le slug du chapitre est invalide ou a ete deplace. Revenez a
            l'accueil pour poursuivre la visite.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black"
          >
            Retour a l'accueil
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[92rem] flex-col gap-6 px-3 py-6 sm:px-5 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,rgba(210,165,196,0.28),transparent_36%),radial-gradient(circle_at_85%_6%,rgba(171,157,205,0.2),transparent_34%)]" />

      <div className="flex items-center justify-between gap-3 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/90 sm:text-sm">
          Musee des Technologies Vertes
        </p>
        <Link
          href="/"
          className="w-fit rounded-full border border-white/30 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white hover:text-black"
        >
          Retour a l'accueil
        </Link>
      </div>

      <ChapterSwitcher chapters={chapters} activeSlug={slug} />

      <section className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-white/60">
          {chapter.yearsRange}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">{chapter.title}</h1>
        <p className="mt-4 max-w-4xl text-sm text-white/85 sm:text-base">{chapter.intro}</p>
      </section>

      <ScrollTimeline items={chapter.timeline} />

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h2 className="text-lg font-semibold">Oeuvres mises en avant</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {chapter.artworks.map((artwork) => (
            <li key={artwork.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm font-medium">{artwork.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/60">
                {artwork.year} · {artwork.medium}
              </p>
              <p className="mt-2 text-sm text-white/75">par {artwork.creator}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
