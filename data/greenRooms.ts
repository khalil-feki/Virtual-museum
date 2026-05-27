export type RoomStat = {
  label: string;
  value: string;
};

export type EcoRoom = {
  id: string;
  title: string;
  label: string;
  color: string;
  challenge: string;
  highlights: string[];
  stats: RoomStat[];
  sdg: string[];
};

export const ecoRooms: EcoRoom[] = [
  {
    id: "introduction-hall",
    title: "Hall d'Introduction",
    label: "Salle 1",
    color: "#66f2d8",
    challenge:
      "Les systemes energetiques mondiaux doivent se decarboner vite alors que la demande augmente dans les villes, l'industrie et la mobilite.",
    highlights: [
      "Etat de reference des emissions et de la demande",
      "Ecart d'urgence entre objectifs politiques et execution",
      "Role cle des jumeaux numeriques et de la prevision",
    ],
    stats: [
      { label: "CO2 mondial", value: "36.8 Gt / an" },
      { label: "Demande electrique", value: "+3.4% / an" },
      { label: "Part renouvelable", value: "30%" },
    ],
    sdg: ["SDG 7", "SDG 9", "SDG 11", "SDG 13"],
  },
  {
    id: "renewable-energy",
    title: "Energies Renouvelables",
    label: "Salle 2",
    color: "#5bf5a7",
    challenge:
      "Changer d'echelle sur le solaire, l'eolien et l'hydraulique tout en preservant resilience, biodiversite et equite territoriale.",
    highlights: [
      "Maintenance predictive des turbines et onduleurs",
      "Optimisation des sites avec intelligence geospatiale",
      "Portefeuilles hybrides pour stabiliser le reseau",
    ],
    stats: [
      { label: "LCOE solaire", value: "-89% depuis 2010" },
      { label: "Eolien offshore", value: "+18% CAGR" },
      { label: "Stockage hydraulique", value: "175 GW" },
    ],
    sdg: ["SDG 7", "SDG 8", "SDG 12", "SDG 13"],
  },
  {
    id: "smart-infrastructure",
    title: "Infrastructures Intelligentes",
    label: "Salle 3",
    color: "#53d8ff",
    challenge:
      "Les reseaux modernes exigent une coordination temps reel entre actifs distribues, flexibilite de la demande et stockage.",
    highlights: [
      "Telemetrie IoT des postes et des quartiers",
      "Dispatch IA et detection d'anomalies",
      "Flexibilite de la demande avec pilotage centre usager",
    ],
    stats: [
      { label: "Compteurs intelligents", value: "1.4 Md deployes" },
      { label: "Reduction des pertes", value: "-12% potentiel" },
      { label: "Latence de reponse", value: "< 300 ms" },
    ],
    sdg: ["SDG 9", "SDG 10", "SDG 11", "SDG 13"],
  },
  {
    id: "green-innovation",
    title: "Innovation Verte",
    label: "Salle 4",
    color: "#7cf5ff",
    challenge:
      "Les technologies emergentes doivent passer du pilote a un deploiement abordable dans les transports, les batiments et l'industrie.",
    highlights: [
      "Mobilite electrique et orchestration de la recharge",
      "Hydrogene pour les secteurs difficiles a decarboner",
      "Captage carbone et boucles materielles circulaires",
    ],
    stats: [
      { label: "Ventes VE", value: "17 M / an" },
      { label: "Cout H2 vert", value: "-45% objectif 2030" },
      { label: "Stockage batterie", value: "2.4 TWh pipeline" },
    ],
    sdg: ["SDG 9", "SDG 11", "SDG 12", "SDG 13"],
  },
  {
    id: "the-future",
    title: "Le Futur",
    label: "Salle 5",
    color: "#8cffd2",
    challenge:
      "Concevoir des villes prosperes et regeneratives ou energie propre, mobilite et gouvernance numerique cooperent.",
    highlights: [
      "Quartiers zero carbone avec microgrids integres",
      "Transport partage autonome et mobilite active",
      "Donnees climat ouvertes pour des politiques transparentes",
    ],
    stats: [
      { label: "Villes net-zero", value: "1 000+ engagements" },
      { label: "Emplois verts", value: "35 M d'ici 2030" },
      { label: "Pic d'emissions", value: "Avant 2028" },
    ],
    sdg: ["SDG 7", "SDG 9", "SDG 11", "SDG 13", "SDG 17"],
  },
];
