'use server'

import prisma from '../../../prisma/prisma'

export async function updateWorkoutName(
  workoutId: number,
  name: string,
  userId: string
) {
  await prisma.workout.update({
    where: {
      id: workoutId,
      userId,
    },
    data: {
      name,
    },
  })
}

export async function updateWorkoutExercises(
  workoutId: number,
  exerciseIds: number[],
  userId: string
) {
  await prisma.workout.update({
    where: {
      id: workoutId,
      userId,
    },
    data: {
      exercises: {
        connect: exerciseIds.map((id) => ({ id })),
      },
    },
  })
}
