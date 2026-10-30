import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { AppData, Theme, WindowMode } from '../shared/types'
import { loadData, saveData } from './store'

// Content sizes; the title bar is added on top so every OS gets the same usable area.
const SIZES: Record<
  WindowMode,
  { width: number; height: number; minWidth: number; minHeight: number }
> = {
  full: { width: 960, height: 692, minWidth: 760, minHeight: 572 },
  mini: { width: 400, height: 156, minWidth: 400, minHeight: 156 }
}

// Sounds must play when MOVE is behind other windows and the user never clicked it.
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

let data: AppData = loadData()
let mainWindow: BrowserWindow | null = null

function applyMode(win: BrowserWindow, mode: WindowMode): void {
  const size = SIZES[mode]
  const [outerW, outerH] = win.getSize()
  const [innerW, innerH] = win.getContentSize()
  const frameW = outerW - innerW
  const frameH = outerH - innerH
  win.setMinimumSize(size.minWidth + frameW, size.minHeight + frameH)
  win.setSize(size.width + frameW, size.height + frameH)
  win.setResizable(mode === 'full')
  win.setMaximizable(mode === 'full')
  win.setFullScreenable(mode === 'full')
}

function createWindow(): void {
  const mode = data.windowMode
  const size = SIZES[mode]
  const win = new BrowserWindow({
    width: size.width,
    height: size.height,
    useContentSize: true,
    title: 'MOVE',
    show: false,
    autoHideMenuBar: true,
    resizable: mode === 'full',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#10141c' : '#ccdbdc',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // The countdown and its sounds must keep running while the window is hidden.
      backgroundThrottling: false
    }
  })
  mainWindow = win
  applyMode(win, mode)

  win.on('ready-to-show', () => win.show())
  win.on('closed', () => {
    mainWindow = null
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function bringToFront(): void {
  const win = mainWindow
  if (!win) return
  if (win.isMinimized()) win.restore()
  if (!win.isVisible()) win.show()
  if (process.platform === 'darwin') app.focus({ steal: true })
  // Briefly pinning on top is the reliable way to come forward on Windows,
  // which otherwise only flashes the taskbar button.
  win.setAlwaysOnTop(true)
  win.focus()
  win.setAlwaysOnTop(false)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('app.move.timer')
  nativeTheme.themeSource = data.settings.theme

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('data:load', () => data)
  ipcMain.handle('data:save', async (_, next: AppData) => {
    data = next
    await saveData(next)
  })
  ipcMain.on('theme:set', (_, theme: Theme) => {
    nativeTheme.themeSource = theme
  })
  ipcMain.on('window:mode', (_, mode: WindowMode) => {
    if (mainWindow) applyMode(mainWindow, mode)
  })
  ipcMain.on('window:attention', () => bringToFront())

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
