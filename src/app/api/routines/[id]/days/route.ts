import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const maxOrder = await db.routineDay.aggregate({
    where: { routineId: id },
    _max: { order: true },
  })

  const day = await db.routineDay.create({
    data: {
      routineId: id,
      title: body.title,
      focus: body.focus,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  })

  return NextResponse.json(day, { status: 201 })
}
