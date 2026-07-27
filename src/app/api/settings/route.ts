import { NextResponse } from 'next/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await db.userSetting.findMany()
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return NextResponse.json(settingsMap)
}

export async function PUT(request: Request) {
  const body = await request.json()

  for (const [key, value] of Object.entries(body) as [string, string][]) {
    const existing = await db.userSetting.findUnique({ where: { key } })
    if (existing) {
      await db.userSetting.update({ where: { key }, data: { value } })
    } else {
      await db.userSetting.create({ data: { key, value } })
    }
  }

  const settings = await db.userSetting.findMany()
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
  return NextResponse.json(settingsMap)
}
