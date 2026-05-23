import * as Haptics from 'expo-haptics';
import { useHapticPreference } from '@/hooks/haptic-preference';

export function useHaptic() {
  const { hapticsEnabled } = useHapticPreference();

  const impact = (style: Haptics.ImpactFeedbackStyle) => {
    if (hapticsEnabled) Haptics.impactAsync(style);
  };

  const notification = (type: Haptics.NotificationFeedbackType) => {
    if (hapticsEnabled) Haptics.notificationAsync(type);
  };

  const selection = () => {
    if (hapticsEnabled) Haptics.selectionAsync();
  };

  return { impact, notification, selection };
}
