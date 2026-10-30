import { app } from 'electron'
import { promises as fs, readFileSync } from 'fs'
import { join } from 'path'
import { AppData, DEFAULT_DATA } from '../shared/types'

const file = (): string => join(app.getPath('userData'), 'move-data.json')

// Read synchronously at startup so the window opens at the saved size.
export function loadData(): AppData {
  try {
    const parsed = JSON.parse(readFileSync(file(), 'utf8')) as Partial<AppData>
    return {
      ...DEFAULT_DATA,
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings }
    }
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

// Write to a temp file and rename, so a crash mid-write never leaves a half-written file.
export async function saveData(data: AppData): Promise<void> {
  const tmp = `${file()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, file())
}
