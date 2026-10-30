import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppData } from '../../shared/types'

/** Loads saved data once, then saves every change shortly after it happens. */
export function useAppData(): [AppData | null, (update: (d: AppData) => AppData) => void] {
  const [data, setData] = useState<AppData | null>(null)
  const pending = useRef<AppData | null>(null)
  const saveTimer = useRef<number>(undefined)

  useEffect(() => {
    void window.api.loadData().then(setData)
    // Don't lose an edit made just before the window closes.
    const flush = (): void => {
      if (pending.current) void window.api.saveData(pending.current)
    }
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [])

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => {
      if (!prev) return prev
      const next = fn(prev)
      pending.current = next
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        pending.current = null
        void window.api.saveData(next)
      }, 300)
      return next
    })
  }, [])

  return [data, update]
}
