import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { requireAuth, unauthorizedResponse } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  muscleGroup: z.string().min(1, "Muscle group is required").max(50),
});

export async function GET() {
  const exercises = await db.exercise.findMany();
  return NextResponse.json(exercises);
}

export async function POST(request: NextRequest) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  const parsed = createExerciseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const exercise = await db.exercise.create({
    data: {
      name: parsed.data.name,
      muscleGroup: parsed.data.muscleGroup,
    },
  });

  return NextResponse.json(exercise, { status: 201 });
}
