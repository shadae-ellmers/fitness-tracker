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

type formDataProps = {
  weight: number | undefined
  sets: number | undefined
  reps: number | undefined
}

export async function updateLog(
  logId: number | undefined,
  formData: formDataProps | undefined
) {
  if (!logId || !formData) return

  await prisma.log.update({
    where: {
      id: logId,
    },
    data: {
      weight: Number(formData.weight),
      sets: formData.sets,
      reps: formData.reps,
    },
  })
}

export async function updateExerciseName(
  exerciseId: number,
  name: string,
  userId: string
) {
  await prisma.exercise.update({
    where: {
      id: exerciseId,
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
