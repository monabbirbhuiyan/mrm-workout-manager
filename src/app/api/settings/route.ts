import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const updateSettingsSchema = z.record(z.string(), z.string());

export async function GET() {
  const settings = await db.userSetting.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );
  return NextResponse.json(settingsMap);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const parsed = updateSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    const existing = await db.userSetting.findUnique({ where: { key } });
    if (existing) {
      await db.userSetting.update({ where: { key }, data: { value } });
    } else {
      await db.userSetting.create({ data: { key, value } });
    }
  }

  const settings = await db.userSetting.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );
  return NextResponse.json(settingsMap);
}
