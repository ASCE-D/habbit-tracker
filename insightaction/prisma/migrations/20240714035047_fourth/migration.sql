/*
  Warnings:

  - Added the required column `status` to the `HabitTracker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('CURRENT', 'COMPLETED', 'SKIPPED', 'FAILED');

-- AlterTable
ALTER TABLE "HabitTracker" ADD COLUMN     "status" "HabitStatus" NOT NULL;
