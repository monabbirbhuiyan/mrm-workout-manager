import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { requireAuth, unauthorizedResponse } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const workoutSetSchema = z.object({
  exerciseName: z.string().min(1),
  setNumber: z.number().int().min(1),
  weight: z.number().min(0),
  reps: z.number().int().min(0),
  completed: z.boolean(),
});

const completeWorkoutSchema = z.object({
  sets: z.array(workoutSetSchema).optional(),
  totalVolume: z.number().min(0).optional(),
  totalSets: z.number().int().min(0).optional(),
  completedSets: z.number().int().min(0).optional(),
  durationSeconds: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  const workout = await db.workout.findUnique({ where: { id } });
  if (!workout) {
    return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = completeWorkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.sets && data.sets.length > 0) {
    await db.workoutSet.createMany({
      data: data.sets.map((s) => ({
        workoutId: id,
        exerciseName: s.exerciseName,
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
        completed: s.completed,
      })),
    });
  }

  const updated = await db.workout.update({
    where: { id },
    data: {
      completedAt: new Date(),
      durationSeconds: data.durationSeconds ?? workout.durationSeconds,
      totalVolume: data.totalVolume ?? workout.totalVolume,
      totalSets: data.totalSets ?? workout.totalSets,
      completedSets: data.completedSets ?? workout.completedSets,
      notes: data.notes,
    },
  });

  return NextResponse.json(updated);
}
