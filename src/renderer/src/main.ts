import { createApp } from 'vue'

import App from './App.vue'

// 引入vue-router
import router from './router'

// 引入pinia
import store from './store'

// 清除默认样式
import './styles/base.scss'

import SocketService from './utils/webSocket'

const app = createApp(App)

app.use(router)
app.use(store)
// 注册 SocketService 实例
app.config.globalProperties.$socketService = SocketService
app.mount('#app')
