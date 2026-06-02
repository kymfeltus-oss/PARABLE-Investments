"use client";

import type { ReactNode } from "react";
import styles from "@/components/landing/pitch-lock-hero-outpaint.module.css";

/** Fixed positions — avoids SSR/client hydration mismatches. */
const LEFT_PARTICLES: { left: string; top: string; size: "sm" | "md" | "lg"; delay: string }[] = [
  { left: "18%", top: "14%", size: "lg", delay: "0s" },
  { left: "32%", top: "22%", size: "sm", delay: "0.8s" },
  { left: "12%", top: "38%", size: "md", delay: "1.4s" },
  { left: "45%", top: "12%", size: "sm", delay: "0.3s" },
  { left: "8%", top: "52%", size: "md", delay: "2.1s" },
  { left: "28%", top: "48%", size: "lg", delay: "1.1s" },
  { left: "52%", top: "35%", size: "sm", delay: "2.8s" },
  { left: "22%", top: "68%", size: "md", delay: "0.5s" },
  { left: "40%", top: "72%", size: "sm", delay: "1.9s" },
  { left: "15%", top: "78%", size: "lg", delay: "2.4s" },
  { left: "48%", top: "58%", size: "md", delay: "0.2s" },
  { left: "35%", top: "28%", size: "sm", delay: "3.1s" },
];

const RIGHT_PARTICLES: { left: string; top: string; size: "sm" | "md" | "lg"; delay: string }[] = [
  { left: "72%", top: "16%", size: "lg", delay: "0.4s" },
  { left: "58%", top: "24%", size: "sm", delay: "1.2s" },
  { left: "82%", top: "36%", size: "md", delay: "0.9s" },
  { left: "65%", top: "10%", size: "sm", delay: "2.2s" },
  { left: "88%", top: "50%", size: "md", delay: "1.6s" },
  { left: "55%", top: "46%", size: "lg", delay: "0.1s" },
  { left: "78%", top: "62%", size: "sm", delay: "2.6s" },
  { left: "62%", top: "70%", size: "md", delay: "1.3s" },
  { left: "92%", top: "28%", size: "sm", delay: "3s" },
  { left: "70%", top: "76%", size: "lg", delay: "0.7s" },
  { left: "48%", top: "32%", size: "md", delay: "2s" },
  { left: "85%", top: "74%", size: "sm", delay: "1.8s" },
];

const LEFT_FRAGMENTS = [
  { left: "20%", top: "42%", delay: "0s" },
  { left: "38%", top: "55%", delay: "1.5s" },
  { left: "10%", top: "61%", delay: "2.8s" },
  { left: "44%", top: "18%", delay: "0.6s" },
];

const RIGHT_FRAGMENTS = [
  { left: "56%", top: "40%", delay: "0.3s" },
  { left: "74%", top: "54%", delay: "1.2s" },
  { left: "88%", top: "60%", delay: "2.4s" },
  { left: "60%", top: "20%", delay: "1.8s" },
];

/** Edge-of-frame only — keeps logo region visually untouched. */
const CENTER_AMBIENT: {
  left: string;
  top: string;
  tone: "cyan" | "purple" | "white";
  delay: string;
}[] = [
  { left: "6%", top: "22%", tone: "cyan", delay: "0.2s" },
  { left: "10%", top: "48%", tone: "cyan", delay: "1.1s" },
  { left: "8%", top: "72%", tone: "white", delay: "2.3s" },
  { left: "92%", top: "20%", tone: "purple", delay: "0.5s" },
  { left: "90%", top: "44%", tone: "purple", delay: "1.7s" },
  { left: "94%", top: "68%", tone: "white", delay: "0.9s" },
  { left: "14%", top: "88%", tone: "cyan", delay: "2.8s" },
  { left: "86%", top: "86%", tone: "purple", delay: "1.4s" },
];

type PitchLockHeroOutpaintProps = {
  children: ReactNode;
};

/**
 * Ultra-wide cinematic environment: cyan (left) + purple (right).
 * Children = untouched center artwork (PNG + optional hotspots).
 */
export default function PitchLockHeroOutpaint({ children }: PitchLockHeroOutpaintProps) {
  return (
    <div className={styles.heroOutpaint}>
      <aside className={`${styles.wing} ${styles.wingLeft}`} aria-hidden="true">
        <div className={styles.wingInner}>
          <div className={`${styles.atmosphereBlob} ${styles.blobA}`} />
          <div className={`${styles.atmosphereBlob} ${styles.blobB}`} />
          <svg className={styles.orbitSvg} viewBox="0 0 400 600" preserveAspectRatio="none">
            <ellipse className={styles.orbitPathCyan} cx="320" cy="300" rx="280" ry="200" />
            <path
              className={styles.orbitPathGold}
              d="M 40 420 Q 200 120 360 380"
              fill="none"
            />
          </svg>
          <div className={`${styles.lightStreak} ${styles.streak1}`} />
          <div className={`${styles.lightStreak} ${styles.streak2}`} />
          {LEFT_PARTICLES.map((p, i) => (
            <span
              key={`l-p-${i}`}
              className={`${styles.particle} ${styles.particleCyan} ${styles[`particle${p.size === "sm" ? "Sm" : p.size === "md" ? "Md" : "Lg"}`]}`}
              style={{ left: p.left, top: p.top, animationDelay: p.delay }}
            />
          ))}
          {LEFT_FRAGMENTS.map((f, i) => (
            <span
              key={`l-f-${i}`}
              className={styles.dataFragment}
              style={{ left: f.left, top: f.top, animationDelay: f.delay }}
            />
          ))}
        </div>
        <div className={styles.wingFadeEdge} />
      </aside>

      <div className={styles.heroCenter}>
        <div className={styles.heroCenterAmbient} aria-hidden="true">
          {CENTER_AMBIENT.map((p, i) => (
            <span
              key={`c-a-${i}`}
              className={`${styles.centerParticle} ${styles.particleSm} ${
                p.tone === "cyan"
                  ? styles.particleCyan
                  : p.tone === "purple"
                    ? styles.particlePurple
                    : styles.particleWhite
              }`}
              style={{ left: p.left, top: p.top, animationDelay: p.delay }}
            />
          ))}
        </div>
        {children}
      </div>

      <aside className={`${styles.wing} ${styles.wingRight}`} aria-hidden="true">
        <div className={styles.wingInner}>
          <div className={`${styles.atmosphereBlob} ${styles.blobA}`} />
          <div className={`${styles.atmosphereBlob} ${styles.blobB}`} />
          <svg className={styles.orbitSvg} viewBox="0 0 400 600" preserveAspectRatio="none">
            <ellipse className={styles.orbitPathPurple} cx="80" cy="280" rx="260" ry="220" />
            <path
              className={styles.orbitPathGold}
              d="M 360 100 Q 200 320 30 480"
              fill="none"
            />
          </svg>
          <div className={`${styles.lightStreak} ${styles.streak1}`} />
          <div className={`${styles.lightStreak} ${styles.streak2}`} />
          {RIGHT_PARTICLES.map((p, i) => (
            <span
              key={`r-p-${i}`}
              className={`${styles.particle} ${styles.particlePurple} ${styles[`particle${p.size === "sm" ? "Sm" : p.size === "md" ? "Md" : "Lg"}`]}`}
              style={{ left: p.left, top: p.top, animationDelay: p.delay }}
            />
          ))}
          {RIGHT_FRAGMENTS.map((f, i) => (
            <span
              key={`r-f-${i}`}
              className={styles.dataFragment}
              style={{ left: f.left, top: f.top, animationDelay: f.delay }}
            />
          ))}
        </div>
        <div className={styles.wingFadeEdge} />
      </aside>
    </div>
  );
}
