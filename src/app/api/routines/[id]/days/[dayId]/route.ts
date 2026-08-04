import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { requireAuth, unauthorizedResponse } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const addExerciseSchema = z.object({
  exerciseId: z.string().min(1, "Exercise ID is required"),
  targetSets: z.number().int().min(1).max(20).optional(),
  targetReps: z.number().int().min(1).max(100).optional(),
  restSeconds: z.number().int().min(0).max(600).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dayId: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const { dayId } = await params;

  const day = await db.routineDay.findUnique({ where: { id: dayId } });
  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = addExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const exercise = await db.exercise.findUnique({
    where: { id: parsed.data.exerciseId },
  });
  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  const maxOrder = await db.routineDayExercise.aggregate({
    where: { routineDayId: dayId },
    _max: { order: true },
  });

  const dayExercise = await db.routineDayExercise.create({
    data: {
      routineDayId: dayId,
      exerciseId: parsed.data.exerciseId,
      targetSets: parsed.data.targetSets ?? 3,
      targetReps: parsed.data.targetReps ?? 10,
      restSeconds: parsed.data.restSeconds ?? 90,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(dayExercise, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dayId: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const { dayId } = await params;
  const url = new URL(request.url);
  const exerciseId = url.searchParams.get("exerciseId");

  if (exerciseId) {
    const exists = await db.routineDayExercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exists) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }
    await db.routineDayExercise.delete({ where: { id: exerciseId } });
    return NextResponse.json({ success: true });
  }

  const day = await db.routineDay.findUnique({ where: { id: dayId } });
  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  await db.routineDayExercise.deleteMany({ where: { routineDayId: dayId } });
  await db.routineDay.delete({ where: { id: dayId } });
  return NextResponse.json({ success: true });
}
