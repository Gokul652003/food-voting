import { useColorScheme } from 'react-native';

const palette = {
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',
  green500: '#22C55E',
  green600: '#16A34A',
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate850: '#172033',
  slate900: '#0F172A',
  white: '#FFFFFF',
  black: '#000000',
};

export type ThemeColors = typeof lightColors;

const lightColors = {
  background: palette.slate50,
  surface: palette.white,
  surfaceAlt: palette.slate100,
  border: palette.slate200,
  text: palette.slate900,
  textMuted: palette.slate500,
  primary: palette.amber600,
  primaryMuted: '#FDF1DC',
  primaryText: palette.white,
  success: palette.green600,
  successMuted: '#DCFCE7',
  danger: palette.red600,
  dangerMuted: '#FEE2E2',
  tabActive: palette.amber600,
  tabInactive: palette.slate400,
};

const darkColors = {
  background: palette.slate900,
  surface: palette.slate850,
  surfaceAlt: palette.slate800,
  border: palette.slate700,
  text: palette.slate50,
  textMuted: palette.slate400,
  primary: palette.amber500,
  primaryMuted: '#3A2E14',
  primaryText: palette.slate900,
  success: palette.green500,
  successMuted: '#123321',
  danger: palette.red400,
  dangerMuted: '#3B1616',
  tabActive: palette.amber500,
  tabInactive: palette.slate500,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };
export const fontSize = { xs: 12, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26 };

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return { colors, spacing, radius, fontSize, isDark: scheme === 'dark' };
}
