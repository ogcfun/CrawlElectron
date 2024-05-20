import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {}

// 使用 `contextBridge` API 将 Electron API 暴露给
// 仅当启用上下文隔离时才渲染器，否则
// 只需添加到 DOM 全局即可。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('getUsername', {
      getUsernameInfo: () => ipcRenderer.invoke('get-username')
    })
    contextBridge.exposeInMainWorld('executablePath', {
      openExecutablePath: () => ipcRenderer.invoke('dialog:openExecutablePath')
    })
    contextBridge.exposeInMainWorld('filePath', {
      openFilePath: () => ipcRenderer.invoke('dialog:openFilePath')
    })
    contextBridge.exposeInMainWorld('openFolder', {
      openFolderPath: (filePath: string) => ipcRenderer.invoke('open-folder-path', filePath)
    })
    contextBridge.exposeInMainWorld('getRanking', {
      getRankingInfo: (rankingData) => ipcRenderer.invoke('invoke-get-ranking', rankingData)
    })
    contextBridge.exposeInMainWorld('getSearch', {
      getSearchInfo: (searchData) => ipcRenderer.invoke('invoke-get-search', searchData)
    })
    contextBridge.exposeInMainWorld('getLog', {
      getLogInfo: (logData) => ipcRenderer.invoke('invoke-get-log', logData)
    })
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
