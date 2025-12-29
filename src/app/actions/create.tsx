'use server'

import prisma from '../../../prisma/prisma'
import { Prisma } from '../../generated/prisma'

interface AddLogInput {
  userId: string
  exerciseId: number
  weight: number
  reps: number
  sets: number
}

interface AddExerciseInput {
  userId: string
  name: string
}

interface AddWorkoutInput {
  userId: string
  name: string
  exerciseIds: number[]
}

export async function addLog(input: AddLogInput) {
  const log = await prisma.log.create({
    data: {
      userId: input.userId,
      exerciseId: input.exerciseId,
      /* eslint-disable  @typescript-eslint/no-unnecessary-type-conversion */
      weight: Number(input.weight),
      reps: input.reps,
      sets: input.sets,
    },
    include: {
      exercise: true,
    },
  })

  return {
    ...log,
    weight: Number(log.weight),
  }
}

export async function addExercise(input: AddExerciseInput) {
  try {
    return await prisma.exercise.create({
      data: {
        userId: input.userId,
        name: input.name,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error('This exercise already exists.')
      }
    }

    throw err
  }
}

export async function addWorkout(input: AddWorkoutInput) {
  try {
    return await prisma.workout.create({
      data: {
        userId: input.userId,
        name: input.name,
        exercises: {
          connect: input.exerciseIds.map((id) => ({ id })),
        },
      },
    })
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error('This workout already exists.')
      }
    }

    throw err
  }
}
