"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  X,
  Search,
  Check,
} from "lucide-react";
import { ExerciseIllustration } from "./exercise-illustrations";
import {
  EXERCISE_LIBRARY,
  MUSCLE_GROUP_LABELS,
  type ExerciseDefinition,
  type MuscleGroup,
} from "./exercise-library";

interface SelectedExercise {
  lib: ExerciseDefinition;
  sets: number;
  reps: number;
  restSeconds: number;
}

interface WorkoutBuilderProps {
  routineId: string;
  onBack: () => void;
  onDayCreated: (dayId: string) => void;
}

export default function WorkoutBuilder({
  routineId,
  onBack,
  onDayCreated,
}: WorkoutBuilderProps) {
  const [step, setStep] = useState<"browse" | "review">("browse");
  const [dayName, setDayName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [dbExerciseMap, setDbExerciseMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/exercises")
      .then((r) => r.json())
      .then((exercises: { id: string; name: string }[]) => {
        const map: Record<string, string> = {};
        for (const e of exercises) {
          map[e.name] = e.id;
        }
        setDbExerciseMap(map);
      })
      .catch(console.error);
  }, []);

  const filteredLibrary = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      !searchQuery ||
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscles.some((m) =>
        MUSCLE_GROUP_LABELS[m].toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesMuscle = !selectedMuscle || ex.muscles.includes(selectedMuscle);
    return matchesSearch && matchesMuscle;
  });

  const toggleExercise = (lib: ExerciseDefinition) => {
    const exists = selected.find((s) => s.lib.id === lib.id);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.lib.id !== lib.id));
    } else {
      setSelected((prev) => [
        ...prev,
        { lib, sets: 3, reps: 10, restSeconds: 90 },
      ]);
    }
  };

  const updateExercise = (
    id: string,
    field: "sets" | "reps" | "restSeconds",
    value: number
  ) => {
    setSelected((prev) =>
      prev.map((s) =>
        s.lib.id === id ? { ...s, [field]: Math.max(1, value) } : s
      )
    );
  };

  const generateDayName = () => {
    if (selected.length === 0) return "";
    const muscles = new Set<MuscleGroup>();
    selected.forEach((s) => s.lib.muscles.forEach((m) => muscles.add(m)));
    if (muscles.size === 1) {
      return MUSCLE_GROUP_LABELS[[...muscles][0]] + " Day";
    }
    if (muscles.has("chest") && muscles.has("triceps"))
      return "Push Day";
    if (muscles.has("back") && muscles.has("biceps"))
      return "Pull Day";
    if (muscles.has("legs") || muscles.has("glutes"))
      return "Leg Day";
    return "Custom Day";
  };

  const handleSave = async () => {
    if (!dayName.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      const dayRes = await fetch(`/api/routines/${routineId}/days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: dayName.trim(),
          focus: selected
            .flatMap((s) => s.lib.muscles.map((m) => MUSCLE_GROUP_LABELS[m]))
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(", "),
        }),
      });
      if (!dayRes.ok) throw new Error("Failed to create day");
      const newDay = await dayRes.json();

      for (const ex of selected) {
        const dbId = dbExerciseMap[ex.lib.name];
        if (!dbId) {
          console.error(`Exercise "${ex.lib.name}" not found in database`);
          continue;
        }
        await fetch(`/api/routines/${routineId}/days/${newDay.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exerciseId: dbId,
            targetSets: ex.sets,
            targetReps: ex.reps,
            restSeconds: ex.restSeconds,
          }),
        });
      }

      onDayCreated(newDay.id);
    } catch (err) {
      console.error("Failed to create day:", err);
    } finally {
      setSaving(false);
    }
  };

  const totalSets = selected.reduce((sum, s) => sum + s.sets, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-border safe-area-top">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={step === "review" ? () => setStep("browse") : onBack}
            className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {step === "browse" ? "Build Workout Day" : "Review Day"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {step === "browse"
                ? `${selected.length} selected · ${totalSets} total sets`
                : `${selected.length} exercises · ${totalSets} sets`}
            </p>
          </div>
        </div>

        {step === "browse" && (
          <>
            <input
              type="text"
              placeholder="Day name (e.g. Push Day, Leg Day)"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-3"
            />
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {(
                [
                  "chest",
                  "back",
                  "shoulders",
                  "biceps",
                  "triceps",
                  "legs",
                  "glutes",
                  "core",
                ] as const
              ).map((m) => (
                <button
                  key={m}
                  onClick={() =>
                    setSelectedMuscle(selectedMuscle === m ? null : m)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedMuscle === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {MUSCLE_GROUP_LABELS[m]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      {step === "browse" ? (
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {filteredLibrary.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No exercises found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLibrary.map((lib) => {
                const isSelected = selected.some((s) => s.lib.id === lib.id);
                return (
                  <button
                    key={lib.id}
                    onClick={() => toggleExercise(lib)}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all border ${
                      isSelected
                        ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                        : "bg-card border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <ExerciseIllustration imageKey={lib.imageKey} size={48} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {lib.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lib.muscles
                          .map((m) => MUSCLE_GROUP_LABELS[m])
                          .join(", ")}{" "}
                        · {lib.equipment}
                      </p>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground/50"
                      }`}
                    >
                      {isSelected ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <Plus size={14} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Review step */
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <input
            type="text"
            placeholder="Day name"
            value={dayName}
            onChange={(e) => setDayName(e.target.value)}
            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors mb-4"
          />
          <div className="space-y-3">
            {selected.map((s) => (
              <div
                key={s.lib.id}
                className="bg-card rounded-xl p-3 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                    <ExerciseIllustration imageKey={s.lib.imageKey} size={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {s.lib.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.lib.muscles
                        .map((m) => MUSCLE_GROUP_LABELS[m])
                        .join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleExercise(s.lib)}
                    className="p-1.5 hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Sets
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          updateExercise(s.lib.id, "sets", s.sets - 1)
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-foreground w-6 text-center">
                        {s.sets}
                      </span>
                      <button
                        onClick={() =>
                          updateExercise(s.lib.id, "sets", s.sets + 1)
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Reps
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          updateExercise(s.lib.id, "reps", s.reps - 1)
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-foreground w-6 text-center">
                        {s.reps}
                      </span>
                      <button
                        onClick={() =>
                          updateExercise(s.lib.id, "reps", s.reps + 1)
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Rest
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          updateExercise(
                            s.lib.id,
                            "restSeconds",
                            s.restSeconds - 15
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-foreground w-6 text-center">
                        {s.restSeconds}s
                      </span>
                      <button
                        onClick={() =>
                          updateExercise(
                            s.lib.id,
                            "restSeconds",
                            s.restSeconds + 15
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="shrink-0 px-5 py-4 border-t border-border bg-background safe-area-bottom">
        {step === "browse" ? (
          <button
            onClick={() => {
              if (!dayName.trim()) setDayName(generateDayName());
              setStep("review");
            }}
            disabled={selected.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-30"
          >
            <Check size={20} />
            Review Day ({selected.length} exercises)
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setStep("browse")}
              className="flex-1 py-4 bg-secondary text-foreground rounded-2xl font-bold text-sm border border-border active:scale-[0.98] transition-transform"
            >
              Add More
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dayName.trim()}
              className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform disabled:opacity-30"
            >
              {saving ? "Saving..." : "Save Day"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
