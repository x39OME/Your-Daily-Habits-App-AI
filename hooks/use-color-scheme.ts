import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useThemePreference } from '@/hooks/theme-preference';

export function useColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme();
  const { mode } = useThemePreference();
  if (mode === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return mode;
}
