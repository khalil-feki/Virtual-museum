export type Artwork = {
  id: string;
  title: string;
  creator: string;
  year: string;
  medium: string;
};

export type TimelineItem = {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  audioUrl?: string;
};

export type Chapter = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  coverImage: string;
  yearsRange: string;
  timeline: TimelineItem[];
  artworks: Artwork[];
};
