// The running session as a pure state machine. Time is passed in on every
// action so the countdown is computed from timestamps and never drifts.

import type { AppData } from '../../shared/types'

const MIN = 60_000

export type Phase = 'idle' | 'work' | 'exercise' | 'ready' | 'finished'

export interface Step {
  name: string
  minutes: number
}

export interface SessionConfig {
  workMinutes: number
  steps: Step[]
}

export interface Boundary {
  kind: 'work-end' | 'exercise-end'
  /** Increments on every natural period end so effects (sound, focus) fire once each. */
  seq: number
}

export interface SessionState {
  phase: Phase
  /** Position in the sequence. During work, the exercise that follows it. */
  index: number
  /** Name of the exercise in progress; empty outside an exercise. */
  stepName: string
  durationMs: number
  /** Wall-clock end of the running period. Ignored while paused. */
  endsAt: number
  /** Time left when paused. */
  pausedRemaining: number
  paused: boolean
  boundary: Boundary | null
  seq: number
}

export type SessionAction =
  | { type: 'startWork'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'resume'; now: number }
  | { type: 'skip'; now: number }
  | { type: 'tick'; now: number }
  | { type: 'startOver'; now: number }
  | { type: 'end'; now: number }

export const initialSession: SessionState = {
  phase: 'idle',
  index: 0,
  stepName: '',
  durationMs: 0,
  endsAt: 0,
  pausedRemaining: 0,
  paused: false,
  boundary: null,
  seq: 0
}

export function remainingMs(s: SessionState, now: number): number {
  if (s.phase !== 'work' && s.phase !== 'exercise') return 0
  if (s.paused) return s.pausedRemaining
  return Math.max(0, s.endsAt - now)
}

export function isRunning(s: SessionState): boolean {
  return s.phase === 'work' || s.phase === 'exercise'
}

function clampIndex(index: number, config: SessionConfig): number {
  return Math.min(index, Math.max(0, config.steps.length - 1))
}

function beginWork(
  s: SessionState,
  index: number,
  start: number,
  config: SessionConfig
): SessionState {
  if (config.steps.length === 0) return s
  const durationMs = config.workMinutes * MIN
  return {
    ...s,
    phase: 'work',
    index: clampIndex(index, config),
    stepName: '',
    durationMs,
    endsAt: start + durationMs,
    pausedRemaining: 0,
    paused: false
  }
}

function beginExercise(s: SessionState, start: number, config: SessionConfig): SessionState {
  const index = clampIndex(s.index, config)
  const step = config.steps[index]
  if (!step) return { ...initialSession, seq: s.seq, boundary: s.boundary }
  const durationMs = step.minutes * MIN
  return {
    ...s,
    phase: 'exercise',
    index,
    stepName: step.name,
    durationMs,
    endsAt: start + durationMs,
    pausedRemaining: 0,
    paused: false
  }
}

function afterExercise(s: SessionState, config: SessionConfig): SessionState {
  const last = s.index >= config.steps.length - 1
  return {
    ...s,
    phase: last ? 'finished' : 'ready',
    index: last ? s.index : s.index + 1,
    stepName: '',
    durationMs: 0,
    endsAt: 0,
    pausedRemaining: 0,
    paused: false
  }
}

function withBoundary(s: SessionState, kind: Boundary['kind']): SessionState {
  const seq = s.seq + 1
  return { ...s, seq, boundary: { kind, seq } }
}

export function reduce(
  s: SessionState,
  action: SessionAction,
  config: SessionConfig
): SessionState {
  const { now } = action
  switch (action.type) {
    case 'startWork':
      if (s.phase !== 'idle' && s.phase !== 'ready') return s
      return beginWork(s, s.index, now, config)

    case 'startOver':
      if (s.phase !== 'finished') return s
      return beginWork(s, 0, now, config)

    case 'end':
      return { ...initialSession, seq: s.seq, boundary: s.boundary }

    case 'pause':
      if (!isRunning(s) || s.paused) return s
      return { ...s, paused: true, pausedRemaining: remainingMs(s, now) }

    case 'resume':
      if (!isRunning(s) || !s.paused) return s
      return { ...s, paused: false, endsAt: now + s.pausedRemaining }

    case 'skip':
      if (s.phase === 'work') return { ...beginExercise(s, now, config), boundary: null }
      if (s.phase === 'exercise') return { ...afterExercise(s, config), boundary: null }
      return s

    case 'tick': {
      if (!isRunning(s) || s.paused || now < s.endsAt) return s
      if (s.phase === 'work') {
        // Start the exercise from the moment work ended, not from this tick.
        return withBoundary(beginExercise(s, s.endsAt, config), 'work-end')
      }
      return withBoundary(afterExercise(s, config), 'exercise-end')
    }
  }
}

/** The steps a session runs, resolved from the saved sequence. */
export function sessionConfig(data: AppData): SessionConfig {
  const byId = new Map(data.exercises.map((e) => [e.id, e]))
  return {
    workMinutes: data.settings.workMinutes,
    steps: data.sequence.flatMap((entry) => {
      const ex = byId.get(entry.exerciseId)
      return ex ? [{ name: ex.name, minutes: ex.minutes }] : []
    })
  }
}
