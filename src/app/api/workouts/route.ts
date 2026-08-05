import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const createWorkoutSchema = z.object({
  routineDayId: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100),
});

export async function GET() {
  const workouts = await db.workout.findMany({
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createWorkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (parsed.data.routineDayId) {
    const day = await db.routineDay.findUnique({
      where: { id: parsed.data.routineDayId },
    });
    if (!day) {
      return NextResponse.json({ error: "Routine day not found" }, { status: 404 });
    }
  }

  const workout = await db.workout.create({
    data: {
      routineDayId: parsed.data.routineDayId || null,
      name: parsed.data.name,
      startedAt: new Date(),
    },
  });

  return NextResponse.json(workout, { status: 201 });
}
