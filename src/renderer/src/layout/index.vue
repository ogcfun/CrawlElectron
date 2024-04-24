<template>
  <div>
    <div class="root">
      <div class="custom-titlebar"></div>
    </div>
    <div class="common-layout">
      <el-container>
        <el-aside width="76px">
          <Menu />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue'

</script>

<style lang="scss" scoped>
html,
body {
  margin: 0;
  /* 禁止 html,body 滚动，避免滚动条出现在标题栏右边 */
  overflow: hidden;
  height: 100%;
}
.root {
  /* 使用 flex 来实现 */
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(125, 125, 125);
  color: white;
}
.custom-titlebar {
  display: flex;
  align-items: center;
  /* 避免被收缩 */
  flex-shrink: 0;
  /* 高度与 main.js 中 titleBarOverlay.height 一致  */
  height: 35px;
  width: 100%;
  /* 标题栏始终在最顶层（避免后续被 Modal 之类的覆盖） */
  z-index: 9999;
  background-color: #e8e8e8;
  color: white;
  padding-left: 12px;
  font-size: 14px;
  /* 避免选中窗口标题 */
  user-select: none;
  /* 设置该属性表明这是可拖拽区域，用来移动窗口 */
  -webkit-app-region: drag;
}
.content {
  /* 内容区需要设置可滚动 */
  overflow: auto;
}
</style>
