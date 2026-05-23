import type { SymbolViewProps } from 'expo-symbols';

export type SymbolName = SymbolViewProps['name'];

export type Habit = {
  id: number;
  name: string;
  icon: SymbolName;
  color: string;
  target_count: number;
  created_at: string;
};

export type Completion = {
  id: number;
  habit_id: number;
  date: string;
  count: number;
};

export type HabitWithProgress = Habit & {
  todayCount: number;
  isComplete: boolean;
};
