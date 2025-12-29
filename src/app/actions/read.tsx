'use server'

import prisma from '../../../prisma/prisma'
import { formatDate } from '../helpers/strings'
import { Prisma } from '@prisma/client'

type LogWithExercise = Prisma.LogGetPayload<{ include: { exercise: true } }>
type ExerciseWithLogs = Prisma.ExerciseGetPayload<{ include: { logs: true } }>

export async function getLogs(userId: string, query: string = '') {
  const logsRaw: LogWithExercise[] = await prisma.log.findMany({
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
    title: log.exercise.name,
    id: log.id,
    created_at: formatDate(log.created_at),
    weight: Number(log.weight),
    reps: log.reps,
    sets: log.sets,
  }))

  return logs
}

export async function getExercises(userId: string, query: string = '') {
  const exercises = await prisma.exercise.findMany({
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
  })

  const exercisesMap = exercises.map((exercise) => ({
    id: exercise.id,
    title: exercise.name,
  }))

  return exercisesMap
}

export async function getAllExercises(userId: string) {
  const exercises = await prisma.exercise.findMany({
    where: {
      userId,
    },
  })

  return exercises
}

export async function getAllExercisesExcludingExisting(
  userId: string,
  workoutId: number
) {
  return prisma.exercise.findMany({
    where: {
      userId,
      workouts: {
        none: {
          id: workoutId,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
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

  return workouts.map((workout) => ({
    title: workout.name,
    id: workout.id,
    exerciseCount: workout._count.exercises,
  }))
}

export async function getExercise(id: string, userId: string) {
  const exerciseRaw: ExerciseWithLogs | null = await prisma.exercise.findUnique(
    {
      where: { id: Number(id) },
      include: {
        logs: {
          where: { userId },
          orderBy: { created_at: 'desc' },
        },
      },
    }
  )

  if (!exerciseRaw) return null

  const logs = exerciseRaw.logs.map((log) => ({
    title: exerciseRaw.name,
    created_at: formatDate(log.created_at),
    weight: Number(log.weight),
    reps: log.reps,
    sets: log.sets,
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

  const exercises = workoutRaw.exercises.map((exercise) => {
    const log = exercise.logs[0]

    return log
      ? {
          id: exercise.id,
          secondaryId: workoutRaw.id,
          title: exercise.name,
          created_at: formatDate(log.created_at),
          weight: Number(log.weight),
          reps: log.reps,
          sets: log.sets,
        }
      : {
          title: exercise.name,
          id: exercise.id,
          secondaryId: workoutRaw.id,
        }
  })

  return {
    ...workoutRaw,
    exercises,
  }
}

export async function getProgress(userId: string) {
  const raw = await prisma.log.findMany({
    where: {
      userId,
    },
    select: {
      created_at: true,
      sets: true,
      reps: true,
      weight: true,
    },
  })

  const dailyMap: Record<string, number> = {}

  raw.forEach((log) => {
    const date = log.created_at.toISOString().split('T')[0]
    const volume = (log.sets ?? 0) * (log.reps ?? 0) * (Number(log.weight) ?? 0)

    if (!dailyMap[date]) {
      dailyMap[date] = 0
    }
    dailyMap[date] += volume
  })

  const daily = Object.entries(dailyMap)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const baseline = daily.length > 0 ? daily[0].volume : 0

  return daily.map((d) => ({
    date: d.date,
    volume: d.volume,
    percentChange:
      baseline === 0 ? 0 : ((d.volume - baseline) / baseline) * 100,
  }))
}

export async function getProgressLastMonth(userId: string) {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const raw = await prisma.log.findMany({
    where: {
      userId,
      created_at: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      created_at: true,
      sets: true,
      reps: true,
      weight: true,
    },
  })

  const dailyMap: Record<string, number> = {}

  raw.forEach((log) => {
    const date = log.created_at.toISOString().split('T')[0]
    const volume = (log.sets ?? 0) * (log.reps ?? 0) * (Number(log.weight) ?? 0)

    if (!dailyMap[date]) {
      dailyMap[date] = 0
    }
    dailyMap[date] += volume
  })

  const daily = Object.entries(dailyMap)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const baseline = daily.length > 0 ? daily[0].volume : 0

  return daily.map((d) => ({
    date: d.date,
    volume: d.volume,
    percentChange:
      baseline === 0 ? 0 : ((d.volume - baseline) / baseline) * 100,
  }))
}
