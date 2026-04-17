/**
 * Populated-state mock content for Parable demos (investor / onboarding).
 * Import from `@/lib/parableMockData` or `@/lib/mockData` (see mockData.js).
 */

export type ParableFeedKind = "short" | "post";

export type ParableFeedItem = {
  id: string;
  kind: ParableFeedKind;
  username: string;
  caption: string;
  mediaUrl: string;
  thumbUrl: string;
  likes: number;
  shares: number;
  comments: number;
  createdLabel: string;
};

/** Fast placeholder images (cached CDN). */
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const PARABLE_SHORTS: ParableFeedItem[] = [
  {
    id: "sh-01",
    kind: "short",
    username: "@FilmMaker_X",
    caption: "Cold open in one take — blocking notes in the replies.",
    mediaUrl: img("parable-sh01", 720, 1280),
    thumbUrl: img("parable-sh01t", 360, 640),
    likes: 128_400,
    shares: 9_820,
    comments: 3_402,
    createdLabel: "12m ago",
  },
  {
    id: "sh-02",
    kind: "short",
    username: "@Studio_Pro",
    caption: "LUT pass vs. clean grade — side by side.",
    mediaUrl: img("parable-sh02", 720, 1280),
    thumbUrl: img("parable-sh02t", 360, 640),
    likes: 89_200,
    shares: 6_110,
    comments: 1_904,
    createdLabel: "28m ago",
  },
  {
    id: "sh-03",
    kind: "short",
    username: "@NeonCut_Rae",
    caption: "Sound design pass: subway rumble + room tone stack.",
    mediaUrl: img("parable-sh03", 720, 1280),
    thumbUrl: img("parable-sh03t", 360, 640),
    likes: 241_900,
    shares: 18_400,
    comments: 5_220,
    createdLabel: "1h ago",
  },
  {
    id: "sh-04",
    kind: "short",
    username: "@LensTheory",
    caption: "Anamorphic flares without the budget — DIY test.",
    mediaUrl: img("parable-sh04", 720, 1280),
    thumbUrl: img("parable-sh04t", 360, 640),
    likes: 56_700,
    shares: 4_002,
    comments: 982,
    createdLabel: "2h ago",
  },
  {
    id: "sh-05",
    kind: "short",
    username: "@QuietUnit",
    caption: "Director monitor setup for a 12-hour day.",
    mediaUrl: img("parable-sh05", 720, 1280),
    thumbUrl: img("parable-sh05t", 360, 640),
    likes: 312_000,
    shares: 22_100,
    comments: 8_900,
    createdLabel: "3h ago",
  },
  {
    id: "sh-06",
    kind: "short",
    username: "@FrameRunner",
    caption: "Stunt rehearsal cam — telemetry overlay mock.",
    mediaUrl: img("parable-sh06", 720, 1280),
    thumbUrl: img("parable-sh06t", 360, 640),
    likes: 74_300,
    shares: 5_400,
    comments: 1_120,
    createdLabel: "5h ago",
  },
  {
    id: "sh-07",
    kind: "short",
    username: "@CitySceneLab",
    caption: "Night exterior — practicals only, no sky panel.",
    mediaUrl: img("parable-sh07", 720, 1280),
    thumbUrl: img("parable-sh07t", 360, 640),
    likes: 198_500,
    shares: 14_200,
    comments: 4_001,
    createdLabel: "6h ago",
  },
  {
    id: "sh-08",
    kind: "short",
    username: "@AudioGrid_Mai",
    caption: "ADR lane vs. production mic — blind test.",
    mediaUrl: img("parable-sh08", 720, 1280),
    thumbUrl: img("parable-sh08t", 360, 640),
    likes: 62_000,
    shares: 3_880,
    comments: 740,
    createdLabel: "8h ago",
  },
  {
    id: "sh-09",
    kind: "short",
    username: "@VFXBench",
    caption: "Particle sim at 24fps — render budget breakdown.",
    mediaUrl: img("parable-sh09", 720, 1280),
    thumbUrl: img("parable-sh09t", 360, 640),
    likes: 445_200,
    shares: 31_000,
    comments: 12_400,
    createdLabel: "9h ago",
  },
  {
    id: "sh-10",
    kind: "short",
    username: "@CastingNotes",
    caption: "Callback energy — what we screen for in hour one.",
    mediaUrl: img("parable-sh10", 720, 1280),
    thumbUrl: img("parable-sh10t", 360, 640),
    likes: 103_800,
    shares: 7_650,
    comments: 2_300,
    createdLabel: "11h ago",
  },
  {
    id: "sh-11",
    kind: "short",
    username: "@GripCart_Kev",
    caption: "Dolly move — wheel chatter fix with tape + mass.",
    mediaUrl: img("parable-sh11", 720, 1280),
    thumbUrl: img("parable-sh11t", 360, 640),
    likes: 38_900,
    shares: 2_100,
    comments: 501,
    createdLabel: "1d ago",
  },
  {
    id: "sh-12",
    kind: "short",
    username: "@ColorVault",
    caption: "HDR pass: skin tone protection nodes.",
    mediaUrl: img("parable-sh12", 720, 1280),
    thumbUrl: img("parable-sh12t", 360, 640),
    likes: 267_000,
    shares: 19_800,
    comments: 6_700,
    createdLabel: "1d ago",
  },
];

export const PARABLE_POSTS: ParableFeedItem[] = [
  {
    id: "po-01",
    kind: "post",
    username: "@Showrunner_Lee",
    caption: "Season arc map v4 — pinning the midpoint flip. Feedback welcome.",
    mediaUrl: img("parable-po01", 1200, 675),
    thumbUrl: img("parable-po01t", 800, 450),
    likes: 52_400,
    shares: 3_200,
    comments: 902,
    createdLabel: "4m ago",
  },
  {
    id: "po-02",
    kind: "post",
    username: "@Studio_Pro",
    caption: "New slate workflow: room tone before every mag change.",
    mediaUrl: img("parable-po02", 1200, 675),
    thumbUrl: img("parable-po02t", 800, 450),
    likes: 91_000,
    shares: 6_700,
    comments: 2_100,
    createdLabel: "18m ago",
  },
  {
    id: "po-03",
    kind: "post",
    username: "@BudgetLine",
    caption: "Shot list vs. actuals — where we bled time (chart).",
    mediaUrl: img("parable-po03", 1200, 675),
    thumbUrl: img("parable-po03t", 800, 450),
    likes: 34_200,
    shares: 1_880,
    comments: 410,
    createdLabel: "32m ago",
  },
  {
    id: "po-04",
    kind: "post",
    username: "@Director_Jane",
    caption: "Uploaded a new Parable cut — color temp is still WIP.",
    mediaUrl: img("parable-po04", 1200, 675),
    thumbUrl: img("parable-po04t", 800, 450),
    likes: 176_000,
    shares: 12_400,
    comments: 5_600,
    createdLabel: "51m ago",
  },
  {
    id: "po-05",
    kind: "post",
    username: "@UnitStill_Nico",
    caption: "BTS stills drop — no spoilers, just vibes.",
    mediaUrl: img("parable-po05", 1200, 675),
    thumbUrl: img("parable-po05t", 800, 450),
    likes: 68_500,
    shares: 4_400,
    comments: 1_002,
    createdLabel: "1h ago",
  },
  {
    id: "po-06",
    kind: "post",
    username: "@RemoteSync",
    caption: "Latency test: cloud review vs. local room — numbers inside.",
    mediaUrl: img("parable-po06", 1200, 675),
    thumbUrl: img("parable-po06t", 800, 450),
    likes: 29_800,
    shares: 1_200,
    comments: 336,
    createdLabel: "2h ago",
  },
  {
    id: "po-07",
    kind: "post",
    username: "@CastingDesk",
    caption: "New casting call posted in Studio Hub — roles close Friday.",
    mediaUrl: img("parable-po07", 1200, 675),
    thumbUrl: img("parable-po07t", 800, 450),
    likes: 214_000,
    shares: 28_000,
    comments: 9_400,
    createdLabel: "3h ago",
  },
  {
    id: "po-08",
    kind: "post",
    username: "@ScoreDraft",
    caption: "Temp track vs. final — why we kept the motif.",
    mediaUrl: img("parable-po08", 1200, 675),
    thumbUrl: img("parable-po08t", 800, 450),
    likes: 47_100,
    shares: 2_900,
    comments: 612,
    createdLabel: "4h ago",
  },
  {
    id: "po-09",
    kind: "post",
    username: "@FilmMaker_X",
    caption: "Location scout notes — parking, power, and noise floor.",
    mediaUrl: img("parable-po09", 1200, 675),
    thumbUrl: img("parable-po09t", 800, 450),
    likes: 133_200,
    shares: 8_800,
    comments: 2_900,
    createdLabel: "6h ago",
  },
  {
    id: "po-10",
    kind: "post",
    username: "@Influencer_K",
    caption: "Gold Slate unlocked — thanks for the support on the live read.",
    mediaUrl: img("parable-po10", 1200, 675),
    thumbUrl: img("parable-po10t", 800, 450),
    likes: 502_000,
    shares: 41_000,
    comments: 18_200,
    createdLabel: "9h ago",
  },
  {
    id: "po-11",
    kind: "post",
    username: "@PostHouse_7",
    caption: "Deliverable checklist — what clients actually open first.",
    mediaUrl: img("parable-po11", 1200, 675),
    thumbUrl: img("parable-po11t", 800, 450),
    likes: 61_700,
    shares: 3_500,
    comments: 880,
    createdLabel: "12h ago",
  },
  {
    id: "po-12",
    kind: "post",
    username: "@IndieUnit_AJ",
    caption: "Crowd scene timing — 40 extras, 6 camera marks.",
    mediaUrl: img("parable-po12", 1200, 675),
    thumbUrl: img("parable-po12t", 800, 450),
    likes: 95_300,
    shares: 5_100,
    comments: 1_450,
    createdLabel: "1d ago",
  },
];

export type ParablePaymentAlert = {
  id: string;
  label: string;
};

export const PARABLE_PAYMENT_ALERTS: ParablePaymentAlert[] = [
  { id: "pa-1", label: "@User123 contributed $5" },
  { id: "pa-2", label: "@Influencer_K sent a Gold Slate" },
  { id: "pa-3", label: "@PixelNorth tipped $12" },
  { id: "pa-4", label: "@Studio_Pro boosted $50" },
  { id: "pa-5", label: "@NeonCut_Rae unlocked Slate Plus" },
  { id: "pa-6", label: "@QuietUnit matched $25" },
  { id: "pa-7", label: "@FrameRunner sent $8" },
  { id: "pa-8", label: "@CitySceneLab contributed $100" },
];

export type ParableRecentActivity = {
  id: string;
  label: string;
  time: string;
};

export const PARABLE_RECENT_ACTIVITY: ParableRecentActivity[] = [
  { id: "ra-1", label: "@Director_Jane uploaded a new Parable", time: "2m ago" },
  { id: "ra-2", label: "New casting call posted in Studio Hub", time: "8m ago" },
  { id: "ra-3", label: "@FilmMaker_X went live — Q&A wrap", time: "14m ago" },
  { id: "ra-4", label: "@Studio_Pro shared a storyboard pack", time: "26m ago" },
  { id: "ra-5", label: "@NeonCut_Rae hit a render milestone", time: "41m ago" },
  { id: "ra-6", label: "@Showrunner_Lee published episode notes", time: "1h ago" },
  { id: "ra-7", label: "Tip train: $240 in 10 minutes", time: "2h ago" },
  { id: "ra-8", label: "@LensTheory joined a remote review room", time: "3h ago" },
];

export type ParableLiveSession = {
  title: string;
  subtitle: string;
  host: string;
  badge: string;
  figureImage: string;
};

export const PARABLE_LIVE_SESSION: ParableLiveSession = {
  title: "Cinema Masterclass",
  subtitle: "Live production breakdown — blocking, coverage, and pace",
  host: "@Studio_Pro",
  badge: "Live production",
  figureImage: img("parable-live-host", 160, 160),
};

export const PARABLE_PROFILE_DEFAULTS = {
  followers: 142,
  following: 89,
} as const;
