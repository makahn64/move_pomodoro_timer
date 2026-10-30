import { describe, expect, it } from 'vitest'
import { initialSession, reduce, remainingMs, SessionConfig, SessionState } from './session'

const MIN = 60_000
const config: SessionConfig = {
  workMinutes: 20,
  steps: [
    { name: 'Cat Cow', minutes: 5 },
    { name: "Child's Pose", minutes: 3 }
  ]
}

function run(actions: [string, number][], state: SessionState = initialSession): SessionState {
  return actions.reduce(
    (s, [type, now]) => reduce(s, { type, now } as Parameters<typeof reduce>[1], config),
    state
  )
}

describe('session', () => {
  it('starts work for the first step', () => {
    const s = run([['startWork', 0]])
    expect(s.phase).toBe('work')
    expect(s.index).toBe(0)
    expect(remainingMs(s, 0)).toBe(20 * MIN)
  })

  it('starts the exercise immediately when work ends, with a work-end boundary', () => {
    const s = run([
      ['startWork', 0],
      ['tick', 20 * MIN]
    ])
    expect(s.phase).toBe('exercise')
    expect(s.index).toBe(0)
    expect(remainingMs(s, 20 * MIN)).toBe(5 * MIN)
    expect(s.boundary).toEqual({ kind: 'work-end', seq: 1 })
  })

  it('carries overshoot into the exercise so time does not drift', () => {
    const s = run([
      ['startWork', 0],
      ['tick', 20 * MIN + 1000]
    ])
    expect(remainingMs(s, 20 * MIN + 1000)).toBe(5 * MIN - 1000)
  })

  it('waits for Start work after an exercise ends', () => {
    const s = run([
      ['startWork', 0],
      ['tick', 20 * MIN],
      ['tick', 25 * MIN]
    ])
    expect(s.phase).toBe('ready')
    expect(s.index).toBe(1)
    expect(s.boundary).toEqual({ kind: 'exercise-end', seq: 2 })
    expect(run([['tick', 99 * MIN]], s).phase).toBe('ready')
  })

  it('asks to start over after the last exercise', () => {
    let s = run([
      ['startWork', 0],
      ['skip', 1],
      ['skip', 2],
      ['startWork', 3],
      ['tick', 3 + 20 * MIN],
      ['tick', 3 + 23 * MIN]
    ])
    expect(s.phase).toBe('finished')
    expect(s.boundary?.kind).toBe('exercise-end')
    s = run([['startOver', 100]], s)
    expect(s.phase).toBe('work')
    expect(s.index).toBe(0)
  })

  it('ends the session when the user declines to start over', () => {
    const s = run([
      ['startWork', 0],
      ['skip', 1],
      ['skip', 2],
      ['startWork', 3],
      ['skip', 4],
      ['skip', 5],
      ['end', 6]
    ])
    expect(s.phase).toBe('idle')
    expect(s.index).toBe(0)
    expect(s.paused).toBe(false)
  })

  it('pause freezes the countdown and resume continues from the same point', () => {
    const s = run([
      ['startWork', 0],
      ['pause', 5 * MIN],
      ['tick', 50 * MIN]
    ])
    expect(s.phase).toBe('work')
    expect(s.paused).toBe(true)
    expect(remainingMs(s, 50 * MIN)).toBe(15 * MIN)
    const r = run([['resume', 50 * MIN]], s)
    expect(remainingMs(r, 51 * MIN)).toBe(14 * MIN)
    expect(run([['tick', 65 * MIN]], r).phase).toBe('exercise')
  })

  it('skip moves on without a boundary sound', () => {
    const work = run([
      ['startWork', 0],
      ['skip', 1000]
    ])
    expect(work.phase).toBe('exercise')
    expect(work.boundary).toBeNull()
    expect(remainingMs(work, 1000)).toBe(5 * MIN)

    const ex = run([['skip', 2000]], work)
    expect(ex.phase).toBe('ready')
    expect(ex.index).toBe(1)
    expect(ex.boundary).toBeNull()
  })

  it('skip while paused starts the next period running', () => {
    const s = run([
      ['startWork', 0],
      ['pause', 1000],
      ['skip', 2000]
    ])
    expect(s.phase).toBe('exercise')
    expect(s.paused).toBe(false)
  })

  it('picks up edits to the sequence at the next period', () => {
    const s = run([['startWork', 0]])
    const edited: SessionConfig = { workMinutes: 10, steps: [{ name: 'Squats', minutes: 1 }] }
    const next = reduce(s, { type: 'tick', now: 20 * MIN }, edited)
    expect(next.phase).toBe('exercise')
    expect(next.stepName).toBe('Squats')
    expect(remainingMs(next, 20 * MIN)).toBe(1 * MIN)
  })

  it('clamps the position when the sequence shrinks', () => {
    const s = run([
      ['startWork', 0],
      ['skip', 1],
      ['skip', 2]
    ])
    expect(s.index).toBe(1)
    const shorter: SessionConfig = { workMinutes: 20, steps: [{ name: 'Squats', minutes: 1 }] }
    const next = reduce(s, { type: 'startWork', now: 3 }, shorter)
    expect(next.index).toBe(0)
  })

  it('cannot start with an empty sequence', () => {
    const s = reduce(initialSession, { type: 'startWork', now: 0 }, { workMinutes: 20, steps: [] })
    expect(s.phase).toBe('idle')
  })
})
