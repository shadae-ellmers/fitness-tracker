/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Workout" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_name_key" ON "public"."Workout"("name");
