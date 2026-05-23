import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CosmicBg } from '@/components/cosmic-bg';
import { HabitIcon } from '@/components/habit-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SymbolName } from '@/db/types';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function ComingSoonScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Gentle float animation for the icon
  const floatY = useSharedValue(0);
  const glowS  = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,  { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    );
    glowS.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.00, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    );
  }, [floatY, glowS]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowAnim = useAnimatedStyle(() => ({
    transform: [{ scale: glowS.value }],
    opacity: 0.18,
  }));

  return (
    <ThemedView style={styles.flex}>
      <CosmicBg />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.center}>

          {/* Glow halo behind icon */}
          <Animated.View
            style={[
              styles.glow,
              { backgroundColor: colors.brand },
              glowAnim,
            ]}
          />

          {/* Cloud icon — floats */}
          <Animated.View
            style={[
              styles.iconWrap,
              { backgroundColor: colors.brandSoft },
              iconAnim,
            ]}>
            <HabitIcon
              name={'cloud.fill' as SymbolName}
              size={44}
              tintColor={colors.brand}
            />
          </Animated.View>

          <ThemedText style={styles.title}>
            {t('tab.soon')}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.secondaryText }]}>
            Something great is on its way.{'\n'}Stay tuned for the next update!
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  glow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  iconWrap: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});
