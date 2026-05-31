'use client';

/**
 * Catches recoverable runtime errors in the App Router tree so users see a retry path
 * instead of only the generic Next.js overlay.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg-black)] px-6 text-center text-white">
      <p className="max-w-md text-sm text-white/75">
        Something went wrong loading this page. You can try again, or refresh the browser.
      </p>
      {process.env.NODE_ENV === 'development' && error.message ? (
        <p className="max-w-lg break-words font-mono text-xs text-red-300/90">{error.message}</p>
      ) : null}
      {error.digest ? <p className="text-xs font-mono text-white/35">Ref: {error.digest}</p> : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/20"
      >
        Try again
      </button>
    </div>
  );
}
