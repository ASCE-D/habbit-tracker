-- CreateEnum
CREATE TYPE "priority" AS ENUM ('p1', 'p2', 'p3');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "priority" "priority";
