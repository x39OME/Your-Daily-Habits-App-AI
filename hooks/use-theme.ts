import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemePalette = typeof Colors.light;

export function useTheme(): { scheme: 'light' | 'dark'; colors: ThemePalette } {
  const scheme = useColorScheme() ?? 'light';
  return { scheme, colors: Colors[scheme] };
}
