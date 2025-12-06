/*
  Warnings:

  - You are about to drop the `_ExerciseToWorkout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ExerciseToWorkout" DROP CONSTRAINT "_ExerciseToWorkout_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExerciseToWorkout" DROP CONSTRAINT "_ExerciseToWorkout_B_fkey";

-- DropIndex
DROP INDEX "public"."Workout_name_key";

-- DropTable
DROP TABLE "public"."_ExerciseToWorkout";

-- CreateTable
CREATE TABLE "public"."_WorkoutExercises" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WorkoutExercises_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WorkoutExercises_B_index" ON "public"."_WorkoutExercises"("B");

-- AddForeignKey
ALTER TABLE "public"."_WorkoutExercises" ADD CONSTRAINT "_WorkoutExercises_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_WorkoutExercises" ADD CONSTRAINT "_WorkoutExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
