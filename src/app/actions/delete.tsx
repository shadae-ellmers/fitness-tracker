'use server'

import prisma from '../../../prisma/prisma'

export async function deleteWorkoutExercise(
  workoutId: number,
  exerciseId: number
) {
  return await prisma.workout.update({
    where: { id: workoutId },
    data: {
      exercises: {
        disconnect: { id: exerciseId },
      },
    },
  })
}

export async function deleteWorkout(workoutId: number) {
  return await prisma.workout.deleteMany({
    where: { id: workoutId },
  })
}

export async function deleteExercise(exerciseId: number) {
  return await prisma.exercise.deleteMany({
    where: { id: exerciseId },
  })
}

export async function deleteLog(logId: number) {
  return await prisma.log.deleteMany({
    where: { id: logId },
  })
}
