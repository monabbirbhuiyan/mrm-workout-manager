import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const workout = await db.workout.findUnique({ where: { id } })
  if (!workout) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
  }

  if (body.sets && Array.isArray(body.sets)) {
    await db.workoutSet.createMany({
      data: body.sets.map((s: { exerciseName: string; setNumber: number; weight: number; reps: number; completed: boolean }) => ({
        workoutId: id,
        exerciseName: s.exerciseName,
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
        completed: s.completed,
      })),
    })
  }

  const totalVolume = body.totalVolume ?? workout.totalVolume
  const totalSets = body.totalSets ?? workout.totalSets
  const completedSets = body.completedSets ?? workout.completedSets
  const durationSeconds = body.durationSeconds ?? workout.durationSeconds

  const updated = await db.workout.update({
    where: { id },
    data: {
      completedAt: new Date(),
      durationSeconds,
      totalVolume,
      totalSets,
      completedSets,
      notes: body.notes,
    },
  })

  return NextResponse.json(updated)
}
