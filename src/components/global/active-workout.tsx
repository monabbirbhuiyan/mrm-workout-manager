'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Clock, Plus, Minus, SkipForward, X } from 'lucide-react'
import { ApiRoutineDayExercise } from './data'

type SetValues = { weight: number; reps: number }

function formatTime(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

type ActiveExercise = {
  id: string
  name: string
  target: string
  sets: { set: number; previous: string; weight: number; reps: number }[]
}

export function ActiveWorkout({
  open,
  routineDayId,
  onClose,
}: {
  open: boolean
  routineDayId?: string | null
  onClose: () => void
}) {
  const [elapsed, setElapsed] = useState(0)
  const [exercises, setExercises] = useState<ActiveExercise[]>([])
  const [dayName, setDayName] = useState('Workout')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState<Record<string, SetValues>>({})
  const [workoutId, setWorkoutId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [restActive, setRestActive] = useState(false)
  const [restRemaining, setRestRemaining] = useState(60)
  const [finishOpen, setFinishOpen] = useState(false)
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!open) return

    const loadExercises = async () => {
      setLoading(true)
      try {
        if (routineDayId) {
          const routinesRes = await fetch('/api/routines')
          const routines = await routinesRes.json()

          let dayExerciseData: ApiRoutineDayExercise[] = []
          let dayTitle = 'Workout'

          for (const routine of routines) {
            const day = routine.days.find((d: { id: string }) => d.id === routineDayId)
            if (day) {
              dayTitle = day.title
              dayExerciseData = day.exercises || []
              break
            }
          }

          setDayName(dayTitle)
          const activeExercises: ActiveExercise[] = dayExerciseData.map((de) => ({
            id: de.exerciseId,
            name: de.exercise?.name || 'Unknown',
            target: de.exercise?.muscleGroup || 'General',
            sets: Array.from({ length: de.targetSets || 3 }, (_, i) => ({
              set: i + 1,
              previous: 'New',
              weight: 0,
              reps: 10,
            })),
          }))

          setExercises(activeExercises)

          const exp: Record<string, boolean> = {}
          const vals: Record<string, SetValues> = {}
          activeExercises.forEach((ex, idx) => {
            exp[ex.id] = idx === 0
            ex.sets.forEach((s) => {
              vals[`${ex.id}-${s.set}`] = { weight: s.weight, reps: s.reps }
            })
          })
          setExpanded(exp)
          setValues(vals)
        } else {
          const defaultExercises: ActiveExercise[] = [
            { id: 'bench', name: 'Barbell Bench Press', target: 'Chest', sets: [
              { set: 1, previous: '80kg x 8', weight: 80, reps: 8 },
              { set: 2, previous: '80kg x 8', weight: 82, reps: 8 },
              { set: 3, previous: '82kg x 6', weight: 82, reps: 6 },
              { set: 4, previous: '82kg x 6', weight: 85, reps: 5 },
            ]},
            { id: 'incline', name: 'Incline Dumbbell Press', target: 'Upper Chest', sets: [
              { set: 1, previous: '30kg x 10', weight: 30, reps: 10 },
              { set: 2, previous: '30kg x 10', weight: 32, reps: 9 },
              { set: 3, previous: '32kg x 8', weight: 32, reps: 8 },
            ]},
            { id: 'flyes', name: 'Cable Flyes', target: 'Chest', sets: [
              { set: 1, previous: '20kg x 15', weight: 20, reps: 15 },
              { set: 2, previous: '20kg x 15', weight: 22, reps: 12 },
              { set: 3, previous: '22kg x 12', weight: 22, reps: 12 },
            ]},
            { id: 'triceps', name: 'Triceps Rope Pushdown', target: 'Triceps', sets: [
              { set: 1, previous: '25kg x 15', weight: 25, reps: 15 },
              { set: 2, previous: '25kg x 15', weight: 27, reps: 12 },
              { set: 3, previous: '27kg x 12', weight: 27, reps: 12 },
            ]},
          ]
          setExercises(defaultExercises)
          setDayName('Push Day A')

          const exp: Record<string, boolean> = { bench: true }
          const vals: Record<string, SetValues> = {}
          defaultExercises.forEach((ex) => {
            ex.sets.forEach((s) => {
              vals[`${ex.id}-${s.set}`] = { weight: s.weight, reps: s.reps }
            })
          })
          setExpanded(exp)
          setValues(vals)
        }

        const res = await fetch('/api/workouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            routineDayId: routineDayId || null,
            name: dayName || 'Workout',
          }),
        })
        const workout = await res.json()
        setWorkoutId(workout.id)
      } catch (err) {
        console.error('Failed to load exercises:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()

    setElapsed(0)
    setCompleted({})
    setRestActive(false)
    setFinishOpen(false)
  }, [open, routineDayId])

  useEffect(() => {
    if (!open || finishOpen) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [open, finishOpen])

  useEffect(() => {
    if (!restActive) return
    restIntervalRef.current = setInterval(() => {
      setRestRemaining((r) => {
        if (r <= 1) {
          setRestActive(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current)
    }
  }, [restActive])

  const stats = useMemo(() => {
    let volume = 0
    let setCount = 0
    for (const key in completed) {
      if (completed[key]) {
        const v = values[key]
        if (v) {
          volume += v.weight * v.reps
          setCount += 1
        }
      }
    }
    return { volume, setCount }
  }, [completed, values])

  if (!open) return null

  const toggleExpand = (id: string) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }))

  const toggleSet = (key: string) => {
    setCompleted((p) => ({ ...p, [key]: !p[key] }))
    if (!completed[key]) {
      setRestRemaining(60)
      setRestActive(true)
    }
  }

  const updateValue = (key: string, field: keyof SetValues, raw: string) => {
    if (raw === '' || raw === '-') {
      setValues((p) => ({ ...p, [key]: { ...p[key], [field]: 0 } }))
      return
    }
    const num = Number.parseInt(raw, 10)
    setValues((p) => ({
      ...p,
      [key]: { ...p[key], [field]: Number.isNaN(num) ? 0 : num },
    }))
  }

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex
        const nextSetNum = ex.sets.length + 1
        const lastSet = ex.sets[ex.sets.length - 1]
        const newKey = `${exerciseId}-${nextSetNum}`
        // Initialize values for the new set
        setValues((p) => ({
          ...p,
          [newKey]: { weight: lastSet?.weight || 0, reps: lastSet?.reps || 10 },
        }))
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              set: nextSetNum,
              previous: lastSet ? `${lastSet.previous}` : 'New',
              weight: lastSet?.weight || 0,
              reps: lastSet?.reps || 10,
            },
          ],
        }
      }),
    )
  }

  const removeSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId || ex.sets.length <= 1) return ex
        const removedSet = ex.sets[ex.sets.length - 1]
        const removedKey = `${exerciseId}-${removedSet.set}`
        // Clean up values and completed state for removed set
        setValues((p) => {
          const next = { ...p }
          delete next[removedKey]
          return next
        })
        setCompleted((p) => {
          const next = { ...p }
          delete next[removedKey]
          return next
        })
        return { ...ex, sets: ex.sets.slice(0, -1) }
      }),
    )
  }

  const handleFinish = async () => {
    if (!workoutId) return

    const setsData: {
      exerciseName: string
      setNumber: number
      weight: number
      reps: number
      completed: boolean
    }[] = []

    for (const ex of exercises) {
      for (const s of ex.sets) {
        const key = `${ex.id}-${s.set}`
        const v = values[key] || { weight: 0, reps: 0 }
        setsData.push({
          exerciseName: ex.name,
          setNumber: s.set,
          weight: v.weight,
          reps: v.reps,
          completed: !!completed[key],
        })
      }
    }

    try {
      await fetch(`/api/workouts/${workoutId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sets: setsData,
          totalVolume: stats.volume,
          totalSets: exercises.reduce((sum, ex) => sum + ex.sets.length, 0),
          completedSets: stats.setCount,
          durationSeconds: elapsed,
        }),
      })
    } catch (err) {
      console.error('Failed to save workout:', err)
    }

    setFinishOpen(true)
  }

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const progressPct = totalSets > 0 ? Math.round((stats.setCount / totalSets) * 100) : 0

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 pb-3 pt-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close workout"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-sm font-bold text-foreground">{dayName}</p>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <Clock className="h-3 w-3 text-primary" />
            <span className="font-mono text-xs font-semibold tabular-nums text-primary">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[0_0_16px_-4px_rgba(34,197,94,0.5)] transition-all hover:shadow-[0_0_20px_-4px_rgba(34,197,94,0.6)] active:scale-95"
        >
          Finish
        </button>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Loading exercises...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((ex) => {
              const isOpen = expanded[ex.id]
              const done = ex.sets.filter(
                (s) => completed[`${ex.id}-${s.set}`],
              ).length
              const allDone = done === ex.sets.length
              return (
                <div
                  key={ex.id}
                  className={`overflow-hidden rounded-2xl ring-1 transition-all duration-200 ${
                    allDone
                      ? 'bg-primary/6 ring-primary/20'
                      : 'bg-card ring-border'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(ex.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <span className="flex-1">
                      <span className={`block text-sm font-bold ${allDone ? 'text-primary' : 'text-foreground'}`}>
                        {ex.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {ex.target}
                      </span>
                    </span>
                    <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                      allDone
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {done}/{ex.sets.length}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3 pb-3">
                      <div className="grid grid-cols-[28px_1fr_1fr_1fr_44px] items-center gap-1.5 px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        <span>Set</span>
                        <span>Prev</span>
                        <span className="text-center">Kg</span>
                        <span className="text-center">Reps</span>
                        <span className="text-center">Done</span>
                      </div>
                      <div className="space-y-1">
                        {ex.sets.map((s) => {
                          const key = `${ex.id}-${s.set}`
                          const isDone = completed[key]
                          return (
                            <div
                              key={key}
                              className={`grid grid-cols-[28px_1fr_1fr_1fr_44px] items-center gap-1.5 rounded-xl px-1 py-0.5 transition-all duration-200 ${
                                isDone ? 'bg-primary/8' : ''
                              }`}
                            >
                              <span className={`text-center text-sm font-bold ${isDone ? 'text-primary' : 'text-foreground'}`}>
                                {s.set}
                              </span>
                              <span className="truncate text-[11px] text-muted-foreground">
                                {s.previous}
                              </span>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={values[key]?.weight || ''}
                                onChange={(e) => updateValue(key, 'weight', e.target.value)}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Weight for set ${s.set}`}
                                className="w-full rounded-lg bg-secondary px-2 py-2 text-center text-sm font-semibold tabular-nums text-foreground outline-none transition-all focus:bg-secondary/80 focus:ring-2 focus:ring-primary/50"
                                placeholder="0"
                              />
                              <input
                                type="number"
                                inputMode="numeric"
                                value={values[key]?.reps || ''}
                                onChange={(e) => updateValue(key, 'reps', e.target.value)}
                                onFocus={(e) => e.target.select()}
                                aria-label={`Reps for set ${s.set}`}
                                className="w-full rounded-lg bg-secondary px-2 py-2 text-center text-sm font-semibold tabular-nums text-foreground outline-none transition-all focus:bg-secondary/80 focus:ring-2 focus:ring-primary/50"
                                placeholder="0"
                              />
                              <button
                                type="button"
                                onClick={() => toggleSet(key)}
                                aria-label={`Mark set ${s.set} complete`}
                                aria-pressed={isDone}
                                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                                  isDone
                                    ? 'bg-primary text-primary-foreground shadow-[0_0_12px_-2px_rgba(34,197,94,0.4)]'
                                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                }`}
                              >
                                <Check
                                  className="h-4 w-4"
                                  strokeWidth={isDone ? 3 : 2}
                                />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                      {/* Add / Remove set buttons */}
                      <div className="mt-2 flex items-center justify-center gap-2">
                        {ex.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(ex.id)}
                            className="flex items-center gap-1 rounded-lg bg-secondary/80 px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition-all active:scale-95"
                          >
                            <Minus className="h-3 w-3" />
                            Remove Set
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => addSet(ex.id)}
                          className="flex items-center gap-1 rounded-lg bg-secondary/80 px-3 py-1.5 text-[11px] font-bold text-primary transition-all active:scale-95"
                        >
                          <Plus className="h-3 w-3" />
                          Add Set
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating rest timer banner */}
      {restActive && (
        <div className="absolute inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-card/95 px-4 pb-6 pt-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="font-mono text-2xl font-bold tabular-nums text-primary">
                  {formatTime(restRemaining)}
                </span>
                <span className="ml-1.5 text-xs font-medium text-muted-foreground">Rest</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setRestRemaining((r) => r + 30)}
                className="flex items-center gap-1 rounded-xl bg-secondary px-3.5 py-2.5 text-xs font-bold text-foreground transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                30s
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestActive(false)
                  setRestRemaining(60)
                }}
                className="flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_16px_-4px_rgba(34,197,94,0.4)] transition-all active:scale-95"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish modal */}
      {finishOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Workout summary"
        >
          <div className="w-full rounded-3xl bg-card p-6 ring-1 ring-border shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[0_0_40px_-4px_rgba(34,197,94,0.6)]">
              <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
            </div>
            <h2 className="mt-5 text-center text-xl font-bold text-foreground">
              Workout Complete!
            </h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Great session — here&apos;s your summary.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-primary/8 p-3.5 text-center ring-1 ring-primary/10">
                <p className="text-xl font-bold text-primary tabular-nums">
                  {(stats.volume / 1000).toFixed(1)}k
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Volume
                </p>
              </div>
              <div className="rounded-xl bg-primary/8 p-3.5 text-center ring-1 ring-primary/10">
                <p className="text-xl font-bold text-primary tabular-nums">
                  {stats.setCount}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sets
                </p>
              </div>
              <div className="rounded-xl bg-primary/8 p-3.5 text-center ring-1 ring-primary/10">
                <p className="text-xl font-bold text-primary tabular-nums font-mono">
                  {formatTime(elapsed)}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFinishOpen(false)
                onClose()
              }}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-[0_0_24px_-4px_rgba(34,197,94,0.4)] transition-all hover:shadow-[0_0_30px_-4px_rgba(34,197,94,0.5)] active:scale-[0.98]"
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
