'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { ParableSparkleSystem } from '@/components/effects/ParableSparkleSystem';

type TestimonyPost = {
  id: number;
  user: string;
  time: string;
  tag: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | null;
  mediaName?: string;
  createdAt: number;
  stats: {
    amens: number;
    comments: number;
    shares: number;
    praiseBreaks: number;
    claps: number;
    dances: number;
    shouts: number;
  };
};

const TESTIMONY_STORAGE_KEY = 'parable:testimonies';

function formatRelativeTime(createdAt: number) {
  const diffMs = Date.now() - createdAt;
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  if (minutes < 1) return 'JUST NOW';
  if (minutes < 60) return `${minutes} MIN AGO`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} HR AGO`;

  const days = Math.floor(hours / 24);
  return `${days} DAY AGO`;
}

function loadMyTestimonies(username?: string | null) {
  try {
    const raw = window.localStorage.getItem(TESTIMONY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as TestimonyPost[];
    if (!Array.isArray(parsed)) return [];

    const targetNames = [username, 'KYM THE CEO']
      .filter(Boolean)
      .map((value) => String(value).trim().toUpperCase());

    return parsed.filter((post) =>
      targetNames.includes(String(post.user).trim().toUpperCase())
    );
  } catch {
    return [];
  }
}

export default function MySanctuaryPage() {
  const router = useRouter();
  const { userProfile, avatarUrl, loading } = useAuth();
  const [testimonies, setTestimonies] = useState<TestimonyPost[]>([]);

  useEffect(() => {
    if (loading) return;

    const refreshPosts = () => {
      const username = userProfile?.username || null;
      setTestimonies(loadMyTestimonies(username));
    };

    refreshPosts();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshPosts();
      }
    };

    window.addEventListener('focus', refreshPosts);
    window.addEventListener('parable:testimonies-updated', refreshPosts);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', refreshPosts);
      window.removeEventListener('parable:testimonies-updated', refreshPosts);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loading, userProfile?.username]);

  if (loading) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <main className="min-h-screen bg-[#010101] text-white relative">
      <ParableSparkleSystem />

      <div className="relative z-10 pb-40">
        <Header title="MY SANCTUARY" />

        <section className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'TOTAL_REVENUE', value: '$24,580.00', route: '/wallet' },
            { label: 'GLOBAL_RANK', value: 'TOP 12', route: '/leaderboard' },
            { label: 'MULTIPLIER', value: '2.5X', route: '/perks' },
            { label: 'SYNC_STATUS', value: 'ONLINE', route: '/settings' }
          ].map((stat, i) => (
            <div key={i} className="flip-card h-36 cursor-pointer group" onClick={() => router.push(stat.route)}>
              <div className="relative w-full h-full flip-card-inner">
                <div className="flip-card-front border-2 border-[#00f2ff]/20 bg-black/90 flex flex-col justify-center px-8 backdrop-blur-xl rounded-[2rem]">
                  <p className="parable-sublabel text-[8px] mb-2">{stat.label}</p>
                  <p className="parable-header text-3xl text-white">{stat.value}</p>
                </div>
                <div className="flip-card-back bg-[#00f2ff] flex flex-col justify-center items-center rounded-[2rem] shadow-[0_0_30px_#00f2ff]">
                  <p className="text-[#010101] font-black italic uppercase text-xl">VIEW_INTEL</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3">
            <div className="border border-[#00f2ff]/30 bg-black/60 rounded-[3.5rem] p-10 text-center backdrop-blur-2xl">
              <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#00f2ff] animate-ping opacity-10"></div>
                <img src={avatarUrl || '/logo.svg'} className="w-40 h-40 rounded-full border-2 border-[#00f2ff]/50 object-cover bg-black" alt="CEO" />
              </div>
              <h2 className="parable-header text-2xl">{userProfile?.username || 'KYM THE CEO'}</h2>

              <div className="mt-8 space-y-4">
                <div className="rounded-[1.5rem] border border-[#00f2ff]/15 bg-[#00f2ff]/8 px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[6px] text-white/40">MY TESTIMONIES</p>
                  <p className="text-[#00f2ff] text-2xl font-black italic mt-2">{testimonies.length}</p>
                </div>

                <button
                  onClick={() => router.push('/testify')}
                  className="w-full bg-[#00f2ff] text-[#010101] px-6 py-4 rounded-full font-black italic uppercase tracking-tighter shadow-[0_0_30px_#00f2ff]/50 hover:scale-105 active:scale-95 transition-all"
                >
                  TESTIFY +
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9 space-y-12">
            <div className="flex items-center justify-between border-b border-[#00f2ff]/20 pb-8 flex-wrap gap-4">
              <div className="flex gap-10">
                <button onClick={() => router.push('/my-sanctuary')} className="text-[#00f2ff] text-2xl font-black italic uppercase tracking-[-0.08em] border-b-4 border-[#00f2ff] pb-2">
                  MY TESTIMONIES
                </button>
                <button onClick={() => router.push('/replays')} className="text-white/30 text-2xl font-black italic uppercase tracking-[-0.08em] hover:text-[#00f2ff] transition-all">
                  REPLAYS
                </button>
              </div>

              <button onClick={() => router.push('/testify')} className="bg-[#00f2ff] text-[#010101] px-14 py-4 rounded-full font-black italic uppercase tracking-tighter shadow-[0_0_30px_#00f2ff]/50 hover:scale-105 active:scale-95 transition-all">
                TESTIFY +
              </button>
            </div>

            {testimonies.length === 0 ? (
              <div className="border border-[#00f2ff]/15 bg-black/60 rounded-[3rem] p-12 text-center backdrop-blur-2xl">
                <h3 className="text-[#00f2ff] text-3xl font-black italic uppercase tracking-[-0.08em]">
                  No Testimonies Yet
                </h3>
                <p className="text-white/50 text-sm leading-7 mt-4 max-w-xl mx-auto">
                  Your personal testimony wall will populate here after you publish from TESTIFY.
                </p>

                <button
                  onClick={() => router.push('/testify')}
                  className="mt-8 bg-[#00f2ff] text-[#010101] px-10 py-4 rounded-full font-black italic uppercase tracking-tighter shadow-[0_0_30px_#00f2ff]/50 hover:scale-105 active:scale-95 transition-all"
                >
                  CREATE FIRST TESTIMONY
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {testimonies.map((post) => (
                  <article
                    key={post.id}
                    className="border border-[#00f2ff]/12 bg-black/70 rounded-[2.5rem] overflow-hidden backdrop-blur-xl hover:border-[#00f2ff]/25 transition-all"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-white text-2xl font-black italic uppercase tracking-[-0.08em]">
                              {post.user}
                            </h3>
                            <span className="px-4 py-2 rounded-full border border-[#00f2ff]/25 bg-[#00f2ff]/10 text-[10px] font-black uppercase tracking-[6px] text-[#00f2ff]">
                              {post.tag}
                            </span>
                          </div>

                          <p className="text-[10px] text-white/35 uppercase tracking-[6px] mt-3">
                            {formatRelativeTime(post.createdAt)}
                          </p>
                        </div>

                        <button
                          onClick={() => router.push('/testify')}
                          className="px-5 py-3 rounded-full border border-[#00f2ff]/20 bg-[#00f2ff]/5 text-[10px] font-black uppercase tracking-[6px] text-[#00f2ff] hover:bg-[#00f2ff]/10 transition-all"
                        >
                          OPEN IN TESTIFY
                        </button>
                      </div>

                      <p className="text-white/78 text-[15px] leading-8 mt-6 whitespace-pre-line">
                        {post.text}
                      </p>

                      {post.mediaUrl ? (
                        <div className="mt-6 rounded-[2rem] border border-[#00f2ff]/10 bg-gradient-to-b from-[#00f2ff]/10 to-transparent overflow-hidden">
                          {post.mediaType === 'image' ? (
                            <img
                              src={post.mediaUrl}
                              alt={post.mediaName || 'Uploaded testimony image'}
                              className="w-full max-h-[520px] object-cover"
                            />
                          ) : post.mediaType === 'video' ? (
                            <video
                              src={post.mediaUrl}
                              controls
                              className="w-full max-h-[520px] bg-black/40"
                            />
                          ) : null}
                        </div>
                      ) : null}

                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-[1.25rem] border border-[#00f2ff]/10 bg-white/[0.02] px-4 py-4">
                          <p className="text-[10px] text-white/35 uppercase tracking-[6px]">AMENS</p>
                          <p className="text-[#00f2ff] text-xl font-black italic mt-2">{post.stats.amens}</p>
                        </div>

                        <div className="rounded-[1.25rem] border border-[#00f2ff]/10 bg-white/[0.02] px-4 py-4">
                          <p className="text-[10px] text-white/35 uppercase tracking-[6px]">PRAISEBREAKS</p>
                          <p className="text-[#00f2ff] text-xl font-black italic mt-2">{post.stats.praiseBreaks}</p>
                        </div>

                        <div className="rounded-[1.25rem] border border-[#00f2ff]/10 bg-white/[0.02] px-4 py-4">
                          <p className="text-[10px] text-white/35 uppercase tracking-[6px]">CLAPS</p>
                          <p className="text-[#00f2ff] text-xl font-black italic mt-2">{post.stats.claps}</p>
                        </div>

                        <div className="rounded-[1.25rem] border border-[#00f2ff]/10 bg-white/[0.02] px-4 py-4">
                          <p className="text-[10px] text-white/35 uppercase tracking-[6px]">DANCE + SHOUT</p>
                          <p className="text-[#00f2ff] text-xl font-black italic mt-2">
                            {post.stats.dances + post.stats.shouts}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}