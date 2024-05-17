import { defineStore } from 'pinia'
import piniaPersistConfig from '@renderer/utils/persist'

import { reactive, toRefs } from 'vue'

// 定义属性类
interface menuState {
  show: boolean
}

// 创建变量
const useMenuStore = defineStore(
  'menu',
  () => {
    const state = reactive<menuState>({
      show: false
    })

    // 创建方法

    function isShowBool() {
      // 改变test的值
      state.show = !state.show
    }

    // 导出
    return {
      ...toRefs(state),
      isShowBool
    }
  },
  {
    //   加入持久化
    persist: piniaPersistConfig('menu', [])
  }
)

// 对外暴露
export default useMenuStore
