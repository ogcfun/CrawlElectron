import { io, Socket } from 'socket.io-client'

/**
 * SocketService 类提供了连接、断开连接和与 Socket.IO 服务器通信的功能。
 */
class SocketService {
  private socket: Socket | null

  constructor() {
    this.socket = null
  }

  /**
   * 连接到指定的 Socket.IO 服务器。
   * @param url 要连接的 Socket.IO 服务器的 URL。
   * @returns 当连接建立时解析的 Promise，或者在出现错误时拒绝。
   */
  connect(url: string): Promise<void> {
    this.socket = io(url)
    return new Promise<void>((resolve, reject) => {
      this.socket!.on('connect', () => {
        resolve()
      })
      this.socket!.on('connect_error', (error) => {
        reject(error)
      })
    })
  }

  /**
   * 从 Socket.IO 服务器断开连接。
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  /**
   * 注册用于处理特定事件的回调函数。
   * @param eventName 要监听的事件的名称。
   * @param callback 当事件发生时要调用的回调函数。
   */
  on(eventName: string, callback: (...args) => void): void {
    if (this.socket) {
      this.socket.on(eventName, callback)
    }
  }

  /**
   * 取消注册特定事件的回调函数。
   * @param eventName 要停止监听的事件的名称。
   * @param callback 要移除的回调函数。
   */
  off(eventName: string, callback: (...args) => void): void {
    if (this.socket) {
      this.socket.off(eventName, callback)
    }
  }

  /**
   * 向 Socket.IO 服务器发出带有数据的指定事件。
   * @param eventName 要发出的事件的名称。
   * @param data 要与事件一起发送的数据。
   */
  emit(eventName: string, data): void {
    if (this.socket) {
      this.socket.emit(eventName, data)
    }
  }
}

export default new SocketService()
