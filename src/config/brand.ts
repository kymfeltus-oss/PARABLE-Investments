/**
 * Pitch Lock Brand Bible
 * ─────────────────────
 * Single source of truth for all design tokens.
 *
 * Related files (read before building UI):
 *   - src/config/brand-guidelines.ts  — mood, avoid list, principles
 *   - src/styles/brand.css            — CSS variables + utility classes
 *   - src/components/brand/PitchLockLogo.tsx — logo mark only
 *
 * Rule: never hardcode colors in components. Use brandCssVars or pl-* classes.
 */

import { BRAND_PALETTE } from "./brand-guidelines";

export const BRAND_VERSION = "2026-06-pitchlock-cyan-purple-v2";

export const brand = {
  version: BRAND_VERSION,

  /** Core palette — mirrors :root in brand.css */
  colors: {
    black: BRAND_PALETTE.black,
    obsidian: BRAND_PALETTE.obsidian,
    glassSurface: "rgba(4, 2, 10, 0.75)",
    cardSurface: "rgba(10, 10, 15, 0.8)",
    cyan: BRAND_PALETTE.cyan,
    purple: BRAND_PALETTE.purple,
    text: BRAND_PALETTE.text,
    muted: BRAND_PALETTE.muted,
    locked: BRAND_PALETTE.locked,
    error: BRAND_PALETTE.error,
    textSecondary: "rgba(255, 255, 255, 0.85)",
    border: "rgba(255, 255, 255, 0.1)",
    borderInput: "rgba(255, 255, 255, 0.2)",
    borderStrong: "rgba(255, 255, 255, 0.15)",
    inputBg: "rgba(255, 255, 255, 0.03)",
    cyanGlow: "rgba(0, 240, 255, 0.4)",
    cyanMuted: "rgba(0, 240, 255, 0.12)",
    purpleMuted: "rgba(157, 0, 255, 0.12)",
    purpleAmbient: "rgba(157, 0, 255, 0.07)",
    cyanAmbient: "rgba(0, 240, 255, 0.06)",
    cyanBorderSoft: "rgba(0, 240, 255, 0.2)",
    purpleBorderSoft: "rgba(157, 0, 255, 0.35)",
    surfaceHover: "rgba(255, 255, 255, 0.04)",
    cardSurfaceHover: "rgba(10, 10, 15, 0.95)",
    headerBg: "rgba(3, 1, 8, 0.92)",
    /** @deprecated use black */
    pureVoid: BRAND_PALETTE.black,
    /** @deprecated use obsidian */
    surfaceObsidian: BRAND_PALETTE.obsidian,
    /** @deprecated use cyan */
    primaryCyan: BRAND_PALETTE.cyan,
    /** @deprecated use purple */
    secondaryPurple: BRAND_PALETTE.purple,
    /** @deprecated use text */
    primaryText: BRAND_PALETTE.text,
    /** @deprecated use muted */
    mutedText: BRAND_PALETTE.muted,
    /** @deprecated use border */
    borderSubtle: "rgba(255, 255, 255, 0.1)",
  },

  status: {
    verified: BRAND_PALETTE.cyan,
    active: BRAND_PALETTE.cyan,
    premium: BRAND_PALETTE.purple,
    locked: BRAND_PALETTE.locked,
    error: BRAND_PALETTE.error,
  },

  typography: {
    primaryFont: "Inter, Montserrat, system-ui, sans-serif",
    displayFont: "Montserrat, Inter, system-ui, sans-serif",
    brandFont: "Playfair Display, Georgia, serif",
    heading: {
      cssClass: "pl-display",
      textTransform: "uppercase" as const,
      fontWeight: 800,
      letterSpacing: "0.4em",
      lineHeight: 1.3,
    },
    body: {
      cssClass: "pl-body",
      fontWeight: 400,
      letterSpacing: "0.1em",
      lineHeight: 1.8,
    },
    label: {
      cssClass: "pl-label",
      textTransform: "uppercase" as const,
      fontWeight: 500,
      letterSpacing: "0.25em",
      fontSize: "0.6875rem",
    },
    brandScript: {
      cssClass: "pl-brand",
      fontStyle: "italic" as const,
      usage: "Pitch wordmark in logo and hero accents only",
    },
  },

  spacing: {
    unit: 8,
    cssUnit: "8px",
    sectionPadding: "clamp(80px, 10vw, 120px)",
    containerPadding: "clamp(32px, 5vw, 48px)",
    componentGap: "clamp(24px, 3vw, 32px)",
    sectionPaddingMin: 80,
    sectionPaddingMax: 120,
    containerPaddingMin: 32,
    containerPaddingMax: 48,
    componentGapMin: 24,
    componentGapMax: 32,
  },

  radius: {
    standard: 3,
    standardCss: "3px",
    pill: 999,
    pillCss: "999px",
    rule: "Sharp 2–4px on cards/inputs; pill only on buttons and badges",
  },

  glow: {
    bloom: "drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))",
    focus: "0 0 12px rgba(0, 240, 255, 0.25)",
    purple: "0 0 40px rgba(157, 0, 255, 0.08)",
    purpleFocus: "0 0 14px rgba(157, 0, 255, 0.35)",
    rule: "Luminous cyan/purple only — no gray box shadows, no gold",
    cssClasses: {
      logo: "pl-logo-glow",
      card: "pl-card-glow",
      heroLock: "pl-hero-lock-glow",
      heroLogo: "pl-hero-logo",
    },
  },

  gradients: {
    ambient:
      "radial-gradient(ellipse 100% 70% at 20% -20%, rgba(0, 240, 255, 0.08), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 10%, rgba(157, 0, 255, 0.06), transparent 50%)",
    text: "linear-gradient(90deg, #FFFFFF 0%, #00F0FF 100%)",
    heroTitle:
      "linear-gradient(105deg, #FFFFFF 0%, #00F0FF 42%, #9D00FF 88%, #FFFFFF 100%)",
    cssClass: "pl-text-gradient",
    opacityRange: "5%–10% for ambient; never full-strength background gradients",
  },

  card: {
    cssClass: "pl-card",
    glowClass: "pl-card-glow",
    premiumClass: "pl-card-premium",
    background: "rgba(10, 10, 15, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropBlur: 12,
  },

  button: {
    cssBase: "pl-btn",
    variants: {
      primary: "pl-btn-primary",
      secondary: "pl-btn-secondary",
      ghost: "pl-btn-secondary",
      outline: "pl-btn-outline",
    },
    background: "#000000",
    letterSpacing: "0.4em",
    textTransform: "uppercase" as const,
    fontSize: "0.6875rem",
    fontWeight: 600,
    primaryHover: "Cyan border + cyan glow",
    secondaryHover: "Purple border + purple glow",
  },

  badge: {
    verified: "pl-badge-cyan",
    premium: "pl-badge-purple",
    muted: "pl-badge-muted",
  },

  input: {
    cssClass: "pl-input",
    labelClass: "pl-input-label",
    background: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.2)",
    focusBorder: "#00F0FF",
  },

  animation: {
    duration: "850ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    entranceTranslateY: 20,
    floatDistance: 5,
    floatDuration: "6s",
    cssClasses: {
      entrance: "pl-animate-in",
      float: "pl-animate-float",
      delay1: "pl-animate-in-delay-1",
      delay2: "pl-animate-in-delay-2",
      delay3: "pl-animate-in-delay-3",
    },
  },

  logo: {
    component: "PitchLockLogo",
    path: "src/components/brand/PitchLockLogo.tsx",
    sizes: ["sm", "md", "lg", "hero"] as const,
    layouts: ["inline", "stacked"] as const,
    iconSizes: { sm: 24, md: 32, lg: 48, hero: 96 },
    wordmark: {
      pitch: "pl-brand script",
      lock: "pl-heading uppercase",
    },
    glowClasses: ["pl-logo-glow", "pl-hero-logo", "pl-hero-lock-glow"],
    rule: "Only PitchLockLogo.tsx may define the lock SVG and wordmark",
  },

  dashboard: {
    cssClasses: {
      shell: "pl-atmosphere",
      header: "pl-dashboard-header",
      sidebar: "pl-dashboard-sidebar",
      navLink: "pl-dashboard-nav-link",
      bottomNav: "pl-dashboard-bottom-nav",
      bottomLink: "pl-dashboard-bottom-link",
      moduleGrid: "pl-module-grid",
      moduleCard: "pl-module-card",
      metricValue: "pl-metric-value",
      verifiedBanner: "pl-verified-banner",
    },
    rules: [
      "Low information density — few modules per screen",
      "High negative space between cards",
      "Cyan badges for verified/active states",
      "Purple badges for premium / Pro features",
      "Muted white for locked or inactive",
      "No gold accents",
    ],
  },

  mobile: {
    typographyScale: 0.85,
    breakpoint: "639px",
    rules: [
      "Typography −15% below 640px; letter-spacing preserved",
      "Full-width pill buttons on intro and forms",
      "Bottom docked navigation or full-screen glass overlay",
      "Black void (--pl-black) must remain visible",
      "No horizontal overflow (overflow-x-hidden on shells)",
      "pl-mobile-logo-bar for compact dashboard header strip",
    ],
    cssClasses: {
      logoBar: "pl-mobile-logo-bar",
    },
  },

  hero: {
    cssClasses: {
      stage: "pl-hero-stage",
      content: "pl-hero-content",
      title: "pl-hero-title",
      subtext: "pl-hero-subtext",
      ctaPanel: "pl-hero-cta-panel",
      proof: "pl-hero-proof",
      orbCyan: "pl-hero-orb-cyan",
      orbPurple: "pl-hero-orb-purple",
    },
    usage: "Flash intro — src/components/landing/PitchLockFlashPage.tsx",
  },
} as const;

/**
 * Canonical CSS custom property names.
 * Prefer these in inline styles: style={{ color: `var(${brandCssVars.cyan})` }}
 */
export const brandCssVars = {
  black: "--pl-black",
  obsidian: "--pl-obsidian",
  cyan: "--pl-cyan",
  purple: "--pl-purple",
  text: "--pl-text",
  muted: "--pl-muted",
  locked: "--pl-locked",
  error: "--pl-error",
  glassSurface: "--pl-glass-surface",
  cardSurface: "--pl-card-surface",
  textSecondary: "--pl-text-secondary",
  border: "--pl-border",
  borderInput: "--pl-border-input",
  inputBg: "--pl-input-bg",
  radius: "--pl-radius",
  radiusPill: "--pl-radius-pill",
  glowBloom: "--pl-glow-bloom",
  glowFocus: "--pl-glow-focus",
  glowPurpleFocus: "--pl-glow-purple-focus",
  sectionPadding: "--pl-section-padding",
  containerPadding: "--pl-container-padding",
  componentGap: "--pl-component-gap",
  animDuration: "--pl-anim-duration",
  animEasing: "--pl-anim-easing",
  void: "--pl-void",
  surfaceObsidian: "--pl-surface-obsidian",
  textMuted: "--pl-text-muted",
} as const;

export type Brand = typeof brand;
