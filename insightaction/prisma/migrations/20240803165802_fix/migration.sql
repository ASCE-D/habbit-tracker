/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date]` on the table `HabitTracker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HabitTracker_habitId_date_key" ON "HabitTracker"("habitId", "date");
