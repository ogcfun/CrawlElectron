import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const Layout = () => import('@renderer/layout/index.vue')

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/login',
  //   component: () => import('@renderer/views/home/index.vue'),
  //   name: 'Login'
  // },
  // {
  //   path: '/register',
  //   component: () => import('@renderer/views/Register.vue'),
  //   name: 'Register'
  // },
  // {
  //   path: "/404",
  //   component: () => import("@/views/error-page/404.vue"),
  //   name:"404"
  // },
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
