import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const routines = await db.routine.findMany()
  const days = await db.routineDay.findMany()
  const dayExercises = await db.routineDayExercise.findMany()
  const exercises = await db.exercise.findMany()

  const exerciseMap = new Map(exercises.map(e => [e.id, e]))

  const result = routines.map(routine => ({
    ...routine,
    days: days
      .filter(d => d.routineId === routine.id)
      .sort((a, b) => a.order - b.order)
      .map(day => ({
        ...day,
        exerciseCount: dayExercises.filter(de => de.routineDayId === day.id).length,
        exercises: dayExercises
          .filter(de => de.routineDayId === day.id)
          .sort((a, b) => a.order - b.order)
          .map(de => ({
            ...de,
            exercise: exerciseMap.get(de.exerciseId),
          })),
      })),
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const body = await request.json()

  const routine = await db.routine.create({
    data: {
      name: body.name,
      description: body.description,
      isActive: body.isActive ?? true,
    },
  })

  return NextResponse.json(routine, { status: 201 })
}
