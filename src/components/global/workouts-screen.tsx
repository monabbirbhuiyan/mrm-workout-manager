'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronRight, Play, Plus, Trash2, X, Dumbbell, Search, Check, Minus } from 'lucide-react'
import { ApiRoutine, ApiRoutineDayExercise } from './data'
import { ExerciseIllustration } from './exercise-illustrations'
import {
  EXERCISE_LIBRARY,
  MUSCLE_GROUP_LABELS,
  type ExerciseDefinition,
  type MuscleGroup,
} from './exercise-library'

export function WorkoutsScreen({
  onStartWorkout,
  onStartBuilder,
  routines,
  onRoutinesChange,
}: {
  onStartWorkout: (routineDayId?: string) => void
  onStartBuilder: (routineId: string, dayId?: string) => void
  routines: ApiRoutine[]
  onRoutinesChange: (routines: ApiRoutine[]) => void
}) {
  const [addedCount, setAddedCount] = useState(0)
  const [removingDayId, setRemovingDayId] = useState<string | null>(null)

  const activeRoutine = routines.find(r => r.isActive)

  const removeDay = async (dayId: string) => {
    if (!activeRoutine) return
    try {
      await fetch(`/api/routines/${activeRoutine.id}/days/${dayId}`, { method: 'DELETE' })
      onRoutinesChange(
        routines.map(r =>
          r.id === activeRoutine.id ? { ...r, days: r.days.filter(d => d.id !== dayId) } : r
        )
      )
      setRemovingDayId(null)
    } catch (err) {
      console.error('Failed to delete day:', err)
    }
  }

  const days = activeRoutine?.days?.sort((a, b) => a.order - b.order) || []

  return (
    <div className="space-y-5 px-5 pb-4 pt-12">
      <header className="flex items-center justify-between">
        <h1 className="text-[1.65rem] font-bold tracking-tight text-foreground">
          My Routines
        </h1>
        <button
          type="button"
          onClick={() => activeRoutine && onStartBuilder(activeRoutine.id)}
          aria-label="Add a split"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </header>

      {/* Active program banner */}
      {activeRoutine && (
        <section className="rounded-2xl bg-primary/5 p-5 ring-1 ring-primary/15">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/6 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Active Program
            </span>
            <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              Active
            </span>
          </div>
          <h2 className="relative mt-2 text-lg font-bold text-foreground">
            {activeRoutine.name}
          </h2>
          {activeRoutine.description && (
            <p className="relative mt-1 text-xs text-muted-foreground">
              {activeRoutine.description}
            </p>
          )}
          <div className="relative mt-4 flex gap-3">
            <div className="flex-1 rounded-xl bg-secondary/50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Frequency
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {days.length}x / week
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-secondary/50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Days
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {days.length}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Training days */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Training Days
          </h3>
          {addedCount > 0 && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
              +{addedCount} added
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {days.map((day, index) => (
            <DayCard
              key={day.id}
              day={{
                id: day.id,
                title: day.title,
                focus: day.focus,
                exercises: day.exerciseCount || 0,
                index: index + 1,
              }}
              onStart={() => onStartWorkout(day.id)}
              onDelete={index === 0 ? undefined : () => removeDay(day.id)}
            />
          ))}
          {(!activeRoutine || days.length === 0) && (
            <li className="rounded-2xl bg-card p-8 text-center ring-1 ring-border">
              <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No training days yet
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/60">
                Tap + to build a custom workout day
              </p>
            </li>
          )}
        </ul>
        {days.length > 0 && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
            Tap to view · Swipe left to start · Swipe right to delete
          </p>
        )}
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DayCard – tap = view detail, swipe left = start, swipe right = del */
/* ------------------------------------------------------------------ */

function DayCard({
  day,
  onStart,
  onDelete,
}: {
  day: { id: string; title: string; focus: string; exercises: number; index: number }
  onStart: () => void
  onDelete?: () => void
}) {
  const SWIPE_THRESHOLD = 70
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!swiping) return
      const delta = e.touches[0].clientX - startX.current
      if (!onDelete && delta > 0) { setOffset(0); return }
      setOffset(delta)
    },
    [swiping, onDelete],
  )

  const handleTouchEnd = useCallback(() => {
    setSwiping(false)
    if (offset < -SWIPE_THRESHOLD) {
      setOffset(0)
      onStart()
    } else if (offset > SWIPE_THRESHOLD && onDelete) {
      setOffset(80)
    } else {
      setOffset(0)
    }
  }, [offset, onStart, onDelete])

  const revealDelete = () => setOffset(80)
  const hideActions = () => setOffset(0)

  return (
    <li className="relative overflow-hidden rounded-xl">
      {/* Left reveal – start */}
      <div className="absolute inset-y-0 left-0 flex w-24 items-center justify-start pl-5 bg-primary text-primary-foreground">
        <Play className="h-4 w-4 fill-current" />
        <span className="ml-1.5 text-xs font-bold">Start</span>
      </div>

      {/* Right reveal – delete */}
      {onDelete && (
        <button
          type="button"
          onClick={() => { setOffset(0); onDelete() }}
          aria-label={`Delete ${day.title}`}
          className="absolute inset-y-0 right-0 flex w-24 items-center justify-center gap-1.5 bg-destructive text-white"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-xs font-bold">Delete</span>
        </button>
      )}

      {/* Foreground card */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (offset === 0) onStart(); else hideActions() }}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.25,1,0.5,1)',
        }}
        className="relative flex items-center gap-3 bg-card p-4 ring-1 ring-border cursor-pointer select-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-[11px] font-bold text-muted-foreground">
          {day.index}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-foreground truncate">
            {day.title}
          </span>
          <span className="block text-[11px] text-muted-foreground truncate">
            {day.focus}
          </span>
          <span className="mt-0.5 block text-[10px] font-bold text-primary/70">
            {day.exercises} Exercises
          </span>
        </span>

        {onDelete ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (offset < 0) hideActions()
              else revealDelete()
            }}
            aria-label="Reveal delete"
            className="pointer-events-auto text-muted-foreground/50"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-200 ${offset > 0 ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
        )}
      </div>
    </li>
  )
}
