import { StyleSheet, View } from 'react-native';

import { HabitIcon } from '@/components/habit-icon';
import { ThemedText } from '@/components/themed-text';
import type { Habit } from '@/db/types';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
  habit: Habit;
  streak: number;
};

export function StreakCard({ habit, streak }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const flameColor = streak > 0 ? colors.warning : colors.iconMuted;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceMuted }]}>
      <View style={[styles.iconBubble, { backgroundColor: habit.color + '22' }]}>
        <HabitIcon name={habit.icon} size={22} tintColor={habit.color} />
      </View>
      <View style={styles.body}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {habit.name}
        </ThemedText>
        <ThemedText style={[styles.subtle, { color: colors.secondaryText }]}>
          {streak === 1 ? t('streaks.dayOne') : t('streaks.dayMany', { count: streak })}
        </ThemedText>
      </View>
      <View
        style={[
          styles.streakBadge,
          { backgroundColor: streak > 0 ? 'rgba(245,190,56,0.16)' : colors.surfaceMutedStrong },
        ]}>
        <HabitIcon name="flame.fill" size={14} tintColor={flameColor} />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.streakNumber, { color: flameColor }]}>
          {streak}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    gap: 12,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  subtle: {
    fontSize: 13,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 56,
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
});
