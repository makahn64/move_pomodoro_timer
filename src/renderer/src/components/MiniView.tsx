import { Maximize2, Pause, Play, SkipForward, RotateCcw } from 'lucide-react'
import type { SessionControls } from '../App'
import { remainingMs } from '../session'
import { clock } from '../format'

interface Props extends SessionControls {
  tone: 'idle' | 'work' | 'exercise'
  onExpand: () => void
}

export function MiniView({
  session,
  now,
  config,
  dispatch,
  tone,
  onExpand
}: Props): React.JSX.Element {
  const { phase, index, paused } = session
  const step = config.steps[Math.min(index, config.steps.length - 1)]
  const left = remainingMs(session, now)
  const running = phase === 'work' || phase === 'exercise'
  const fraction =
    running && session.durationMs ? left / session.durationMs : phase === 'finished' ? 0 : 1
  const empty = config.steps.length === 0

  let label: string
  let detail: React.ReactNode = ''
  switch (phase) {
    case 'idle':
      label = 'Ready'
      detail = step?.name ? nextUp(step.name) : ''
      break
    case 'work':
      label = 'Work'
      detail = step ? nextUp(step.name) : ''
      break
    case 'exercise':
      label = 'Exercise'
      detail = session.stepName
      break
    case 'ready':
      label = 'Up next'
      detail = 'Work'
      break
    case 'finished':
      label = 'Done'
      detail = 'Start over?'
      break
  }

  const time = running
    ? clock(left)
    : phase === 'finished'
      ? ''
      : clock(config.workMinutes * 60_000)

  return (
    <div className="mini" data-tone={tone} data-phase={phase}>
      <div className="mini-row">
        <div className="mini-label">
          <span className="pill" data-phase={phase}>
            {label}
          </span>
          <span className="mini-detail">{detail}</span>
        </div>
        <span className="mini-time" data-paused={paused || undefined}>
          {time}
        </span>
      </div>

      <div
        className="lane"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fraction * 100)}
        aria-label="Time left"
      >
        <div
          className="lane-paint"
          style={{ transform: `scaleX(${running ? fraction : phase === 'ready' ? 1 : 0})` }}
          data-paused={paused || undefined}
        />
      </div>

      <div className="mini-row">
        <div className="mini-controls">
          {(phase === 'idle' || phase === 'ready') && (
            <button
              className="btn btn-primary btn-small"
              data-tone="work"
              disabled={empty}
              onClick={() => dispatch('startWork')}
            >
              <Play size={14} strokeWidth={2.75} aria-hidden /> Start work
            </button>
          )}
          {phase === 'finished' && (
            <>
              <button
                className="btn btn-primary btn-small"
                data-tone="work"
                onClick={() => dispatch('startOver')}
              >
                <RotateCcw size={14} strokeWidth={2.75} aria-hidden /> Start over
              </button>
              <button className="btn btn-line btn-small" onClick={() => dispatch('end')}>
                Done
              </button>
            </>
          )}
          {running && (
            <>
              <button
                className="btn btn-line btn-small"
                onClick={() => dispatch(paused ? 'resume' : 'pause')}
              >
                {paused ? (
                  <Play size={14} strokeWidth={2.75} aria-hidden />
                ) : (
                  <Pause size={14} strokeWidth={2.75} aria-hidden />
                )}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <button className="btn btn-line btn-small" onClick={() => dispatch('skip')}>
                <SkipForward size={14} strokeWidth={2.75} aria-hidden /> Skip
              </button>
            </>
          )}
        </div>
        <button className="icon-btn" onClick={onExpand} title="Switch to full window">
          <Maximize2 size={16} strokeWidth={2.25} aria-hidden />
          <span className="sr-only">Switch to full window</span>
        </button>
      </div>
    </div>
  )
}

function nextUp(name: string): React.JSX.Element {
  return (
    <>
      <strong>Next Up:</strong> {name}
    </>
  )
}
