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

  return exercises
}

export async function getAllExercises(userId: string) {
  const exercises = await prisma.exercise.findMany({
    where: {
      userId,
    },
  })

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

export async function getProgress(userId: string) {
  const raw = await prisma.log.groupBy({
    by: ['created_at'],
    where: {
      userId,
    },
    _sum: {
      sets: true,
      reps: true,
      weight: true,
    },
  })

  const daily = raw.map((d) => {
    const sets = d._sum.sets ?? 0
    const reps = d._sum.reps ?? 0
    const weight = Number(d._sum.weight ?? 0)

    return {
      date: d.created_at.toISOString().split('T')[0],
      volume: sets * reps * weight,
    }
  })

  daily.sort((a, b) => a.date.localeCompare(b.date))

  // ✅ baseline = first day
  const baseline = daily.length > 0 ? daily[0].volume : 0

  const percent = daily.map((d) => ({
    date: d.date,
    percent: baseline === 0 ? 0 : ((d.volume - baseline) / baseline) * 100,
  }))

  return percent
}

export async function getProgressLastMonth(userId: string) {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const raw = await prisma.log.groupBy({
    by: ['created_at'],
    where: {
      userId,
      created_at: {
        gte: thirtyDaysAgo,
      },
    },
    _sum: {
      sets: true,
      reps: true,
      weight: true,
    },
  })

  const daily = raw.map((d) => {
    const sets = d._sum.sets ?? 0
    const reps = d._sum.reps ?? 0
    const weight = Number(d._sum.weight ?? 0)

    return {
      date: d.created_at.toISOString().split('T')[0],
      volume: sets * reps * weight,
    }
  })

  daily.sort((a, b) => a.date.localeCompare(b.date))

  const baseline = daily.length > 0 ? daily[0].volume : 0

  return daily.map((d) => ({
    date: d.date,
    percent: baseline === 0 ? 0 : ((d.volume - baseline) / baseline) * 100,
  }))
}

export async function getHeatmapData(userId: string) {
  const today = new Date()
  const start = new Date()
  start.setDate(today.getDate() - 29).toLocaleString('en-NZ')

  // Fetch real log data
  const logs = await prisma.log.groupBy({
    by: ['created_at'],
    where: {
      userId,
      created_at: {
        gte: start,
      },
    },
    _count: { id: true },
  })

  // Convert DB results to map for fast lookup
  const logMap = new Map<string, number>()
  logs.forEach((l) => {
    const localKey = l.created_at.toLocaleDateString('en-NZ')
    logMap.set(localKey, l._count.id)
  })

  // Build exactly 30 days aligned Mon → Sun
  // Build 30 days of real data
  const realDays: { date: string | null; count: number | null }[] = []

  for (let i = 0; i < 30; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)

    const key = d.toLocaleDateString('en-NZ')

    if (d > today) {
      realDays.push({ date: null, count: null }) // future = grey
    } else {
      realDays.push({ date: key, count: logMap.get(key) ?? 0 })
    }
  }

  // Find weekday index of the first day (0 = Monday)
  const weekday = (start.getDay() + 6) % 7

  // Pad the beginning so the first column starts on Monday
  const paddedDays = [
    ...Array(weekday).fill({ date: null, count: null }),
    ...realDays,
  ]

  return paddedDays
}
