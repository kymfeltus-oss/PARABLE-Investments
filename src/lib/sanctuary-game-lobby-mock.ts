export type GameLobbyCard = {
  id: string;
  title: string;
  subtitle: string;
  viewers: string;
  badges: string[];
  gradient: string;
  live: boolean;
  href: string;
};

export const GAME_LOBBY_CARDS: GameLobbyCard[] = [
  {
    id: "ranked-arena",
    title: "Ranked Arena",
    subtitle: "Competitive queue · season 12",
    viewers: "42.1K live",
    badges: ["Ranked", "4K"],
    gradient: "from-[#00f2ff]/40 via-violet-500/30 to-fuchsia-500/25",
    live: true,
    href: "/gaming",
  },
  {
    id: "watch-party",
    title: "Watch Party",
    subtitle: "Synced playback + voice",
    viewers: "18.6K live",
    badges: ["Co-view", "Chat"],
    gradient: "from-cyan-500/35 via-blue-600/25 to-indigo-500/30",
    live: true,
    href: "/streamers",
  },
  {
    id: "creator-duel",
    title: "Creator Duel",
    subtitle: "Head-to-head spotlight",
    viewers: "9.2K live",
    badges: ["Live", "Drops"],
    gradient: "from-amber-500/30 via-orange-500/25 to-rose-500/30",
    live: true,
    href: "/streamers",
  },
  {
    id: "coop-raid",
    title: "Co-op Raid",
    subtitle: "Squad matchmaking",
    viewers: "31.4K live",
    badges: ["Squad", "Voice"],
    gradient: "from-emerald-500/25 via-teal-500/30 to-cyan-500/25",
    live: true,
    href: "/gaming",
  },
  {
    id: "speedrun",
    title: "Speedrun Lounge",
    subtitle: "PB attempts · mod tools",
    viewers: "6.8K live",
    badges: ["Timer", "Mods"],
    gradient: "from-pink-500/30 via-purple-500/25 to-sky-500/30",
    live: true,
    href: "/gaming",
  },
  {
    id: "open-mic",
    title: "Open Stage",
    subtitle: "Drop-in performance slots",
    viewers: "12.0K live",
    badges: ["Stage", "Queue"],
    gradient: "from-lime-400/25 via-[#00f2ff]/30 to-blue-500/25",
    live: true,
    href: "/live-studio",
  },
];
