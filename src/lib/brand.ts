/**
 * PARABLE brand tokens — keep in sync with the main PARABLE app (Inter, #00f2ff cyber, dark sanctuary).
 */
export const BRAND = {
  cyber: '#00f2ff',
  cyberMuted: 'rgba(0, 242, 255, 0.7)',
  sanctuary: '#010101',
  shell: '#070708',
  black: '#000000',
} as const;

export type BrandColors = typeof BRAND;
