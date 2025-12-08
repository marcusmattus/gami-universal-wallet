/**
 * Neo-UI Design System - Theme Export
 * Gami Protocol Universal Wallet
 */

export { neoUIColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows } from './shadows';

export type { NeoUIColors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius } from './spacing';
export type { Shadows } from './shadows';

// Re-export for convenience
export const theme = {
  colors: require('./colors').neoUIColors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  shadows: require('./shadows').shadows,
} as const;
