"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [isReady, setIsReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  function handleEnter() {
    setIsEntering(true);

    window.setTimeout(() => {
      window.location.href = "/info/intro";
    }, 850);
  }

  return (
    <main className={`introPage ${isReady ? "isReady" : ""} ${isEntering ? "isEntering" : ""}`}>
      {/* Background Layers matching page 1.png */}
      <div className="solidBlackBackground" />
      <div className="ambientNebula" />
      <div className="subtleStars" />
      <div className="perspectiveGrid" />
      <div className="softVignette" />
      <div className="thinLightSweep" />

      <section className="introStage">
        <div className="logoFrame">
          <Image
            src="/logo/parable-logo2.png"
            alt="SECURAFIN AI presents PARABLE Ecosystem"
            width={1600}
            height={540}
            priority
            className="mainLogo"
          />
        </div>

        <div className="cinematicLine" />

        <p className="missionLine">
          BUILDING THE INFRASTRUCTURE LAYER OF THE <span className="highlightText">FAITH ECONOMY</span>.
        </p>

        <button type="button" onClick={handleEnter} className="enterButton">
          <span>ENTER</span>
        </button>
      </section>

      <style jsx>{`
        .introPage {
          position: relative;
          min-height: 100svh;
          width: 100%;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: #020005;
          color: #ffffff;
          isolation: isolate;
          transition:
            opacity 850ms ease,
            transform 850ms ease,
            filter 850ms ease;
        }

        .introPage.isEntering {
          opacity: 0;
          transform: scale(1.04);
          filter: blur(20px);
        }

        .solidBlackBackground {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: #030108;
        }

        /* Replicating the dual cyan/purple horizon glow from page 1.png */
        .ambientNebula {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: 
            radial-gradient(circle at 30% 60%, rgba(0, 240, 255, 0.11) 0%, transparent 50%),
            radial-gradient(circle at 70% 55%, rgba(157, 0, 255, 0.14) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 35%);
          filter: blur(40px);
        }

        .subtleStars {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.12;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.85) 0 1px, transparent 1.8px),
            radial-gradient(circle, rgba(0, 240, 255, 0.6) 0 1px, transparent 2px);
          background-size: 300px 300px, 450px 450px;
          background-position: 0 0, 150px 110px;
          animation: starDrift 60s linear infinite;
        }

        /* Digital infrastructure grid canvas mimicking the floor grid in page 1.png */
        .perspectiveGrid {
          position: absolute;
          inset: 0;
          z-index: 3;
          background-image: 
            linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(157, 0, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center;
          transform: perspective(500px) rotateX(68deg) translateY(-30%);
          transform-origin: top center;
          opacity: 0.6;
          mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,1) 70%, transparent);
        }

        .softVignette {
          position: absolute;
          inset: 0;
          z-index: 4;
          background:
            linear-gradient(180deg, rgba(3, 1, 8, 0.4) 0%, transparent 35%, transparent 70%, rgba(3, 1, 8, 0.6) 100%),
            radial-gradient(circle at center, transparent 40%, rgba(2, 0, 5, 0.7) 100%);
          pointer-events: none;
        }

        .thinLightSweep {
          position: absolute;
          inset: -40%;
          z-index: 5;
          background: linear-gradient(
            115deg,
            transparent 0%,
            transparent 46%,
            rgba(0, 240, 255, 0.09) 50%,
            rgba(157, 0, 255, 0.06) 52%,
            transparent 56%,
            transparent 100%
          );
          transform: translateX(-90%);
          opacity: 0;
          animation: lightSweep 9s ease-in-out 1.5s infinite;
          pointer-events: none;
        }

        .introStage {
          position: relative;
          z-index: 10;
          width: min(94vw, 1100px);
          min-height: 100svh;
          padding: clamp(1.5rem, 4vw, 4rem) 1rem;
          display: grid;
          align-content: center;
          justify-items: center;
          text-align: center;
        }

        .logoFrame {
          width: 100%;
          opacity: 0;
          transform: translateY(22px) scale(0.97);
          filter: blur(12px);
          transition:
            opacity 1200ms ease,
            transform 1200ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 1200ms ease;
        }

        .isReady .logoFrame {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        .mainLogo {
          width: min(100%, 920px);
          height: auto;
          filter:
            drop-shadow(0 0 15px rgba(0, 240, 255, 0.18))
            drop-shadow(0 0 35px rgba(157, 0, 255, 0.12));
          animation: logoFloat 7s ease-in-out infinite;
        }

        .cinematicLine {
          width: min(72vw, 680px);
          height: 1px;
          margin-top: clamp(1.2rem, 2.5vw, 2rem);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 240, 255, 0.2),
            rgba(255, 255, 255, 0.7),
            rgba(157, 0, 255, 0.3),
            transparent
          );
          opacity: 0;
          transform: scaleX(0.2);
          transform-origin: center;
          transition:
            opacity 1000ms ease 600ms,
            transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) 600ms;
        }

        .isReady .cinematicLine {
          opacity: 1;
          transform: scaleX(1);
        }

        .missionLine {
          max-width: 780px;
          margin: clamp(1.2rem, 2.6vw, 1.9rem) auto 0;
          font-size: clamp(0.72rem, 1.05vw, 0.92rem);
          font-weight: 700;
          letter-spacing: 0.32em;
          text-indent: 0.32em;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.6);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 1000ms ease 800ms,
            transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) 800ms;
        }

        .isReady .missionLine {
          opacity: 1;
          transform: translateY(0);
        }

        .highlightText {
          color: #00f0ff;
          text-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .enterButton {
          position: relative;
          margin-top: clamp(1.6rem, 3.2vw, 2.6rem);
          min-width: 200px;
          padding: 0.96rem 2.5rem;
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(4, 2, 10, 0.75);
          backdrop-filter: blur(8px);
          box-shadow:
            inset 0 0 15px rgba(0, 240, 255, 0.08),
            0 0 20px rgba(157, 0, 255, 0.1);
          cursor: pointer;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 1000ms ease 1000ms,
            transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 240ms ease,
            box-shadow 240ms ease,
            background 240ms ease;
        }

        .isReady .enterButton {
          opacity: 1;
          transform: translateY(0);
        }

        .enterButton::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 240, 255, 0.45),
            rgba(157, 0, 255, 0.45),
            transparent
          );
          transform: translateX(-130%);
          transition: transform 800ms ease;
        }

        .enterButton span {
          position: relative;
          z-index: 1;
          display: block;
          font-size: 0.86rem;
          font-weight: 800;
          letter-spacing: 0.38em;
          text-indent: 0.38em;
          transition: color 240ms ease;
        }

        .enterButton:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: rgba(0, 240, 255, 0.85);
          background: rgba(4, 2, 10, 0.9);
          box-shadow:
            inset 0 0 25px rgba(0, 240, 255, 0.15),
            0 0 35px rgba(0, 240, 255, 0.35),
            0 0 15px rgba(157, 0, 255, 0.2);
        }

        .enterButton:hover span {
          color: #ffffff;
        }

        .enterButton:hover::before {
          transform: translateX(130%);
        }

        .enterButton:active {
          transform: translateY(-1px) scale(0.985);
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-300px, 150px, 0);
          }
        }

        @keyframes lightSweep {
          0% {
            opacity: 0;
            transform: translateX(-95%);
          }
          15% {
            opacity: 1;
          }
          45% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
            transform: translateX(95%);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter:
              drop-shadow(0 0 15px rgba(0, 240, 255, 0.18))
              drop-shadow(0 0 35px rgba(157, 0, 255, 0.12));
          }
          50% {
            transform: translateY(-6px) scale(1.004);
            filter:
              drop-shadow(0 0 22px rgba(0, 240, 255, 0.25))
              drop-shadow(0 0 45px rgba(157, 0, 255, 0.18));
          }
        }

        @media (max-width: 760px) {
          .introStage {
            width: min(94vw, 760px);
            padding: 1.5rem 1rem;
          }

          .mainLogo {
            width: min(100%, 680px);
          }

          .missionLine {
            letter-spacing: 0.16em;
            text-indent: 0.16em;
          }
          
          .perspectiveGrid {
            opacity: 0.35;
          }
        }
      `}</style>
    </main>
  );
}