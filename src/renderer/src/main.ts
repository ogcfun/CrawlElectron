import { createApp } from 'vue'

import App from './App.vue'

// 引入vue-router
import router from './router'

// 引入pinia
import store from './store'

// 清除默认样式
import './styles/base.scss'

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
