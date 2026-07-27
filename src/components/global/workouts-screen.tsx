'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Trash2, Dumbbell, AlertTriangle } from 'lucide-react'
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
  const [deleteConfirmDay, setDeleteConfirmDay] = useState<{ id: string; title: string } | null>(null)

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
      setDeleteConfirmDay(null)
    } catch (err) {
      console.error('Failed to delete day:', err)
    }
  }

  const days = activeRoutine?.days?.sort((a, b) => a.order - b.order) || []

  return (
    <div className="space-y-5 px-5 pb-4 pt-12 overflow-x-hidden">
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
              onDelete={() => setDeleteConfirmDay({ id: day.id, title: day.title })}
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
            Tap to start · Swipe right to start · Swipe left to delete
          </p>
        )}
      </section>

      {/* Delete confirmation dialog */}
      {deleteConfirmDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-border shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Delete Day?</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  &ldquo;{deleteConfirmDay.title}&rdquo; will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmDay(null)}
                className="flex-1 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground transition active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeDay(deleteConfirmDay.id)}
                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-xs font-bold text-white transition active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DayCard – swipe right = start, swipe left = delete                */
/* ------------------------------------------------------------------ */

function DayCard({
  day,
  onStart,
  onDelete,
}: {
  day: { id: string; title: string; focus: string; exercises: number; index: number }
  onStart: () => void
  onDelete: () => void
}) {
  const SWIPE_THRESHOLD = 60
  const MAX_SWIPE = 100
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)
  const swipingRef = useRef(false)
  const startX = useRef(0)
  const lockedAxis = useRef<'x' | 'y' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const setOffsetTracked = useCallback((val: number) => {
    const clamped = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, val))
    offsetRef.current = clamped
    setOffset(clamped)
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation()
      startX.current = e.touches[0].clientX
      lockedAxis.current = null
      swipingRef.current = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipingRef.current) return
      const dx = e.touches[0].clientX - startX.current

      if (!lockedAxis.current) {
        if (Math.abs(dx) < 8) return
        lockedAxis.current = 'x'
      }

      e.preventDefault()
      setOffsetTracked(dx)
    }

    const handleTouchEnd = () => {
      swipingRef.current = false
      lockedAxis.current = null
      const dx = offsetRef.current

      if (dx > SWIPE_THRESHOLD) {
        setOffsetTracked(0)
        onStart()
      } else if (dx < -SWIPE_THRESHOLD) {
        setOffsetTracked(0)
        onDelete()
      } else {
        setOffsetTracked(0)
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onDelete, onStart, setOffsetTracked])

  const bgClass = offset > 10
    ? 'bg-primary/10'
    : offset < -10
      ? 'bg-destructive/10'
      : ''

  return (
    <li
      onClick={() => onStart()}
      className={`relative rounded-xl cursor-pointer transition-colors duration-150 ${bgClass}`}
    >
      <div
        ref={cardRef}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swipingRef.current ? 'none' : 'transform 0.3s cubic-bezier(0.25,1,0.5,1)',
        }}
        className="relative flex items-center gap-3 bg-card p-4 ring-1 ring-border select-none touch-pan-y"
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

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label={`Delete ${day.title}`}
          className="p-2 text-muted-foreground/30 hover:text-destructive transition-colors rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}
