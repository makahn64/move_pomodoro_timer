import type { MoveApi } from '../shared/types'

declare global {
  interface Window {
    api: MoveApi
  }
}
