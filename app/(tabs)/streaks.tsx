import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CosmicBg } from '@/components/cosmic-bg';
import { HabitIcon } from '@/components/habit-icon';
import { Heatmap } from '@/components/heatmap';
import { StreakCard } from '@/components/streak-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  addDays,
  computeOverallStreak,
  computeStreak,
  getCompletionsInRange,
  listHabits,
  todayISO,
  useQuery,
} from '@/db';
import type { Habit } from '@/db/types';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

type HeatmapData = Record<string, { completed: number; total: number }>;
type StreaksData = {
  overall: number;
  heatmap: HeatmapData;
  habits: { habit: Habit; streak: number }[];
};

export default function StreaksScreen() {
  const { colors, scheme } = useTheme();
  const { t } = useTranslation();
  const { data } = useQuery<StreaksData>(async (db) => {
    const overall = await computeOverallStreak(db);
    const habits = await listHabits(db);
    const today = todayISO();
    const start = addDays(today, -48);
    const rows = await getCompletionsInRange(db, start, today);
    const heatmap: HeatmapData = {};
    for (const row of rows) {
      heatmap[row.date] = { completed: row.completed, total: row.total };
    }
    const habitStreaks = await Promise.all(
      habits.map(async (h) => ({ habit: h, streak: await computeStreak(db, h.id) })),
    );
    return { overall, heatmap, habits: habitStreaks };
  });

  const overall = data?.overall ?? 0;
  const heatmap = data?.heatmap ?? {};
  const habits = data?.habits ?? [];

  const isOnFire = overall > 0;

  return (
    <ThemedView style={styles.flex}>
      <CosmicBg />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>

          <View style={styles.headerText}>
            <ThemedText style={[styles.subtle, { color: colors.secondaryText }]}>
              {t('streaks.subtitle')}
            </ThemedText>
            <ThemedText type="title">{t('streaks.title')}</ThemedText>
          </View>

          {/* ── Hero streak card ── */}
          <View
            style={[
              styles.hero,
              {
                backgroundColor: isOnFire
                  ? (scheme === 'dark'
                    ? 'rgba(255,208,80,0.14)'
                    : 'rgba(245,190,56,0.11)')
                  : colors.surfaceMuted,
                borderColor: isOnFire
                  ? (scheme === 'dark'
                    ? 'rgba(255,208,80,0.22)'
                    : 'rgba(245,190,56,0.18)')
                  : 'transparent',
                borderWidth: 1,
              },
            ]}>
            <View style={styles.flameRow}>
              <HabitIcon
                name="flame.fill"
                size={42}
                tintColor={isOnFire ? colors.warning : colors.iconMuted}
              />
              <ThemedText style={[styles.heroNumber, isOnFire && { color: colors.warning }]}>
                {overall}
              </ThemedText>
            </View>
            <ThemedText style={[styles.heroLabel, { color: colors.secondaryText }]}>
              {t('streaks.dayStreak')}
            </ThemedText>
            <ThemedText style={[styles.heroSubtle, { color: colors.secondaryText }]}>
              {overall === 0 ? t('streaks.startMsg') : t('streaks.allDone')}
            </ThemedText>
          </View>

          {/* ── Heatmap ── */}
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">{t('streaks.last7')}</ThemedText>
          </View>
          <View style={[styles.heatmapWrap, { backgroundColor: colors.surfaceMuted }]}>
            <Heatmap data={heatmap} tint={colors.brand} />
          </View>

          {/* ── Per-habit streaks ── */}
          {habits.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <ThemedText type="subtitle">{t('streaks.perHabit')}</ThemedText>
              </View>
              {habits.map(({ habit, streak }) => (
                <StreakCard key={habit.id} habit={habit} streak={streak} />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 130 },
  headerText: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 4,
  },
  subtle: { fontSize: 14 },
  hero: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 4,
  },
  flameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroNumber: {
    fontSize: 58,
    fontWeight: '800',
    lineHeight: 64,
    fontVariant: ['tabular-nums'],
  },
  heroLabel: { fontSize: 16 },
  heroSubtle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  heatmapWrap: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
});
