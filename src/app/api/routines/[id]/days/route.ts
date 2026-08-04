import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { requireAuth, unauthorizedResponse } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const createDaySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  focus: z.string().min(1, "Focus is required").max(100),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const { id } = await params;

  const routine = await db.routine.findUnique({ where: { id } });
  if (!routine) {
    return NextResponse.json({ error: "Routine not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createDaySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const maxOrder = await db.routineDay.aggregate({
    where: { routineId: id },
    _max: { order: true },
  });

  const day = await db.routineDay.create({
    data: {
      routineId: id,
      title: parsed.data.title,
      focus: parsed.data.focus,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(day, { status: 201 });
}
