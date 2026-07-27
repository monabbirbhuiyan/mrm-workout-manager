'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { BarChart, LineChart } from './charts'
import { AnalyticsData } from './data'

const ranges = ['1W', '1M', '3M', 'All'] as const

export function AnalyticsScreen() {
  const [range, setRange] = useState<(typeof ranges)[number]>('1W')
  const [exercise, setExercise] = useState('Est. 1RM: Barbell Bench Press')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?range=${range}`)
      .then(r => r.json())
      .then((data: AnalyticsData) => {
        setAnalyticsData(data)
        if (data.exerciseOptions.length > 0 && !data.exerciseOptions.includes(exercise)) {
          setExercise(data.exerciseOptions[0])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [range])

  const volumeData = analyticsData?.volumeData || []
  const totalVolume = volumeData.reduce((sum, d) => sum + d.value, 0)
  const oneRm = analyticsData?.oneRepMaxByExercise?.[exercise] || []
  const currentRm = oneRm[oneRm.length - 1] || 0
  const muscleBreakdown = analyticsData?.muscleBreakdown || []
  const exerciseOptions = analyticsData?.exerciseOptions || []

  const muscleAccentColors = ['bg-primary', 'bg-sky', 'bg-amber', 'bg-violet']

  return (
    <div className="space-y-5 px-5 pb-4 pt-12">
      <header>
        <h1 className="text-[1.65rem] font-bold tracking-tight text-foreground">
          Performance
          <br />
          Analytics
        </h1>
      </header>

      {/* Range filter pills */}
      <div
        role="tablist"
        aria-label="Time range"
        className="flex gap-1.5 rounded-2xl bg-card p-1 ring-1 ring-border"
      >
        {ranges.map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={range === r}
            type="button"
            onClick={() => setRange(r)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
              range === r
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Total volume graph */}
          <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Total Volume Load
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                  Weekly total lifted (kg)
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-bold text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                {totalVolume.toFixed(0)}k
              </span>
            </div>
            <div className="mt-4">
              {volumeData.length > 0 ? (
                <LineChart data={volumeData} />
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No volume data yet
                </p>
              )}
            </div>
          </section>

          {/* Exercise progress */}
          <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Exercise Progress
            </p>
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
                className="flex w-full items-center justify-between rounded-xl bg-secondary px-3.5 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                <span className="truncate">{exercise || 'Select exercise'}</span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                  {exerciseOptions.map((opt) => (
                    <li key={opt}>
                      <button
                        type="button"
                        onClick={() => { setExercise(opt); setDropdownOpen(false) }}
                        className={`block w-full px-3.5 py-3 text-left text-sm transition-colors ${
                          opt === exercise
                            ? 'bg-primary/10 font-semibold text-primary'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground tabular-nums">
                {currentRm || '—'}
              </p>
              {currentRm > 0 && (
                <span className="text-sm font-medium text-muted-foreground">kg</span>
              )}
            </div>
            {currentRm > 0 && oneRm.length > 0 && (
              <p className="mt-1 text-xs font-semibold text-primary">
                +{currentRm - (oneRm[0] || 0)} kg over {oneRm.length} weeks
              </p>
            )}
            <div className="mt-4">
              {oneRm.length > 0 ? (
                <BarChart data={oneRm} />
              ) : (
                <p className="text-center text-xs text-muted-foreground/50 py-6">
                  Complete workouts to see progress
                </p>
              )}
            </div>
          </section>

          {/* Muscle group breakdown */}
          <section>
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Muscle Group Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {muscleBreakdown.map((m, i) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-card p-4 ring-1 ring-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {m.label}
                    </span>
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {m.value}%
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${muscleAccentColors[i % muscleAccentColors.length]}`}
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
