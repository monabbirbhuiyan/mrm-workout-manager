'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Flame, Play, TrendingUp, User } from 'lucide-react'
import { ApiRoutine, ApiWorkout } from './data'

const streakDays = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

export function HomeScreen({
  onStartWorkout,
  routines,
  userName: sessionUserName,
}: {
  onStartWorkout: () => void
  routines: ApiRoutine[]
  userName?: string
}) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [recentWorkouts, setRecentWorkouts] = useState<ApiWorkout[]>([])
  const [userName, setUserName] = useState('User')

  const toggleDay = (key: string) =>
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    if (sessionUserName) {
      setUserName(sessionUserName)
    } else {
      fetch('/api/settings')
        .then(r => r.json())
        .then((s: Record<string, string>) => { if (s.userName) setUserName(s.userName) })
        .catch(() => {})
    }
  }, [sessionUserName])

  useEffect(() => {
    fetch('/api/workouts')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load workouts')
        return r.json()
      })
      .then((workouts: ApiWorkout[]) => {
        setRecentWorkouts(workouts.slice(0, 3))
        const newCompleted: Record<string, boolean> = {}
        const now = new Date()
        const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

        for (const w of workouts) {
          const wDate = new Date(w.startedAt)
          const diffDays = Math.floor((now.getTime() - wDate.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays < 7) {
            const wDay = dayMap[wDate.getDay()]
            newCompleted[wDay] = true
          }
        }
        setCompleted(newCompleted)
      })
      .catch(() => {})
  }, [])

  const firstRoutine = routines[0]
  const firstDay = firstRoutine?.days?.[0]
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const lastWorkout = recentWorkouts[0]
  const streakCount = Object.values(completed).filter(Boolean).length

  return (
    <div className="space-y-5 px-5 pb-4 pt-12">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {dateStr}
          </p>
          <h1 className="mt-1 text-[1.65rem] font-bold tracking-tight text-foreground">
            Welcome back{userName !== 'User' ? `, ${userName}` : ''}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
        >
          <User className="h-5 w-5" />
        </button>
      </header>

      <section className="rounded-2xl bg-primary/5 p-5 ring-1 ring-primary/15">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Today&apos;s Focus
        </p>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          {firstDay?.title || 'Start a Workout'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {firstDay?.focus || 'Choose a routine to begin'}
        </p>
        <button
          type="button"
          onClick={onStartWorkout}
          className="relative mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-all active:scale-[0.98]"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Active Workout
        </button>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Streak
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {streakCount}<span className="text-sm font-medium text-muted-foreground"> / 7</span>
            </p>
            <div className="mt-2.5 flex gap-1">
              {streakDays.map((d) => {
                const isDone = completed[d.key]
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDay(d.key)}
                    aria-pressed={isDone}
                    aria-label={`Toggle ${d.label}`}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
                      isDone
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-sky" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Last Session
              </span>
            </div>
            {lastWorkout ? (
              <>
                <p className="mt-2 text-sm font-bold text-foreground leading-tight">
                  {lastWorkout.name}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {timeAgo(lastWorkout.completedAt || lastWorkout.startedAt)}
                </p>
                <p className="mt-1.5 inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {(lastWorkout.totalVolume || 0).toLocaleString()} kg
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No sessions yet</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Recent Activity
        </h3>
        <ul className="space-y-2">
          {recentWorkouts.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left ring-1 ring-border transition-all active:scale-[0.98]"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  i === 0
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  <Dumbbell className="h-5 w-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {Math.floor((item.durationSeconds || 0) / 60)} min · {timeAgo(item.completedAt || item.startedAt)}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-foreground tabular-nums">
                  {(item.totalVolume || 0).toLocaleString()} kg
                </span>
              </button>
            </li>
          ))}
          {recentWorkouts.length === 0 && (
            <li className="rounded-2xl bg-card p-8 text-center ring-1 ring-border">
              <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No recent activity
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/60">
                Start a workout to see your history here
              </p>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
