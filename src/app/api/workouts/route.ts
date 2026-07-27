import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const workouts = await db.workout.findMany({
    orderBy: { startedAt: 'desc' },
  })

  return NextResponse.json(workouts)
}

export async function POST(request: Request) {
  const body = await request.json()

  const workout = await db.workout.create({
    data: {
      routineDayId: body.routineDayId,
      name: body.name,
      startedAt: new Date(),
    },
  })

  return NextResponse.json(workout, { status: 201 })
}
