<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

// 连接到 Socket.IO 服务器
if (instance) {
  const socketService = instance.appContext.config.globalProperties.$socketService

  const connectToServer = () => {
    socketService
      .connect('http://localhost:9002')
      .then(() => {
        console.log('连接到 Socket.IO 服务器')
        socketService.emit('nest-scoket', { userId: 'electron-scoket' })
      })
      .catch((error) => {
        console.error('无法连接到 Socket.IO 服务器：', error)
        // 连接失败后进行重连
        setTimeout(connectToServer, 3000) // 3秒后重新连接
      })
  }

  // 初始化连接
  connectToServer()

  // 监听连接断开事件，实现断线重连
  socketService.on('disconnect', () => {
    console.log('连接断开，正在尝试重新连接...')
    // 连接断开后进行重连
    setTimeout(connectToServer, 3000) // 3秒后重新连接
  })

  // 监听登录信息
  socketService.on('electron-scoket', (data) => {
    console.log(data)
  })
}
</script>

<template>
  <router-view />
</template>

<style scoped></style>
