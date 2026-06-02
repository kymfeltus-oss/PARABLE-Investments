/**
 * Pitch Lock Brand Guidelines
 * ───────────────────────────
 * Read this file AND src/config/brand.ts before creating any UI.
 * CSS implementation: src/styles/brand.css
 * Logo component: src/components/brand/PitchLockLogo.tsx
 *
 * Visual source of truth: Pitch Lock flash intro artwork (cyan + purple on black void).
 */

export const BRAND_GUIDELINES = {
  mood: [
    "Premium",
    "Modern",
    "Technology-forward",
    "Exclusive",
    "Clean",
    "Minimal",
    "Gen Z / Millennial",
  ],

  avoid: [
    "Corporate banking",
    "Legal software",
    "Traditional venture capital",
    "Admin dashboard density",
    "Crypto clutter",
    "Gold or warm metallic accents",
  ],

  visualPrinciples: [
    "High negative space",
    "Cinematic hero moments",
    "Low information density",
    "Cyan + purple luminous glow on black",
    "Flash intro as the aesthetic anchor",
  ],
} as const;

/** Required reading order for AI / developers building new screens. */
export const BRAND_SOURCE_FILES = [
  "src/config/brand.ts",
  "src/config/brand-guidelines.ts",
  "src/styles/brand.css",
  "src/components/brand/PitchLockLogo.tsx",
] as const;

/** Approved palette — never introduce colors outside this set. */
export const BRAND_PALETTE = {
  black: "#000000",
  obsidian: "#030108",
  cyan: "#00F0FF",
  purple: "#9D00FF",
  text: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.6)",
  locked: "rgba(255, 255, 255, 0.35)",
  error: "#FF4D8D",
} as const;

/** Component class cheat sheet — use these instead of ad-hoc Tailwind colors. */
export const BRAND_COMPONENT_CLASSES = {
  pageBackground: "pl-atmosphere",
  heading: "pl-display",
  body: "pl-body",
  label: "pl-label",
  muted: "pl-muted",
  text: "pl-text",
  gradientText: "pl-text-gradient",
  card: "pl-card",
  cardGlow: "pl-card-glow",
  cardPremium: "pl-card-premium",
  buttonPrimary: "pl-btn pl-btn-primary",
  buttonSecondary: "pl-btn pl-btn-secondary",
  buttonGhost: "pl-btn pl-btn-secondary",
  buttonOutline: "pl-btn pl-btn-outline",
  input: "pl-input",
  inputLabel: "pl-input-label",
  link: "pl-link",
  error: "pl-error",
  badgeVerified: "pl-badge pl-badge-cyan",
  badgePremium: "pl-badge pl-badge-purple",
  badgeMuted: "pl-badge pl-badge-muted",
  logo: "PitchLockLogo",
} as const;

export type BrandGuidelines = typeof BRAND_GUIDELINES;
