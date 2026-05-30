/**
 * PARABLE brand tokens — backgrounds, blues, purples, accents, gradients, product moods.
 * CSS mirrors these in `globals.css` (`:root` + `@theme`).
 */
export const BRAND = {
  bg: {
    deepSpace: '#030712',
    midnightNavy: '#0A1018',
    darkSlate: '#0F1419',
    richNavy: '#111827',
  },
  blue: {
    electricCyan: '#00D4FF',
    primary: '#00B8FF',
    azureGlow: '#1EA7FF',
  },
  purple: {
    electric: '#8B5CF6',
    neonViolet: '#A855F7',
    deepViolet: '#7C3AED',
  },
  white: {
    pure: '#FFFFFF',
    soft: '#F8FAFC',
  },
  accent: {
    success: '#10B981',
    warning: '#F59E0B',
    alert: '#EF4444',
  },
  streaming: {
    pink: '#FF4FD8',
  },
  /** @deprecated Use `blue.electricCyan` */
  cyber: '#00D4FF',
  /** @deprecated Use `bg.deepSpace` */
  sanctuary: '#030712',
  /** @deprecated Use `bg.deepSpace` */
  shell: '#030712',
  black: '#000000',
} as const;

export const PARABLE_GRADIENT =
  'linear-gradient(90deg, #00D4FF 0%, #1EA7FF 35%, #8B5CF6 70%, #A855F7 100%)' as const;

export const LOGO_A_GRADIENT =
  'linear-gradient(180deg, #00D4FF 0%, #1EA7FF 50%, #8B5CF6 100%)' as const;

export type BrandColors = typeof BRAND;
