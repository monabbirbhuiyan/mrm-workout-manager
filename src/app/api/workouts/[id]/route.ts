import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workout = await db.workout.findUnique({ where: { id } });

  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  const sets = await db.workoutSet.findMany({
    where: { workoutId: id },
  });

  return NextResponse.json({ ...workout, sets });
}
