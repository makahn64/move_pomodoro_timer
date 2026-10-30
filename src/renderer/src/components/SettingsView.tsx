import type { AppData, Settings, Theme } from '../../../shared/types'
import { NumberField } from './NumberField'

interface Props {
  data: AppData
  update: (fn: (d: AppData) => AppData) => void
}

const THEMES: { id: Theme; label: string }[] = [
  { id: 'system', label: 'Match system' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
]

export function SettingsView({ data, update }: Props): React.JSX.Element {
  const s = data.settings
  const set = (patch: Partial<Settings>): void =>
    update((d) => ({ ...d, settings: { ...d.settings, ...patch } }))

  return (
    <section className="settings">
      <h2>Settings</h2>

      <div className="setting">
        <label htmlFor="work-min">
          <span className="setting-name">Work length</span>
          <span className="setting-help">Every work period runs this long.</span>
        </label>
        <span className="min-field">
          <NumberField
            id="work-min"
            className="input input-num input-lg"
            value={s.workMinutes}
            min={1}
            max={180}
            onCommit={(workMinutes) => set({ workMinutes })}
          />
          <span className="unit">min</span>
        </span>
      </div>

      <div className="setting">
        <label htmlFor="ex-min">
          <span className="setting-name">Default exercise length</span>
          <span className="setting-help">
            New exercises start with this length. You can change each one in Setup.
          </span>
        </label>
        <span className="min-field">
          <NumberField
            id="ex-min"
            className="input input-num input-lg"
            value={s.defaultExerciseMinutes}
            min={1}
            max={120}
            onCommit={(defaultExerciseMinutes) => set({ defaultExerciseMinutes })}
          />
          <span className="unit">min</span>
        </span>
      </div>

      <div className="setting" role="radiogroup" aria-labelledby="theme-label">
        <span id="theme-label">
          <span className="setting-name">Appearance</span>
          <span className="setting-help">Light, dark, or follow your computer.</span>
        </span>
        <span className="segmented">
          {THEMES.map((t) => (
            <button
              key={t.id}
              role="radio"
              aria-checked={s.theme === t.id}
              className="segment"
              onClick={() => {
                window.api.setTheme(t.id)
                set({ theme: t.id })
              }}
            >
              {t.label}
            </button>
          ))}
        </span>
      </div>

      <p className="settings-foot">
        Changes save automatically. A session already running picks them up at its next period.
      </p>
    </section>
  )
}
