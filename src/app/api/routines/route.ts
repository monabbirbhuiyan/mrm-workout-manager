import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const createRoutineSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const routines = await db.routine.findMany();
  const days = await db.routineDay.findMany();
  const dayExercises = await db.routineDayExercise.findMany();
  const exercises = await db.exercise.findMany();

  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  const result = routines.map((routine) => ({
    ...routine,
    days: days
      .filter((d) => d.routineId === routine.id)
      .sort((a, b) => a.order - b.order)
      .map((day) => ({
        ...day,
        exerciseCount: dayExercises.filter((de) => de.routineDayId === day.id).length,
        exercises: dayExercises
          .filter((de) => de.routineDayId === day.id)
          .sort((a, b) => a.order - b.order)
          .map((de) => ({
            ...de,
            exercise: exerciseMap.get(de.exerciseId),
          })),
      })),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createRoutineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const routine = await db.routine.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      isActive: parsed.data.isActive ?? true,
    },
  });

  return NextResponse.json(routine, { status: 201 });
}
