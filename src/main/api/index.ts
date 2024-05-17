import axios from 'axios'
import qs from 'qs' // 引入 qs 库

interface rankingType {
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

/**
 * 请求排行榜信息
 * @param rankingData
 * @returns
 */
export const getRanking = (rankingData: rankingType): Promise<string> => {
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
