'use server'

import prisma from '../../../prisma/prisma'
import { formatDate } from '../helpers/strings'

export async function getLogs(userId: string, query: string = '') {
  const logsRaw = await prisma.log.findMany({
    where: {
      userId,
      exercise: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    },
    include: {
      exercise: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const logs = logsRaw.map((log) => ({
    ...log,
    created_at: formatDate(log.created_at),
    weight: Number(log.weight),
  }))

  return logs
}

export async function getExercises(query: string = '') {
  const exercises = await prisma.exercise.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'desc',
    },
  })

  return exercises
}

export async function getMaxWeights(userId: string, query: string = '') {
  const exercisesWithMax = await prisma.exercise.findMany({
    where: {
      logs: {
        some: { userId },
      },
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      logs: {
        where: { userId },
        select: {
          weight: true,
          sets: true,
          reps: true,
          created_at: true,
        },
        orderBy: { weight: 'desc' },
        take: 1,
      },
    },
  })

  const data = exercisesWithMax.map((exercise) => {
    const log = exercise.logs[0]
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      maxWeight: log?.weight ? Number(log.weight) : null,
      sets: log?.sets ?? null,
      reps: log?.reps ?? null,
      date: log?.created_at ? formatDate(log.created_at) : null,
    }
  })

  return data
}

export async function getAllExercises() {
  const exercises = await prisma.exercise.findMany()

  return exercises
}

export async function getWorkouts(userId: string, query: string = '') {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'desc',
    },
    include: {
      _count: {
        select: { exercises: true },
      },
    },
  })

  return workouts.map((w) => ({
    ...w,
    exerciseCount: w._count.exercises,
  }))
}
