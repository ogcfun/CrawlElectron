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
    contextBridge.exposeInMainWorld('electronAPI', {
      openFile: async () => {
        const { canceled, filePaths } = await ipcRenderer.invoke('dialog:openFile')
        if (!canceled) {
          return filePaths[0]
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
