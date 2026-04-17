/** Square thumbnails for Sanctuary Moments grid (fast CDN). */
export type SanctuaryMoment = {
  id: string;
  imageUrl: string;
  alt: string;
};

const sq = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;

export const SANCTUARY_MOMENTS: SanctuaryMoment[] = [
  { id: "m1", imageUrl: sq("sanctuary-moment-01"), alt: "Moment" },
  { id: "m2", imageUrl: sq("sanctuary-moment-02"), alt: "Moment" },
  { id: "m3", imageUrl: sq("sanctuary-moment-03"), alt: "Moment" },
  { id: "m4", imageUrl: sq("sanctuary-moment-04"), alt: "Moment" },
  { id: "m5", imageUrl: sq("sanctuary-moment-05"), alt: "Moment" },
  { id: "m6", imageUrl: sq("sanctuary-moment-06"), alt: "Moment" },
  { id: "m7", imageUrl: sq("sanctuary-moment-07"), alt: "Moment" },
  { id: "m8", imageUrl: sq("sanctuary-moment-08"), alt: "Moment" },
  { id: "m9", imageUrl: sq("sanctuary-moment-09"), alt: "Moment" },
];
