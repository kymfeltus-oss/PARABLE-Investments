"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPitchAccessSignedFlag } from "@/lib/pitch-access-storage";

export default function PitchLockIntro() {
  const router = useRouter();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (!isFinePointer) return;

    const move = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const dashboardPath = useMemo(() => "/dashboard/investor", []);

  const enterPitchLock = () => {
    const signed = hasPitchAccessSignedFlag();

    if (signed) {
      router.push(dashboardPath);
      return;
    }

    router.push(`/nda?next=${encodeURIComponent(dashboardPath)}`);
  };

  const signAgreement = () => {
    router.push(`/nda?next=${encodeURIComponent(dashboardPath)}`);
  };

  return (
    <main className="pitchlockIntro">
      <div
        className="cursorGlow"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      <div className="orb orbCyan" />
      <div className="orb orbPurple" />
      <div className="orb orbBlue" />

      <header className="introHeader">
        <div className="miniLogo" aria-label="Pitch Lock">
          <SmallLogoMark />
          <div className="miniWordmark">
            <span className="miniPitch">Pitch</span>
            <span className="miniLock">Lock</span>
          </div>
        </div>

        <button
          type="button"
          className="soundButton"
          onClick={() => setSoundOn((value) => !value)}
          aria-label="Toggle sound"
        >
          <span>Sound</span>
          <span className={soundOn ? "soundOrb soundOrbOn" : "soundOrb"}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <section className="heroWrap">
        <div className="heroLogoBlock">
          <div className="logoAura" />
          <LargeLogoMark />

          <div className="heroWordmark" aria-label="Pitch Lock">
            <span className="heroPitch">Pitch</span>
            <span className="heroLock">
              L<span className="lockO">o</span>ck
            </span>
          </div>

          <div className="taglineRail">
            <span />
            <p>Pitch. Protect. Progress.</p>
            <span />
          </div>
        </div>

        <div className="accessPill">Secure Investor Access</div>

        <h1 className="heroTitle">
          <span>Pitch.</span>
          <span>Protect.</span>
          <span>Progress.</span>
        </h1>

        <p className="heroCopy">
          A private pitch room for founders and verified investors.
        </p>

        <div className="ctaPanel">
          <div className="panelShimmer" />

          <button type="button" className="ctaButton cyan" onClick={enterPitchLock}>
            <span>Enter Pitch Lock</span>
            <strong>›</strong>
          </button>

          <div className="panelDivider">
            <span />
          </div>

          <button type="button" className="ctaButton purple" onClick={signAgreement}>
            <span>Sign Access Agreement</span>
            <strong>›</strong>
          </button>
        </div>

        <div className="proofGrid" aria-label="Pitch Lock features">
          <div className="proofItem">
            <ShieldIcon />
            <p>Signed Access</p>
          </div>

          <div className="proofItem">
            <LockIcon />
            <p>Private Pitch Room</p>
          </div>

          <div className="proofItem">
            <GrowthIcon />
            <p>PitchMeeting Ready</p>
          </div>
        </div>
      </section>

      <div className="bottomBars" aria-hidden="true">
        {Array.from({ length: 44 }).map((_, index) => (
          <span key={index} style={{ animationDelay: `${index * 80}ms` }} />
        ))}
      </div>

      <style jsx>{`
        .pitchlockIntro {
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 52%, rgba(0, 240, 255, 0.15), transparent 22rem),
            radial-gradient(circle at 82% 52%, rgba(157, 0, 255, 0.18), transparent 26rem),
            radial-gradient(circle at 50% 18%, rgba(0, 240, 255, 0.08), transparent 24rem),
            #000000;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Inter, Montserrat, system-ui, sans-serif;
        }

        .cursorGlow {
          position: fixed;
          z-index: 1;
          width: 25rem;
          height: 25rem;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(0, 240, 255, 0.12), transparent 68%);
          filter: blur(12px);
        }

        .orb {
          position: absolute;
          z-index: 1;
          border-radius: 999px;
          filter: blur(2px);
          animation: float 7s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
        }

        .orbCyan {
          width: 0.85rem;
          height: 0.85rem;
          left: 13%;
          top: 38%;
          background: #00f0ff;
          box-shadow: 0 0 28px rgba(0, 240, 255, 0.9);
        }

        .orbPurple {
          width: 1.15rem;
          height: 1.15rem;
          right: 13%;
          top: 41%;
          background: #9d00ff;
          box-shadow: 0 0 36px rgba(157, 0, 255, 0.9);
          animation-delay: 1.2s;
        }

        .orbBlue {
          width: 0.75rem;
          height: 0.75rem;
          left: 7%;
          top: 55%;
          background: #00f0ff;
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.85);
          animation-delay: 2s;
        }

        .introHeader {
          position: relative;
          z-index: 10;
          width: min(100%, 78rem);
          padding: 2.25rem clamp(1.25rem, 4vw, 3.25rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .miniLogo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          filter: drop-shadow(0 0 15px rgba(0, 240, 255, 0.35));
        }

        .miniWordmark {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          line-height: 1;
        }

        .miniPitch {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(1.45rem, 2vw, 2.1rem);
          font-style: italic;
          color: #ffffff;
          text-shadow: 0 0 14px rgba(255, 255, 255, 0.35);
        }

        .miniLock {
          font-size: clamp(1rem, 1.35vw, 1.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(90deg, #9d00ff, #00f0ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .soundButton {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border: 0;
          background: transparent;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.42em;
          font-size: 0.72rem;
          cursor: pointer;
        }

        .soundOrb {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 999px;
          border: 1px solid rgba(157, 0, 255, 0.75);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.17rem;
          box-shadow: 0 0 22px rgba(157, 0, 255, 0.26);
        }

        .soundOrb span {
          width: 0.16rem;
          height: 0.75rem;
          border-radius: 999px;
          background: #00f0ff;
          opacity: 0.7;
          transform-origin: center;
        }

        .soundOrb span:nth-child(2) {
          height: 1.05rem;
        }

        .soundOrbOn span {
          animation: soundWave 800ms ease-in-out infinite alternate;
        }

        .soundOrbOn span:nth-child(2) {
          animation-delay: 100ms;
        }

        .soundOrbOn span:nth-child(3) {
          animation-delay: 200ms;
        }

        .heroWrap {
          position: relative;
          z-index: 10;
          width: min(100%, 72rem);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(1rem, 2vw, 2rem) clamp(1.25rem, 5vw, 4rem) 7rem;
          text-align: center;
        }

        .heroLogoBlock {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.4rem;
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .logoAura {
          position: absolute;
          top: 6%;
          left: 50%;
          width: min(58vw, 36rem);
          height: min(58vw, 36rem);
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            radial-gradient(circle at 38% 42%, rgba(0, 240, 255, 0.24), transparent 45%),
            radial-gradient(circle at 62% 48%, rgba(157, 0, 255, 0.24), transparent 48%);
          filter: blur(34px);
          opacity: 0.9;
        }

        .heroWordmark {
          position: relative;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: clamp(0.45rem, 1.5vw, 0.9rem);
          margin-top: -0.55rem;
          line-height: 0.92;
          filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.22));
        }

        .heroPitch {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(4.8rem, 11vw, 10rem);
          font-style: italic;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.08em;
          text-shadow:
            0 0 18px rgba(255, 255, 255, 0.55),
            0 0 40px rgba(255, 255, 255, 0.18);
        }

        .heroLock {
          font-size: clamp(3.75rem, 8.6vw, 7.9rem);
          font-weight: 950;
          letter-spacing: -0.08em;
          background: linear-gradient(90deg, #9d00ff 0%, #00f0ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 16px rgba(0, 240, 255, 0.32));
        }

        .lockO {
          position: relative;
        }

        .taglineRail {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.35rem;
          margin-top: 1.15rem;
        }

        .taglineRail span {
          width: clamp(3rem, 8vw, 7.5rem);
          height: 1px;
          background: linear-gradient(90deg, transparent, #00f0ff, #9d00ff, transparent);
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
        }

        .taglineRail p {
          margin: 0;
          color: #00f0ff;
          text-transform: uppercase;
          letter-spacing: 0.42em;
          font-size: clamp(0.62rem, 1vw, 0.8rem);
          font-weight: 800;
        }

        .accessPill {
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
          margin-bottom: 1.7rem;
          width: min(100%, 34rem);
          border-radius: 999px;
          border: 1px solid rgba(0, 240, 255, 0.8);
          padding: 0.85rem 1.6rem;
          background: rgba(4, 2, 10, 0.75);
          box-shadow:
            0 0 24px rgba(0, 240, 255, 0.2),
            inset 0 0 18px rgba(157, 0, 255, 0.15);
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.55em;
          font-size: clamp(0.68rem, 1vw, 0.82rem);
          font-weight: 800;
        }

        .heroTitle {
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) 220ms both;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.15rem;
          flex-wrap: wrap;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: clamp(2.25rem, 6vw, 5.25rem);
          line-height: 1;
          font-weight: 950;
        }

        .heroTitle span:nth-child(1),
        .heroTitle span:nth-child(3) {
          color: #ffffff;
          text-shadow: 0 0 24px rgba(255, 255, 255, 0.18);
        }

        .heroTitle span:nth-child(2) {
          background: linear-gradient(90deg, #9d00ff, #00f0ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 20px rgba(157, 0, 255, 0.28));
        }

        .heroCopy {
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) 320ms both;
          margin: 1.55rem 0 2.35rem;
          max-width: 40rem;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(1rem, 1.7vw, 1.35rem);
          letter-spacing: 0.06em;
          line-height: 1.7;
        }

        .ctaPanel {
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) 420ms both;
          position: relative;
          overflow: hidden;
          width: min(100%, 56rem);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: stretch;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 4px;
          padding: 1.55rem;
          background: rgba(4, 2, 10, 0.75);
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 34px rgba(0, 240, 255, 0.27),
            0 0 54px rgba(157, 0, 255, 0.2),
            inset 0 0 32px rgba(255, 255, 255, 0.03);
        }

        .panelShimmer {
          position: absolute;
          inset: 0;
          transform: translateX(-110%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 240, 255, 0.16),
            rgba(157, 0, 255, 0.16),
            transparent
          );
          animation: shimmer 5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .panelDivider {
          width: 1px;
          min-height: 100%;
          background: rgba(255, 255, 255, 0.16);
          margin: 0 1.55rem;
          position: relative;
        }

        .panelDivider span {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0.5rem;
          height: 0.5rem;
          transform: translate(-50%, -50%) rotate(45deg);
          border: 1px solid #9d00ff;
          background: #030108;
          box-shadow: 0 0 16px rgba(157, 0, 255, 0.8);
        }

        .ctaButton {
          position: relative;
          z-index: 3;
          height: 4.45rem;
          border-radius: 999px;
          background: #000000;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.22);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-weight: 900;
          font-size: clamp(0.74rem, 1vw, 0.9rem);
          transition:
            transform 850ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 850ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 850ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ctaButton strong {
          font-size: 1.8rem;
          line-height: 0;
          transform: translateY(-0.05rem);
        }

        .ctaButton:hover {
          transform: translateY(-2px);
        }

        .ctaButton.cyan {
          border-color: rgba(0, 240, 255, 0.95);
          box-shadow: 0 0 26px rgba(0, 240, 255, 0.24);
        }

        .ctaButton.cyan:hover {
          box-shadow:
            0 0 34px rgba(0, 240, 255, 0.45),
            inset 0 0 20px rgba(0, 240, 255, 0.1);
        }

        .ctaButton.purple {
          border-color: rgba(157, 0, 255, 0.95);
          box-shadow: 0 0 26px rgba(157, 0, 255, 0.24);
        }

        .ctaButton.purple:hover {
          box-shadow:
            0 0 34px rgba(157, 0, 255, 0.45),
            inset 0 0 20px rgba(157, 0, 255, 0.1);
        }

        .proofGrid {
          animation: enter 950ms cubic-bezier(0.16, 1, 0.3, 1) 520ms both;
          width: min(100%, 58rem);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2.25rem;
        }

        .proofItem {
          min-height: 7rem;
          border-left: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .proofItem:first-child {
          border-left: 0;
        }

        .proofItem svg {
          width: 2rem;
          height: 2rem;
          color: #00f0ff;
          filter: drop-shadow(0 0 12px rgba(0, 240, 255, 0.55));
        }

        .proofItem:nth-child(2) svg {
          color: #9d00ff;
          filter: drop-shadow(0 0 12px rgba(157, 0, 255, 0.55));
        }

        .proofItem p {
          margin: 0;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .bottomBars {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          bottom: 0;
          height: 6.5rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 0 2rem;
          opacity: 0.55;
          pointer-events: none;
          mask-image: linear-gradient(to top, black 0%, transparent 100%);
        }

        .bottomBars span {
          width: 2px;
          height: clamp(0.8rem, 5vw, 4rem);
          background: linear-gradient(to top, #00f0ff, #9d00ff, transparent);
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
          animation: equalizer 3s ease-in-out infinite alternate;
        }

        @keyframes enter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-8px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          48%,
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes soundWave {
          from {
            transform: scaleY(0.55);
            opacity: 0.55;
          }
          to {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }

        @keyframes equalizer {
          from {
            transform: scaleY(0.35);
            opacity: 0.35;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @media (max-width: 760px) {
          .introHeader {
            padding: 1.2rem 1rem;
          }

          .soundButton span:first-child {
            display: none;
          }

          .heroWrap {
            justify-content: flex-start;
            padding: 1.5rem 1rem 6rem;
          }

          .heroLogoBlock {
            margin-top: 1.25rem;
            margin-bottom: 1.75rem;
          }

          .heroTitle {
            flex-direction: column;
            gap: 0.35rem;
            letter-spacing: 0.03em;
          }

          .heroCopy {
            margin-bottom: 1.65rem;
          }

          .accessPill {
            letter-spacing: 0.28em;
            padding: 0.75rem 1rem;
          }

          .ctaPanel {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          .panelDivider {
            display: none;
          }

          .ctaButton {
            width: 100%;
            height: 4.1rem;
            letter-spacing: 0.18em;
          }

          .proofGrid {
            grid-template-columns: 1fr;
            gap: 0.4rem;
            margin-top: 1.4rem;
          }

          .proofItem {
            border-left: 0;
            min-height: 4.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .proofItem:first-child {
            border-top: 0;
          }

          .bottomBars {
            height: 4rem;
          }
        }

        @media (max-width: 430px) {
          .miniPitch {
            font-size: 1.3rem;
          }

          .miniLock {
            font-size: 1rem;
          }

          .heroPitch {
            font-size: 4.2rem;
          }

          .heroLock {
            font-size: 3.3rem;
          }

          .taglineRail {
            gap: 0.7rem;
          }

          .taglineRail p {
            letter-spacing: 0.24em;
          }
        }
      `}</style>
    </main>
  );
}

function LargeLogoMark() {
  return (
    <svg
      className="largeMark"
      width="270"
      height="270"
      viewBox="0 0 270 270"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="largePitchLockGradient" x1="36" y1="43" x2="235" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F0FF" />
          <stop offset="0.52" stopColor="#1A73FF" />
          <stop offset="1" stopColor="#9D00FF" />
        </linearGradient>
        <filter id="largeGlow" x="-40" y="-40" width="350" height="350" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M79 111V82C79 48 103 28 135 28C167 28 191 48 191 82V114"
        stroke="url(#largePitchLockGradient)"
        strokeWidth="22"
        strokeLinecap="round"
        filter="url(#largeGlow)"
      />

      <path
        d="M70 105H191C218 105 235 123 235 150C235 183 211 211 180 225L135 247L90 225C59 211 35 183 35 150C35 123 43 105 70 105Z"
        stroke="url(#largePitchLockGradient)"
        strokeWidth="20"
        strokeLinejoin="round"
        filter="url(#largeGlow)"
      />

      <path
        d="M93 178C130 157 159 134 188 101"
        stroke="#00F0FF"
        strokeWidth="13"
        strokeLinecap="round"
        filter="url(#largeGlow)"
      />

      <path
        d="M188 101L183 134L154 123"
        stroke="#00F0FF"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#largeGlow)"
      />

      <path d="M103 200V174" stroke="url(#largePitchLockGradient)" strokeWidth="13" strokeLinecap="round" />
      <path d="M134 214V161" stroke="url(#largePitchLockGradient)" strokeWidth="13" strokeLinecap="round" />
      <path d="M165 198V145" stroke="url(#largePitchLockGradient)" strokeWidth="13" strokeLinecap="round" />

      <path
        d="M218 73L224 87L238 93L224 99L218 113L212 99L198 93L212 87L218 73Z"
        fill="#9D00FF"
        filter="url(#largeGlow)"
      />
      <circle cx="50" cy="158" r="8" fill="#00F0FF" filter="url(#largeGlow)" />
      <circle cx="225" cy="159" r="6" fill="#9D00FF" filter="url(#largeGlow)" />

      <style jsx>{`
        .largeMark {
          position: relative;
          z-index: 2;
          width: clamp(13rem, 26vw, 20rem);
          height: auto;
          animation: float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
        }
      `}</style>
    </svg>
  );
}

function SmallLogoMark() {
  return (
    <svg width="38" height="38" viewBox="0 0 270 270" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="smallPitchLockGradient" x1="36" y1="43" x2="235" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F0FF" />
          <stop offset="1" stopColor="#9D00FF" />
        </linearGradient>
      </defs>
      <path d="M79 111V82C79 48 103 28 135 28C167 28 191 48 191 82V114" stroke="url(#smallPitchLockGradient)" strokeWidth="22" strokeLinecap="round" />
      <path d="M70 105H191C218 105 235 123 235 150C235 183 211 211 180 225L135 247L90 225C59 211 35 183 35 150C35 123 43 105 70 105Z" stroke="url(#smallPitchLockGradient)" strokeWidth="20" strokeLinejoin="round" />
      <path d="M93 178C130 157 159 134 188 101" stroke="#00F0FF" strokeWidth="13" strokeLinecap="round" />
      <path d="M188 101L183 134L154 123" stroke="#00F0FF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L19 6V11C19 15.5 16.1 19.7 12 21C7.9 19.7 5 15.5 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12L11 14L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V8C7 5.2 9 3.5 12 3.5C15 3.5 17 5.2 17 8V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 10H18V20H6V10Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 17V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 17V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 10L12 7L16 8L20 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
