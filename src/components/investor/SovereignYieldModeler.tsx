'use client';

import { JetBrains_Mono } from 'next/font/google';
import { useMemo, useState } from 'react';

const yieldMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const GIVING_FLOW = 135_000_000_000;
const LEAKAGE_POOL = 6_700_000_000;
const FEE_RATE = 0.035;
const UPFRONT = 5_000_000;
/** Platform operational overhead applied to gross infrastructure yield. */
const PLATFORM_OVERHEAD = 0.2;
const PENETRATION_1_PCT = 1;
const ACCENT = '#00FFFF';

function grossAnnual(adoptionPct: number, recoveryPct: number) {
  const giving = GIVING_FLOW * (adoptionPct / 100) * FEE_RATE;
  const leakage = LEAKAGE_POOL * (recoveryPct / 100);
  return giving + leakage;
}

function ActivityGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h3l2-7 4 14 2-7h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
  );
}

function ZapWatermark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

export function SovereignYieldModeler() {
  const [adoption, setAdoption] = useState(1);
  const [recovery, setRecovery] = useState(2);

  const metrics = useMemo(() => {
    const grossAnnualYield = grossAnnual(adoption, recovery);
    const overheadAnnual = grossAnnualYield * PLATFORM_OVERHEAD;
    const annualNOI = grossAnnualYield - overheadAnnual;
    const monthlyNOI = annualNOI / 12;
    const paybackMonths =
      monthlyNOI > 0 ? UPFRONT / monthlyNOI : Number.POSITIVE_INFINITY;

    const grossAt1Pct = grossAnnual(PENETRATION_1_PCT, recovery);
    const noiAt1Pct = grossAt1Pct * (1 - PLATFORM_OVERHEAD);
    const monthlyAt1Pct = noiAt1Pct / 12;
    const paybackMonthsAt1Pct =
      monthlyAt1Pct > 0 ? UPFRONT / monthlyAt1Pct : Number.POSITIVE_INFINITY;
    const paybackAt1PctLabel =
      Number.isFinite(paybackMonthsAt1Pct) && paybackMonthsAt1Pct < 1e4
        ? paybackMonthsAt1Pct.toFixed(1)
        : '—';

    const fmt0 = (n: number) =>
      n.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });

    return {
      grossAnnualYield,
      overheadAnnual,
      annualNOI,
      paybackMonths,
      formattedNOI: fmt0(annualNOI),
      formattedGross: fmt0(grossAnnualYield),
      formattedOverhead: fmt0(overheadAnnual),
      paybackLabel:
        Number.isFinite(paybackMonths) && paybackMonths < 1e4
          ? paybackMonths.toFixed(1)
          : '—',
      paybackAt1PctLabel,
    };
  }, [adoption, recovery]);

  return (
    <div className="relative z-[2] mb-6 w-full md:mb-8">
      <style>{`
        .sovereign-yield-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(90deg, rgba(0,255,255,0.15), rgba(255,255,255,0.06));
          outline: none;
          box-shadow: 0 0 12px rgba(0,255,255,0.08);
        }
        .sovereign-yield-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #050505;
          border: 2px solid ${ACCENT};
          box-shadow: 0 0 14px rgba(0,255,255,0.55), 0 0 28px rgba(0,255,255,0.25);
          cursor: pointer;
        }
        .sovereign-yield-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #050505;
          border: 2px solid ${ACCENT};
          box-shadow: 0 0 14px rgba(0,255,255,0.55), 0 0 28px rgba(0,255,255,0.25);
          cursor: pointer;
        }
        .sovereign-yield-range:focus-visible::-webkit-slider-thumb {
          outline: 2px solid rgba(0,255,255,0.5);
          outline-offset: 3px;
        }
        .sovereign-yield-range:focus-visible::-moz-range-thumb {
          outline: 2px solid rgba(0,255,255,0.5);
          outline-offset: 3px;
        }
      `}</style>

      <div
        className="rounded-2xl border p-5 shadow-[0_0_50px_rgba(0,255,255,0.06)] backdrop-blur-xl md:p-7"
        style={{
          backgroundColor: '#050505',
          borderColor: 'rgba(0, 255, 255, 0.2)',
          boxShadow: `inset 0 1px 0 rgba(0,255,255,0.08), 0 0 48px -12px rgba(0,255,255,0.12)`,
        }}
      >
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ActivityGlyph className="h-5 w-5 shrink-0 text-[#00FFFF]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90 md:text-[13px] md:tracking-[0.26em]">
              Net infrastructure margin
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-400/95 md:text-[10px]">
              Live data
            </span>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-end justify-between gap-2">
                <label
                  htmlFor="sovereign-adoption"
                  className="text-[10px] font-medium uppercase leading-snug tracking-[0.14em] text-white/45 md:text-[11px]"
                >
                  Market adoption
                  <span className="mt-1 block font-normal normal-case tracking-normal text-white/35">
                    0.1%–5.0% of the $135B giving flow
                  </span>
                </label>
                <span
                  className={`${yieldMono.className} shrink-0 text-sm font-semibold tabular-nums text-[#00FFFF]`}
                  style={{ textShadow: '0 0 16px rgba(0,255,255,0.35)' }}
                >
                  {adoption.toFixed(1)}%
                </span>
              </div>
              <input
                id="sovereign-adoption"
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={adoption}
                onChange={(e) => setAdoption(parseFloat(e.target.value))}
                className="sovereign-yield-range"
              />
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-2">
                <label
                  htmlFor="sovereign-recovery"
                  className="text-[10px] font-medium uppercase leading-snug tracking-[0.14em] text-white/45 md:text-[11px]"
                >
                  Recovery efficiency
                  <span className="mt-1 block font-normal normal-case tracking-normal text-white/35">
                    Reclaiming 1%–10% of the $6.7B leakage
                  </span>
                </label>
                <span
                  className={`${yieldMono.className} shrink-0 text-sm font-semibold tabular-nums text-[#00FFFF]`}
                  style={{ textShadow: '0 0 16px rgba(0,255,255,0.35)' }}
                >
                  {recovery.toFixed(1)}%
                </span>
              </div>
              <input
                id="sovereign-recovery"
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={recovery}
                onChange={(e) => setRecovery(parseFloat(e.target.value))}
                className="sovereign-yield-range"
              />
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-xl border p-5 text-center md:p-6"
            style={{
              borderColor: 'rgba(0, 255, 255, 0.12)',
              background: 'linear-gradient(160deg, rgba(0,255,255,0.07), rgba(0,0,0,0.5))',
            }}
          >
            <ZapWatermark className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 rotate-12 text-[#00FFFF]/[0.06]" />
            <p className="mb-2 text-[8px] font-bold uppercase leading-tight tracking-[0.22em] text-white/55 md:text-[9px] md:tracking-[0.26em]">
              Annual net operating income (NOI)
            </p>
            <div
              className={`${yieldMono.className} mb-3 space-y-0.5 text-left text-[9px] tabular-nums text-white/38 md:text-[10px]`}
            >
              <div className="flex justify-between gap-4">
                <span className="text-white/32">Gross yield</span>
                <span>{metrics.formattedGross}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/32">Platform operational overhead (20%)</span>
                <span className="text-[#00FFFF]/55">−{metrics.formattedOverhead}</span>
              </div>
            </div>
            <h3
              className={`${yieldMono.className} mb-5 text-3xl font-semibold leading-none tracking-tight text-white tabular-nums md:text-4xl lg:text-5xl`}
              style={{ textShadow: '0 0 32px rgba(0,255,255,0.12)' }}
            >
              {metrics.formattedNOI}
            </h3>
            <div
              className="mx-auto inline-flex w-fit items-center justify-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: 'rgba(0, 255, 255, 0.22)',
                background: 'rgba(0,255,255,0.06)',
              }}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#00FFFF]/90 md:text-[11px]">
                Acquisition payback
              </span>
              <span
                className={`${yieldMono.className} text-[10px] font-semibold tabular-nums text-white md:text-[11px]`}
              >
                {metrics.paybackLabel} mo
              </span>
            </div>
            <p className="mx-auto mt-3 max-w-[18rem] text-[9px] leading-relaxed text-white/45 md:max-w-md md:text-[10px] md:leading-relaxed">
              At 1% market penetration, the $5M upfront acquisition cost is recovered in{' '}
              <span className={`${yieldMono.className} font-semibold text-[#00FFFF]/90`}>
                {metrics.paybackAt1PctLabel}
              </span>{' '}
              months.
            </p>
            <p className="mx-auto mt-1.5 max-w-[18rem] text-[9px] leading-relaxed text-white/38 md:max-w-md md:text-[10px]">
              Why: even if you are 99% wrong about the market, the buyer still wins.
            </p>
            <p className="mt-2 text-[9px] leading-relaxed text-white/28 md:text-[10px]">
              $5,000,000 ÷ (annual NOI ÷ 12). Illustrative model only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
