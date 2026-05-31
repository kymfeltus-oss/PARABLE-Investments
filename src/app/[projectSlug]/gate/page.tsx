'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock } from 'lucide-react';
import { BrandIcon } from '@/components/brand/BrandIcon';

const VAULT_COOKIE = 'pitchlock_vault_unlocked';
const VAULT_PASSKEY = process.env.NEXT_PUBLIC_PITCHLOCK_VAULT_PASSKEY?.trim() || '050605';

type Props = {
  params: Promise<{ projectSlug: string }>;
};

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
    <div className="app-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 select-none">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center glass-card p-8 shadow-2xl">
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
            error
              ? 'border-red-500/30 bg-red-500/10 text-red-400'
              : 'border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10'
          }`}
        >
          {error ? (
            <BrandIcon icon={AlertCircle} tone="inherit" className="h-5 w-5 text-red-400" />
          ) : (
            <BrandIcon icon={Lock} className="h-5 w-5" />
          )}
        </div>

        <div className="mb-8 space-y-1 text-center">
          <h1 className="type-hero text-[var(--text-baseline)]">
            Identity Authentication
          </h1>
          <p className="type-section-label text-[var(--text-baseline)]/40">
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
            className={`type-nav w-full rounded-xl border bg-[var(--bg-canvas)] px-4 py-4 text-center text-sm text-[var(--text-baseline)] placeholder-[var(--text-baseline)]/20 transition-all duration-200 focus:outline-none ${
              error
                ? 'border-red-500 shadow-md shadow-red-500/5 focus:border-red-400'
                : 'border-[var(--border-grid)] focus:border-[var(--color-accent)] focus:shadow-md focus:shadow-[var(--color-accent)]/5'
            }`}
          />

          {error ? (
            <div className="type-nav flex items-center justify-center gap-2 text-red-400">
              <span className="h-1 w-1 rounded-full bg-red-400" />
              Invalid Credentials Issued
            </div>
          ) : null}

          <button
            type="submit"
            disabled={processing || !passkey}
            className="primary-button type-nav"
          >
            {processing ? 'Verifying…' : 'Authorize Terminal Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
