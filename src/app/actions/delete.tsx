'use server'

import prisma from '../../../prisma/prisma'

export async function deleteWorkoutExercise(
  workoutId: number,
  exerciseId?: number
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
  await prisma.workout.delete({
    where: { id: workoutId },
  })
}
