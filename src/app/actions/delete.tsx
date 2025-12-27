'use server'

import prisma from '../../../prisma/prisma'

export async function deleteWorkoutExercise(
  workoutId: number,
  exerciseId: number
) {
  await prisma.workout.update({
    where: { id: workoutId },
    data: {
      exercises: {
        disconnect: { id: exerciseId },
      },
    },
  })
}

export async function deleteWorkout(workoutId: number) {
  await prisma.workout.deleteMany({
    where: { id: workoutId },
  })
}

export async function deleteExercise(exerciseId: number) {
  await prisma.exercise.deleteMany({
    where: { id: exerciseId },
  })
}

export async function deleteLog(logId: number) {
  await prisma.log.deleteMany({
    where: { id: logId },
  })
}
