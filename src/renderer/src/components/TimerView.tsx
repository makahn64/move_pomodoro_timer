import { Pause, Play, SkipForward, RotateCcw } from 'lucide-react'
import type { SessionControls } from '../App'
import { remainingMs } from '../session'
import { clock, minutes } from '../format'
import { CourtRing } from './CourtRing'

interface Props extends SessionControls {
  onOpenSetup: () => void
}

export function TimerView({
  session,
  now,
  config,
  dispatch,
  onOpenSetup
}: Props): React.JSX.Element {
  const { phase, index, paused } = session
  const steps = config.steps
  const step = steps[Math.min(index, steps.length - 1)]
  const left = remainingMs(session, now)
  const fraction = session.durationMs ? left / session.durationMs : 1
  const position = steps.length ? `${index + 1} of ${steps.length}` : ''

  let label: string
  let big: string
  let name = ''
  let next: React.ReactNode = ''
  switch (phase) {
    case 'idle':
      label = 'Ready'
      big = clock(config.workMinutes * 60_000)
      next = step ? nextUp(`${step.name} · ${minutes(step.minutes)}`) : ''
      break
    case 'work':
      label = 'Work'
      big = clock(left)
      next = step ? nextUp(`${step.name} · ${minutes(step.minutes)}`) : ''
      break
    case 'exercise':
      label = 'Exercise'
      big = clock(left)
      name = session.stepName
      next =
        index < steps.length - 1
          ? `Then work ${minutes(config.workMinutes)}, then ${steps[index + 1].name}`
          : 'Last exercise in the sequence'
      break
    case 'ready':
      label = 'Up next'
      big = clock(config.workMinutes * 60_000)
      next = step ? nextUp(`${step.name} · ${minutes(step.minutes)}`) : ''
      break
    case 'finished':
      label = 'Sequence done'
      big = clock(0)
      break
  }

  const empty = steps.length === 0
  const showRing = phase === 'work' || phase === 'exercise'
  // After an exercise the ring stays painted in its colour until you start work.
  const lit = phase === 'ready'

  return (
    <section className="timer" aria-live="polite">
      <div className="timer-meta">
        <span className="pill" data-phase={phase}>
          {label}
        </span>
        {position && phase !== 'finished' && <span className="position">Step {position}</span>}
      </div>

      <CourtRing fraction={showRing ? fraction : 1} active={showRing || lit} paused={paused}>
        <span className="ring-time" data-paused={paused || undefined}>
          {big}
        </span>
        {paused && <span className="ring-note">Paused</span>}
        {phase === 'ready' && <span className="ring-note">of work</span>}
      </CourtRing>

      <div className="timer-copy">
        {name && <h1 className="exercise-name">{name}</h1>}
        {phase === 'finished' && (
          <h1 className="exercise-name">Start over from the first exercise?</h1>
        )}
        {phase === 'ready' && (
          <h1 className="exercise-name">{steps[index - 1]?.name ?? 'Exercise'} done</h1>
        )}
        {next && <p className="next">{next}</p>}
        {empty && phase === 'idle' && (
          <p className="next">
            Your sequence is empty.{' '}
            <button className="link" onClick={onOpenSetup}>
              Add exercises in Setup
            </button>
          </p>
        )}
      </div>

      <div className="controls">
        {(phase === 'idle' || phase === 'ready') && (
          <button
            className="btn btn-primary btn-big"
            data-tone="work"
            disabled={empty}
            onClick={() => dispatch('startWork')}
          >
            <Play size={20} strokeWidth={2.5} aria-hidden /> Start work
          </button>
        )}
        {phase === 'finished' && (
          <>
            <button
              className="btn btn-primary btn-big"
              data-tone="work"
              onClick={() => dispatch('startOver')}
            >
              <RotateCcw size={20} strokeWidth={2.5} aria-hidden /> Start over
            </button>
            <button className="btn btn-line btn-big" onClick={() => dispatch('end')}>
              Done for now
            </button>
          </>
        )}
        {(phase === 'work' || phase === 'exercise') && (
          <>
            <button
              className="btn btn-line btn-big"
              onClick={() => dispatch(paused ? 'resume' : 'pause')}
            >
              {paused ? (
                <Play size={20} strokeWidth={2.5} aria-hidden />
              ) : (
                <Pause size={20} strokeWidth={2.5} aria-hidden />
              )}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button className="btn btn-line btn-big" onClick={() => dispatch('skip')}>
              <SkipForward size={20} strokeWidth={2.5} aria-hidden />
              {phase === 'work' ? 'Skip to exercise' : 'Skip exercise'}
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function nextUp(text: string): React.JSX.Element {
  return (
    <>
      <strong>Next Up:</strong> {text}
    </>
  )
}
