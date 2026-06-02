"use client";

import { useEffect, useState } from "react";
import { consumeLastEmailStatus } from "@/lib/pitch-access-storage";
import { getEmailStatusMessage } from "@/lib/nda-template-defaults";

export function EmailDeliveryNotice() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const stored = consumeLastEmailStatus();
    if (!stored) return;
    setMessage(getEmailStatusMessage(stored.status));
    setIsError(stored.status === "failed");
  }, []);

  if (!message) return null;

  return (
    <div className="pl-verified-banner !mt-4">
      <p className={`pl-body text-sm ${isError ? "pl-error" : "pl-text"}`}>{message}</p>
      {isError ? (
        <p className="mt-1 text-xs pl-muted">Check RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local</p>
      ) : null}
    </div>
  );
}
