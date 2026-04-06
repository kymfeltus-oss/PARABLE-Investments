export type AppCategory = "corporate" | "events" | "small-business";

export type SecurafinApp = {
  id: string;
  name: string;
  tagline: string;
  category: AppCategory;
  highlights: string[];
  sandboxRoute: string;
};

export const CATEGORY_LABELS: Record<AppCategory, string> = {
  corporate: "Corporate",
  events: "Event Management",
  "small-business": "Small Business",
};

export const APPS: SecurafinApp[] = [
  {
    id: "vault-access",
    name: "VaultAccess",
    tagline: "Zero-trust visitor and contractor onboarding",
    category: "corporate",
    highlights: ["SSO-ready", "Audit trails", "Policy gates"],
    sandboxRoute: "/try/vault-access",
  },
  {
    id: "pulse-events",
    name: "PulseEvents",
    tagline: "Registration, seating, and live ops in one pane",
    category: "events",
    highlights: ["Real-time capacity", "Staff handheld mode", "Sponsor portals"],
    sandboxRoute: "/try/pulse-events",
  },
  {
    id: "ledger-lite",
    name: "LedgerLite",
    tagline: "Invoices, reminders, and cash flow without the clutter",
    category: "small-business",
    highlights: ["Under 2s loads", "Mobile-first", "Exports you can trust"],
    sandboxRoute: "/try/ledger-lite",
  },
  {
    id: "sentinel-desk",
    name: "SentinelDesk",
    tagline: "IT intake with AI triage and SLA tracking",
    category: "corporate",
    highlights: ["Role-based queues", "Encrypted attachments", "Executive rollups"],
    sandboxRoute: "/try/sentinel-desk",
  },
  {
    id: "gather-circle",
    name: "GatherCircle",
    tagline: "Community events from RSVP to follow-up",
    category: "events",
    highlights: ["Multi-track agendas", "Check-in kiosks", "Engagement heatmaps"],
    sandboxRoute: "/try/gather-circle",
  },
  {
    id: "stockline",
    name: "Stockline",
    tagline: "Inventory and reordering with predictive nudges",
    category: "small-business",
    highlights: ["Barcode friendly", "Low-stock alerts", "Supplier sync"],
    sandboxRoute: "/try/stockline",
  },
];

export function appsByCategory(cat: AppCategory | "all") {
  if (cat === "all") return APPS;
  return APPS.filter((a) => a.category === cat);
}
