import { Habit as PrismaHabit, HabitStatus } from "@prisma/client";

interface TrackedDay {
  id: string;
  habitId: string;
  date: Date;
  completedCount: number;
  status: HabitStatus | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

export interface TrackedHabit extends PrismaHabit {
  trackedDays: TrackedDay[];
  trackedDaysTuple: (Date | HabitStatus | null)[][];
}

export interface TestListProps {
  activeHabits: PrismaHabit[];
  trackedHabits: TrackedHabit[];
}
