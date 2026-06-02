"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { StudioShell } from "../StudioShell";

export function PitchMeetingStudioModule() {
  return (
    <StudioShell title="PitchMeeting Studio" subtitle="Concierge for investors">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm pl-muted leading-relaxed">
          Configure how investors book and join private conversations. This flows to the
          PitchMeeting Lounge on their dashboard — no separate setup required.
        </p>
        <GlassCard className="!p-6 space-y-4">
          <p className="pl-label">Meeting tools</p>
          <Link href="/book" className="pl-btn pl-btn-primary w-full justify-center">
            Book PitchMeeting setup
          </Link>
          <Link href="/meet" className="pl-btn pl-btn-outline w-full justify-center">
            Join meeting settings
          </Link>
        </GlassCard>
        <Link href="/dashboard/presenter" className="pl-link text-sm">
          ← Back to studio
        </Link>
      </div>
    </StudioShell>
  );
}
