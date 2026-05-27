import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-sm font-semibold tracking-[0.16em] uppercase">
          Musee Vert
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/80">
          <Link href="/" className="transition-colors hover:text-white">
            Accueil
          </Link>
          <Link href="/chapters/panorama-climatique" className="transition-colors hover:text-white">
            Premier chapitre
          </Link>
        </nav>
      </div>
    </header>
  );
}
