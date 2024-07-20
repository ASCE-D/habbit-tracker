"use server";

// import { calculateLongestStreak, shouldDisplayHabit } from "@/utils/habitUtils";
import { prisma } from "../../utils/prismaDB";
import {
  FrequencyType,
  Habit,
  HabitStatus,
  HabitTracker,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { TrackedHabit } from "@/types/habitListProps";
import { calculateLongestStreak } from "@/utils/habitUtils";

type HabitWithTrackedDays = Habit & {
  trackedDays: HabitTracker[];
};

interface HabitWithStats extends Habit {
  status: HabitStatus;
  completed: number;
  skipped: number;
  failed: number;
}

export const getHabitsForDay = async (
  date: Date,
): Promise<{ error: string } | { success: true; habits: HabitWithStats[] }> => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const currentDate = new Date(date);

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        isArchived: false,
        OR: [{ startDate: null }, { startDate: { lte: currentDate } }],
      },
      include: {
        trackedDays: true,
      },
    });

    const habitsWithStats: HabitWithStats[] = habits.map((habit) => {
      const { shouldDisplay, status } = shouldDisplayHabit(habit, currentDate);
      const trackedDay = habit.trackedDays.find(
        (day) =>
          day.date.getUTCFullYear() === currentDate.getUTCFullYear() &&
          day.date.getUTCMonth() === currentDate.getUTCMonth() &&
          day.date.getUTCDate() === currentDate.getUTCDate(),
      );

      const {skipped, failed, total, completed} = getCount(habit.trackedDays);
      return {
        ...habit,
        status: trackedDay?.status || status,
        completed: completed,
        skipped: skipped,
        failed: failed,
        streak: calculateLongestStreak(habit),
        total: total,
      };
    });

    return { success: true, habits: habitsWithStats };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch habits with stats." };
  }
};

function shouldDisplayHabit(
  habit: HabitWithTrackedDays,
  currentDate: Date,
): { shouldDisplay: boolean; status: "CURRENT" | "COMPLETED" } {
  if (!habit.startDate || !habit.frequency)
    return { shouldDisplay: true, status: "CURRENT" };

  const startDate = new Date(habit.startDate);
  const currentDateUTC = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ),
  );

  if (currentDateUTC < startDate) {
    return { shouldDisplay: false, status: "CURRENT" };
  }

  switch (habit.frequency) {
    case "DAILY":
      return {
        shouldDisplay: true,
        status: habit.trackedDays.some(
          (d) => d.date.getTime() === currentDateUTC.getTime(),
        )
          ? "COMPLETED"
          : "CURRENT",
      };

    case "WEEKLY":
      const startOfWeek = new Date(currentDateUTC);
      startOfWeek.setUTCDate(
        currentDateUTC.getUTCDate() - currentDateUTC.getUTCDay(),
      );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);

      return {
        shouldDisplay: true,
        status: habit.trackedDays.some(
          (d) => d.date >= startOfWeek && d.date <= endOfWeek,
        )
          ? "COMPLETED"
          : "CURRENT",
      };

    case "MONTHLY":
      const startOfMonth = new Date(
        Date.UTC(
          currentDateUTC.getUTCFullYear(),
          currentDateUTC.getUTCMonth(),
          1,
        ),
      );
      const endOfMonth = new Date(
        Date.UTC(
          currentDateUTC.getUTCFullYear(),
          currentDateUTC.getUTCMonth() + 1,
          0,
        ),
      );

      return {
        shouldDisplay: true,
        status: habit.trackedDays.some(
          (d) => d.date >= startOfMonth && d.date <= endOfMonth,
        )
          ? "COMPLETED"
          : "CURRENT",
      };

    case "INTERVAL":
      if (!habit.intervalDays) {
        return { shouldDisplay: false, status: "CURRENT" };
      }
      const daysSinceStart = Math.floor(
        (currentDateUTC.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return {
        shouldDisplay: daysSinceStart % habit.intervalDays === 0,
        status: habit.trackedDays.some(
          (d) => d.date.getTime() === currentDateUTC.getTime(),
        )
          ? "COMPLETED"
          : "CURRENT",
      };

    default:
      return { shouldDisplay: false, status: "CURRENT" };
  }
}

function getCount(trackedDays: HabitTracker[]) {
  let completed = 0;
  let skipped = 0;
  let failed = 0;

  trackedDays.some((d) => {
    if (d.status === HabitStatus.COMPLETED) completed++
    else if (d.status === HabitStatus.SKIPPED) skipped++
    else if (d.status === HabitStatus.FAILED) failed++
  });

  return {completed, skipped, failed, total: trackedDays.length}
}
