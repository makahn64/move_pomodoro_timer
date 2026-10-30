import { contextBridge, ipcRenderer } from 'electron'
import type { MoveApi } from '../shared/types'

const api: MoveApi = {
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  setTheme: (theme) => ipcRenderer.send('theme:set', theme),
  setWindowMode: (mode) => ipcRenderer.send('window:mode', mode),
  requestAttention: () => ipcRenderer.send('window:attention')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
