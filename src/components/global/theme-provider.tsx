'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

interface ThemeContextValue {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  toggleDarkMode: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved ? saved === 'true' : prefersDark

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
    setMounted(true)

    fetch('/api/settings')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load settings')
        return r.json()
      })
      .then((settings: Record<string, string>) => {
        if (settings.darkMode === 'true') {
          document.documentElement.classList.add('dark')
          setDarkMode(true)
          localStorage.setItem('darkMode', 'true')
        } else if (settings.darkMode === 'false') {
          document.documentElement.classList.remove('dark')
          setDarkMode(false)
          localStorage.setItem('darkMode', 'false')
        }
      })
      .catch(() => {})
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('darkMode', String(next))

      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ darkMode: String(next) }),
      }).catch(() => {})

      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
