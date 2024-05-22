import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { fork, ChildProcess } from 'child_process'
import { join } from 'path'
import * as os from 'os'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { handleExecutablePath, handleFilePath, openFolderAndSelectFile } from './utils/index'

import { getRanking, getSearch, getLog, deleteLogLine } from './api/index'

let mainWindow: BrowserWindow | null
let nestProcess: ChildProcess | null
const scriptPath = join(__dirname, '../../node_process/main.js') // 子程序路径
let restartAttempts = 0 // 重启尝试次数
const maxRestartAttempts = 5 //最大重启尝试次数
const restartDelay = 1000 // 1秒钟延迟

function createWindow(): void {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({
    // 窗口的初始宽度为 1200 像素
    width: 1440,
    // 窗口的初始高度为 720 像素
    height: 900,
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
    mainWindow?.show()
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
  // 发送windows用户名称
  ipcMain.handle('get-username', () => {
    const userInfo = os.userInfo()
    return userInfo.username
  })
  ipcMain.handle('dialog:openExecutablePath', handleExecutablePath) // 选择浏览器路径弹窗
  ipcMain.handle('dialog:openFilePath', handleFilePath) // 选择图片保存路径弹窗
  ipcMain.handle('open-folder-path', (event, filePath: string) => {
    try {
      openFolderAndSelectFile(filePath)
      return ''
    } catch (error) {
      return { error: '打开文件失败' }
    }
  })

  // 监听从渲染进程发送的invoke-get-ranking消息
  ipcMain.handle('invoke-get-ranking', async (event, rankingData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // 调用 getRanking 函数，并将 rankingData 作为参数传递
      return await getRanking(rankingData)
    } catch (error) {
      // 如果发生错误，将错误信息返回给渲染进程
      return { error: error }
    }
  })

  // 监听从渲染进程发送的invoke-get-search消息
  ipcMain.handle('invoke-get-search', async (event, searchData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // 调用 getSearch 函数，并将 searchData 作为参数传递
      return await getSearch(searchData)
    } catch (error) {
      // 如果发生错误，将错误信息返回给渲染进程
      return { error: error }
    }
  })

  // 监听从渲染进程发送的invoke-get-log消息
  ipcMain.handle('invoke-get-log', async (event, logData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // 调用 getLog 函数，并将 logData 作为参数传递
      return await getLog(logData)
    } catch (error) {
      // 如果发生错误，将错误信息返回给渲染进程
      return { error: error }
    }
  })

  // 监听从渲染进程发送的invoke-delete-search消息
  ipcMain.handle('invoke-delete-log', async (event, deletelogData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // 调用 deleteLogLine 函数，并将 deletelogData 作为参数传递
      return await deleteLogLine(deletelogData)
    } catch (error) {
      // 如果发生错误，将错误信息返回给渲染进程
      return { error: error }
    }
  })

  // 创建主窗口
  createWindow()

  // 在 macOS 上，当点击停靠图标并且没有其他窗口打开时，通常会重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 初次启动子进程
  startNestProcess()
})

// 当所有窗口关闭时退出（macOS 除外）。
// 应用程序及其菜单栏保持活动状态直到用户退出
// 显式使用 Cmd + Q。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // 窗口关闭时退出子程序
    if (nestProcess) {
      nestProcess.kill()
    }
    app.quit()
  }
})

/**
 * 启动子程序
 */
function startNestProcess() {
  nestProcess = fork(scriptPath)

  // 监听子进程消息
  nestProcess.on('spawn', () => {
    console.log('NestJs 子进程运行成功！！！')
    restartAttempts = 0 // 重置重启计数器
  })

  // 监听子进程错误
  nestProcess.on('error', (err: Error) => {
    console.error('子进程错误:', err)
    // 子进程错误时重启
    restartNestProcess()
  })

  /**
   * 监听子进程退出
   * @code 已成功退出，代码为 0，其他代码都是错误退出
   * @signal 优雅的退出
   */
  nestProcess.on('exit', (code: number | null, signal: string | null) => {
    console.log(`NestJs 子程序进程已退出，代码为 ${code}，信号为 ${signal}`)
  })
}

/**
 * 子程序报错时重启
 */
function restartNestProcess() {
  if (restartAttempts < maxRestartAttempts) {
    restartAttempts += 1
    console.log(`尝试重启子进程 (${restartAttempts}/${maxRestartAttempts})...`)
    setTimeout(() => {
      startNestProcess()
    }, restartDelay)
  } else {
    console.error('达到最大重启次数，停止重启子进程。')
    app.quit() // 达到最大重启次数时退出应用程序
  }
}
