import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const routine = await db.routine.findUnique({ where: { id } })

  if (!routine) {
    return NextResponse.json({ error: 'Routine not found' }, { status: 404 })
  }

  const days = await db.routineDay.findMany({
    where: { routineId: id },
    orderBy: { order: 'asc' },
  })

  const dayExercises = await db.routineDayExercise.findMany()
  const exercises = await db.exercise.findMany()
  const exerciseMap = new Map(exercises.map(e => [e.id, e]))

  const result = {
    ...routine,
    days: days.map(day => ({
      ...day,
      exercises: dayExercises
        .filter(de => de.routineDayId === day.id)
        .sort((a, b) => a.order - b.order)
        .map(de => ({
          ...de,
          exercise: exerciseMap.get(de.exerciseId),
        })),
    })),
  }

  return NextResponse.json(result)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.routine.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
