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

export async function getExercise(id: string, userId: string) {
  const exerciseRaw = await prisma.exercise.findUnique({
    where: { id: Number(id) },
    include: {
      logs: {
        where: { userId },
        orderBy: { created_at: 'desc' },
      },
    },
  })

  if (!exerciseRaw) return null

  const logs = exerciseRaw.logs.map((log) => ({
    ...log,
    created_at: formatDate(log.created_at),
    weight: Number(log.weight),
  }))

  const maxLogRaw = await prisma.log.findFirst({
    where: {
      exerciseId: Number(id),
      userId,
    },
    orderBy: {
      weight: 'desc',
    },
  })

  const maxLog = maxLogRaw
    ? {
        ...maxLogRaw,
        created_at: formatDate(maxLogRaw.created_at),
        weight: Number(maxLogRaw.weight),
      }
    : null

  return {
    ...exerciseRaw,
    logs,
    maxLog,
  }
}

export async function getWorkout(id: string, userId: string) {
  const workoutRaw = await prisma.workout.findUnique({
    where: {
      userId,
      id: Number(id),
    },
    include: {
      exercises: {
        include: {
          logs: {
            where: { userId },
            orderBy: { weight: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  if (!workoutRaw) return null

  const exercises = workoutRaw.exercises.map((ex) => {
    const log = ex.logs[0]

    return {
      ...ex,
      personalBest: log
        ? {
            ...log,
            weight: Number(log.weight),
            created_at: formatDate(log.created_at),
          }
        : null,
    }
  })

  return {
    ...workoutRaw,
    exercises,
  }
}
