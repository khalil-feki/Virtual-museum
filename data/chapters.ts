import type { Chapter } from "@/types/content";

export const chapters: Chapter[] = [
  {
    slug: "panorama-climatique",
    title: "Panorama Climatique",
    subtitle:
      "Comprendre l'urgence energetique mondiale pour orienter les choix technologiques.",
    intro:
      "Cette introduction pose les bases: emissions, demande, et trajectoires possibles pour une transition durable pilotee par la technologie.",
    coverImage: "/covers/genesis.svg",
    yearsRange: "2000-2010",
    timeline: [
      {
        id: "climat-1",
        year: "2000",
        title: "Alerte scientifique mondiale",
        description:
          "Les rapports internationaux convergent: limiter le rechauffement impose une transformation rapide des systemes energetiques.",
        image: "/design/gallery-a.svg",
      },
      {
        id: "climat-2",
        year: "2006",
        title: "Mesurer pour agir",
        description:
          "La generalisation des capteurs et des donnees ouvre la voie a des politiques climat plus precises.",
        image: "/design/gallery-d.svg",
      },
      {
        id: "climat-3",
        year: "2010",
        title: "Cap vers la neutralite carbone",
        description:
          "Les strategies nationales se structurent autour de feuilles de route net-zero et d'investissements verts.",
        image: "/design/gallery-b.svg",
      },
    ],
    artworks: [
      {
        id: "art-climat-1",
        title: "Atlas Carbone",
        creator: "Laboratoire Terra Data",
        year: "2010",
        medium: "Installation de visualisation",
      },
    ],
  },
  {
    slug: "energies-renouvelables",
    title: "Energies Renouvelables",
    subtitle:
      "Solaire, eolien et hydraulique deviennent le coeur des nouveaux mix energetiques.",
    intro:
      "Cette salle retrace l'essor des filieres renouvelables et les innovations qui accelerent leur integration au reseau.",
    coverImage: "/covers/networked-voices.svg",
    yearsRange: "2011-2018",
    timeline: [
      {
        id: "renouvelable-1",
        year: "2011",
        title: "Baisse des couts solaires",
        description:
          "Le photovoltaIque entre dans une phase d'accessibilite massive grace a l'industrialisation.",
        image: "/design/gallery-b.svg",
      },
      {
        id: "renouvelable-2",
        year: "2015",
        title: "Eolien en mer a grande echelle",
        description:
          "Les parcs offshore gagnent en puissance et stabilisent la production bas-carbone dans plusieurs regions.",
        image: "/design/gallery-a.svg",
      },
      {
        id: "renouvelable-3",
        year: "2018",
        title: "Pilotage hybride des reseaux",
        description:
          "Le couplage production, stockage et prevision permet d'augmenter la part des renouvelables.",
        image: "/design/gallery-c.svg",
      },
    ],
    artworks: [
      {
        id: "art-ren-1",
        title: "Courants de Vent",
        creator: "Collectif Horizon Bleu",
        year: "2017",
        medium: "Projection de donnees energetiques",
      },
    ],
  },
  {
    slug: "infrastructures-intelligentes",
    title: "Infrastructures Intelligentes",
    subtitle:
      "L'IA et l'IoT transforment le pilotage des reseaux, des villes et des usages.",
    intro:
      "Capteurs, compteurs communicants et controle predictif rendent les systemes energetiques plus robustes et plus sobres.",
    coverImage: "/covers/algorithmic-era.svg",
    yearsRange: "2019-2026",
    timeline: [
      {
        id: "infra-1",
        year: "2019",
        title: "Reseaux electriques connectes",
        description:
          "Les infrastructures energetiques deviennent observables en temps reel jusqu'au niveau local.",
        image: "/design/gallery-c.svg",
      },
      {
        id: "infra-2",
        year: "2022",
        title: "Flexibilite de la demande",
        description:
          "Les batiments et les industries modulent leur consommation pour lisser les pointes et integrer plus de renouvelable.",
        image: "/design/gallery-d.svg",
      },
      {
        id: "infra-3",
        year: "2026",
        title: "Jumeaux numeriques territoriaux",
        description:
          "Les simulations urbaines anticipent les besoins energetiques et orientent les investissements durables.",
        image: "/design/gallery-a.svg",
      },
    ],
    artworks: [
      {
        id: "art-infra-1",
        title: "Ville Synchrone",
        creator: "Atelier Signal Public",
        year: "2025",
        medium: "Maquette numerique interactive",
      },
    ],
  },
  {
    slug: "innovations-vertes",
    title: "Innovations Vertes",
    subtitle:
      "Mobilite electrique, hydrogene, stockage et captage carbone ouvrent la prochaine etape.",
    intro:
      "Ce chapitre explore les solutions emergentes qui relient recherche, industrie et politiques publiques pour une economie bas-carbone.",
    coverImage: "/covers/ambient-intelligence.svg",
    yearsRange: "2027-2035",
    timeline: [
      {
        id: "innovation-1",
        year: "2027",
        title: "Batteries de nouvelle generation",
        description:
          "Les nouvelles chimies ameliorent densite, securite et recyclabilite pour le stockage stationnaire et mobile.",
        image: "/design/gallery-d.svg",
      },
      {
        id: "innovation-2",
        year: "2031",
        title: "Hydrogene vert industrialise",
        description:
          "Les usages lourds decarbonent via des chaines hydrogene plus efficaces et mieux integrees.",
        image: "/design/gallery-c.svg",
      },
      {
        id: "innovation-3",
        year: "2035",
        title: "Ecosystemes regeneratifs",
        description:
          "Les villes combinent energie propre, materiaux circulaires et gouvernance ouverte pour restaurer les ressources.",
        image: "/design/gallery-b.svg",
      },
    ],
    artworks: [
      {
        id: "art-innov-1",
        title: "Boucle Regenerative",
        creator: "Collectif Biosphere",
        year: "2034",
        medium: "Installation spatiale et capteurs",
      },
    ],
  },
];

export const chaptersBySlug = Object.fromEntries(
  chapters.map((chapter) => [chapter.slug, chapter])
) as Record<string, Chapter>;

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chaptersBySlug[slug];
}
