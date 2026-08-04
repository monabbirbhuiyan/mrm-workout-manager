import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const rangeSchema = z.enum(["1W", "1M", "3M", "All"]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = rangeSchema.parse(searchParams.get("range") || "1W");

  const workouts = await db.workout.findMany({
    where: { completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
  });

  const now = Date.now();
  const rangeMs: Record<string, number> = {
    "1W": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
    "3M": 90 * 24 * 60 * 60 * 1000,
    All: 365 * 24 * 60 * 60 * 1000,
  };

  const cutoff = now - (rangeMs[range] || rangeMs["1W"]);
  const filtered = workouts.filter(
    (w) => new Date(w.startedAt).getTime() >= cutoff
  );

  const volumeData = (() => {
    if (range === "1W") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const result: { label: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now - i * 24 * 60 * 60 * 1000);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        const dayWorkouts = filtered.filter((w) => {
          const t = new Date(w.startedAt).getTime();
          return t >= dayStart.getTime() && t < dayEnd.getTime();
        });
        result.push({
          label: dayNames[dayStart.getDay()],
          value:
            dayWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0) /
            1000,
        });
      }
      return result;
    }

    if (range === "1M") {
      const result: { label: string; value: number }[] = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(
          now - (i + 1) * 7 * 24 * 60 * 60 * 1000
        );
        const weekEnd = new Date(now - i * 7 * 24 * 60 * 60 * 1000);
        const weekWorkouts = filtered.filter((w) => {
          const t = new Date(w.startedAt).getTime();
          return t >= weekStart.getTime() && t < weekEnd.getTime();
        });
        result.push({
          label: `Wk ${4 - i}`,
          value:
            weekWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0) /
            1000,
        });
      }
      return result;
    }

    if (range === "3M") {
      const result: { label: string; value: number }[] = [];
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now - i * 30 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const monthWorkouts = filtered.filter((w) => {
          const t = new Date(w.startedAt).getTime();
          return t >= monthStart.getTime() && t <= monthEnd.getTime();
        });
        result.push({
          label: monthNames[d.getMonth()],
          value:
            monthWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0) /
            1000,
        });
      }
      return result;
    }

    const yearMap = new Map<number, number>();
    for (const w of filtered) {
      const year = new Date(w.startedAt).getFullYear();
      yearMap.set(year, (yearMap.get(year) || 0) + (w.totalVolume || 0));
    }
    const years = Array.from(yearMap.keys()).sort();
    return years.map((y) => ({
      label: `'${String(y).slice(2)}`,
      value: yearMap.get(y)! / 1000,
    }));
  })();

  const allSets = await db.workoutSet.findMany({
    where: { completed: true },
  });
  const exerciseNames = [...new Set(allSets.map((s) => s.exerciseName))];

  const oneRepMaxByExercise: Record<string, number[]> = {};
  for (const exName of exerciseNames.slice(0, 4)) {
    const exSets = allSets.filter(
      (s) =>
        s.exerciseName === exName &&
        (s.weight ?? 0) > 0 &&
        (s.reps ?? 0) > 0
    );

    const byWorkout = new Map<
      string,
      { weight: number; reps: number; date: string }
    >();
    for (const s of exSets) {
      const workout = workouts.find((w) => w.id === s.workoutId);
      if (!workout) continue;
      const key = s.workoutId;
      const existing = byWorkout.get(key);
      const orm =
        (s.weight ?? 0) * (1 + (s.reps ?? 0) / 30);
      if (
        !existing ||
        orm >
          (existing.weight ?? 0) * (1 + (existing.reps ?? 0) / 30)
      ) {
        byWorkout.set(key, {
          weight: s.weight ?? 0,
          reps: s.reps ?? 0,
          date: workout.startedAt.toISOString(),
        });
      }
    }

    const sorted = Array.from(byWorkout.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    oneRepMaxByExercise[exName] = sorted
      .slice(-8)
      .map((s) =>
        Math.round((s.weight ?? 0) * (1 + (s.reps ?? 0) / 30))
      );
  }

  const exercises = await db.exercise.findMany();
  const exerciseMuscleMap = new Map(
    exercises.map((e) => [e.name, e.muscleGroup])
  );

  const muscleGroups: Record<string, number> = {};
  for (const s of allSets) {
    const mg = exerciseMuscleMap.get(s.exerciseName) || "Other";
    muscleGroups[mg] =
      (muscleGroups[mg] || 0) + (s.weight ?? 0) * (s.reps ?? 0);
  }

  const totalMuscle =
    Object.values(muscleGroups).reduce((a, b) => a + b, 0) || 1;
  const muscleBreakdown = Object.entries(muscleGroups)
    .map(([label, value]) => ({
      label,
      value: Math.round((value / totalMuscle) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const finalMuscleBreakdown =
    muscleBreakdown.length > 0
      ? muscleBreakdown
      : [
          { label: "Chest", value: 30 },
          { label: "Back", value: 25 },
          { label: "Legs", value: 25 },
          { label: "Arms / Shoulders", value: 20 },
        ];

  return NextResponse.json({
    volumeData,
    exerciseOptions: exerciseNames
      .slice(0, 4)
      .map((n) => `Est. 1RM: ${n}`),
    oneRepMaxByExercise: Object.fromEntries(
      Object.entries(oneRepMaxByExercise).map(([k, v]) => [
        `Est. 1RM: ${k}`,
        v,
      ])
    ),
    muscleBreakdown: finalMuscleBreakdown,
  });
}
