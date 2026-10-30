export type Theme = 'system' | 'light' | 'dark'
export type WindowMode = 'full' | 'mini'

export interface Exercise {
  id: string
  name: string
  minutes: number
}

export interface SequenceEntry {
  /** Unique per entry, so repeats of one exercise can be told apart when reordering. */
  key: string
  exerciseId: string
}

export interface Settings {
  workMinutes: number
  defaultExerciseMinutes: number
  theme: Theme
}

export interface AppData {
  version: 1
  exercises: Exercise[]
  /** The order exercises run in. The same exercise may appear more than once. */
  sequence: SequenceEntry[]
  settings: Settings
  windowMode: WindowMode
}

export const DEFAULT_DATA: AppData = {
  version: 1,
  exercises: [
    { id: 'cat-cow', name: 'Cat Cow Stretch', minutes: 5 },
    { id: 'childs-pose', name: "Child's Pose", minutes: 3 },
    { id: 'squats', name: 'Bodyweight Squats', minutes: 2 },
    { id: 'wall-push-ups', name: 'Wall Push-ups', minutes: 2 },
    { id: 'neck-rolls', name: 'Neck Rolls', minutes: 2 },
    { id: 'forward-fold', name: 'Standing Forward Fold', minutes: 3 }
  ],
  sequence: ['cat-cow', 'squats', 'childs-pose', 'wall-push-ups'].map((exerciseId, i) => ({
    key: `s${i}`,
    exerciseId
  })),
  settings: { workMinutes: 25, defaultExerciseMinutes: 5, theme: 'system' },
  windowMode: 'full'
}

/** What the preload script exposes to the renderer as `window.api`. */
export interface MoveApi {
  loadData(): Promise<AppData>
  saveData(data: AppData): Promise<void>
  setTheme(theme: Theme): void
  setWindowMode(mode: WindowMode): void
  requestAttention(): void
}
