// utils/habitUtils.ts
import {
  FrequencyType,
  Habit as PrismaHabit,
  GoalPeriodType,
  HabitTracker,
  HabitStatus,
} from "@prisma/client";

export type HabitWithTrackedDays = PrismaHabit & {
  trackedDays: HabitTracker[];
};

export function shouldDisplayHabit(
  habit: HabitWithTrackedDays,
  currentDate: Date = new Date(),
): boolean {
  console.log("--- shouldDisplayHabit called ---");
  console.log("Habit:", habit.title);
  console.log("Frequency:", habit.frequency);
  console.log("Start date:", habit.startDate);
  console.log("Current date:", currentDate);

  if (!habit.startDate) {
    console.log("Start date is null. displaying.");
    return true;
  }

  const startDate = new Date(habit.startDate);
  const startDateUTC = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    ),
  );
  const currentDateUTC = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ),
  );

  console.log("Start date UTC:", startDateUTC);
  console.log("Current date UTC:", currentDateUTC);
  console.log("Start date UTC day:", startDateUTC.getUTCDate());
  console.log("Current date UTC day:", currentDateUTC.getUTCDate());

  if (currentDateUTC < startDateUTC) {
    console.log("Current date is before start date. Not displaying.");
    return false;
  }

  switch (habit.frequency) {
    case "DAILY":
      // Check if tracked today
      if (
        habit.trackedDays.some((trackedDay) => {
          const trackedDate = new Date(trackedDay.date);
          return (
            trackedDate.getUTCFullYear() === currentDateUTC.getUTCFullYear() &&
            trackedDate.getUTCMonth() === currentDateUTC.getUTCMonth() &&
            trackedDate.getUTCDate() === currentDateUTC.getUTCDate()
          );
        })
      ) {
        console.log("Daily habit already tracked today. Not displaying.");
        return false;
      }
      console.log("Daily habit not tracked today. Displaying.");
      return true;

    case "WEEKLY":
      const dayOfWeek = startDateUTC.getUTCDay();
      if (currentDateUTC.getUTCDay() !== dayOfWeek) {
        console.log("Not the correct day of the week. Not displaying.");
        return false;
      }
      // Check if tracked this week
      const daysSinceStart = Math.floor(
        (currentDateUTC.getTime() - startDateUTC.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const currentWeekNumber = Math.floor(daysSinceStart / 7);
      if (
        habit.trackedDays.some((trackedDay) => {
          const trackedDate = new Date(trackedDay.date);
          const trackedDaysSinceStart = Math.floor(
            (trackedDate.getTime() - startDateUTC.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          const trackedWeekNumber = Math.floor(trackedDaysSinceStart / 7);
          return currentWeekNumber === trackedWeekNumber;
        })
      ) {
        console.log("Weekly habit already tracked this week. Not displaying.");
        return false;
      }
      console.log("Weekly habit not tracked this week. Displaying.");
      return true;

    case "MONTHLY":
      const dayOfMonth = startDateUTC.getUTCDate();
      if (currentDateUTC.getUTCDate() !== dayOfMonth) {
        console.log("Not the correct day of the month. Not displaying.");
        return false;
      }
      // Check if tracked this month
      if (
        habit.trackedDays.some((trackedDay) => {
          const trackedDate = new Date(trackedDay.date);
          return (
            trackedDate.getUTCFullYear() === currentDateUTC.getUTCFullYear() &&
            trackedDate.getUTCMonth() === currentDateUTC.getUTCMonth()
          );
        })
      ) {
        console.log(
          "Monthly habit already tracked this month. Not displaying.",
        );
        return false;
      }
      console.log("Monthly habit not tracked this month. Displaying.");
      return true;

    default:
      console.log("Unknown frequency.displaying.");
      return true;
  }
}

function getCompletedCountForPeriod(
  habit: HabitWithTrackedDays,
  currentDate: Date,
): number {
  let periodStart: Date;
  switch (habit.goalPeriod) {
    case GoalPeriodType.DAY:
      periodStart = new Date(currentDate);
      periodStart.setHours(0, 0, 0, 0);
      break;
    case GoalPeriodType.WEEK:
      periodStart = new Date(currentDate);
      periodStart.setDate(currentDate.getDate() - currentDate.getDay());
      periodStart.setHours(0, 0, 0, 0);
      break;
    case GoalPeriodType.MONTH:
      periodStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      break;
  }

  return habit.trackedDays
    .filter(
      (day) =>
        new Date(day.date) >= periodStart && new Date(day.date) <= currentDate,
    )
    .reduce((sum, day) => sum + day.completedCount, 0);
}

export function calculateLongestStreak(habit: HabitWithTrackedDays): number {
  if (habit.trackedDays.length === 0) return 0;

  // Sort tracked days by date
  const sortedDays = habit.trackedDays.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletedDate: Date | null = null;

  for (let i = 0; i < sortedDays.length; i++) {
    const currentDay = sortedDays[i];

    if (currentDay.status === HabitStatus.COMPLETED) {
      if (!lastCompletedDate) {
        currentStreak = 1;
      } else {
        const daysDifference = getDaysDifference(
          lastCompletedDate,
          currentDay.date,
        );

        switch (habit.frequency) {
          case "DAILY":
            if (daysDifference === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
            break;
          case "WEEKLY":
            if (daysDifference === 7) {
              currentStreak++;
            } else if (daysDifference > 7) {
              currentStreak = 1;
            }
            break;
          case "MONTHLY":
            if (isNextMonth(lastCompletedDate, currentDay.date)) {
              currentStreak++;
            } else if (daysDifference > 31) {
              // Rough check for more than a month
              currentStreak = 1;
            }
            break;
        }
      }

      lastCompletedDate = currentDay.date;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Reset streak for FAILED or SKIPPED
      currentStreak = 0;
      lastCompletedDate = null;
    }
  }

  return longestStreak;
}

function getDaysDifference(date1: Date, date2: Date): number {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffMs / oneDayMs);
}

function isNextMonth(date1: Date, date2: Date): boolean {
  if (date2.getFullYear() > date1.getFullYear()) {
    return date1.getMonth() === 11 && date2.getMonth() === 0;
  }
  return (
    date2.getMonth() - date1.getMonth() === 1 ||
    (date1.getMonth() === 11 && date2.getMonth() === 0)
  );
}
