export type TabId = 'home' | 'workouts' | 'analytics' | 'settings'

export type ExerciseSet = {
  set: number
  previous: string
  weight: number
  reps: number
}

export type WorkoutExercise = {
  id: string
  name: string
  target: string
  sets: ExerciseSet[]
}

export type RoutineDay = {
  id: string
  title: string
  focus: string
  exercises: number
}

export type ApiExercise = {
  id: string
  name: string
  muscleGroup: string
  createdAt: string | null
}

export type ApiRoutineDayExercise = {
  id: string
  routineDayId: string
  exerciseId: string
  targetSets: number | null
  targetReps: number | null
  restSeconds: number | null
  lastWeight: number | null
  order: number
  exercise?: ApiExercise
  exercise_name?: string
  muscle_group?: string
}

export type ApiRoutineDay = {
  id: string
  routineId: string
  title: string
  focus: string
  order: number
  exerciseCount?: number
  exercises?: ApiRoutineDayExercise[]
}

export type ApiRoutine = {
  id: string
  name: string
  description: string | null
  isActive: boolean | null
  createdAt: string | null
  days: ApiRoutineDay[]
}

export type ApiWorkout = {
  id: string
  routineDayId: string | null
  name: string
  startedAt: string
  completedAt: string | null
  durationSeconds: number | null
  totalVolume: number | null
  totalSets: number | null
  completedSets: number | null
  notes: string | null
}

export type ApiWorkoutSet = {
  id: string
  workoutId: string
  exerciseName: string
  setNumber: number
  weight: number | null
  reps: number | null
  completed: boolean | null
}

export type AnalyticsData = {
  volumeData: { label: string; value: number }[]
  exerciseOptions: string[]
  oneRepMaxByExercise: Record<string, number[]>
  muscleBreakdown: { label: string; value: number }[]
}
