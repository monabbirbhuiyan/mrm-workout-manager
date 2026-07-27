import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; dayId: string }> }
) {
  const { dayId } = await params
  const body = await request.json()

  const maxOrder = await db.routineDayExercise.aggregate({
    where: { routineDayId: dayId },
    _max: { order: true },
  })

  const dayExercise = await db.routineDayExercise.create({
    data: {
      routineDayId: dayId,
      exerciseId: body.exerciseId,
      targetSets: body.targetSets ?? 3,
      targetReps: body.targetReps ?? 10,
      restSeconds: body.restSeconds ?? 90,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  })

  return NextResponse.json(dayExercise, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; dayId: string }> }
) {
  const { dayId } = await params
  const url = new URL(request.url)
  const exerciseId = url.searchParams.get('exerciseId')

  if (exerciseId) {
    await db.routineDayExercise.delete({ where: { id: exerciseId } })
    return NextResponse.json({ success: true })
  }

  await db.routineDayExercise.deleteMany({ where: { routineDayId: dayId } })
  await db.routineDay.delete({ where: { id: dayId } })
  return NextResponse.json({ success: true })
}
