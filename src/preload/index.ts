import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {}

// 使用 `contextBridge` API 将 Electron API 暴露给
// 仅当启用上下文隔离时才渲染器，否则只需添加到 DOM 全局即可。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    /***************************** 主程序操作 ******************************/

    // 打开浏览器链接
    contextBridge.exposeInMainWorld('openLink', {
      openExternal: (url) => shell.openExternal(url)
    })
    // 获取windows的用户名
    contextBridge.exposeInMainWorld('getUsername', {
      getUsernameInfo: () => ipcRenderer.invoke('get-username')
    })
    // 打开系统级通知弹窗
    contextBridge.exposeInMainWorld('notification', {
      showNotification: (title, body, timeoutType, icon) =>
        ipcRenderer.invoke('show-notification', { title, body, timeoutType, icon })
    })
    // 打开文件弹窗选择浏览器文件
    contextBridge.exposeInMainWorld('executablePath', {
      openExecutablePath: () => ipcRenderer.invoke('dialog:openExecutablePath')
    })
    // 打开文件弹窗选择图片保存文件夹
    contextBridge.exposeInMainWorld('filePath', {
      openFilePath: () => ipcRenderer.invoke('dialog:openFilePath')
    })
    // 根据图片路径打开文件夹并选中图片
    contextBridge.exposeInMainWorld('openFolder', {
      openFolderPath: (filePath: string) => ipcRenderer.invoke('open-folder-path', filePath)
    })

    /***************************** 网络请求 ******************************/

    // 获取排行榜图片
    contextBridge.exposeInMainWorld('getRanking', {
      getRankingInfo: (rankingData) => ipcRenderer.invoke('invoke-get-ranking', rankingData)
    })
    // 获取搜索图片
    contextBridge.exposeInMainWorld('getSearch', {
      getSearchInfo: (searchData) => ipcRenderer.invoke('invoke-get-search', searchData)
    })
    // 获取图片下载日志信息
    contextBridge.exposeInMainWorld('getLog', {
      getLogInfo: (logData) => ipcRenderer.invoke('invoke-get-log', logData)
    })
    // 删除图片日志信息
    contextBridge.exposeInMainWorld('deleteLogLine', {
      deleteLogLineInfo: (deletelogData) => ipcRenderer.invoke('invoke-delete-log', deletelogData)
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
