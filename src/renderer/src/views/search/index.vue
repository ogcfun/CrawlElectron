<template>
  <div class="search">

    <el-button class="search-icon" :disabled="crawlStart" @click="openForm">
      <el-icon v-if="!crawlStart" color="#409efc" class="no-inherit" :size="20">
        <Search />
      </el-icon>
      <el-icon v-else class="is-loading">
        <Loading />
      </el-icon>
    </el-button>

    <el-dialog v-model="dialogFormVisible" width="500">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm"
        label-position="top" :size="formSize" status-icon>
        <el-form-item label="作者名称" prop="searchUser" :label-width="140">
          <el-input v-model="ruleForm.searchUser" />
        </el-form-item>
        <el-form-item label="开始页数" prop="pageStart" :label-width="140">
          <el-input v-model="ruleForm.pageStart" autocomplete="off" />
        </el-form-item>
        <el-form-item label="结束页数" prop="pageEnd" :label-width="140">
          <el-input v-model="ruleForm.pageEnd" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            爬取
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="table-search">
      <el-table ref="tableRef" :data="tableData" height="calc(70vh - 35px)" style="width: 96%">
        <el-table-column prop="number" label="作品序号" width="100" />
        <el-table-column prop="title" label="作品标题" />
        <el-table-column prop="imageName" label="作品名称" />
        <el-table-column prop="author" label="作者名称" width="160" />
        <el-table-column prop="DownloadTime" label="下载时间" width="180" />
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-button link type="primary" @click.prevent="openRow(scope.row.destination)">
              打开
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="log">
      <div class="log-box" ref="logContainer">
        <div class="message" v-for="(item, index) in logMessages" :key="index" :class="{
      'bg-success': item.state === 'success',
      'bg-error': item.state === 'error',
      'bg-warning': item.state === 'warning'
    }">
          {{ item.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { Search, Loading } from '@element-plus/icons-vue'
import useMenuStore from '../../store/modules/menu'
const useMenu = useMenuStore()
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()

interface RuleForm {
  searchUser: string
  pageStart: string
  pageEnd: string
}

const dialogFormVisible = ref(false)
const ruleForm = reactive<RuleForm>({
  searchUser: '',
  pageStart: '',
  pageEnd: ''
})
const rules = reactive<FormRules<RuleForm>>({
  searchUser: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
  pageStart: [{ required: true, message: '请输入开始爬取页数', trigger: 'blur' }],
  pageEnd: [{ required: true, message: '请输入结束爬取页数', trigger: 'blur' }]
})
const ruleFormRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('default')
const tableData: any = reactive([])
const tableRef = ref(null)
const logMessages: any = reactive([]) // 创建一个响应式数组来保存所有的日志信息
const crawlStart = ref(false)
const logContainer = ref(null)

/**
 * 打开表单
 */
const openForm = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}

/**
 * 停止监听
 */
const stopListening = () => {
  if (instance) {
    const socketService = instance.appContext.config.globalProperties.$socketService
    socketService.off('search-download-message');
    socketService.off('search-log-message');
  }
};

/**
 * 开始爬取图片
 * @param formEl
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const searchData = {
        imagePath: localStorage.getItem('imagePath'),
        executablePath: localStorage.getItem('executablePath'),
        headless: localStorage.getItem('headless'),
        pixiv_username: localStorage.getItem('pixiv_username'),
        pixiv_password: localStorage.getItem('pixiv_password'),
        useProxy: localStorage.getItem('useProxy'),
        port: localStorage.getItem('port'),
        searchUser: ruleForm.searchUser,
        pageStart: ruleForm.pageStart,
        pageEnd: ruleForm.pageEnd
      }

      // 设置爬取按钮动画
      crawlStart.value = true
      // 设置菜单是否能点击
      useMenu.onShowBool()
      // 关闭弹窗表单
      openForm()

      // 启动监听Socket
      if (instance) {
        const socketService = instance.appContext.config.globalProperties.$socketService
        // 监听下载Json信息
        socketService.on('search-download-message', (data) => {
          // console.log('下载图片信息:', data)
          tableData.push(data)
          // 监听表单数据，滚动到表单底部
          nextTick(() => {
            if (tableRef.value) {
              const tableBodyWrapper = tableRef.value.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
              tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight
            }
          })
        })

        // 监听下载日志信息
        socketService.on('search-log-message', (data) => {
          // console.log('下载日志信息:', data)
          // 将收到的日志信息添加到logMessages数组中
          logMessages.push(data)
          // 监听数据，滚动到底部
          nextTick(() => {
            if (logContainer.value) {
              logContainer.value.scrollTop = logContainer.value.scrollHeight
            }
          })
        })
      }

      // 发送IPC消息到主进程
      const result = await window.getSearch.getSearchInfo(searchData)
      if (result.error) {
        ElMessage({
          message: result.error,
          type: 'warning',
          grouping: true,
          plain: true,
          offset: 48
        })
        stopListening()
        useMenu.offShowBool()
        crawlStart.value = false
      } else {
        ElMessage({
          message: result,
          type: 'success',
          grouping: true,
          plain: true,
          offset: 48
        })
      }
      stopListening()
      useMenu.offShowBool()
      crawlStart.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 打开对应路径文件夹中的图片
 * @param e
 */
const openRow = (e: string) => {
  console.log('e :>> ', e)
  const result = window.openFolder.openFolderPath(e)
  if (result.error) {
    ElMessage({
      message: result.error,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  }
}
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: calc(100vh - 35px);
  position: relative;

  .search-icon {
    width: 50px;
    height: 50px;
    background-color: #9191916e;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 50px;
    right: 50px;
  }

  .el-table {
    height: calc(70vh - 35px);
    margin: 0 auto;
  }

  .log {
    width: 100%;
    height: 28vh;

    .log-box {
      height: 28vh;
      margin: 10px 24px;
      overflow-y: auto;

      /* 自定义滚动条 */
      &::-webkit-scrollbar {
        width: 8px;
        /* 设置滚动条宽度 */
      }

      /* 滚动条轨道 */
      &::-webkit-scrollbar-track {
        background-color: #78f59d;
        /* 设置滚动条轨道背景色 */
        border-radius: 4px;
        /* 设置滚动条轨道的圆角 */
      }

      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        background-color: #ff9b9b;
        /* 设置滚动条滑块颜色 */
        border-radius: 4px;
        /* 设置滚动条滑块的圆角 */
      }

      /* 滚动条滑块悬停时的样式 */
      &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
        /* 设置滚动条滑块悬停时的颜色 */
      }

      .bg-success {
        background-color: rgb(84, 226, 129);
      }

      .bg-error {
        background-color: rgb(252, 109, 109);
      }

      .bg-warning {
        background-color: rgb(255, 190, 51);
      }

      .message {
        padding: 10px;
        margin: 5px;
        border-radius: 4px;
        color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
