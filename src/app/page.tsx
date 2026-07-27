'use client'

import { TabId, ApiRoutine, ApiRoutineDayExercise } from '@/components/global/data'
import { HomeScreen } from '@/components/global/home-screen'
import { WorkoutsScreen } from '@/components/global/workouts-screen'
import { AnalyticsScreen } from '@/components/global/analytics-screen'
import { SettingsScreen } from '@/components/global/settings-screen'
import { BottomNav } from '@/components/global/bottom-nav'
import { ActiveWorkout } from '@/components/global/active-workout'
import WorkoutDetail from '@/components/global/workout-detail'
import WorkoutBuilder from '@/components/global/workout-builder'
import { useSession, signOut } from '@/lib/auth-client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell, LogOut, Loader2 } from 'lucide-react'

type Screen =
  | { type: 'tabs' }
  | { type: 'detail'; dayId: string; dayName: string; exercises: ApiRoutineDayExercise[]; routineId: string }
  | { type: 'builder'; routineId: string }
  | { type: 'active'; exercises: { id: string; name: string; muscle_group: string; sets: number; reps: number; weight: number; rest_seconds: number }[]; dayName: string; routineDayId: string }

export default function Page() {
  const { data: session, isPending } = useSession()
  const [tab, setTab] = useState<TabId>('home')
  const [screen, setScreen] = useState<Screen>({ type: 'tabs' })
  const [routines, setRoutines] = useState<ApiRoutine[]>([])

  useEffect(() => {
    if (session) {
      fetch('/api/routines')
        .then(r => r.json())
        .then(setRoutines)
        .catch(console.error)
    }
  }, [screen.type, session])

  const activeRoutine = routines.find(r => r.isActive)

  const handleOpenDay = (dayId: string) => {
    if (!activeRoutine) return
    const day = activeRoutine.days.find(d => d.id === dayId)
    if (!day) return
    setScreen({
      type: 'detail',
      dayId,
      dayName: day.title,
      exercises: day.exercises || [],
      routineId: activeRoutine.id,
    })
  }

  const handleStartWorkout = (dayId?: string) => {
    if (dayId) {
      setScreen({
        type: 'active',
        exercises: [],
        dayName: '',
        routineDayId: dayId,
      })
    } else {
      setScreen({
        type: 'active',
        exercises: [],
        dayName: 'Quick Workout',
        routineDayId: '',
      })
    }
  }

  const handleOpenBuilder = (routineId: string) => {
    setScreen({ type: 'builder', routineId })
  }

  const handleDayCreated = (dayId: string) => {
    fetch('/api/routines')
      .then(r => r.json())
      .then((data) => {
        setRoutines(data)
        setScreen({ type: 'tabs' })
      })
  }

  const handleStartFromDetail = (
    exercises: { id: string; name: string; muscle_group: string; sets: number; reps: number; weight: number; rest_seconds: number }[]
  ) => {
    if (screen.type !== 'detail') return
    setScreen({
      type: 'active',
      exercises,
      dayName: screen.dayName,
      routineDayId: screen.dayId,
    })
  }

  const handleAddExerciseToDay = async (exerciseId: string, sets: number, reps: number, restSeconds: number) => {
    if (screen.type !== 'detail') return
    try {
      await fetch(`/api/routines/${screen.routineId}/days/${screen.dayId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, targetSets: sets, targetReps: reps, restSeconds }),
      })
      const res = await fetch('/api/routines')
      const data = await res.json()
      setRoutines(data)
      const updatedRoutine = data.find((r: ApiRoutine) => r.id === screen.routineId)
      const updatedDay = updatedRoutine?.days.find((d: { id: string }) => d.id === screen.dayId)
      if (updatedDay) {
        setScreen({
          type: 'detail',
          dayId: screen.dayId,
          dayName: updatedDay.title,
          exercises: updatedDay.exercises || [],
          routineId: screen.routineId,
        })
      }
    } catch (err) {
      console.error('Failed to add exercise:', err)
    }
  }

  const handleRemoveExerciseFromDay = async (exerciseDayId: string) => {
    if (screen.type !== 'detail') return
    try {
      await fetch(`/api/routines/${screen.routineId}/days/${screen.dayId}?exerciseId=${exerciseDayId}`, {
        method: 'DELETE',
      })
      const res = await fetch('/api/routines')
      const data = await res.json()
      setRoutines(data)
      const updatedRoutine = data.find((r: ApiRoutine) => r.id === screen.routineId)
      const updatedDay = updatedRoutine?.days.find((d: { id: string }) => d.id === screen.dayId)
      if (updatedDay) {
        setScreen({
          type: 'detail',
          dayId: screen.dayId,
          dayName: updatedDay.title,
          exercises: updatedDay.exercises || [],
          routineId: screen.routineId,
        })
      }
    } catch (err) {
      console.error('Failed to remove exercise:', err)
    }
  }

  const handleCloseActive = () => {
    fetch('/api/routines')
      .then(r => r.json())
      .then(setRoutines)
    setScreen({ type: 'tabs' })
    setTab('home')
  }

  const handleCloseDetail = () => {
    setScreen({ type: 'tabs' })
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Loading state
  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  // Not authenticated - show landing page
  if (!session) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-5">
        <div className="w-full max-w-sm text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Dumbbell className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">MRM Workout</h1>
            <p className="text-muted-foreground mt-2">Track your workouts, monitor progress, and optimize your training</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block w-full py-3.5 bg-secondary text-foreground border border-border rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            >
              Create Account
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground/60">
            Track sets, reps, and weights. Monitor your progress over time.
          </p>
        </div>
      </main>
    )
  }

  // Authenticated - show app
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      {/* User bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-card px-4 py-3 border-b border-border safe-area-top">
        <div />
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px]">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 scrollbar-none">
        {screen.type === 'tabs' && (
          <>
            {tab === 'home' && (
              <HomeScreen
                onStartWorkout={() => handleStartWorkout()}
                routines={routines}
                userName={session.user.name || session.user.email || 'User'}
              />
            )}
            {tab === 'workouts' && (
              <WorkoutsScreen
                onStartWorkout={handleStartWorkout}
                onStartBuilder={handleOpenBuilder}
                routines={routines}
                onRoutinesChange={setRoutines}
              />
            )}
            {tab === 'analytics' && <AnalyticsScreen />}
            {tab === 'settings' && <SettingsScreen userName={session.user.name || session.user.email || 'User'} />}
          </>
        )}

        {screen.type === 'detail' && (
          <WorkoutDetail
            dayName={screen.dayName}
            dayExercises={screen.exercises}
            onStart={handleStartFromDetail}
            onBack={handleCloseDetail}
            routineId={screen.routineId}
            dayId={screen.dayId}
            onAddExercise={handleAddExerciseToDay}
            onRemoveExercise={handleRemoveExerciseFromDay}
          />
        )}

        {screen.type === 'builder' && (
          <WorkoutBuilder
            routineId={screen.routineId}
            onBack={() => setScreen({ type: 'tabs' })}
            onDayCreated={handleDayCreated}
          />
        )}
      </div>

      {screen.type === 'tabs' && <BottomNav active={tab} onChange={setTab} />}

      {screen.type === 'active' && (
        <ActiveWorkout
          open={screen.type === 'active'}
          routineDayId={screen.type === 'active' ? screen.routineDayId : undefined}
          onClose={handleCloseActive}
        />
      )}
    </main>
  )
}
