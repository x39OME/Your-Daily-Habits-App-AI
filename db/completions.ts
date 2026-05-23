import type { SQLiteDatabase } from 'expo-sqlite';

import { addDays, todayISO } from './dates';

export async function toggleCompletion(
  db: SQLiteDatabase,
  habitId: number,
  date: string = todayISO()
): Promise<{ count: number }> {
  const habit = await db.getFirstAsync<{ target_count: number }>(
    'SELECT target_count FROM habits WHERE id = ?',
    [habitId]
  );
  if (!habit) return { count: 0 };

  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT count FROM completions WHERE habit_id = ? AND date = ?',
    [habitId, date]
  );

  const current = existing?.count ?? 0;
  const next = current >= habit.target_count ? 0 : habit.target_count;

  await db.runAsync(
    `INSERT INTO completions (habit_id, date, count)
     VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET count = excluded.count`,
    [habitId, date, next]
  );

  return { count: next };
}

export async function getCompletionsInRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<{ date: string; completed: number; total: number }[]> {
  return db.getAllAsync<{ date: string; completed: number; total: number }>(
    `SELECT c.date,
            SUM(CASE WHEN c.count >= h.target_count THEN 1 ELSE 0 END) AS completed,
            COUNT(*) AS total
     FROM completions c
     JOIN habits h ON h.id = c.habit_id
     WHERE c.date BETWEEN ? AND ?
     GROUP BY c.date`,
    [startDate, endDate]
  );
}

export async function getCompletionDatesForHabit(
  db: SQLiteDatabase,
  habitId: number
): Promise<string[]> {
  const rows = await db.getAllAsync<{ date: string }>(
    `SELECT c.date FROM completions c
     JOIN habits h ON h.id = c.habit_id
     WHERE c.habit_id = ? AND c.count >= h.target_count
     ORDER BY c.date DESC`,
    [habitId]
  );
  return rows.map((r) => r.date);
}

export async function computeStreak(
  db: SQLiteDatabase,
  habitId: number
): Promise<number> {
  const dates = await getCompletionDatesForHabit(db, habitId);
  if (dates.length === 0) return 0;

  const today = todayISO();
  const yesterday = addDays(today, -1);

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  let cursor = dates[0];
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === addDays(cursor, -1)) {
      streak += 1;
      cursor = dates[i];
    } else {
      break;
    }
  }
  return streak;
}

export async function computeOverallStreak(
  db: SQLiteDatabase
): Promise<number> {
  const rows = await db.getAllAsync<{ date: string }>(
    `SELECT c.date
     FROM completions c
     JOIN habits h ON h.id = c.habit_id
     WHERE c.count >= h.target_count
     GROUP BY c.date
     HAVING COUNT(DISTINCT c.habit_id) = (SELECT COUNT(*) FROM habits)
     ORDER BY c.date DESC`
  );
  if (rows.length === 0) return 0;

  const today = todayISO();
  const yesterday = addDays(today, -1);
  if (rows[0].date !== today && rows[0].date !== yesterday) return 0;

  let streak = 1;
  let cursor = rows[0].date;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].date === addDays(cursor, -1)) {
      streak += 1;
      cursor = rows[i].date;
    } else {
      break;
    }
  }
  return streak;
}
