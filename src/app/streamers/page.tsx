"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  BarChart3,
  Users,
  BookOpen,
  Zap,
  Shield,
  Play,
  Pause,
  MessageSquare,
  Heart,
  DollarSign,
  ChevronDown,
  Loader2,
  Search,
  Sparkles,
  Wand2,
  FileText,
  Upload,
  Video,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Headphones,
  Cross,
  MonitorPlay,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import HubBackground from "@/components/HubBackground";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const MODES = [
  { id: "broadcast", label: "Live Broadcast", icon: <Radio size={16} />, color: "#00f2ff" },
  { id: "study", label: "Message & Study", icon: <BookOpen size={16} />, color: "#00f2ff" },
  { id: "interaction", label: "Live Interaction", icon: <MessageSquare size={16} />, color: "#00f2ff" },
] as const;

const LIVE_MESSAGES = [
  "AMEN 🙏",
  "HALLELUJAH 🔥",
  "PRAYING FOR YOU 💙",
  "GLORY ✨",
  "PRAISE BREAK 🙌",
  "THANK YOU JESUS",
];

const CATEGORY_WORLDS = [
  { id: "worship", title: "WORSHIP", watching: "3.8K", rooms: "27 LIVE ROOMS", icon: <Headphones size={18} /> },
  { id: "prayer", title: "PRAYER ROOM", watching: "2.1K", rooms: "32 ACTIVE", icon: <Cross size={18} /> },
  { id: "testimonies", title: "TESTIMONIES", watching: "1.6K", rooms: "417 TODAY", icon: <Sparkles size={18} /> },
  { id: "revival", title: "REVIVAL", watching: "4.2K", rooms: "18 LIVE NOW", icon: <Flame size={18} /> },
  { id: "study", title: "BIBLE STUDY", watching: "1.3K", rooms: "22 STREAMS", icon: <BookOpen size={18} /> },
  { id: "kingdom", title: "KINGDOM BUSINESS", watching: "920", rooms: "11 LIVE TALKS", icon: <DollarSign size={18} /> },
  { id: "deliverance", title: "DELIVERANCE", watching: "1.1K", rooms: "9 LIVE ROOMS", icon: <Shield size={18} /> },
  { id: "gaming", title: "CHRISTIAN GAMING", watching: "2.7K", rooms: "35 LIVE MATCHES", icon: <MonitorPlay size={18} /> },
];

const hubStyles = `
  @keyframes gridDrift {
    0% { transform: translateY(0); opacity: .16; }
    100% { transform: translateY(22px); opacity: .16; }
  }
  @keyframes techScan {
    0% { transform: translateY(-140%); opacity: 0; }
    15% { opacity: .85; }
    55% { opacity: .22; }
    100% { transform: translateY(180%); opacity: 0; }
  }
  @keyframes borderPulse {
    0%,100% { box-shadow: 0 0 0 rgba(0,242,255,0); }
    50% { box-shadow: 0 0 54px rgba(0,242,255,.12); }
  }
  @keyframes shimmerX {
    0% { transform: translateX(-120%); opacity: 0; }
    20% { opacity: .9; }
    65% { opacity: .22; }
    100% { transform: translateX(140%); opacity: 0; }
  }
  @keyframes dotPulse {
    0% { opacity: .18; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-1px); }
    100% { opacity: .18; transform: translateY(0); }
  }
  @keyframes glowFloat {
    0% { transform: translateY(0px); opacity: .35; }
    50% { transform: translateY(-6px); opacity: .7; }
    100% { transform: translateY(0px); opacity: .35; }
  }
  @keyframes tickerMove {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes chatRise {
    0% { transform: translateY(14px); opacity: 0; }
    15% { opacity: .95; }
    80% { opacity: .55; }
    100% { transform: translateY(-18px); opacity: 0; }
  }
  @keyframes panelGlow {
    0%,100% { box-shadow: 0 0 0 rgba(0,242,255,0); }
    50% { box-shadow: 0 0 40px rgba(0,242,255,.10); }
  }
`;

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] border transition-all ${
        active
          ? "bg-[#00f2ff] text-black border-[#00f2ff] shadow-[0_0_18px_rgba(0,242,255,0.22)]"
          : "bg-white/5 text-white/45 border-white/10 hover:border-[#00f2ff]/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function MiniStatus({ isLive }: { isLive: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${isLive ? "bg-red-500" : "bg-[#00f2ff]"} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
        style={{ animation: isLive ? "dotPulse 1s ease-in-out infinite" : undefined }}
      />
      <span className="text-[10px] font-black uppercase tracking-[6px] text-white/45">STATUS</span>
      <span className={`text-[10px] font-black uppercase tracking-[6px] ${isLive ? "text-red-400" : "text-[#00f2ff]"}`}>
        {isLive ? "LIVE" : "READY"}
      </span>
    </div>
  );
}

type SermonReport = {
  score: number;
  flags: { type: "ok" | "warn"; label: string; detail: string }[];
  highlights: string[];
};

type StreamCard = {
  id: string;
  title: string;
  creator: string;
  live: boolean;
  tag: string;
  viewers: string;
};

export default function StreamerHub() {
  const supabase = createClient();
  const router = useRouter();

  const [activeMode, setActiveMode] = useState<(typeof MODES)[number]["id"]>("broadcast");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics] = useState({ support: "$2,450", active: "1.2k", praise: "1.28M", prayer: "32" });

  const [user, setUser] = useState<{ name: string; profilePic: string | null }>({
    name: "",
    profilePic: null,
  });

  const [query, setQuery] = useState("");
  const [activeRow, setActiveRow] = useState<"ForYou" | "Trending" | "New" | "Following">("ForYou");

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [checkerOpen, setCheckerOpen] = useState(false);

  const [notesTitle, setNotesTitle] = useState("Sunday Message");
  const [teleprompterText, setTeleprompterText] = useState("");
  const [teleSpeed, setTeleSpeed] = useState(26);
  const [telePlaying, setTelePlaying] = useState(false);
  const [teleFont, setTeleFont] = useState(18);

  const [notesInput, setNotesInput] = useState("");
  const [liveInput, setLiveInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [report, setReport] = useState<SermonReport | null>(null);

  const STREAMS = useMemo(
    () => ({
      ForYou: [
        { id: "s1", title: "Kingdom Night Live", creator: "Alpha Creator", live: true, tag: "Worship", viewers: "2.4K" },
        { id: "s2", title: "Sermon Studio", creator: "Beta Artist", live: false, tag: "Study", viewers: "—" },
        { id: "s3", title: "Gaming for Ministry", creator: "Zion Streamer", live: true, tag: "Gaming", viewers: "980" },
        { id: "s4", title: "Prayer & Peace", creator: "Sanctuary Host", live: false, tag: "Prayer", viewers: "—" },
      ],
      Trending: [
        { id: "t1", title: "Revival Broadcast", creator: "Kai", live: true, tag: "Live", viewers: "4.1K" },
        { id: "t2", title: "Bible Breakdown", creator: "Nia", live: false, tag: "Study", viewers: "—" },
        { id: "t3", title: "Faith Talk", creator: "Eli", live: true, tag: "Talk", viewers: "1.7K" },
        { id: "t4", title: "Worship Set", creator: "Jules", live: false, tag: "Worship", viewers: "—" },
      ],
      New: [
        { id: "n1", title: "First Stream: Welcome", creator: "New Creator", live: false, tag: "Intro", viewers: "—" },
        { id: "n2", title: "Notes to Stage", creator: "Speaker Lab", live: true, tag: "Live", viewers: "430" },
        { id: "n3", title: "Creator Setup", creator: "Parable Academy", live: false, tag: "Guide", viewers: "—" },
        { id: "n4", title: "Late Night Prayer", creator: "Peace Room", live: true, tag: "Prayer", viewers: "620" },
      ],
      Following: [
        { id: "f1", title: "Community Pulse", creator: "Alpha Creator", live: true, tag: "Live", viewers: "2.4K" },
        { id: "f2", title: "Studio Session", creator: "Beta Artist", live: false, tag: "Behind", viewers: "—" },
        { id: "f3", title: "Preach Practice", creator: "Gamma Pastor", live: false, tag: "Practice", viewers: "—" },
        { id: "f4", title: "Scripture Sprint", creator: "Delta Teacher", live: true, tag: "Study", viewers: "1.1K" },
      ],
    }),
    []
  );

  const liveRail = useMemo(
    () => [
      { id: "lr1", title: "WORSHIP NIGHT LIVE", creator: "Sanctuary Main", viewers: "3.2K", tag: "WORSHIP" },
      { id: "lr2", title: "PRAYER ROOM", creator: "Prayer Watch", viewers: "982", tag: "PRAYER" },
      { id: "lr3", title: "TESTIMONY STREAM", creator: "Faith Voices", viewers: "438", tag: "TESTIFY" },
      { id: "lr4", title: "REVIVAL NIGHT", creator: "Upper Room", viewers: "1.8K", tag: "REVIVAL" },
      { id: "lr5", title: "KINGDOM BUSINESS", creator: "Market Grace", viewers: "611", tag: "KINGDOM" },
      { id: "lr6", title: "DELIVERANCE ROOM", creator: "Freedom House", viewers: "721", tag: "DELIVERANCE" },
    ],
    []
  );

  const discoveryRows = useMemo(
    () => [
      { label: "Trending Worship", items: STREAMS.Trending },
      { label: "Prayer Rooms", items: STREAMS.Following },
      { label: "Testimony Streams", items: STREAMS.ForYou },
      { label: "New Voices", items: STREAMS.New },
    ],
    [STREAMS]
  );

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          const metadataName = authUser.user_metadata?.display_name || authUser.user_metadata?.full_name;
          const metadataAvatar = authUser.user_metadata?.avatar_url;

          let finalPic: string | null = null;
          if (metadataAvatar) {
            const { data } = supabase.storage.from("avatars").getPublicUrl(metadataAvatar);
            finalPic = `${data.publicUrl}?t=${Date.now()}`;
          }

          setUser({
            name: metadataName || "Authorized Legend",
            profilePic: finalPic,
          });
        }
      } catch (err) {
        console.error("Identity Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdentity();
  }, [supabase]);

  useEffect(() => {
    if (!teleprompterOpen || !telePlaying) return;
    const el = document.getElementById("parable-teleprompter-scroll");
    if (!el) return;

    let raf = 0;
    const tick = () => {
      el.scrollTop += teleSpeed / 60;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [teleprompterOpen, telePlaying, teleSpeed]);

  const filteredTiles = useMemo(() => {
    const row = STREAMS[activeRow];
    if (!query.trim()) return row;
    const q = query.toLowerCase();
    return row.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.creator.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q)
    );
  }, [STREAMS, activeRow, query]);

  const liveCount = useMemo(() => {
    return Object.values(STREAMS).flat().filter((stream) => stream.live).length;
  }, [STREAMS]);

  const totalDiscoverable = useMemo(() => {
    return Object.values(STREAMS).flat().length;
  }, [STREAMS]);

  const activeModeLabel = useMemo(() => {
    return MODES.find((mode) => mode.id === activeMode)?.label || "Live Broadcast";
  }, [activeMode]);

  const goSettings = () => router.push("/settings");
  const goAiStudio = () => router.push("/ai-studio");
  const goTeleprompter = () => router.push("/teleprompter");
  const goSermonChecker = () => router.push("/sermon-checker");
  const goGoLive = () => router.push("/live-studio");
  const goWatch = (id: string) => router.push(`/watch/${id}`);
  const goTiers = () => router.push("/contribution-tiers");
  const goCommunity = () => router.push("/community");
  const goTestify = () => router.push("/testify");

  const toggleLive = () => {
    setIsLive((v) => !v);
    if (!isLive) goGoLive();
  };

  const runChecker = async () => {
    setChecking(true);
    setReport(null);

    await new Promise((r) => setTimeout(r, 900));

    const a = notesInput.trim();
    const b = liveInput.trim();

    const lengthDelta = Math.abs(a.length - b.length);
    const base = a && b ? 82 : a || b ? 64 : 52;
    const score = Math.max(40, Math.min(98, base - Math.min(22, Math.floor(lengthDelta / 120))));

    const flags: SermonReport["flags"] = [];
    if (!a) flags.push({ type: "warn", label: "Missing notes", detail: "Upload or paste notes for strongest alignment checks." });
    if (!b) flags.push({ type: "warn", label: "Missing live transcript", detail: "Paste transcript or live capture for comparison." });
    if (a && b) flags.push({ type: "ok", label: "Theme alignment", detail: "Core topics appear consistent." });
    if (a && b && lengthDelta > 900) flags.push({ type: "warn", label: "Structure drift", detail: "Transcript length diverges significantly from notes." });
    if (a && b) flags.push({ type: "ok", label: "Clarity check", detail: "Key points are readable and well segmented." });

    setReport({
      score,
      flags,
      highlights: [
        "Suggested: tighten transitions between sections.",
        "Suggested: add a clear closing call-to-action.",
        "Suggested: repeat your main scripture reference once more for retention.",
      ],
    });

    setChecking(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-[#00f2ff]">
      <style>{hubStyles}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <HubBackground />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,255,0.055)_1px,transparent_1px)] bg-[size:64px_64px]"
            style={{ animation: "gridDrift 7s ease-in-out infinite alternate" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[34vh] bg-gradient-to-t from-[#00f2ff]/6 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,black_100%)] opacity-90" />
      </div>

      <Header />

      <main className="relative z-10 pt-24 pb-28 w-full">
        <div className="w-full border-y border-[#00f2ff]/10 bg-black/35 backdrop-blur-sm overflow-hidden">
          <div
            className="flex min-w-max gap-4 px-6 py-3"
            style={{ animation: "tickerMove 28s linear infinite" }}
          >
            {[...liveRail, ...liveRail].map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => goWatch(item.id)}
                className="flex items-center gap-3 rounded-full border border-[#00f2ff]/12 bg-black/55 px-4 py-3 hover:border-[#00f2ff]/30 transition-all"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">{item.tag}</span>
                <span className="text-[10px] font-black uppercase tracking-[3px] text-white">{item.title}</span>
                <span className="text-[10px] font-black uppercase tracking-[3px] text-white/50">{item.viewers} watching</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <aside className="xl:col-span-2 space-y-6">
              <div
                className="rounded-[2rem] border border-[#00f2ff]/14 bg-black/55 backdrop-blur-md p-5"
                style={{ animation: "panelGlow 5s ease-in-out infinite" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-2 border-[#00f2ff]/45 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_18px_rgba(0,242,255,0.18)]">
                        {loading ? (
                          <Loader2 className="animate-spin text-[#00f2ff]" size={18} />
                        ) : user.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="text-white/25" size={24} />
                        )}
                      </div>
                      {isLive && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black animate-pulse" />
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] font-black italic uppercase tracking-[2px] text-white">
                        {loading ? "SYNCING..." : user.name}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-[3px] text-[#00f2ff] mt-1">
                        Premium Creator
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={goSettings}
                    className="px-3 py-2 rounded-full border border-white/10 bg-black/60 hover:border-[#00f2ff]/30 transition-all"
                  >
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-white/60 inline-flex items-center gap-2">
                      Settings <ChevronDown size={12} className="text-white/35" />
                    </span>
                  </button>
                </div>

                <div className="mt-5">
                  <MiniStatus isLive={isLive} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2">
                  <button
                    onClick={goAiStudio}
                    className="w-full px-4 py-3 rounded-full border border-[#00f2ff]/25 bg-black/70 text-[10px] font-black uppercase tracking-[3px] text-[#00f2ff] hover:text-white transition-colors"
                  >
                    AI Studio
                  </button>
                  <button
                    onClick={() => setIsToolsOpen(true)}
                    className="w-full px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/55 hover:border-[#00f2ff]/25 hover:text-white transition-all"
                  >
                    Tools
                  </button>
                  <button
                    onClick={goCommunity}
                    className="w-full px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/55 hover:border-[#00f2ff]/25 hover:text-white transition-all"
                  >
                    Community
                  </button>
                  <button
                    onClick={goTestify}
                    className="w-full px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/55 hover:border-[#00f2ff]/25 hover:text-white transition-all"
                  >
                    Testify
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/55 backdrop-blur-md p-5">
                <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Global Pulse</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Praise Stream</p>
                    <p className="mt-1 text-xl font-black italic text-[#00f2ff]">{analytics.praise}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Prayer Rooms</p>
                    <p className="mt-1 text-xl font-black italic text-white">{analytics.prayer} ACTIVE</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Support</p>
                    <p className="mt-1 text-xl font-black italic text-white">{analytics.support}</p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="xl:col-span-7 space-y-8">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#00f2ff]/16 bg-black/55 backdrop-blur-md p-6">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,242,255,0.12),transparent_45%)]" />
                  <div
                    className="absolute inset-x-0 h-56 bg-gradient-to-b from-transparent via-[#00f2ff]/10 to-transparent"
                    style={{ animation: "techScan 3.8s linear infinite" }}
                  />
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
                  <div>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Featured Sanctuary Broadcast</p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-black italic uppercase tracking-[-0.08em] text-[#00f2ff]">
                          Worship Revival Night
                        </h1>
                        <p className="mt-3 text-sm md:text-base text-white/60 font-bold italic max-w-2xl leading-relaxed">
                          A full width broadcast command center with live discovery, praise energy, and creator operations all in one place.
                        </p>
                      </div>

                      <div className="rounded-full border border-[#00f2ff]/20 bg-black/60 px-4 py-3">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-red-400">
                          LIVE • 3.8K watching
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 relative aspect-[16/9] rounded-[1.75rem] overflow-hidden border border-[#00f2ff]/18 bg-black shadow-[0_0_40px_rgba(0,242,255,0.10)]">
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-red-500/30 bg-black/60 px-4 py-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[5px] text-red-300">Sanctuary Live</span>
                      </div>

                      <div className="absolute right-4 top-4 z-20 rounded-full border border-[#00f2ff]/20 bg-black/60 px-4 py-2">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">{activeModeLabel}</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Zap size={120} className="text-[#00f2ff]" />
                      </div>

                      <div className="absolute left-6 bottom-6 z-20 space-y-2">
                        {LIVE_MESSAGES.map((msg, index) => (
                          <div
                            key={msg}
                            className="rounded-full border border-[#00f2ff]/16 bg-black/55 px-4 py-2 text-[10px] font-black uppercase tracking-[3px] text-white/70 w-fit"
                            style={{
                              animation: "chatRise 4.8s ease-in-out infinite",
                              animationDelay: `${index * 0.35}s`,
                            }}
                          >
                            {msg}
                          </div>
                        ))}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5 z-20">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={goGoLive}
                              className="px-5 py-3 rounded-full bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[5px] shadow-[0_0_22px_rgba(0,242,255,0.22)]"
                            >
                              Enter Sanctuary
                            </button>
                            <button
                              onClick={goTeleprompter}
                              className="px-5 py-3 rounded-full border border-[#00f2ff]/25 bg-black/70 text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff] hover:text-white transition-colors"
                            >
                              Teleprompter
                            </button>
                            <button
                              onClick={goSermonChecker}
                              className="px-5 py-3 rounded-full border border-[#00f2ff]/25 bg-black/70 text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff] hover:text-white transition-colors"
                            >
                              Checker
                            </button>
                          </div>

                          <div className="text-[10px] font-black uppercase tracking-[4px] text-white/40">
                            Praise Break +284
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Creator Readiness</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                          <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Live Now</p>
                          <p className="mt-2 text-2xl font-black italic text-[#00f2ff]">{liveCount}</p>
                        </div>
                        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                          <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Discovery</p>
                          <p className="mt-2 text-2xl font-black italic text-white">{totalDiscoverable}</p>
                        </div>
                        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                          <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Mode</p>
                          <p className="mt-2 text-sm font-black italic uppercase text-white">{activeModeLabel}</p>
                        </div>
                        <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                          <p className="text-[9px] font-black uppercase tracking-[3px] text-white/35">Active</p>
                          <p className="mt-2 text-2xl font-black italic text-white">{analytics.active}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[#00f2ff]/14 bg-black/55 p-5">
                      <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Command Dock</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          onClick={goGoLive}
                          className="px-4 py-4 rounded-[1rem] bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[4px]"
                        >
                          Go Live
                        </button>
                        <button
                          onClick={goAiStudio}
                          className="px-4 py-4 rounded-[1rem] border border-[#00f2ff]/20 bg-[#00f2ff]/8 text-[#00f2ff] text-[10px] font-black uppercase tracking-[4px]"
                        >
                          AI Studio
                        </button>
                        <button
                          onClick={goTeleprompter}
                          className="px-4 py-4 rounded-[1rem] border border-white/10 bg-white/5 text-white/70 text-[10px] font-black uppercase tracking-[4px]"
                        >
                          Teleprompter
                        </button>
                        <button
                          onClick={goSermonChecker}
                          className="px-4 py-4 rounded-[1rem] border border-white/10 bg-white/5 text-white/70 text-[10px] font-black uppercase tracking-[4px]"
                        >
                          Sermon Checker
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[#00f2ff]/14 bg-black/40 px-5 py-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Search size={18} className="text-white/35" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search streams, creators, categories…"
                      className="bg-transparent w-[340px] max-w-full outline-none text-sm font-bold placeholder:text-white/25"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Pill active={activeRow === "ForYou"} onClick={() => setActiveRow("ForYou")}>
                      For You
                    </Pill>
                    <Pill active={activeRow === "Trending"} onClick={() => setActiveRow("Trending")}>
                      Trending
                    </Pill>
                    <Pill active={activeRow === "New"} onClick={() => setActiveRow("New")}>
                      New
                    </Pill>
                    <Pill active={activeRow === "Following"} onClick={() => setActiveRow("Following")}>
                      Following
                    </Pill>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORY_WORLDS.map((cat) => (
                  <button
                    key={cat.id}
                    className="rounded-[1.75rem] border border-[#00f2ff]/14 bg-black/55 backdrop-blur-md p-5 text-left hover:border-[#00f2ff]/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#00f2ff]">{cat.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-[4px] text-white/35">{cat.rooms}</span>
                    </div>
                    <p className="mt-5 text-lg font-black italic uppercase tracking-[-0.04em] text-white">{cat.title}</p>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">
                      {cat.watching} watching
                    </p>
                  </button>
                ))}
              </div>

              <div className="rounded-[2rem] border border-[#00f2ff]/14 bg-black/40 overflow-hidden">
                <div className="px-5 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#00f2ff]" />
                    <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">
                      {activeRow === "ForYou"
                        ? "For You"
                        : activeRow === "Trending"
                        ? "Trending Now"
                        : activeRow === "New"
                        ? "New & Rising"
                        : "Following"}
                    </p>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-[3px] text-white/35">
                    {filteredTiles.length} channels
                  </div>
                </div>

                <div className="px-5 pb-6 overflow-x-auto custom-scrollbar">
                  <div className="flex gap-4 min-w-max">
                    {filteredTiles.map((s) => (
                      <motion.button
                        key={s.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goWatch(s.id)}
                        className="w-[290px] relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/55 text-left"
                      >
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,242,255,0.12),transparent_50%)]" />
                          <div
                            className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-20"
                            style={{ animation: "shimmerX 2.2s ease-in-out infinite" }}
                          />
                        </div>

                        <div className="relative p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">{s.tag}</div>
                            {s.live ? (
                              <div className="text-[10px] font-black uppercase tracking-[4px] text-red-400">
                                LIVE • {s.viewers}
                              </div>
                            ) : (
                              <div className="text-[10px] font-black uppercase tracking-[4px] text-white/35">
                                REPLAY
                              </div>
                            )}
                          </div>

                          <div className="mt-3 h-[170px] rounded-[1.25rem] border border-[#00f2ff]/14 bg-black flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.12),transparent_60%)]" />
                            <Zap className="text-[#00f2ff]/60 relative z-10" size={40} />
                            {s.live && (
                              <div className="absolute bottom-3 left-3 rounded-full border border-red-500/30 bg-black/60 px-3 py-2">
                                <span className="text-[9px] font-black uppercase tracking-[4px] text-red-300">Praise Break +27</span>
                              </div>
                            )}
                          </div>

                          <p className="mt-4 text-[16px] font-black italic uppercase tracking-tight leading-tight">{s.title}</p>
                          <p className="mt-1 text-[11px] text-white/45 font-bold uppercase tracking-[2px]">{s.creator}</p>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="px-3 py-2 rounded-full border border-[#00f2ff]/25 bg-black/70 text-[10px] font-black uppercase tracking-[3px] text-[#00f2ff]">
                              Watch
                            </span>
                            <div className="flex items-center gap-3 text-white/35">
                              <span className="inline-flex items-center gap-1 text-[10px] font-black">
                                <Heart size={14} className="text-[#00f2ff]" /> 12K
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-black">
                                <MessageSquare size={14} className="text-[#00f2ff]" /> 940
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {discoveryRows.map((row) => (
                <div key={row.label} className="rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden">
                  <div className="px-5 py-5 flex items-center justify-between">
                    <p className="text-[12px] font-black uppercase tracking-[5px] text-white/70">{row.label}</p>
                    <button className="text-[10px] font-black uppercase tracking-[3px] text-[#00f2ff] hover:text-white transition-colors">
                      View All
                    </button>
                  </div>

                  <div className="px-5 pb-6 overflow-x-auto custom-scrollbar">
                    <div className="flex gap-4 min-w-max">
                      {row.items.map((item: StreamCard) => (
                        <motion.button
                          key={`${row.label}-${item.id}`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goWatch(item.id)}
                          className="w-[240px] rounded-[1.5rem] border border-white/10 bg-black/55 p-4 text-left hover:border-[#00f2ff]/25 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">{item.tag}</span>
                            <span className={`text-[10px] font-black uppercase tracking-[4px] ${item.live ? "text-red-400" : "text-white/35"}`}>
                              {item.live ? `LIVE • ${item.viewers}` : "REPLAY"}
                            </span>
                          </div>

                          <div className="mt-3 h-[120px] rounded-[1.25rem] border border-[#00f2ff]/14 bg-black flex items-center justify-center">
                            <Zap className="text-[#00f2ff]/60" size={34} />
                          </div>

                          <p className="mt-3 text-[14px] font-black italic uppercase tracking-tight leading-tight">{item.title}</p>
                          <p className="mt-1 text-[11px] text-white/45 font-bold uppercase tracking-[2px]">{item.creator}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <aside className="xl:col-span-3 space-y-6">
              <div className="rounded-[2rem] border border-[#00f2ff]/14 bg-black/55 backdrop-blur-md p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Mode Control</p>
                  <button
                    onClick={toggleLive}
                    className={`px-4 py-3 rounded-full font-black uppercase tracking-[4px] text-[10px] border transition-all ${
                      isLive
                        ? "bg-red-500/10 border-red-500/40 text-red-400"
                        : "bg-[#00f2ff] border-[#00f2ff] text-black shadow-[0_0_22px_rgba(0,242,255,0.22)]"
                    }`}
                  >
                    {isLive ? (
                      <span className="inline-flex items-center gap-2">
                        <Pause size={14} /> End
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Play size={14} /> Go Live
                      </span>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMode(m.id)}
                      className={`w-full px-4 py-4 rounded-[1rem] text-[10px] font-black uppercase tracking-[3px] transition-all ${
                        activeMode === m.id ? "bg-[#00f2ff] text-black" : "text-white/55 hover:text-white bg-white/5"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center gap-2 w-full">
                        {m.icon} {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/55 backdrop-blur-md p-5">
                <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Quick Launch</p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={goTeleprompter}
                    className="w-full rounded-[1rem] border border-[#00f2ff]/18 bg-black/60 p-4 text-left hover:border-[#00f2ff]/30 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#00f2ff]" />
                      <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">Teleprompter</span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/45 font-bold italic">Run clean notes while live.</p>
                  </button>

                  <button
                    onClick={goSermonChecker}
                    className="w-full rounded-[1rem] border border-white/10 bg-white/5 p-4 text-left hover:border-[#00f2ff]/25 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Wand2 size={16} className="text-[#00f2ff]" />
                      <span className="text-[10px] font-black uppercase tracking-[4px] text-white/70">Sermon Checker</span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/45 font-bold italic">Compare notes and transcript.</p>
                  </button>

                  <button
                    onClick={goTiers}
                    className="w-full rounded-[1rem] border border-white/10 bg-white/5 p-4 text-left hover:border-[#00f2ff]/25 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-[#00f2ff]" />
                      <span className="text-[10px] font-black uppercase tracking-[4px] text-white/70">Contribution Engine</span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/45 font-bold italic">Open giving and support controls.</p>
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/55 backdrop-blur-md p-5">
                <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45 flex items-center gap-2">
                  <BarChart3 size={14} className="text-[#00f2ff]" /> Stewardship Analytics
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/45">Support</p>
                    <p className="mt-2 text-xl font-black italic tracking-tighter text-white">{analytics.support}</p>
                  </div>
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/45">Active</p>
                    <p className="mt-2 text-xl font-black italic tracking-tighter text-[#00f2ff]">{analytics.active}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 242, 255, 0.18);
            border-radius: 10px;
          }
        `}</style>
      </main>

      <AnimatePresence>
        {isToolsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 size={18} className="text-[#00f2ff]" />
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/55">AI Studio Tools</p>
                </div>
                <button onClick={() => setIsToolsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="rounded-[1.5rem] border border-[#00f2ff]/18 bg-black/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[5px] text-[#00f2ff]">Teleprompter</p>
                  <p className="mt-2 text-sm text-white/60 font-bold italic leading-relaxed">
                    Upload or paste notes, then run a clean scroll overlay while live.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => router.push("/teleprompter")}
                      className="px-4 py-3 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-[5px]"
                    >
                      Open Teleprompter Page
                    </button>
                    <label className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[3px] text-white/55 cursor-pointer hover:border-[#00f2ff]/25 transition-all inline-flex items-center gap-2 justify-center">
                      <Upload size={14} className="text-[#00f2ff]" /> Upload Notes
                      <input
                        type="file"
                        accept=".txt,.md,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const text = await f.text();
                          setTeleprompterText(text);
                          setNotesInput(text);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#00f2ff]/18 bg-black/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[5px] text-[#00f2ff]">Sermon Checker</p>
                  <p className="mt-2 text-sm text-white/60 font-bold italic leading-relaxed">
                    Compare notes vs transcript, get alignment signals, and spot drift.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => router.push("/sermon-checker")}
                      className="px-4 py-3 rounded-full bg-[#00f2ff] text-black text-[9px] font-black uppercase tracking-[5px]"
                    >
                      Open Checker Page
                    </button>
                    <button
                      onClick={() => router.push("/ai-studio")}
                      className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[3px] text-white/55 hover:border-[#00f2ff]/25 transition-all"
                    >
                      Full AI Studio
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-4">
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-[#00f2ff]" />
                    <p className="text-[10px] font-black uppercase tracking-[5px] text-white/55">Streaming Features</p>
                  </div>
                  <ul className="mt-3 text-sm text-white/55 font-bold italic leading-relaxed space-y-2">
                    <li>• Watch page + chat + reactions</li>
                    <li>• VOD replay + highlights</li>
                    <li>• Subscriptions + tiers + gifting</li>
                    <li>• Moderation + safety controls</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {teleprompterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-[430px] bg-zinc-950 border border-[#00f2ff]/18 rounded-[1.75rem] overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#00f2ff]" />
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/55">Teleprompter</p>
                </div>
                <button onClick={() => setTeleprompterOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/55 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[4px] text-white/45">Title</p>
                  <input
                    value={notesTitle}
                    onChange={(e) => setNotesTitle(e.target.value)}
                    className="mt-2 w-full bg-black/60 border border-white/10 px-4 py-3 outline-none text-sm font-bold text-white rounded-[1rem] focus:border-[#00f2ff]/40"
                  />
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-black/55 p-4">
                  <p className="text-[9px] font-black uppercase tracking-[4px] text-white/45">Controls</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setTelePlaying((v) => !v)}
                      className={`flex-1 px-4 py-3 rounded-full font-black uppercase tracking-[4px] text-[10px] border transition-all ${
                        telePlaying
                          ? "bg-red-500/10 border-red-500/40 text-red-300"
                          : "bg-[#00f2ff] border-[#00f2ff] text-black shadow-[0_0_18px_rgba(0,242,255,0.18)]"
                      }`}
                    >
                      {telePlaying ? "Pause" : "Run"}
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("parable-teleprompter-scroll");
                        if (el) el.scrollTop = 0;
                      }}
                      className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[4px] text-white/55 hover:border-[#00f2ff]/25 transition-all"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-[9px] font-black uppercase tracking-[4px] text-white/45">Speed</p>
                    <input
                      type="range"
                      min={10}
                      max={70}
                      value={teleSpeed}
                      onChange={(e) => setTeleSpeed(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[3px] text-white/35">{teleSpeed} px/sec</div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[9px] font-black uppercase tracking-[4px] text-white/45">Font</p>
                    <input
                      type="range"
                      min={14}
                      max={28}
                      value={teleFont}
                      onChange={(e) => setTeleFont(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[3px] text-white/35">{teleFont}px</div>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-black/55 p-4">
                  <textarea
                    value={teleprompterText}
                    onChange={(e) => setTeleprompterText(e.target.value)}
                    placeholder="Paste notes…"
                    rows={6}
                    className="w-full bg-black/60 border border-white/10 p-4 outline-none text-sm font-bold text-white/85 rounded-[1rem] focus:border-[#00f2ff]/40 resize-none"
                  />
                </div>

                <div className="rounded-[1.25rem] border border-[#00f2ff]/14 bg-black/55 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[6px] text-white/55">Live Scroll • {notesTitle}</p>
                    <div className="text-[9px] font-black uppercase tracking-[4px] text-white/35">{telePlaying ? "RUNNING" : "PAUSED"}</div>
                  </div>

                  <div
                    id="parable-teleprompter-scroll"
                    className="h-[34vh] overflow-y-auto p-5 leading-relaxed custom-scrollbar"
                    style={{ fontSize: teleFont }}
                  >
                    <div className="text-white/80 font-bold whitespace-pre-wrap">
                      {teleprompterText || "Paste notes to begin…"}
                    </div>
                    <div className="h-24" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNotesInput(teleprompterText);
                      setTeleprompterOpen(false);
                    }}
                    className="flex-1 px-5 py-3 rounded-full bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[5px]"
                  >
                    Save Notes
                  </button>
                  <button
                    onClick={() => router.push("/teleprompter")}
                    className="flex-1 px-5 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[5px] text-white/55 hover:border-[#00f2ff]/25 transition-all"
                  >
                    Full Page
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-[430px] bg-zinc-950 border border-[#00f2ff]/18 rounded-[1.75rem] overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#00f2ff]" />
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/55">Sermon Checker</p>
                </div>
                <button onClick={() => setCheckerOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Sermon Notes</p>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Paste notes…"
                    rows={6}
                    className="mt-3 w-full bg-black/60 border border-white/10 p-4 outline-none text-sm font-bold text-white/85 rounded-[1rem] focus:border-[#00f2ff]/40 resize-none"
                  />
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-black/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[6px] text-white/45">Live Transcript</p>
                  <textarea
                    value={liveInput}
                    onChange={(e) => setLiveInput(e.target.value)}
                    placeholder="Paste transcript…"
                    rows={6}
                    className="mt-3 w-full bg-black/60 border border-white/10 p-4 outline-none text-sm font-bold text-white/85 rounded-[1rem] focus:border-[#00f2ff]/40 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNotesInput("");
                      setLiveInput("");
                      setReport(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[4px] text-white/55 hover:border-[#00f2ff]/25 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={runChecker}
                    disabled={checking}
                    className="flex-1 px-5 py-3 rounded-full bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[5px] disabled:opacity-60"
                  >
                    {checking ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Checking…
                      </span>
                    ) : (
                      "Run Check"
                    )}
                  </button>
                </div>

                <div className="rounded-[1.25rem] border border-[#00f2ff]/14 bg-black/55 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[6px] text-white/55">Report</p>
                    <p className="text-[10px] font-black uppercase tracking-[6px] text-white/35">
                      {report ? `Score: ${report.score}` : "—"}
                    </p>
                  </div>

                  {!report ? (
                    <p className="mt-3 text-sm text-white/60 font-bold italic leading-relaxed">
                      Paste notes + transcript, then run check. (UI only for now.)
                    </p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">Signals</p>
                        <div className="mt-3 space-y-3">
                          {report.flags.map((f, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              {f.type === "ok" ? (
                                <CheckCircle2 size={18} className="text-[#00f2ff]" />
                              ) : (
                                <AlertTriangle size={18} className="text-yellow-300" />
                              )}
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[3px] text-white/70">{f.label}</p>
                                <p className="text-sm text-white/55 font-bold italic">{f.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2ff]">Suggestions</p>
                        <ul className="mt-3 space-y-2">
                          {report.highlights.map((h, idx) => (
                            <li key={idx} className="text-sm text-white/60 font-bold italic leading-relaxed">
                              • {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push("/sermon-checker")}
                  className="w-full px-5 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[5px] text-white/55 hover:border-[#00f2ff]/25 transition-all"
                >
                  Open Full Checker Page
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}