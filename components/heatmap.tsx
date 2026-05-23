import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { addDays, todayISO } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const WEEKS = 7;
const DAYS_PER_WEEK = 7;
const CELL_SIZE = 20;
const CELL_GAP = 5;
const WEEKDAY_LABEL_WIDTH = 18;

type Props = {
  data: Record<string, { completed: number; total: number }>;
  tint: string;
};

export function Heatmap({ data, tint }: Props) {
  const { colors, scheme } = useTheme();
  const { t, language } = useTranslation();
  const emptyCellColor =
    scheme === 'dark' ? 'rgba(120,120,128,0.22)' : 'rgba(120,120,128,0.16)';

  const today = todayISO();
  const totalDays = WEEKS * DAYS_PER_WEEK;
  const start = addDays(today, -(totalDays - 1));

  const dates: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    dates.push(addDays(start, i));
  }

  const weeks: string[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(dates.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK));
  }

  const monthLocale = language === 'ar' ? 'ar' : undefined;
  const monthLabels = weeks.map((week) => {
    const firstOfMonth = week.find((d) => d.endsWith('-01'));
    if (!firstOfMonth) return '';
    const [, m] = firstOfMonth.split('-').map(Number);
    return new Date(2000, m - 1, 1).toLocaleString(monthLocale, { month: 'short' });
  });

  const weekdayLabels = (
    language === 'ar'
      ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
      : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  );
  const labelsToShow = new Set([1, 3, 5]);
  const rowWeekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(`${dates[i]}T00:00:00`).getDay()
  );

  let activeCount = 0;
  for (const d of dates) {
    const entry = data[d];
    if (entry && entry.completed > 0) activeCount++;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.activeCount, { color: colors.text }]}>
          {activeCount}
        </ThemedText>
        <ThemedText style={[styles.activeLabel, { color: colors.secondaryText }]}>
          {language === 'ar'
            ? `يوم نشط من ${totalDays}`
            : `active days of ${totalDays}`}
        </ThemedText>
      </View>

      <View style={styles.monthRow}>
        <View style={{ width: WEEKDAY_LABEL_WIDTH }} />
        {monthLabels.map((label, idx) => (
          <View key={idx} style={styles.monthCell}>
            <ThemedText
              style={[styles.monthText, { color: colors.secondaryText }]}
              numberOfLines={1}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        <View style={styles.weekdayColumn}>
          {rowWeekdays.map((wd, idx) => (
            <View key={idx} style={styles.weekdayCell}>
              {labelsToShow.has(idx) ? (
                <ThemedText
                  style={[styles.weekdayLabel, { color: colors.secondaryText }]}>
                  {weekdayLabels[wd]}
                </ThemedText>
              ) : null}
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.column}>
            {week.map((date) => {
              const entry = data[date];
              const ratio = entry && entry.total > 0 ? entry.completed / entry.total : 0;
              const isToday = date === today;
              return (
                <View
                  key={date}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: cellColor(tint, ratio, emptyCellColor),
                      borderWidth: isToday ? 1.5 : 0,
                      borderColor: tint,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <ThemedText style={[styles.legendText, { color: colors.secondaryText }]}>
          {t('heatmap.less')}
        </ThemedText>
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <View
            key={r}
            style={[
              styles.legendCell,
              { backgroundColor: cellColor(tint, r, emptyCellColor) },
            ]}
          />
        ))}
        <ThemedText style={[styles.legendText, { color: colors.secondaryText }]}>
          {t('heatmap.more')}
        </ThemedText>
      </View>
    </View>
  );
}

function cellColor(tint: string, ratio: number, emptyColor: string): string {
  if (ratio <= 0) return emptyColor;
  const alpha = 0.25 + ratio * 0.75;
  return tint + alphaHex(alpha);
}

function alphaHex(alpha: number): string {
  const v = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return v.toString(16).padStart(2, '0');
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingLeft: 2,
  },
  activeCount: {
    fontSize: 26,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  activeLabel: {
    fontSize: 13,
  },
  monthRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
    paddingHorizontal: 2,
  },
  monthCell: {
    width: CELL_SIZE,
    height: 14,
    overflow: 'visible',
  },
  monthText: {
    fontSize: 10,
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    top: 0,
    width: CELL_SIZE * 2,
  },
  grid: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  weekdayColumn: {
    width: WEEKDAY_LABEL_WIDTH,
    gap: CELL_GAP,
  },
  weekdayCell: {
    height: CELL_SIZE,
    justifyContent: 'center',
  },
  weekdayLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  column: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingLeft: WEEKDAY_LABEL_WIDTH + CELL_GAP,
  },
  legendText: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
