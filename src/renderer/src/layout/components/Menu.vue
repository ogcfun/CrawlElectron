<template>
  <div>
    <el-menu
      router
      default-active="/home"
      class="el-menu-vertical-demo"
      :collapse="false"
      @open="handleOpen"
      @close="handleClose"
    >
      <h3>爬虫</h3>

      <el-menu-item index="/home" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><House /></el-icon>
          <span>首 页</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/ranking" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><TrophyBase /></el-icon>
          <span>排 行</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/search" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><Search /></el-icon>
          <span>搜 索</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/find" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><Promotion /></el-icon>
          <span>发 现</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/log" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><Document /></el-icon>
          <span>日 志</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/setting" :disabled="useMenu.show">
        <div class="menu-item">
          <el-icon :size="40"><Setting /></el-icon>
          <span>设 置</span>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { House, TrophyBase, Search, Promotion, Document, Setting } from '@element-plus/icons-vue'
import useMenuStore from '../../store/modules/menu'
const useMenu = useMenuStore()

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 76px;
  min-height: 400px;
}

.el-menu {
  height: calc(100vh - 35px);
  white-space: nowrap;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;

  h3 {
    color: #333;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .el-menu-item {
    height: 80px;
    text-align: center;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .el-icon {
        margin: 0 auto;
      }

      span {
        height: 24px; /* 调整菜单项的高度 */
        line-height: 24px; /* 垂直居中 */
      }
    }
  }
}
</style>
