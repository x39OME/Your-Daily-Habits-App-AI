import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { DATABASE_NAME, HabitStoreProvider, migrate } from '@/db';
import { HapticPreferenceProvider } from '@/hooks/haptic-preference';
import { LanguagePreferenceProvider } from '@/hooks/language-preference';
import { ThemePreferenceProvider } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: 'onboarding',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
        <ThemePreferenceProvider>
          <LanguagePreferenceProvider>
            <HapticPreferenceProvider>
            <HabitStoreProvider>
              <ThemedApp />
            </HabitStoreProvider>
            </HapticPreferenceProvider>
          </LanguagePreferenceProvider>
        </ThemePreferenceProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-habit"
          options={{
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.85, 1],
            sheetCornerRadius: 24,
            title: 'New Habit',
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
