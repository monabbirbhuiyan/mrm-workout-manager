import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const exercises = await db.exercise.findMany()
  return NextResponse.json(exercises)
}

export async function POST(request: Request) {
  const body = await request.json()

  const exercise = await db.exercise.create({
    data: {
      name: body.name,
      muscleGroup: body.muscleGroup,
    },
  })

  return NextResponse.json(exercise, { status: 201 })
}
