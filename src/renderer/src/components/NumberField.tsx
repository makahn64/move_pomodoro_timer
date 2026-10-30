import { useState } from 'react'

interface Props {
  value: number
  min: number
  max: number
  onCommit: (value: number) => void
  className?: string
  id?: string
  'aria-label'?: string
}

/** A whole-number input that lets you type freely and only saves a valid value on blur or Enter. */
export function NumberField({ value, min, max, onCommit, ...rest }: Props): React.JSX.Element {
  const [draft, setDraft] = useState(String(value))
  // Show the new value when it changes from outside this field.
  const [shown, setShown] = useState(value)
  if (shown !== value) {
    setShown(value)
    setDraft(String(value))
  }

  const commit = (): void => {
    const n = Math.round(Number(draft))
    if (!draft.trim() || Number.isNaN(n)) {
      setDraft(String(value))
      return
    }
    const clamped = Math.min(max, Math.max(min, n))
    setDraft(String(clamped))
    if (clamped !== value) onCommit(clamped)
  }

  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={1}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
    />
  )
}
