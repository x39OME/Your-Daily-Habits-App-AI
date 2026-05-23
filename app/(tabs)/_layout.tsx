import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="streaks" />
      <Tabs.Screen name="coming-soon" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
