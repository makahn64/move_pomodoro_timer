import type { ReactNode } from 'react'

// The radial timer is drawn as a court's centre circle: a white boundary line,
// with the time left painted over it in the period's colour.
const SIZE = 400
const R = 172
const PAINT = 30
const CIRC = 2 * Math.PI * R

interface Props {
  fraction: number
  active: boolean
  paused: boolean
  children: ReactNode
}

export function CourtRing({ fraction, active, paused, children }: Props): React.JSX.Element {
  const f = Math.max(0, Math.min(1, fraction))
  return (
    <div className="court">
      <div className="court-halfline" aria-hidden />
      <div className="ring" role="timer">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
          <circle className="ring-floor" cx={SIZE / 2} cy={SIZE / 2} r={R + PAINT / 2 + 6} />
          <circle className="ring-line" cx={SIZE / 2} cy={SIZE / 2} r={R} />
          {active && (
            <circle
              className="ring-paint"
              data-paused={paused || undefined}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - f)}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}
          <circle
            className="ring-line ring-line-inner"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R - PAINT / 2 - 10}
          />
        </svg>
        <div className="ring-center">{children}</div>
      </div>
    </div>
  )
}
