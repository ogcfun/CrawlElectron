import axios from 'axios'
import qs from 'qs' // 引入 qs 库

interface RankingType {
  imagePath: string | null
  executablePath: string | null
  headless: string | null
  pixiv_username: string | null
  pixiv_password: string | null
  rankingType: string | null
  pageStart: string | null
  pageEnd: string | null
  useProxy: string | null
  port: string | null
}

interface SearchType {
  imagePath: string | null
  executablePath: string | null
  headless: string | null
  pixiv_username: string | null
  pixiv_password: string | null
  searchUser: string | null
  pageStart: string | null
  pageEnd: string | null
  useProxy: string | null
  port: string | null
}

interface LogType {
  path: string
  page: string
  pageSize: string
}

interface DeleteLogType {
  imagePath: string
  filePath: string
  jsonObject: {
    type: string
    number: string
    imageName: string
    destination: string
    imageURL: string
    author: string
    title: string
    DownloadTime: string
  }
}

/**
 * 请求排行榜信息
 * @param rankingData
 * @returns
 */
export const getRanking = (rankingData: RankingType): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 发送POST请求
    axios
      .post(
        'http://localhost:8787/ranking',
        // 将数据序列化为 x-www-form-urlencoded 格式
        qs.stringify(rankingData),
        // 设置请求头为 x-www-form-urlencoded
        {
          timeout: 3600000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then((response) => {
        // 从响应中获取数据
        const responseData = response.data
        resolve(responseData)
      })
      .catch((error) => {
        // 处理请求错误
        if (error.response && error.response.data) {
          const { message } = error.response.data
          reject(message) // 返回错误消息给调用方
        } else {
          reject(error.message) // 如果没有响应数据，则返回错误消息
        }
      })
  })
}

/**
 * 请求搜索信息
 * @param searchData
 * @returns
 */
export const getSearch = (searchData: SearchType): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 发送POST请求
    axios
      .post(
        'http://localhost:8787/search',
        // 将数据序列化为 x-www-form-urlencoded 格式
        qs.stringify(searchData),
        // 设置请求头为 x-www-form-urlencoded
        {
          timeout: 3600000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then((response) => {
        // 从响应中获取数据
        const responseData = response.data
        resolve(responseData)
      })
      .catch((error) => {
        // 处理请求错误
        if (error.response && error.response.data) {
          const { message } = error.response.data
          reject(message) // 返回错误消息给调用方
        } else {
          reject(error.message) // 如果没有响应数据，则返回错误消息
        }
      })
  })
}

/**
 * 请求下载记录信息
 * @param logData
 * @returns
 */
export const getLog = (logData: LogType): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 发送POST请求
    axios
      .get('http://localhost:8787/file/read', {
        params: logData, // 将 logData 作为查询参数传递
        timeout: 600000
      })
      .then((response) => {
        // 从响应中获取数据
        const responseData = response.data
        resolve(responseData)
      })
      .catch((error) => {
        // 处理请求错误
        if (error.response && error.response.data) {
          const { message } = error.response.data
          reject(message) // 返回错误消息给调用方
        } else {
          reject(error.message) // 如果没有响应数据，则返回错误消息
        }
      })
  })
}

/**
 * 删除记录信息的其中一行
 * @param logData
 * @returns
 */
export const deleteLogLine = (deletelogData: DeleteLogType): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 发送POST请求
    axios
      .delete(
        'http://localhost:8787/file/delete',
        // 设置请求头为 x-www-form-urlencoded
        {
          data: deletelogData, // 将 logData 作为查询参数传递
          timeout: 600000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((response) => {
        // 从响应中获取数据
        const responseData = response.data
        resolve(responseData)
      })
      .catch((error) => {
        // 处理请求错误
        if (error.response && error.response.data) {
          const { message } = error.response.data
          reject(message) // 返回错误消息给调用方
        } else {
          reject(error.message) // 如果没有响应数据，则返回错误消息
        }
      })
  })
}
