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
    } else {
      return ''
    }
  } catch (error: any) {
    throw new Error(error.message)
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
    } else {
      return ''
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
