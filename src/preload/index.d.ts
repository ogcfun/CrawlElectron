import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    getUsername: getUsernameInfo
    executablePath: openExecutablePath
    filePath: openFilePath
    openFolder: openFolderPath
    getRanking: getRankingInfo
    getSearch: getSearchInfo
    getLog: getLogInfo
    deleteLogLine: deleteLogLineInfo
  }
}
