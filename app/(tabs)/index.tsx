import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { CosmicBg } from '@/components/cosmic-bg';
import { HabitIcon } from '@/components/habit-icon';
import { HabitRow } from '@/components/habit-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  deleteHabit,
  listHabitsWithProgress,
  toggleCompletion,
  useDb,
  useHabitStore,
  useQuery,
} from '@/db';
import type { HabitWithProgress } from '@/db/types';
import { useCompletionSound } from '@/hooks/use-completion-sound';
import { useHaptic } from '@/hooks/use-haptic';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function TodayScreen() {
  const router = useRouter();
  const db = useDb();
  const { bump } = useHabitStore();
  const { colors, scheme } = useTheme();
  const { t, language } = useTranslation();
  const playCompletion = useCompletionSound();
  const { impact } = useHaptic();

  const { data: habits } = useQuery(listHabitsWithProgress);

  const { list, completedCount, totalCount, dateLabel } = useMemo(() => {
    const items = habits ?? [];
    const completed = items.filter((h) => h.isComplete).length;
    const today = new Date();
    const locale = language === 'ar' ? 'ar' : undefined;
    const label = today.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    return {
      list: items,
      completedCount: completed,
      totalCount: items.length,
      dateLabel: label,
    };
  }, [habits, language]);

  const handleToggle = async (habit: HabitWithProgress) => {
    const wasComplete = habit.isComplete;
    await toggleCompletion(db, habit.id);
    bump();
    if (!wasComplete) playCompletion();
  };

  const handleDelete = (habit: HabitWithProgress) => {
    impact(ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('today.deleteConfirmTitle', { name: habit.name }),
      t('today.deleteConfirmBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(db, habit.id);
            bump();
          },
        },
      ],
    );
  };

  const handleAdd = () => {
    impact(ImpactFeedbackStyle.Light);
    router.push('/new-habit');
  };

  const allDone = totalCount > 0 && completedCount === totalCount;
  const progressPct = totalCount === 0 ? 0 : completedCount / totalCount;

  return (
    <ThemedView style={styles.flex}>
      <CosmicBg />
      <SafeAreaView edges={['top']} style={styles.flex}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText style={[styles.dateLabel, { color: colors.secondaryText }]}>
              {dateLabel}
            </ThemedText>
            <ThemedText type="title">{t('today.title')}</ThemedText>
          </View>
          <Pressable
            accessibilityLabel={t('today.addAccessibility')}
            onPress={handleAdd}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.brand },
              pressed && { opacity: 0.7 },
            ]}>
            <HabitIcon name="plus" size={22} tintColor="#fff" />
          </Pressable>
        </View>

        {/* ── Progress card ── */}
        {totalCount > 0 && (
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: allDone
                  ? (scheme === 'dark' ? 'rgba(66,200,126,0.15)' : 'rgba(66,200,126,0.10)')
                  : colors.surfaceMuted,
              },
            ]}>
            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: colors.secondaryText }]}>
                {t('today.progress')}
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                {completedCount} {t('today.of')} {totalCount}
              </ThemedText>
            </View>
            <View style={[styles.summaryTrack, { backgroundColor: colors.trackBackground }]}>
              <View
                style={[
                  styles.summaryFill,
                  {
                    backgroundColor: allDone ? colors.success : colors.brand,
                    width: `${progressPct * 100}%`,
                  },
                ]}
              />
            </View>
            {allDone && (
              <ThemedText style={[styles.allDoneText, { color: colors.success }]}>
                ✦ All done for today!
              </ThemedText>
            )}
          </View>
        )}

        {/* ── List ── */}
        <ScrollView
          contentContainerStyle={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          {list.length === 0 ? (
            <View style={styles.empty}>
              <HabitIcon name="sparkles" size={56} tintColor={colors.brand} />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                {t('today.emptyTitle')}
              </ThemedText>
              <ThemedText style={[styles.emptyBody, { color: colors.secondaryText }]}>
                {t('today.emptyBody')}
              </ThemedText>
            </View>
          ) : (
            list.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerText: { gap: 4 },
  dateLabel: { fontSize: 14 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 14 },
  summaryTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    borderRadius: 4,
  },
  allDoneText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 130,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: { marginTop: 8 },
  emptyBody: { textAlign: 'center' },
});
