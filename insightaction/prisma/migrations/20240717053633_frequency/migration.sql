-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'INTERVAL');

-- CreateEnum
CREATE TYPE "GoalPeriodType" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "frequency" "FrequencyType",
ADD COLUMN     "goalCount" INTEGER,
ADD COLUMN     "goalPeriod" "GoalPeriodType",
ADD COLUMN     "intervalDays" INTEGER,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "timeOfDay" TEXT;

-- AlterTable
ALTER TABLE "HabitTracker" ADD COLUMN     "completedCount" INTEGER NOT NULL DEFAULT 0;
