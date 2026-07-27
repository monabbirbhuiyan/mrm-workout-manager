"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Plus,
  Trash2,
  GripVertical,
  Target,
  Check,
  X,
} from "lucide-react";
import { ExerciseIllustration } from "./exercise-illustrations";
import {
  EXERCISE_LIBRARY,
  MUSCLE_GROUP_LABELS,
  type ExerciseDefinition,
} from "./exercise-library";
import type { ApiRoutineDayExercise } from "./data";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: number;
  rest_seconds: number;
}

interface WorkoutDetailProps {
  dayName: string;
  dayExercises: ApiRoutineDayExercise[];
  onStart: (exercises: Exercise[]) => void;
  onBack: () => void;
  routineId?: string;
  dayId?: string;
  onAddExercise?: (exerciseId: string, sets: number, reps: number, restSeconds: number) => void;
  onRemoveExercise?: (exerciseDayId: string) => void;
}

export default function WorkoutDetail({
  dayName,
  dayExercises,
  onStart,
  onBack,
  routineId,
  dayId,
  onAddExercise,
  onRemoveExercise,
}: WorkoutDetailProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);

  const filteredLibrary = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      !searchQuery ||
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscles.some((m) => MUSCLE_GROUP_LABELS[m].toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMuscle = !selectedMuscle || ex.muscles.includes(selectedMuscle as any);
    const notAlreadyAdded = !dayExercises.some((de) => (de.exercise?.name || de.exercise_name) === ex.name);
    return matchesSearch && matchesMuscle && notAlreadyAdded;
  });

  const totalSets = dayExercises.reduce((sum, ex) => sum + (ex.targetSets || 3), 0);
  const totalExercises = dayExercises.length;

  const handleAddExercise = (lib: ExerciseDefinition) => {
    if (onAddExercise) {
      onAddExercise(lib.id, 3, 10, 90);
    }
    setShowAddModal(false);
    setSearchQuery("");
    setSelectedMuscle(null);
  };

  const handleDeleteExercise = (exerciseDayId: string) => {
    if (onRemoveExercise) {
      onRemoveExercise(exerciseDayId);
    }
    setExerciseToDelete(null);
  };

  const handleStart = () => {
    const exercises = dayExercises.map((de) => ({
      id: `ex-${de.id}`,
      name: de.exercise_name || de.exercise?.name || 'Unknown',
      muscle_group: de.muscle_group || de.exercise?.muscleGroup || "Other",
      sets: de.targetSets || 3,
      reps: de.targetReps || 10,
      weight: de.lastWeight || 0,
      rest_seconds: de.restSeconds || 90,
    }));
    onStart(exercises);
  };

  return (
    <div className="relative flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">{dayName}</h1>
            <p className="text-sm text-muted-foreground">{totalExercises} exercises · {totalSets} total sets</p>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5">
        {dayExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Target size={32} className="text-muted-foreground/40" />
            </div>
            <p className="text-foreground font-medium mb-2">No exercises yet</p>
            <p className="text-sm text-muted-foreground mb-6">Add exercises to build your workout</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
            >
              <Plus size={18} />
              Add Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dayExercises.map((de) => (
              <div key={de.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
                <GripVertical size={16} className="text-muted-foreground/30 flex-shrink-0" />
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ExerciseIllustration
                      imageKey={
                        EXERCISE_LIBRARY.find((e) => e.name === (de.exercise?.name || de.exercise_name))?.imageKey || "barbell_bench_press"
                      }
                      size={48}
                    />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{de.exercise?.name || de.exercise_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {de.targetSets || 3} sets × {de.targetReps || 10} reps
                    {de.restSeconds ? ` · ${de.restSeconds}s rest` : ""}
                  </p>
                </div>
                {onRemoveExercise && (
                  <div className="relative">
                    {exerciseToDelete === de.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteExercise(de.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setExerciseToDelete(null)}
                          className="p-1.5 bg-secondary text-muted-foreground rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExerciseToDelete(de.id)}
                        className="p-1.5 hover:bg-red-50 text-muted-foreground/40 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors text-sm"
            >
              <Plus size={16} />
              Add Exercise
            </button>
          </div>
        )}
      </div>

      {/* Start Button – outside scroll area */}
      {dayExercises.length > 0 && (
        <div className="shrink-0 px-5 pt-3 pb-20">
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base active:scale-[0.98] transition-transform"
          >
            <Play size={22} fill="currentColor" />
            Start Workout
          </button>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col">
          <div className="flex flex-col h-full bg-background mt-auto rounded-t-3xl max-h-[85%]">
            {/* Modal Header */}
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-foreground">Add Exercise</h2>
                <button
                  onClick={() => { setShowAddModal(false); setSearchQuery(""); setSelectedMuscle(null); }}
                  className="p-2 -mr-2 hover:bg-secondary rounded-xl"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {(["chest", "back", "shoulders", "biceps", "triceps", "legs", "glutes", "core"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMuscle(selectedMuscle === m ? null : m)}
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
            </div>

            {/* Exercise Results */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No exercises found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLibrary.map((lib) => (
                    <button
                      key={lib.id}
                      onClick={() => handleAddExercise(lib)}
                      className="w-full flex items-center gap-3 bg-card hover:bg-secondary/50 rounded-xl p-3 text-left transition-colors border border-border"
                    >
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <ExerciseIllustration imageKey={lib.imageKey} size={48} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{lib.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lib.muscles.map((m) => MUSCLE_GROUP_LABELS[m]).join(", ")} · {lib.equipment}
                        </p>
                      </div>
                      <Plus size={18} className="text-primary/40 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
