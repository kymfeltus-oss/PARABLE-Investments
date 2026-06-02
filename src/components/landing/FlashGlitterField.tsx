"use client";

type SparkSpec = {
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: "sm" | "md" | "lg";
  tone: "cyan" | "purple" | "white";
};

const SPARKS: SparkSpec[] = [
  { left: "6%", top: "12%", delay: "0s", duration: "5.2s", size: "lg", tone: "cyan" },
  { left: "14%", top: "28%", delay: "0.8s", duration: "4.4s", size: "sm", tone: "white" },
  { left: "22%", top: "8%", delay: "1.4s", duration: "6.1s", size: "md", tone: "purple" },
  { left: "31%", top: "18%", delay: "0.3s", duration: "5.8s", size: "sm", tone: "cyan" },
  { left: "38%", top: "34%", delay: "2.1s", duration: "4.9s", size: "lg", tone: "purple" },
  { left: "45%", top: "6%", delay: "1.1s", duration: "5.5s", size: "md", tone: "cyan" },
  { left: "52%", top: "22%", delay: "0.5s", duration: "6.4s", size: "sm", tone: "white" },
  { left: "58%", top: "38%", delay: "2.8s", duration: "4.2s", size: "md", tone: "purple" },
  { left: "66%", top: "14%", delay: "1.7s", duration: "5.1s", size: "lg", tone: "cyan" },
  { left: "73%", top: "30%", delay: "0.2s", duration: "6.8s", size: "sm", tone: "purple" },
  { left: "81%", top: "10%", delay: "2.4s", duration: "5.3s", size: "md", tone: "cyan" },
  { left: "88%", top: "26%", delay: "1.3s", duration: "4.6s", size: "sm", tone: "white" },
  { left: "94%", top: "42%", delay: "0.9s", duration: "5.9s", size: "lg", tone: "purple" },
  { left: "4%", top: "48%", delay: "2.6s", duration: "4.8s", size: "md", tone: "cyan" },
  { left: "12%", top: "62%", delay: "1.9s", duration: "6.2s", size: "sm", tone: "purple" },
  { left: "20%", top: "52%", delay: "0.6s", duration: "5.4s", size: "lg", tone: "cyan" },
  { left: "28%", top: "72%", delay: "2.2s", duration: "4.5s", size: "sm", tone: "white" },
  { left: "36%", top: "58%", delay: "1.5s", duration: "5.7s", size: "md", tone: "purple" },
  { left: "44%", top: "78%", delay: "0.4s", duration: "6.5s", size: "sm", tone: "cyan" },
  { left: "54%", top: "66%", delay: "2.9s", duration: "4.3s", size: "lg", tone: "purple" },
  { left: "62%", top: "54%", delay: "1.2s", duration: "5.6s", size: "md", tone: "cyan" },
  { left: "70%", top: "74%", delay: "0.7s", duration: "6s", size: "sm", tone: "white" },
  { left: "78%", top: "60%", delay: "2.5s", duration: "4.7s", size: "lg", tone: "purple" },
  { left: "86%", top: "70%", delay: "1.8s", duration: "5.2s", size: "md", tone: "cyan" },
  { left: "92%", top: "56%", delay: "0.1s", duration: "6.3s", size: "sm", tone: "purple" },
  { left: "8%", top: "84%", delay: "2.3s", duration: "5s", size: "md", tone: "cyan" },
  { left: "18%", top: "88%", delay: "1.6s", duration: "4.4s", size: "sm", tone: "purple" },
  { left: "48%", top: "90%", delay: "0.8s", duration: "6.1s", size: "lg", tone: "cyan" },
  { left: "68%", top: "86%", delay: "2.7s", duration: "4.9s", size: "sm", tone: "white" },
  { left: "82%", top: "92%", delay: "1.4s", duration: "5.5s", size: "md", tone: "purple" },
  { left: "10%", top: "20%", delay: "0.4s", duration: "5.8s", size: "md", tone: "cyan" },
  { left: "25%", top: "15%", delay: "1.1s", duration: "6.2s", size: "lg", tone: "cyan" },
  { left: "42%", top: "25%", delay: "2.3s", duration: "4.9s", size: "sm", tone: "cyan" },
  { left: "55%", top: "16%", delay: "0.9s", duration: "5.4s", size: "md", tone: "cyan" },
  { left: "72%", top: "22%", delay: "1.6s", duration: "6s", size: "lg", tone: "cyan" },
  { left: "90%", top: "18%", delay: "2.1s", duration: "5.1s", size: "sm", tone: "cyan" },
  { left: "16%", top: "35%", delay: "1.8s", duration: "5.7s", size: "md", tone: "purple" },
  { left: "33%", top: "42%", delay: "0.3s", duration: "6.4s", size: "lg", tone: "purple" },
  { left: "50%", top: "32%", delay: "2.6s", duration: "4.6s", size: "sm", tone: "purple" },
  { left: "64%", top: "40%", delay: "1.2s", duration: "5.9s", size: "md", tone: "purple" },
  { left: "79%", top: "35%", delay: "0.7s", duration: "6.1s", size: "lg", tone: "purple" },
  { left: "93%", top: "30%", delay: "2.4s", duration: "5.3s", size: "sm", tone: "purple" },
];

type FlashGlitterFieldProps = {
  variant?: "viewport" | "stage";
};

export default function FlashGlitterField({ variant = "viewport" }: FlashGlitterFieldProps) {
  return (
    <div
      className={variant === "stage" ? "glitterField glitterFieldStage" : "glitterField"}
      aria-hidden="true"
    >
      <div className="glitterNebula glitterNebulaCyan" />
      <div className="glitterNebula glitterNebulaPurple" />
      <div className="glitterNebula glitterNebulaGold" />

      <div className="glitterOrb glitterOrbCyan glitterOrbA" />
      <div className="glitterOrb glitterOrbCyan glitterOrbB" />
      <div className="glitterOrb glitterOrbCyan glitterOrbC" />
      <div className="glitterOrb glitterOrbPurple glitterOrbD" />
      <div className="glitterOrb glitterOrbPurple glitterOrbE" />
      <div className="glitterOrb glitterOrbPurple glitterOrbF" />
      <div className="glitterOrb glitterOrbCyan glitterOrbG" />
      <div className="glitterOrb glitterOrbCyan glitterOrbH" />
      <div className="glitterOrb glitterOrbPurple glitterOrbI" />
      <div className="glitterOrb glitterOrbPurple glitterOrbJ" />

      <svg className="glitterOrbit" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <ellipse
          className="glitterOrbitPath glitterOrbitCyan"
          cx="500"
          cy="520"
          rx="420"
          ry="260"
        />
        <ellipse
          className="glitterOrbitPath glitterOrbitPurple"
          cx="500"
          cy="480"
          rx="340"
          ry="380"
        />
        <path
          className="glitterOrbitPath glitterOrbitGold"
          d="M 120 680 Q 500 200 880 620"
          fill="none"
        />
      </svg>

      {SPARKS.map((spark, index) => (
        <span
          key={index}
          className={`glitterSpark glitterSpark--${spark.size} glitterSpark--${spark.tone}`}
          style={{
            left: spark.left,
            top: spark.top,
            animationDelay: spark.delay,
            animationDuration: spark.duration,
          }}
        />
      ))}

      <style jsx>{`
        .glitterField {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: #000000;
        }

        .glitterFieldStage {
          position: absolute;
          inset: 0;
          z-index: 1;
          mix-blend-mode: screen;
          opacity: 1;
        }

        .glitterNebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(56px);
          opacity: 0.72;
          animation: nebulaDrift 18s ease-in-out infinite alternate;
        }

        .glitterNebulaCyan {
          left: -8%;
          top: 8%;
          width: 58%;
          height: 46%;
          background: radial-gradient(
            circle,
            rgba(0, 240, 255, 0.55) 0%,
            rgba(0, 240, 255, 0.18) 42%,
            transparent 72%
          );
        }

        .glitterNebulaPurple {
          right: -10%;
          top: 18%;
          width: 62%;
          height: 52%;
          background: radial-gradient(
            circle,
            rgba(157, 0, 255, 0.55) 0%,
            rgba(157, 0, 255, 0.2) 45%,
            transparent 72%
          );
          animation-delay: 2s;
        }

        .glitterNebulaGold {
          left: 20%;
          bottom: 5%;
          width: 45%;
          height: 30%;
          background: radial-gradient(circle, rgba(204, 164, 59, 0.22) 0%, transparent 72%);
          animation-delay: 4s;
        }

        .glitterOrb {
          position: absolute;
          border-radius: 50%;
          filter: blur(12px);
          mix-blend-mode: screen;
          animation: orbFloat 9s ease-in-out infinite alternate;
        }

        .glitterOrbCyan {
          background: radial-gradient(
            circle,
            rgba(0, 240, 255, 1) 0%,
            rgba(0, 240, 255, 0.35) 40%,
            transparent 70%
          );
          box-shadow: 0 0 48px rgba(0, 240, 255, 0.75), 0 0 80px rgba(0, 240, 255, 0.25);
        }

        .glitterOrbPurple {
          background: radial-gradient(
            circle,
            rgba(157, 0, 255, 1) 0%,
            rgba(157, 0, 255, 0.35) 42%,
            transparent 72%
          );
          box-shadow: 0 0 52px rgba(157, 0, 255, 0.65), 0 0 84px rgba(157, 0, 255, 0.22);
        }

        .glitterOrbA {
          left: 8%;
          top: 22%;
          width: clamp(34px, 6vw, 64px);
          height: clamp(34px, 6vw, 64px);
        }

        .glitterOrbB {
          left: 32%;
          top: 12%;
          width: clamp(18px, 3vw, 36px);
          height: clamp(18px, 3vw, 36px);
          animation-delay: 1.2s;
        }

        .glitterOrbC {
          right: 28%;
          top: 38%;
          width: clamp(36px, 6vw, 68px);
          height: clamp(36px, 6vw, 68px);
          animation-delay: 2.4s;
        }

        .glitterOrbD {
          right: 10%;
          top: 18%;
          width: clamp(42px, 7vw, 80px);
          height: clamp(42px, 7vw, 80px);
        }

        .glitterOrbE {
          left: 14%;
          bottom: 28%;
          width: clamp(32px, 5.5vw, 62px);
          height: clamp(32px, 5.5vw, 62px);
          animation-delay: 1.8s;
        }

        .glitterOrbF {
          right: 16%;
          bottom: 22%;
          width: clamp(24px, 4vw, 48px);
          height: clamp(24px, 4vw, 48px);
          animation-delay: 3.1s;
        }

        .glitterOrbG {
          left: 22%;
          top: 26%;
          width: clamp(20px, 3.5vw, 40px);
          height: clamp(20px, 3.5vw, 40px);
          animation-delay: 0.5s;
        }

        .glitterOrbH {
          left: 48%;
          top: 8%;
          width: clamp(30px, 4.5vw, 52px);
          height: clamp(30px, 4.5vw, 52px);
          animation-delay: 2.8s;
        }

        .glitterOrbI {
          right: 22%;
          top: 28%;
          width: clamp(26px, 4vw, 46px);
          height: clamp(26px, 4vw, 46px);
          animation-delay: 1.4s;
        }

        .glitterOrbJ {
          left: 58%;
          top: 48%;
          width: clamp(22px, 3.8vw, 44px);
          height: clamp(22px, 3.8vw, 44px);
          animation-delay: 3.6s;
        }

        .glitterOrbit {
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          opacity: 0.88;
        }

        .glitterOrbitPath {
          fill: none;
          stroke-width: 1.5;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 6 14;
          animation: orbitPulse 12s linear infinite;
        }

        .glitterOrbitCyan {
          stroke: rgba(0, 240, 255, 0.55);
          filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.75));
        }

        .glitterOrbitPurple {
          stroke: rgba(157, 0, 255, 0.52);
          filter: drop-shadow(0 0 10px rgba(157, 0, 255, 0.65));
          animation-delay: 2s;
        }

        .glitterOrbitGold {
          stroke: rgba(204, 164, 59, 0.28);
          filter: drop-shadow(0 0 5px rgba(204, 164, 59, 0.4));
          animation-delay: 4s;
        }

        .glitterSpark {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation:
            sparkTwinkle ease-in-out infinite,
            sparkDrift 14s ease-in-out infinite alternate;
        }

        .glitterSpark--sm {
          width: 3px;
          height: 3px;
        }

        .glitterSpark--md {
          width: 4px;
          height: 4px;
        }

        .glitterSpark--lg {
          width: 7px;
          height: 7px;
          filter: blur(0.4px);
        }

        .glitterSpark--cyan {
          background: var(--pl-cyan);
          box-shadow:
            0 0 12px rgba(0, 240, 255, 0.95),
            0 0 28px rgba(0, 240, 255, 0.7),
            0 0 48px rgba(0, 240, 255, 0.35);
        }

        .glitterSpark--purple {
          background: var(--pl-purple);
          box-shadow:
            0 0 12px rgba(157, 0, 255, 0.95),
            0 0 28px rgba(157, 0, 255, 0.7),
            0 0 48px rgba(157, 0, 255, 0.35);
        }

        .glitterSpark--white {
          background: #ffffff;
          box-shadow:
            0 0 10px rgba(255, 255, 255, 0.95),
            0 0 22px rgba(255, 255, 255, 0.5);
        }

        @keyframes nebulaDrift {
          from {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          to {
            transform: translate(2%, -3%) scale(1.08);
            opacity: 0.82;
          }
        }

        @keyframes orbFloat {
          from {
            transform: translate(0, 0) scale(0.92);
            opacity: 0.65;
          }
          to {
            transform: translate(12px, -18px) scale(1.12);
            opacity: 1;
          }
        }

        @keyframes sparkTwinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          45% {
            opacity: 1;
          }
        }

        @keyframes sparkDrift {
          from {
            transform: translate(-50%, -50%) translate(0, 0) scale(0.85);
          }
          to {
            transform: translate(-50%, -50%) translate(14px, -20px) scale(1.2);
          }
        }

        @keyframes orbitPulse {
          from {
            stroke-dashoffset: 0;
            opacity: 0.45;
          }
          to {
            stroke-dashoffset: -120;
            opacity: 0.95;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glitterNebula,
          .glitterOrb,
          .glitterSpark,
          .glitterOrbitPath {
            animation: none !important;
          }

          .glitterSpark {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}
