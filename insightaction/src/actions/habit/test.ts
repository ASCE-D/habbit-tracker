"use server";

// import { calculateLongestStreak, shouldDisplayHabit } from "@/utils/habitUtils";
import { prisma } from "../../utils/prismaDB";
import {
  FrequencyType,
  Habit,
  HabitStatus,
  HabitTracker,
  Prisma,
  Todo,
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
  date: string,
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
    console.log(currentDate, "faf", date);
    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        isArchived: false,
        OR: [{ startDate: null }, { startDate: { lte: currentDate } }],
      },
      include: {
        trackedDays: true,
        obstacles: true,
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

      const { skipped, failed, total, completed } = getCount(habit.trackedDays);
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

export const getHabitById = async (id: string) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
        isArchived: false,
      },
      include: {
        trackedDays: true,
      },
    });

    if (!habit) {
      return { error: "Habit not found" };
    }

    const { skipped, failed, total, completed } = getCount(habit.trackedDays);

    const habitWithStats = {
      ...habit,
      completed: completed,
      skipped: skipped,
      failed: failed,
      streak: calculateLongestStreak(habit),
      total: total,
    };

    return habitWithStats;
  } catch (error: any) {
    return { error: error.message || "Failed to fetch habit with stats." };
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
    if (d.status === HabitStatus.COMPLETED) completed++;
    else if (d.status === HabitStatus.SKIPPED) skipped++;
    else if (d.status === HabitStatus.FAILED) failed++;
  });

  return { completed, skipped, failed, total: trackedDays.length };
}

export const addTodo = async (data: Partial<Todo>) => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.id) {
    return { error: "User not found" };
  }
  const dataToAdd: Prisma.TodoCreateInput = {
    ...data,
    title: data.title || "",
    user: {
      connect: {
        id: user.id as string,
      },
    },
    isCompleted: false,
  };

  try {
    const todo = await prisma.todo.create({ data: dataToAdd });
    return { success: true, todo };
  } catch (error: any) {
    return { error: error.message || "Failed to create " };
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const todo = await prisma.todo.delete({ where: { id } });
    return { success: true, todo };
  } catch (error: any) {
    return { error: error.message || "Failed to delete todo" };
  }
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }
  try {
    const todo = await prisma.todo.update({ where: { id }, data });
    return { success: true, todo };
  } catch (error: any) {
    return { error: error.message || "Failed to update todo" };
  }
};

export const getTodos = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const todos = await prisma.todo.findMany({
      where: { userId: user?.id },
      orderBy: { priority: "asc" },
    });

    return { success: true, todos };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch todos" };
  }
};

export const getTodoById = async (id: string) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }
  try {
    const todo = await prisma.todo.findFirst({ where: { id } });
    return { success: true, todo };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch todo" };
  }
};

export const markTodo = async (id: string) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { isCompleted: true },
    });
    return { success: true, todo };
  } catch (error: any) {
    return { error: error.message || "Failed to mark todo" };
  }
};

export const updateHabitObstacle = async (
  habitId: string,
  obstacle: { description: string; solution: string },
) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return { error: "Habit not found" };
    }

    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        obstacles: {
          create: {
            ...obstacle,
          },
        },
      },
      include: {
        obstacles: true,
      },
    });

    return { success: true, updatedHabit };
  } catch (error) {}
};

export const deleteHabitObstacle = async (id: string) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const obstacle = await prisma.obstacle.delete({ where: { id } });
    return { success: true, obstacle };
  } catch (error: any) {
    return { error: error.message || "Failed to delete obstacle" };
  }
};

export const updateHabitObstacleById = async (
  id: string,
  description?: string | null,
  solution?: string | null,
) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const obstacle = await prisma.obstacle.update({
      where: { id },
      data: {
        ...(description !== null ? { description } : {}),
        ...(solution !== null ? { solution } : {}),
      },
    });
    return { success: true, obstacle };
  } catch (error: any) {
    return { error: error.message || "Failed to update obstacle" };
  }
};
