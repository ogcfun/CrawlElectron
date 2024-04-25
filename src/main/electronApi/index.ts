import { dialog } from 'electron'

/**
 * 选择浏览器地址
 * @returns 
 */
export async function handleExecutablePath(): Promise<string> {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    if (!canceled) {
      return filePaths[0]
    }
    throw new Error('取消操作')
  } catch (error) {
    console.error('Error while handling file open:', error)
    throw error
  }
}

/**
 * 选择图片保存地址
 * @returns 
 */
export async function handleFilePath(): Promise<string> {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (!canceled) {
      return filePaths[0]
    }
    throw new Error('取消操作')
  } catch (error) {
    console.error('Error while handling file open:', error)
    throw error
  }
}