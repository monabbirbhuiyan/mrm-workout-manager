'use client'

import { useState, useEffect } from 'react'
import {
  ChevronRight,
  Download,
  HeartPulse,
  Link2,
  Moon,
  Timer,
  User,
  Volume2,
} from 'lucide-react'
import { useTheme } from '@/components/global/theme-provider'

function Toggle({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string
  icon: typeof Timer
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="h-4.5 w-4.5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium text-foreground">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function NavRow({
  label,
  icon: Icon,
  iconColor,
  onClick,
}: {
  label: string
  icon: typeof Timer
  iconColor?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-secondary/60"
    >
      <Icon className={`h-4.5 w-4.5 ${iconColor || 'text-muted-foreground'}`} />
      <span className="flex-1 text-sm font-medium text-foreground">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
    </button>
  )
}

export function SettingsScreen({ userName: defaultName }: { userName: string }) {
  const { darkMode, toggleDarkMode } = useTheme()
  const [userName, setUserName] = useState(defaultName)
  const [restAutoStart, setRestAutoStart] = useState(true)
  const [audioAlerts, setAudioAlerts] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(defaultName)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((settings: Record<string, string>) => {
        if (settings.userName && settings.userName !== 'User') {
          setUserName(settings.userName)
          setNameInput(settings.userName)
        }
        if (settings.restTimerAutoStart) setRestAutoStart(settings.restTimerAutoStart === 'true')
        if (settings.audioAlerts) setAudioAlerts(settings.audioAlerts === 'true')
      })
      .catch(console.error)
  }, [])

  const updateSetting = async (key: string, value: string) => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })
    } catch (err) {
      console.error('Failed to save setting:', err)
    } finally {
      setSaving(false)
    }
  }

  const saveUserName = () => {
    setUserName(nameInput)
    setEditingName(false)
    updateSetting('userName', nameInput)
  }

  const exportCSV = async () => {
    try {
      const res = await fetch('/api/workouts')
      const workouts = await res.json()

      let csv = 'Date,Name,Duration (min),Volume (kg),Sets,Completed Sets\n'
      for (const w of workouts) {
        const date = new Date(w.startedAt).toLocaleDateString()
        const duration = Math.floor((w.durationSeconds || 0) / 60)
        csv += `${date},${w.name},${duration},${w.totalVolume || 0},${w.totalSets || 0},${w.completedSets || 0}\n`
      }

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workout-log-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export CSV:', err)
    }
  }

  return (
    <div className="space-y-5 px-5 pb-4 pt-12">
      <header>
        <h1 className="text-[1.65rem] font-bold tracking-tight text-foreground">
          Settings
        </h1>
      </header>

      {/* User card */}
      <section className="rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/15">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveUserName}
                onKeyDown={(e) => e.key === 'Enter' && saveUserName()}
                autoFocus
                className="w-full rounded-lg bg-secondary px-2.5 py-1 text-sm font-bold text-foreground outline-none ring-1 ring-primary/30 focus:ring-primary/60"
              />
            ) : (
              <p className="text-sm font-bold text-foreground truncate">{userName}</p>
            )}
            <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              Pro Plan
            </span>
          </div>
          <button
            type="button"
            onClick={() => editingName ? saveUserName() : setEditingName(true)}
            className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-secondary/80 active:scale-95"
          >
            {editingName ? 'Save' : 'Edit'}
          </button>
        </div>
      </section>

      {/* Account */}
      <section>
        <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </h3>
        <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
          <NavRow
            label="Edit Profile Info"
            icon={User}
            iconColor="text-primary"
            onClick={() => setEditingName(true)}
          />
          <NavRow label="Link Personal Trainer Coach" icon={Link2} iconColor="text-sky" />
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Preferences
          {saving && (
            <span className="ml-2 text-[10px] font-medium text-primary animate-pulse">Saving...</span>
          )}
        </h3>
        <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
          <Toggle
            label="Rest Timer Auto-Start"
            icon={Timer}
            checked={restAutoStart}
            onChange={() => {
              const next = !restAutoStart
              setRestAutoStart(next)
              updateSetting('restTimerAutoStart', String(next))
            }}
          />
          <Toggle
            label="Audio / Haptic Alerts"
            icon={Volume2}
            checked={audioAlerts}
            onChange={() => {
              const next = !audioAlerts
              setAudioAlerts(next)
              updateSetting('audioAlerts', String(next))
            }}
          />
          <Toggle
            label="Dark Mode"
            icon={Moon}
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </div>
      </section>

      {/* Integrations & Data */}
      <section>
        <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Integrations &amp; Data
        </h3>
        <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
          <NavRow label="Sync with Apple Health / Google Fit" icon={HeartPulse} iconColor="text-rose" />
          <NavRow label="Export All Training Logs (.CSV)" icon={Download} iconColor="text-amber" onClick={exportCSV} />
        </div>
      </section>
    </div>
  )
}
