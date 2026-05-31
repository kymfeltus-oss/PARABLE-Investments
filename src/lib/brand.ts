/**
 * PARABLE Brand v2 — cinematic kingdom OS tokens.
 * CSS source of truth: `src/app/globals.css` (`:root` + `@theme`).
 * Legacy `parable-*` keys bridge to v2 until the Phase 4 component sweep.
 */
export const BRAND_V2 = {
  bg: {
    black: '#000000',
    blackSoft: '#020205',
    panel: 'rgba(5, 8, 18, 0.72)',
    panelStrong: 'rgba(2, 4, 12, 0.92)',
  },
  white: {
    pure: '#FFFFFF',
    soft: 'rgba(255, 255, 255, 0.78)',
    muted: 'rgba(255, 255, 255, 0.56)',
    faint: 'rgba(255, 255, 255, 0.28)',
  },
  cyan: {
    primary: '#00F2FF',
    bright: '#00EAFF',
    deep: '#007AFF',
  },
  blue: {
    primary: '#1268FF',
    deep: '#061BFF',
  },
  violet: {
    primary: '#7D2CFF',
    purple: '#BC00DD',
    magenta: '#D100FF',
  },
  gold: {
    primary: '#F7B733',
    soft: '#FFCC58',
  },
  semantic: {
    success: '#28F5A3',
    danger: '#FF3B5C',
  },
} as const;

/** @deprecated Use `BRAND_V2` — kept for existing imports during migration. */
export const BRAND = {
  bg: {
    deepSpace: BRAND_V2.bg.black,
    midnightNavy: BRAND_V2.bg.blackSoft,
    darkSlate: BRAND_V2.bg.panel,
    richNavy: BRAND_V2.bg.panelStrong,
  },
  blue: {
    electricCyan: BRAND_V2.cyan.primary,
    primary: BRAND_V2.blue.primary,
    azureGlow: BRAND_V2.blue.primary,
  },
  purple: {
    electric: BRAND_V2.violet.purple,
    neonViolet: BRAND_V2.violet.magenta,
    deepViolet: BRAND_V2.violet.primary,
  },
  white: {
    pure: BRAND_V2.white.pure,
    soft: BRAND_V2.white.soft,
  },
  accent: {
    success: BRAND_V2.semantic.success,
    warning: BRAND_V2.gold.primary,
    alert: BRAND_V2.semantic.danger,
  },
  streaming: {
    pink: BRAND_V2.violet.magenta,
  },
  cyber: BRAND_V2.cyan.primary,
  sanctuary: BRAND_V2.bg.black,
  shell: BRAND_V2.bg.black,
  black: BRAND_V2.bg.black,
} as const;

export const PARABLE_GRADIENT_PRIMARY =
  'linear-gradient(90deg, #00F2FF 0%, #1268FF 42%, #7D2CFF 72%, #D100FF 100%)' as const;

export const PARABLE_GRADIENT_TITLE =
  'linear-gradient(90deg, #FFFFFF 0%, #00F2FF 38%, #7D2CFF 68%, #FFFFFF 100%)' as const;

/** @deprecated Use `PARABLE_GRADIENT_PRIMARY` */
export const PARABLE_GRADIENT = PARABLE_GRADIENT_PRIMARY;

export const LOGO_A_GRADIENT =
  'linear-gradient(180deg, #00F2FF 0%, #1268FF 50%, #7D2CFF 100%)' as const;

/** Flagship PitchLock tenant defaults (mirrors `pitchlock_projects` seed + layout fallbacks). */
export const PITCHLOCK_FLAGSHIP_THEME = {
  theme_bg: BRAND_V2.bg.black,
  theme_panel: BRAND_V2.bg.panel,
  theme_border: 'rgba(0, 242, 255, 0.14)',
  theme_accent: BRAND_V2.cyan.primary,
  theme_success: BRAND_V2.semantic.success,
  theme_text: BRAND_V2.white.soft,
} as const;

export type BrandV2Colors = typeof BRAND_V2;
export type BrandColors = typeof BRAND;
