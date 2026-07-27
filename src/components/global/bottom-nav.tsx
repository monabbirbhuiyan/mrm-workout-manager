'use client'

import { BarChart3, Dumbbell, Home, Settings } from 'lucide-react'
import type { TabId } from './data'

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 border-t border-border bg-card/95 px-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
    >
      <ul className="flex items-center justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-16 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10'
                    : 'active:scale-95'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`h-0.75 w-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-primary scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
