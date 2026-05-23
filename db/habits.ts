import type { SQLiteDatabase } from 'expo-sqlite';

import type { Habit, HabitWithProgress, SymbolName } from './types';
import { todayISO } from './dates';

export async function listHabits(db: SQLiteDatabase): Promise<Habit[]> {
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits ORDER BY created_at ASC'
  );
}

export async function listHabitsWithProgress(
  db: SQLiteDatabase,
  date: string = todayISO()
): Promise<HabitWithProgress[]> {
  const rows = await db.getAllAsync<Habit & { todayCount: number | null }>(
    `SELECT h.*, c.count AS todayCount
     FROM habits h
     LEFT JOIN completions c
       ON c.habit_id = h.id AND c.date = ?
     ORDER BY h.created_at ASC`,
    [date]
  );
  return rows.map((row) => {
    const todayCount = row.todayCount ?? 0;
    return {
      ...row,
      todayCount,
      isComplete: todayCount >= row.target_count,
    };
  });
}

export async function createHabit(
  db: SQLiteDatabase,
  input: { name: string; icon: SymbolName; color: string; target_count?: number }
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO habits (name, icon, color, target_count, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      input.name,
      input.icon as string,
      input.color,
      input.target_count ?? 1,
      new Date().toISOString(),
    ]
  );
  return result.lastInsertRowId;
}

export async function deleteHabit(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}
