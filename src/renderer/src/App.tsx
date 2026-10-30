import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Minimize2 } from 'lucide-react'
import type { WindowMode } from '../../shared/types'
import { useAppData } from './useAppData'
import {
  initialSession,
  isRunning,
  reduce,
  sessionConfig,
  SessionAction,
  SessionConfig,
  SessionState
} from './session'
import { playExerciseEnd, playWorkEnd } from './sounds'
import { TimerView } from './components/TimerView'
import { MiniView } from './components/MiniView'
import { SetupView } from './components/SetupView'
import { SettingsView } from './components/SettingsView'

type Page = 'timer' | 'setup' | 'settings'

const PAGES: { id: Page; label: string }[] = [
  { id: 'timer', label: 'Timer' },
  { id: 'setup', label: 'Setup' },
  { id: 'settings', label: 'Settings' }
]

export interface SessionControls {
  session: SessionState
  now: number
  config: SessionConfig
  dispatch: (type: SessionAction['type']) => void
}

function App(): React.JSX.Element | null {
  const [data, update] = useAppData()
  const [page, setPage] = useState<Page>('timer')
  const [session, setSession] = useState<SessionState>(initialSession)
  const [now, setNow] = useState(() => Date.now())

  const config = useMemo(
    () => (data ? sessionConfig(data) : { workMinutes: 25, steps: [] }),
    [data]
  )
  // The reducer always reads the latest sequence, so edits apply from the next period.
  const configRef = useRef(config)
  useEffect(() => {
    configRef.current = config
  }, [config])

  const dispatch = useCallback((type: SessionAction['type']) => {
    const t = Date.now()
    setNow(t)
    setSession((s) => reduce(s, { type, now: t } as SessionAction, configRef.current))
  }, [])

  const running = isRunning(session) && !session.paused
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => dispatch('tick'), 250)
    return () => window.clearInterval(id)
  }, [running, dispatch])

  // Natural period ends: sound, bring the window forward, show the timer.
  const lastSeq = useRef(0)
  const [repaint, setRepaint] = useState<SessionState['boundary']>(null)
  useEffect(() => {
    const b = session.boundary
    if (!b || b.seq === lastSeq.current) return
    lastSeq.current = b.seq
    if (b.kind === 'work-end') playWorkEnd()
    else playExerciseEnd()
    window.api.requestAttention()
    setPage('timer')
    setRepaint(b)
  }, [session.boundary])

  const mode = data?.windowMode ?? 'full'
  useEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  const setMode = (next: WindowMode): void => {
    window.api.setWindowMode(next)
    update((d) => ({ ...d, windowMode: next }))
  }

  if (!data) return null

  const controls: SessionControls = { session, now, config, dispatch }
  const tone = session.phase === 'work' ? 'work' : session.phase === 'idle' ? 'idle' : 'exercise'

  const flood = repaint && (
    <div
      key={repaint.seq}
      className="repaint"
      data-kind={repaint.kind}
      onAnimationEnd={() => setRepaint(null)}
    />
  )

  if (mode === 'mini') {
    return (
      <>
        <MiniView {...controls} tone={tone} onExpand={() => setMode('full')} />
        {flood}
      </>
    )
  }

  return (
    <div className="shell" data-tone={tone}>
      <header className="topbar">
        <span className="wordmark" aria-label="MOVE">
          MO<span>VE</span>
        </span>
        <nav className="tabs" aria-label="Pages">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className="tab"
              aria-current={page === p.id ? 'page' : undefined}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <button className="icon-btn" onClick={() => setMode('mini')} title="Switch to mini window">
          <Minimize2 size={18} strokeWidth={2.25} aria-hidden />
          <span className="sr-only">Switch to mini window</span>
        </button>
      </header>
      <main className="page">
        {page === 'timer' && <TimerView {...controls} onOpenSetup={() => setPage('setup')} />}
        {page === 'setup' && <SetupView data={data} update={update} />}
        {page === 'settings' && <SettingsView data={data} update={update} />}
      </main>
      {flood}
    </div>
  )
}

export default App
