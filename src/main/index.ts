import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { handleExecutablePath, handleFilePath} from './electronApi/index'

function createWindow(): void {
  // 创建浏览器窗口。
  const mainWindow = new BrowserWindow({
    // 窗口的初始宽度为 1200 像素
    width: 1200,
    // 窗口的初始高度为 720 像素
    height: 720,
    // 设置为 false，表示创建窗口后不立即显示
    show: false,
    // 自动隐藏菜单栏
    autoHideMenuBar: true,
    // 隐藏窗口标题栏
    titleBarStyle: 'hidden',
    // 定义标题栏覆盖层的样式
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',
      height: 35,
      symbolColor: 'rgb(78,78,78)'
    },
    // 如果操作系统是 Linux，则设置窗口图标
    ...(process.platform === 'linux' ? { icon } : {}),
    // 配置 Web 页面的属性
    webPreferences: {
      // 指定一个预加载脚本的路径，在渲染进程开始加载页面之前运行
      preload: join(__dirname, '../preload/index.js'),
      // 启用 Node.js 的集成，允许在渲染进程中直接使用 Node.js 的 API
      nodeIntegration: true,
      // 禁用上下文隔离，使得在渲染进程中可以直接访问 Electron 的 API，而不需要使用 IPC 进行通信
      contextIsolation: true,
      // 禁用沙箱，允许渲染进程访问本机资源
      sandbox: false
    }
  })

  // 等待窗口准备好显示后再显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 防止恶意网站弹出新窗口或重定向到其他网站
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 基于 Electron-vite cli 的渲染器 HMR。
  // 加载用于开发的远程 URL 或用于生产的本地 html 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 当 Electron 完成时将调用此方法
// 初始化并准备创建浏览器窗口。
// 某些API只有在该事件发生后才能使用。
// 当 Electron 应用准备好后执行
app.whenReady().then(() => {
  // 设置 Windows 的应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境中默认按 F12 打开或关闭开发者工具
  // 并在生产环境中忽略 CommandOrControl + R。
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC 通信
  ipcMain.handle('dialog:openExecutablePath', handleExecutablePath) // 选择浏览器路径弹窗
  ipcMain.handle('dialog:openFilePath', handleFilePath) // 选择图片保存路径弹窗

  // 创建主窗口
  createWindow()

  // 在 macOS 上，当点击停靠图标并且没有其他窗口打开时，通常会重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出（macOS 除外）。
// 应用程序及其菜单栏保持活动状态直到用户退出
// 显式使用 Cmd + Q。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
