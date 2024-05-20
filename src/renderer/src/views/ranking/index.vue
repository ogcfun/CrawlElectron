<template>
  <div class="ranking">
    <div class="from-ranking">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        label-position="top"
        :size="formSize"
        status-icon
      >
        <el-form-item label="排行榜分类" prop="rankingType">
          <el-radio-group v-model="ruleForm.rankingType">
            <el-radio value="day">每日排行</el-radio>
            <el-radio value="week">每周排行</el-radio>
            <el-radio value="month">每月排行</el-radio>
            <el-radio value="Ai">Ai 每日排行</el-radio>
            <el-radio value="day-r18">R18 每日排行</el-radio>
            <el-radio value="week-r18">R18 每周排行</el-radio>
            <el-radio value="Ai-r18">Ai-R18 每日排行</el-radio>
            <el-radio value="r18g">R18 猎奇</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始页数" prop="pageStart">
          <el-input v-model="ruleForm.pageStart" />
        </el-form-item>
        <el-form-item label="结束页数" prop="pageEnd">
          <el-input v-model="ruleForm.pageEnd" />
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="crawlStart"
            style="width: 100%"
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            <span v-if="!crawlStart">开始爬取</span>
            <span v-else
              ><el-icon class="is-loading"><Loading /></el-icon
            ></span>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- <div class="stop">
        <el-button style="width: 100%" type="warning" @click="submitFormEnd"> 结束爬取 </el-button>
      </div> -->
    </div>
    <div class="log-ranking">
      <el-table ref="tableRef" :data="tableData" height="calc(70vh - 35px)" style="width: 96%">
        <el-table-column prop="number" label="作品序号" width="100" />
        <el-table-column prop="title" label="作品标题" />
        <el-table-column prop="imageName" label="图片名称" />
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

      <!-- <div class="icon" @click="continueOrPause">
        <el-tooltip
          v-if="startOrShutDown"
          class="box-item"
          effect="light"
          content="爬取中"
          placement="top"
        >
          <el-icon color="#2891ed" :size="40"><VideoPause /></el-icon>
        </el-tooltip>
        <el-tooltip v-else class="box-item" effect="light" content="暂停中" placement="top">
          <el-icon color="#f13333" :size="40"><VideoPlay /></el-icon>
        </el-tooltip>
      </div> -->

      <!-- 日志 -->
      <div class="log">
        <div class="log-box" ref="logContainer">
          <div
            class="message"
            v-for="(item, index) in logMessages"
            :key="index"
            :class="{
              'bg-success': item.state === 'success',
              'bg-error': item.state === 'error',
              'bg-warning': item.state === 'warning'
            }"
          >
            {{ item.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import useMenuStore from '../../store/modules/menu'
const useMenu = useMenuStore()
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()

interface RuleForm {
  rankingType: string
  pageStart: string
  pageEnd: string
}

// const startOrShutDown = ref<boolean>(false) // 启动或者暂停
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  rankingType: 'day',
  pageStart: '1',
  pageEnd: '1'
})

const rules = reactive<FormRules<RuleForm>>({
  rankingType: [{ required: true, message: '请选择排行分类', trigger: 'blur' }],
  pageStart: [{ required: true, message: '请输入开始爬取页数', trigger: 'blur' }],
  pageEnd: [{ required: true, message: '请输入结束爬取页数', trigger: 'blur' }]
})

const tableData: any = reactive([])
const logMessages: any = reactive([]) // 创建一个响应式数组来保存所有的日志信息
const crawlStart = ref(false)
const tableRef = ref(null)
const logContainer = ref(null)

/**
 * 停止监听
 */
const stopListening = () => {
  if (instance) {
    const socketService = instance.appContext.config.globalProperties.$socketService
    socketService.off('download-message');
    socketService.off('log-message');
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
      const rankingData = {
        imagePath: localStorage.getItem('imagePath'),
        executablePath: localStorage.getItem('executablePath'),
        headless: localStorage.getItem('headless'),
        pixiv_username: localStorage.getItem('pixiv_username'),
        pixiv_password: localStorage.getItem('pixiv_password'),
        useProxy: localStorage.getItem('useProxy'),
        port: localStorage.getItem('port'),
        rankingType: ruleForm.rankingType,
        pageStart: ruleForm.pageStart,
        pageEnd: ruleForm.pageEnd
      }

      // 设置爬取按钮动画
      crawlStart.value = true
      // 设置菜单是否能点击
      useMenu.onShowBool()

      // 启动监听Socket
      if (instance) {
        const socketService = instance.appContext.config.globalProperties.$socketService
        // 监听下载Json信息
        socketService.on('download-message', (data) => {
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
        socketService.on('log-message', (data) => {
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
      const result = await window.getRanking.getRankingInfo(rankingData)
      if (result.error) {
        ElMessage({
          message: result.error,
          type: 'warning',
          grouping: true,
          plain: true,
          offset: 48
        })
        stopListening()
        crawlStart.value = false
        useMenu.offShowBool()
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
      crawlStart.value = false
      useMenu.offShowBool()
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 结束爬取图片
 */
/*
const submitFormEnd = () => {
  // 启动监听Socket
  if (instance) {
    const socketService = instance.appContext.config.globalProperties.$socketService
    // 监听下载Json信息
    socketService.on('download-message', (data) => {
      console.log('下载图片信息:', data)
      tableData.push(data)
      nextTick(() => {
        if (tableRef.value) {
          const tableBodyWrapper = tableRef.value.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
          tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight
        }
      })
    })

    // 监听下载日志信息
    socketService.on('log-message', (data) => {
      console.log('下载日志信息:', data)
      // 将收到的日志信息添加到logMessages数组中
      logMessages.push(data)
      nextTick(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
      })
    })
  }
}
*/

/**
 * 打开对应路径文件夹中的图片
 * @param e
 */
const openRow = (e: string) => {
  // console.log('e :>> ', e)
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

/**
 * 继续或暂停
 */
// const continueOrPause = () => {
//   startOrShutDown.value = !startOrShutDown.value
//   console.log('startOrShutDown :>> ', startOrShutDown.value)

//   if (startOrShutDown.value) {
//     console.log('继续')
//     if (instance) {
//       const socketService = instance.appContext.config.globalProperties.$socketService
//       // 注册事件监听
//       socketService.emit('start-or-shutDown', '继续')
//     }
//   } else {
//     console.log('暂停')
//   }
// }
</script>

<style lang="scss" scoped>
.ranking {
  display: flex;
  align-content: center;

  .from-ranking {
    width: 200px;
    height: calc(100vh - 35px);
    border-right: 1px solid #e2e2e2;
    box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);

    .el-form-item {
      width: 80%;
      margin: 30px auto;
    }

    .stop {
      width: 80%;
      margin: 30px auto;
    }
  }

  .log-ranking {
    width: 100%;
    height: calc(100vh - 35px);
    position: relative;

    .el-table {
      height: calc(70vh - 35px);
      margin: 0 auto;
    }

    .icon {
      cursor: pointer;
      position: absolute;
      bottom: 40px;
      right: 60px;
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
          width: 8px; /* 设置滚动条宽度 */
        }

        /* 滚动条轨道 */
        &::-webkit-scrollbar-track {
          background-color: #78f59d; /* 设置滚动条轨道背景色 */
          border-radius: 4px; /* 设置滚动条轨道的圆角 */
        }

        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          background-color: #ff9b9b; /* 设置滚动条滑块颜色 */
          border-radius: 4px; /* 设置滚动条滑块的圆角 */
        }

        /* 滚动条滑块悬停时的样式 */
        &::-webkit-scrollbar-thumb:hover {
          background-color: #555; /* 设置滚动条滑块悬停时的颜色 */
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
}
</style>
