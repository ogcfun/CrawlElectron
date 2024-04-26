import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const Layout = () => import('@renderer/layout/index.vue')

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@renderer/views/home/index.vue'),
        name: 'Home'
      },
      {
        path: '/ranking',
        component: () => import('@renderer/views/ranking/index.vue'),
        name: 'Ranking'
      },
      {
        path: '/search',
        component: () => import('@renderer/views/search/index.vue'),
        name: 'Search'
      },
      {
        path: '/find',
        component: () => import('@renderer/views/find/index.vue'),
        name: 'Find'
      },
      {
        path: '/log',
        component: () => import('@renderer/views/log/index.vue'),
        name: 'Log'
      },
      {
        path: '/setting',
        component: () => import('@renderer/views/setting/index.vue'),
        name: 'Setting'
      }
    ]
  }
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory('/'),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
