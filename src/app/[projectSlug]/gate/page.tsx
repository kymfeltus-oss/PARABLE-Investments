'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

const VAULT_COOKIE = 'pitchlock_vault_unlocked';
const VAULT_PASSKEY = process.env.NEXT_PUBLIC_PITCHLOCK_VAULT_PASSKEY?.trim() || '050605';

type Props = {
  params: Promise<{ projectSlug: string }>;
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export default function SecurityGatePage({ params }: Props) {
  const { projectSlug } = use(params);
  const router = useRouter();

  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(false);

    if (passkey.trim() === VAULT_PASSKEY) {
      document.cookie = `${VAULT_COOKIE}=true; path=/; max-age=86400; SameSite=Lax`;
      router.push(`/${projectSlug}/investor`);
      return;
    }

    setTimeout(() => {
      setError(true);
      setProcessing(false);
      setPasskey('');
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 select-none bg-[var(--bg-canvas)]">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[100px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-2xl border border-[var(--border-grid)] bg-[var(--bg-panel)] p-8 shadow-2xl">
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
            error
              ? 'border-red-500/30 bg-red-500/10 text-red-400'
              : 'border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          }`}
        >
          {error ? <AlertIcon className="h-5 w-5" /> : <LockIcon className="h-5 w-5" />}
        </div>

        <div className="mb-8 space-y-1 text-center">
          <h1 className="text-xl font-black tracking-tight text-[var(--text-baseline)] uppercase">
            Identity Authentication
          </h1>
          <p className="font-mono text-[9px] tracking-widest text-[var(--text-baseline)]/40 uppercase">
            Authorized Boardroom Access Only
          </p>
        </div>

        <form onSubmit={handleVerification} className="w-full space-y-4">
          <input
            type="password"
            maxLength={12}
            value={passkey}
            disabled={processing}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="ENTER SECURE ACCESS KEY"
            className={`w-full rounded-xl border bg-[var(--bg-canvas)] px-4 py-4 text-center font-mono text-sm tracking-[0.4em] text-[var(--text-baseline)] placeholder-[var(--text-baseline)]/20 transition-all duration-200 focus:outline-none ${
              error
                ? 'border-red-500 shadow-md shadow-red-500/5 focus:border-red-400'
                : 'border-[var(--border-grid)] focus:border-[var(--color-accent)] focus:shadow-md focus:shadow-[var(--color-accent)]/5'
            }`}
          />

          {error ? (
            <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-wider text-red-400 uppercase">
              <span className="h-1 w-1 rounded-full bg-red-400" />
              Invalid Credentials Issued
            </div>
          ) : null}

          <button
            type="submit"
            disabled={processing || !passkey}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-purple-600 py-4 text-center font-black text-xs tracking-wider text-[var(--bg-canvas)] uppercase shadow-lg shadow-[var(--color-accent)]/10 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 disabled:hover:scale-100"
          >
            {processing ? 'Verifying…' : 'Authorize Terminal Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
