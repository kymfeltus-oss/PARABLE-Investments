"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  BadgeCheck,
  Heart,
  DollarSign,
  Gift,
  Radio,
  Gamepad2,
  Users,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  Link as LinkIcon,
  Play,
  Plus,
  Star,
  Music4,
  MessageCircle,
  Crown,
  Shield,
  Wallet,
  CalendarDays,
  Eye,
} from "lucide-react";

function frac(n: number) {
  return n - Math.floor(n);
}

function prand(seed: number) {
  return frac(Math.sin(seed * 9999.123) * 10000);
}

function ProfileSparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 58 }).map((_, i) => {
      const r1 = prand(i + 1);
      const r2 = prand(i + 101);
      const r3 = prand(i + 1001);
      const r4 = prand(i + 5001);

      return {
        id: i,
        left: `${(r1 * 100).toFixed(4)}%`,
        top: `${(r2 * 100).toFixed(4)}%`,
        dur: `${(4.2 + r3 * 3.4).toFixed(4)}s`,
        delay: `${(r4 * 1.6).toFixed(4)}s`,
        size: 1 + (i % 3),
        opacity: 0.18 + (i % 4) * 0.08,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-[#00f2fe] shadow-[0_0_16px_rgba(0,242,254,0.75)]"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `profileSpark ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes profileSpark {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.08);
          }
          100% {
            transform: translate3d(0, -44px, 0) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes profileOcean {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(2%, -2%, 0) rotate(5deg);
          }
        }

        @keyframes borderGlow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(0, 242, 254, 0);
          }
          50% {
            box-shadow: 0 0 48px rgba(0, 242, 254, 0.12);
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <span className="text-white/40">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-[3px] text-white/35">
          Live Stat
        </span>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[4px] text-white/45">
        {label}
      </p>
      <p className="mt-1 text-[20px] font-black text-white">{value}</p>
    </div>
  );
}

function SupportCard({
  title,
  amount,
  subtitle,
  icon,
  active = false,
}: {
  title: string;
  amount: string;
  subtitle: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={[
        "w-full rounded-[24px] border p-5 text-left backdrop-blur-2xl transition-all",
        active
          ? "border-[#00f2fe]/28 bg-[#00f2fe]/10 shadow-[0_0_42px_rgba(0,242,254,0.12)]"
          : "border-white/10 bg-white/[0.04] hover:border-[#00f2fe]/20",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#00f2fe]">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2fe]">
          {amount}
        </span>
      </div>

      <h3 className="mt-5 text-[18px] font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/55 leading-relaxed">{subtitle}</p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#00f2fe]/20 bg-black/45 px-4 py-2">
        <span className="text-[10px] font-black uppercase tracking-[4px] text-[#00f2fe]">
          Support Now
        </span>
      </div>
    </motion.button>
  );
}

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button className="rounded-[18px] border border-white/10 bg-black/45 px-4 py-3 text-[10px] font-black uppercase tracking-[3px] text-white/70 hover:bg-white/10 transition inline-flex items-center gap-2">
      <span className="text-[#00f2fe]">{icon}</span>
      {label}
    </button>
  );
}

function MediaCard({
  title,
  subtitle,
  tag,
}: {
  title: string;
  subtitle: string;
  tag: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,242,254,0.08)]"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#00f2fe]" />
          <span className="text-[10px] font-black uppercase tracking-[4px] text-white/65">
            {tag}
          </span>
        </span>

        <button className="rounded-full border border-[#00f2fe]/18 bg-[#00f2fe]/10 p-3 text-[#00f2fe]">
          <Play size={14} />
        </button>
      </div>

      <div className="mt-4 h-[160px] rounded-[20px] border border-[#00f2fe]/12 bg-black/45 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.14),transparent_58%)]" />
        <Play className="relative z-10 text-[#00f2fe]/55" size={36} />
      </div>

      <h3 className="mt-4 text-[18px] font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/55 leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

export default function ProfilePage() {
  const [selectedSupport, setSelectedSupport] = useState("Seed");

  const supportOptions = [
    {
      title: "Seed",
      amount: "$25",
      subtitle: "A faith seed to support the creator’s vision, content, and community work.",
      icon: <Sparkles size={18} />,
    },
    {
      title: "Tithe",
      amount: "$50",
      subtitle: "Support kingdom building, stewardship, and long term growth through consistent giving.",
      icon: <Crown size={18} />,
    },
    {
      title: "Offering",
      amount: "$100",
      subtitle: "A special offering to bless the work, the mission, and the impact being built here.",
      icon: <Gift size={18} />,
    },
    {
      title: "Partner Support",
      amount: "$250",
      subtitle: "A higher support level for followers who want to invest in expansion and vision.",
      icon: <Shield size={18} />,
    },
  ];

  const media = [
    {
      title: "Latest Stream Replay",
      subtitle: "Catch the most recent live moment, community energy, and support highlights.",
      tag: "Replay",
    },
    {
      title: "Featured Testimony Clip",
      subtitle: "A short form testimony moment pinned for the profile audience.",
      tag: "Testify",
    },
    {
      title: "Sanctuary Session",
      subtitle: "A featured music or worship clip spotlighted on the profile.",
      tag: "Music",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-[-30%] opacity-[0.20] blur-[90px] animate-[profileOcean_18s_ease-in-out_infinite] bg-[radial-gradient(circle_at_18%_18%,rgba(0,242,254,0.34),transparent_55%),radial-gradient(circle_at_75%_68%,rgba(255,255,255,0.12),transparent_60%),radial-gradient(circle_at_46%_82%,rgba(0,242,254,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.10] [background:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.74)_58%,rgba(0,0,0,0.97)_100%)]" />
      </div>

      <ProfileSparkles />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 pb-28 pt-10">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div
              className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_140px_rgba(0,242,254,0.12)]"
              style={{ animation: "borderGlow 5.4s ease-in-out infinite" }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[radial-gradient(circle_at_18%_18%,rgba(0,242,254,0.18),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.08),transparent_60%)]" />

              <div className="relative">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#00f2fe]/35 bg-black/55 shadow-[0_0_34px_rgba(0,242,254,0.18)]">
                        <User className="text-[#00f2fe]" size={40} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-red-500">
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-white"
                          style={{ animation: "pulseDot 1.15s ease-in-out infinite" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                        <BadgeCheck size={14} className="text-[#00f2fe]" />
                        <span className="text-[11px] font-black uppercase tracking-[4px] text-white/70">
                          Verified Creator
                        </span>
                      </div>

                      <h1 className="mt-4 text-[38px] sm:text-[52px] font-black leading-[0.98] tracking-tight">
                        KYM THE{" "}
                        <span className="relative inline-block">
                          <span className="absolute -inset-2 blur-2xl opacity-60 bg-[radial-gradient(circle_at_30%_40%,rgba(0,242,254,0.42),transparent_60%)]" />
                          <span className="relative text-[#00f2fe] drop-shadow-[0_0_24px_rgba(0,242,254,0.55)]">
                            CEO
                          </span>
                        </span>
                      </h1>

                      <p className="mt-3 max-w-[760px] text-[15px] leading-relaxed text-white/65">
                        Streamer, storyteller, builder, and visionary creating digital sanctuary experiences for community, worship, entertainment, and impact.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <button className="rounded-[20px] bg-[#00f2fe] px-5 py-4 text-[10px] font-black uppercase tracking-[4px] text-black shadow-[0_0_30px_rgba(0,242,254,0.18)]">
                      Follow
                    </button>
                    <button className="rounded-[20px] border border-white/10 bg-black/50 px-5 py-4 text-[10px] font-black uppercase tracking-[4px] text-white/70 hover:bg-white/10 transition">
                      Message
                    </button>
                    <button className="rounded-[20px] border border-white/10 bg-black/50 px-5 py-4 text-[10px] font-black uppercase tracking-[4px] text-white/70 hover:bg-white/10 transition">
                      Watch Live
                    </button>
                    <button className="rounded-[20px] border border-white/10 bg-black/50 px-5 py-4 text-[10px] font-black uppercase tracking-[4px] text-white/70 hover:bg-white/10 transition">
                      Support
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <SocialButton label="Instagram" icon={<Instagram size={14} />} />
                  <SocialButton label="Facebook" icon={<Facebook size={14} />} />
                  <SocialButton label="YouTube" icon={<Youtube size={14} />} />
                  <SocialButton label="Link Hub" icon={<LinkIcon size={14} />} />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 grid grid-cols-2 gap-4">
            <StatCard label="Followers" value="24.8K" icon={<Users size={18} />} />
            <StatCard label="Live Viewers" value="3.2K" icon={<Eye size={18} />} />
            <StatCard label="Streams" value="128" icon={<Radio size={18} />} />
            <StatCard label="Top Rank" value="Top 12" icon={<Star size={18} />} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-[0_0_90px_rgba(0,242,254,0.08)]">
                <div className="flex items-center justify-between">
                  <Gamepad2 className="text-[#00f2fe]" size={18} />
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-white/35">
                    Gaming
                  </span>
                </div>
                <h3 className="mt-5 text-[18px] font-black text-white">Gaming Identity</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">
                  Competitive energy, live sessions, replay moments, and creator highlights.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-[0_0_90px_rgba(0,242,254,0.08)]">
                <div className="flex items-center justify-between">
                  <Music4 className="text-[#00f2fe]" size={18} />
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-white/35">
                    Music
                  </span>
                </div>
                <h3 className="mt-5 text-[18px] font-black text-white">Sound Profile</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">
                  Sanctuary sessions, featured audio moments, and worship centered releases.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl shadow-[0_0_90px_rgba(0,242,254,0.08)]">
                <div className="flex items-center justify-between">
                  <MessageCircle className="text-[#00f2fe]" size={18} />
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-white/35">
                    Community
                  </span>
                </div>
                <h3 className="mt-5 text-[18px] font-black text-white">Fellowship Signal</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">
                  Prayer circles, testimonies, conversations, and follower engagement in one place.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,242,254,0.10)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-white/45">
                    Profile Highlights
                  </p>
                  <h2 className="mt-1 text-[24px] font-black text-white">Featured Media</h2>
                </div>

                <button className="inline-flex items-center gap-2 rounded-[18px] border border-[#00f2fe]/18 bg-[#00f2fe]/10 px-4 py-3 text-[10px] font-black uppercase tracking-[3px] text-[#00f2fe]">
                  <Plus size={14} /> Add Highlight
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
                {media.map((item) => (
                  <MediaCard
                    key={item.title}
                    title={item.title}
                    subtitle={item.subtitle}
                    tag={item.tag}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,242,254,0.10)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-white/45">
                    About
                  </p>
                  <h2 className="mt-1 text-[24px] font-black text-white">Creator Bio</h2>
                </div>

                <button className="rounded-[18px] border border-white/10 bg-black/45 px-4 py-3 text-[10px] font-black uppercase tracking-[3px] text-white/70 hover:bg-white/10 transition">
                  Edit Bio
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-black/45 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-white/45">
                    Mission
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Building an immersive digital sanctuary where creators, communities, and supporters can gather through story, sound, live streams, and meaningful connection.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/45 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-white/45">
                    Profile Details
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-white/60">
                    <div className="flex items-center justify-between">
                      <span>Creator Type</span>
                      <span className="font-black text-white/80">Streamer + Builder</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Joined</span>
                      <span className="inline-flex items-center gap-2 font-black text-white/80">
                        <CalendarDays size={14} className="text-[#00f2fe]" /> Jan 2026
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support Wallet</span>
                      <span className="inline-flex items-center gap-2 font-black text-white/80">
                        <Wallet size={14} className="text-[#00f2fe]" /> Enabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,242,254,0.10)]">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#00f2fe]" />
                <p className="text-[10px] font-black uppercase tracking-[4px] text-white/50">
                  Support Center
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {supportOptions.map((item) => (
                  <div key={item.title} onClick={() => setSelectedSupport(item.title)}>
                    <SupportCard
                      title={item.title}
                      amount={item.amount}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      active={selectedSupport === item.title}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,242,254,0.10)]">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#00f2fe]" />
                <p className="text-[10px] font-black uppercase tracking-[4px] text-white/50">
                  Quick Support
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {["$10", "$25", "$50", "$100", "$250", "$500"].map((amount) => (
                  <button
                    key={amount}
                    className="rounded-[18px] border border-[#00f2fe]/16 bg-black/45 px-4 py-4 text-[10px] font-black uppercase tracking-[3px] text-[#00f2fe] hover:bg-[#00f2fe]/10 transition"
                  >
                    Give {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,242,254,0.10)]">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#00f2fe]" />
                <p className="text-[10px] font-black uppercase tracking-[4px] text-white/50">
                  Support Signals
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  "24 new supporters this week",
                  "Top seed amount today is $250",
                  "Offering goal is 68% complete",
                  "Most active support hour is 8 PM",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-white/10 bg-black/45 px-4 py-4 text-sm text-white/65"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}