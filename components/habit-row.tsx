import { ImpactFeedbackStyle } from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { HabitIcon } from '@/components/habit-icon';
import { ThemedText } from '@/components/themed-text';
import type { HabitWithProgress, SymbolName } from '@/db/types';
import { useHaptic } from '@/hooks/use-haptic';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  habit: HabitWithProgress;
  onToggle: (habit: HabitWithProgress) => void;
  onDelete?: (habit: HabitWithProgress) => void;
};

export function HabitRow({ habit, onToggle, onDelete }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { impact } = useHaptic();
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkScale = useSharedValue(habit.isComplete ? 1 : 0);
  useEffect(() => {
    checkScale.value = withTiming(habit.isComplete ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [habit.isComplete, checkScale]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handlePress = () => {
    impact(habit.isComplete ? ImpactFeedbackStyle.Light : ImpactFeedbackStyle.Medium);
    onToggle(habit);
  };

  const handleDeletePress = () => {
    if (!onDelete) return;
    onDelete(habit);
  };

  return (
    <AnimatedPressable
      style={[styles.container, { backgroundColor: colors.surfaceMuted }, pressStyle]}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      }}
      onPress={handlePress}>
      <View style={[styles.iconBubble, { backgroundColor: habit.color + '22' }]}>
        <HabitIcon name={habit.icon} size={26} tintColor={habit.color} />
      </View>

      <View style={styles.body}>
        <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
          {habit.name}
        </ThemedText>
      </View>

      <View
        style={[
          styles.check,
          {
            borderColor: habit.color,
            backgroundColor: habit.isComplete ? habit.color : 'transparent',
          },
        ]}>
        <Animated.View style={checkStyle}>
          <HabitIcon name={'checkmark' as SymbolName} size={18} tintColor="#fff" />
        </Animated.View>
      </View>

      {onDelete && (
        <Pressable
          accessibilityLabel={t('today.deleteAccessibility', { name: habit.name })}
          hitSlop={10}
          onPress={handleDeletePress}
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: 'rgba(255,69,58,0.12)' },
            pressed && { opacity: 0.6 },
          ]}>
          <HabitIcon
            name={'trash' as SymbolName}
            size={16}
            tintColor={colors.danger}
          />
        </Pressable>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 18,
    gap: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
