import { Platform } from 'react-native';

// Extracted from main.png: teal clock ring, amber sun, moon blue, mint bg
const brandLight = '#38C4D0';
const brandDark  = '#5CD8E2';

export const Colors = {
  light: {
    text: '#1A2A42',
    secondaryText: 'rgba(26,42,66,0.55)',
    background: '#EDF8F5',
    surface: '#FFFFFF',
    surfaceMuted: 'rgba(56,196,208,0.08)',
    surfaceMutedStrong: 'rgba(56,196,208,0.15)',
    trackBackground: 'rgba(26,42,66,0.10)',
    separator: 'rgba(26,42,66,0.08)',
    placeholder: 'rgba(26,42,66,0.35)',
    tint: brandLight,
    accent: brandLight,
    success: '#42C87E',
    warning: '#F5BE38',
    danger: '#F07060',
    icon: '#4A6078',
    iconMuted: '#8AABBC',
    tabIconDefault: '#8AABBC',
    tabIconSelected: brandLight,
    brand: brandLight,
    brandSoft: 'rgba(56,196,208,0.13)',
    sun: '#F5C040',
    moon: '#70B8CC',
    coral: '#F07870',
    lavender: '#8090D0',
  },
  dark: {
    text: '#E4F2FA',
    secondaryText: 'rgba(228,242,250,0.58)',
    background: '#0C1828',
    surface: '#132038',
    surfaceMuted: 'rgba(92,216,226,0.12)',
    surfaceMutedStrong: 'rgba(92,216,226,0.20)',
    trackBackground: 'rgba(92,216,226,0.18)',
    separator: 'rgba(92,216,226,0.12)',
    placeholder: 'rgba(228,242,250,0.35)',
    tint: brandDark,
    accent: brandDark,
    success: '#4CD890',
    warning: '#FFD050',
    danger: '#FF6464',
    icon: '#7AC4D0',
    iconMuted: '#4E8898',
    tabIconDefault: '#4E8898',
    tabIconSelected: brandDark,
    brand: brandDark,
    brandSoft: 'rgba(92,216,226,0.18)',
    sun: '#FFD050',
    moon: '#9ACCE4',
    coral: '#FF8070',
    lavender: '#9AACEE',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
