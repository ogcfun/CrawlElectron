import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    executablePath: openExecutablePath
    filePath: openFilePath
    openFolder: openFolderPath
    getRanking: getRankingInfo
    getSearch: getSearchInfo
  }
}
