import Link from "next/link";
import { PagePlaceholder } from "@/components/layout/MarketingShell";

const PITCH_SUBMODULES = [
  { href: "/documents", title: "Documents", description: "Materials shared for your review." },
  { href: "/questions", title: "Questions", description: "Ask the presenter in confidence." },
  {
    href: "/interest",
    title: "Investment Interest",
    description: "Signal interest or request follow-up.",
  },
];

export default function PitchPage() {
  return (
    <PagePlaceholder
      title="Pitch Room"
      description="Protected deck viewer and live pitch session. Backend and deck upload will connect here."
      backHref="/dashboard/investor"
    >
      <nav
        className="mt-8 w-full max-w-md border-t border-[var(--pl-border)] pt-6 text-left"
        aria-label="Pitch room modules"
      >
        <p className="pl-label mb-4 !text-xs pl-muted">In this room</p>
        <ul className="space-y-2">
          {PITCH_SUBMODULES.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-[var(--pl-radius)] border border-[var(--pl-border)] bg-[var(--pl-card-surface)] px-4 py-3 transition-colors hover:border-[var(--pl-border-strong)] hover:bg-[var(--pl-card-surface-hover)]"
              >
                <span className="pl-label !text-sm">{item.title}</span>
                <p className="mt-1 text-sm pl-muted">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PagePlaceholder>
  );
}
