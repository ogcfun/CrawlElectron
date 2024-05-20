<template>
  <div class="log">
    <el-table :data="tableData.data" height="calc(90vh - 35px)" style="width: 96%">
      <el-table-column prop="type" label="下载分类" width="120" />
      <el-table-column prop="author" label="作者名称" width="140" />
      <el-table-column prop="title" label="作品标题" />
      <el-table-column prop="imageName" label="图片名称" />
      <el-table-column prop="DownloadTime" label="下载时间" width="180" />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button link type="primary" @click.prevent="showRow(scope.row.destination)">
            预览
          </el-button>
          <el-button link type="primary" @click.prevent="openRow(scope.row.destination)">
            打开
          </el-button>
          <el-button link type="primary" @click.prevent="deleteRow(scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 200, 400]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const path = ref('')
const page = ref(1)
const pageSize = ref(50)
const total = ref(0)
const tableData = reactive({
  data: []
})

/**
 * 获取windows系统用户名
 */
const getUsername = async () => {
  const username = await window.getUsername.getUsernameInfo()
  path.value = `C:\\Users\\${username}\\AppData\\Local\\log\\download.log`
}

/**
 * 调整每页数据
 * @param val
 */
const handleSizeChange = (val: number) => {
  // console.log(`${val} 每页项目`)
  pageSize.value = val
  getLogData({ path: path.value, page: page.value, pageSize: val })
}

/**
 * 跳转页数
 * @param val
 */
const handleCurrentChange = (val: number) => {
  // console.log(`当前页面: ${val}`)
  page.value = val
  getLogData({ path: path.value, page: val, pageSize: pageSize.value })
}

const showRow = () => {}

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

const deleteRow = async (row) => {
  const { destination } = row
  const result = await window.deleteLogLine.deleteLogLineInfo({
    imagePath: destination,
    filePath: path.value,
    jsonObject: JSON.parse(JSON.stringify(row))
  })
  if (result.error) {
    ElMessage({
      message: result.error,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  } else {
    ElMessage({
      message: result.data,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  }
  await getLogData({ path: path.value, page: page.value, pageSize: pageSize.value })
}

/**
 * 请求下载日志数据
 * @param logData
 */
const getLogData = async (logData) => {
  // 发送IPC消息到主进程
  const result = await window.getLog.getLogInfo(logData)
  if (result.error) {
    ElMessage({
      message: result.error,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  } else {
    tableData.data = result.data.items
    total.value = result.data.totalItems
  }
}

getUsername()
getLogData({ path: path.value, page: page.value, pageSize: pageSize.value })
</script>

<style lang="scss" scoped>
.log {
  width: 100%;
  height: calc(100vh - 35px);
  position: relative;

  .el-table {
    margin: 0 auto;
  }

  .page {
    width: 96%;
    height: 10vh;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
