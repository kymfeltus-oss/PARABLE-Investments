"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AIPresenterAvatar from "@/components/AIPresenterAvatar";
import IntroVideoPlayer from "@/components/IntroVideoPlayer";

export default function IntroLanding() {
  const videoUrl = process.env.NEXT_PUBLIC_INTRO_VIDEO_URL;
  const posterUrl = process.env.NEXT_PUBLIC_INTRO_VIDEO_POSTER;

  return (
    <main id="securafin-main" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.22),transparent),radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(20,184,166,0.08),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 md:pt-14">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[11px] font-black uppercase tracking-[0.4em] text-teal-400/90"
        >
          Meet your guide
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-4 max-w-3xl text-center text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.6rem]"
        >
          Your AI host introduces{" "}
          <span className="bg-gradient-to-r from-teal-300 to-violet-300 bg-clip-text text-transparent">
            Securafin-AI
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/50"
        >
          Watch a short welcome from our synthetic presenter, then step into the
          digital showroom to explore ready-to-use apps and custom Innovation Lab
          work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/showroom"
            className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-bold text-black outline-none transition hover:bg-teal-400 focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            Enter digital showroom
          </Link>
          <a
            href="#company-intro-video"
            className="rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/85 outline-none transition hover:border-white/25 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Jump to video
          </a>
        </motion.div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,220px)_1fr] xl:grid-cols-[minmax(0,240px)_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <AIPresenterAvatar label="Synthetic presenter" />
          </motion.div>

          <motion.section
            id="company-intro-video"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="min-w-0"
            aria-labelledby="video-heading"
          >
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h2
                id="video-heading"
                className="text-sm font-bold text-white md:text-base"
              >
                Company introduction
              </h2>
              <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
                AI-narrated
              </span>
            </div>
            <IntroVideoPlayer videoUrl={videoUrl} posterUrl={posterUrl} />
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Prefer text? After you watch, use{" "}
              <Link
                href="/showroom"
                className="text-teal-400/90 underline-offset-2 hover:underline"
              >
                the showroom
              </Link>{" "}
              for the full interactive tour, marketplace, and Project Estimator.
            </p>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
