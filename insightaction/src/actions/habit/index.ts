"use server";

import { getServerSession } from "next-auth";
import { prisma } from "../../utils/prismaDB";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { HabitStatus, Habit, FrequencyType } from "@prisma/client";
// import { sendNotification } from '../../lib/firebase-amin';

export const createGoal = async (data: {
  title: string;
  description?: string;
  currentPath?: string;
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const { title, description, currentPath } = data;
  const userEmail = session.user.email;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Create the goal
    const newGoal = await prisma.goal.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    });

    // Revalidate the path if provided, otherwise revalidate the home page
    if (currentPath) {
      revalidatePath(currentPath);
    } else {
      revalidatePath("/");
    }

    return { success: true, goal: newGoal };
  } catch (error: any) {
    return { error: error.message || "Failed to create goal." };
  }
};

interface CreateHabitData {
  title: string;
  description?: string;
  goalId?: string;
  cue?: string;
  craving?: string;
  response?: string;
  reward?: string;
  implementationIntention?: string;
  environment: string;
  time: Date;
  stackedHabitId?: string;
  obstacles?: { description: string; solution: string }[];
  currentPath?: string;
  goalCount?: number;
  frequency?: FrequencyType;
}
const MAX_HABITS = 5;

export const createHabit = async (data: CreateHabitData) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;
  

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }
    const habitCount = await prisma.habit.count({
      where: { userId:  user.id, isArchived: false },
    });
  
    if (habitCount >= MAX_HABITS) {
      return { error: "You have reached the maximum number of habits allowed (5)" };
    }

    // Check if the goal exists and belongs to the user
    const goal = await prisma.goal.findFirst({
      where: {
        id: data.goalId,
        userId: user.id,
      },
    });

    // if (!goal) {
    //   return { error: "Goal not found or doesn't belong to the user" };
    // }

    // Create the habit
    const newHabit = await prisma.habit.create({
      data: {
        title: data.title,
        description: data.description,
        userId: user.id,
        goalId: data.goalId,
        cue: data.cue,
        craving: data.craving,
        response: data.response,
        reward: data.reward,
        implementationIntention: data.implementationIntention,
        environment: data.environment,
        time: data.time,
        stackedHabitId: data.stackedHabitId,
        obstacles: {
          create: data.obstacles?.map((obstacle) => ({
            description: obstacle.description,
            solution: obstacle.solution,
          })),
        },
        goalCount: data.goalCount,
        frequency: data.frequency,
      },
      include: {
        obstacles: true,
      },
    });

    // Revalidate the path if provided, otherwise revalidate the home page
    if (data.currentPath) {
      revalidatePath(data.currentPath);
    } else {
      console.log("Revalidating ");
      revalidatePath("/journal/habits");
    }

    return { success: true, habit: newHabit };
  } catch (error: any) {
    return { error: error.message || "Failed to create habit." };
  }
};

export const getHabits = async (goalId?: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        ...(goalId && { goalId }),
      },
      include: { obstacles: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, habits };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch habits." };
  }
};

export async function fetchHabits() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
    });
    return habits;
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw new Error("Failed to fetch habits");
  }
}

export const getGoals = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      include: { habits: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, goals };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch goals." };
  }
};

interface TrackHabitData {
  habitId: string;
  localDateString: string;
  completed: boolean;
  status: HabitStatus; // Use the HabitStatus enum
  notes?: string;
}

export const trackHabit = async (data: TrackHabitData) => {
  const session = await getServerSession(authOptions);
  console.log("Tracking habit with data:", JSON.stringify(data, null, 2));
  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;
  const currentDate = new Date(data.localDateString);

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check if the habit belongs to the user
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId: user.id,
      },
    });

    if (!habit) {
      return { error: "Habit not found or doesn't belong to the user" };
    }

    // Create or update the habit tracker entry
    const trackedHabit = await prisma.habitTracker.upsert({
      where: {
        habitId_date: {
          habitId: data.habitId,
          date: currentDate,
        },
      },
      update: {
        completed: data.completed,
        status: data.status,
        notes: data.notes,
      },
      create: {
        habitId: data.habitId,
        date: currentDate,
        completed: data.completed,
        status: data.status,
        notes: data.notes,
      },
    });

    revalidatePath("/habit-tracker");

    return { success: true, trackedHabit };
  } catch (error: any) {
    return { error: error.message || "Failed to track habit." };
  }
};

export async function getHabit(habitId: any) {
  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        obstacles: true,
        goal: true,
        stackedHabit: true,
        stackedOnto: true,
      },
    });

    if (!habit) {
      throw new Error("Habit not found");
    }

    return habit;
  } catch (error) {
    console.error("Error fetching habit:", error);
    throw error;
  }
}

export async function getHabitStreak(habitId: any) {
  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new Error("Habit not found");
    }

    const trackedDays = await prisma.habitTracker.findMany({
      where: {
        habitId: habitId,
        completed: true,
      },
      orderBy: { date: "desc" },
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let trackedDay of trackedDays) {
      const completionDate = new Date(trackedDay.date);
      completionDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() - completionDate.getTime() > 86400000) {
        // More than one day difference, streak is broken
        break;
      }

      if (currentDate.getTime() === completionDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating habit streak:", error);
    throw error;
  }
}

export async function stackHabit(
  habitId: any,
  stackedHabitId: any,
  implementationIntention: any,
) {
  try {
    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        stackedHabitId,
        implementationIntention,
      },
    });
    return updatedHabit;
  } catch (error) {
    console.error("Error stacking habit:", error);
    throw new Error("Failed to stack habit");
  }
}

// export const getCompletedHabits = async (date: Date) => {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     return { error: "Unauthorized or insufficient permissions" };
//   }

//   const userEmail = session.user.email;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { email: userEmail as string },
//     });

//     if (!user) {
//       return { error: "User not found" };
//     }

//     const completedHabits = await prisma.habitTracker.findMany({
//       where: {
//         habit: { userId: user.id },
//         date: {
//           gte: new Date(date.setHours(0, 0, 0, 0)),
//           lt: new Date(date.setHours(23, 59, 59, 999)),
//         },
//         completed: true,
//       },
//       include: {
//         habit: true,
//       },
//     });

//     return { success: true, completedHabits };
//   } catch (error: any) {
//     return { error: error.message || "Failed to fetch completed habits." };
//   }
// };
type HabitWithStats = Habit & {
  status: string;

  completed: number;
  skipped: number;
  failed: number;
};
interface HabitListProps {
  gethabit: HabitWithStats[];
}

export const getHabitsForDay = async (date: Date) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        trackedDays: {
          where: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        },
      },
    });

    const habitsWithStats: HabitWithStats[] = habits.map((habit) => {
      const trackedDay = habit.trackedDays[0];
      return {
        ...habit,
        status: trackedDay?.status || "NOT_STARTED",
        completed: trackedDay?.completed ? 1 : 0,
        skipped: trackedDay?.status === "SKIPPED" ? 1 : 0,
        failed: trackedDay?.status === "FAILED" ? 1 : 0,
      };
    });

    return { success: true, gethabit: habitsWithStats };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch habits with stats." };
  }
};

export const editHabit = async (data: any) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const userEmail = session.user.email;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check if the habit exists and belongs to the user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
      include: { obstacles: true },
    });

    if (!existingHabit) {
      return { error: "Habit not found or doesn't belong to the user" };
    }

    // Update the habit
    const updatedHabit = await prisma.habit.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,

        environment: data.environment,
        time: data.time,
      },
    });

    // Revalidate the path if provided, otherwise revalidate the home page
    if (data.currentPath) {
      revalidatePath(data.currentPath);
    } else {
      revalidatePath("/");
    }

    return { success: true, habit: updatedHabit };
  } catch (error: any) {
    return { error: error.message || "Failed to update habit." };
  }
};

export async function getHabitPerformedDates(habitId: string) {
  try {
    const habitTrackers = await prisma.habitTracker.findMany({
      where: {
        habitId: habitId,
        completed: true,
      },
      select: {
        date: true,
      },
    });

    return habitTrackers.map((tracker) => tracker.date);
  } catch (error) {
    console.error("Error fetching habit performed dates:", error);
    throw new Error("Failed to fetch habit performed dates");
  }
}

export const userDetails = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Unauthorized or insufficient permissions");
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email: userEmail as string },
    });

    return {
      success: true,
      user: { name: user?.name, email: user?.email, image: user?.image },
    };
  } catch (error: any) {
    return { error: error.message || "Failed to update habit." };
  }
};

export const updateProfile = async (data: any) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Unauthorized or insufficient permissions");
    }

    const userEmail = session.user.email;
    console.log(data);

    const updatedUser = await prisma.user.update({
      where: { email: userEmail as string },
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
      },
    });

    return { success: true, updatedUser };
  } catch (error: any) {
    return { error: error.message || "Failed to update user profile." };
  }
};

export const addInterested = async (data: any) => {
  try {
    console.log(data);

    const result = await prisma.interested.create({
      data: {
        feature: data.features,
        email: data.email,
      },
    });
    console.log("result", result);
    return { success: true, data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to update user profile." };
  }
};


export async function deleteHabit(habitId: string) {
  try {
    await prisma.habit.delete({
      where: { id: habitId },
    });

    revalidatePath("/journal/habits");
    return { success: true, message: "Habit deleted successfully" };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return { success: false, message: "Failed to delete habit" };
  }
}
