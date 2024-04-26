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
          <el-button style="width: 100%" type="primary" @click="submitForm(ruleFormRef)">
            开始爬取
          </el-button>
        </el-form-item>
      </el-form>

      <div class="stop">
        <el-button style="width: 100%" type="warning" @click="submitForm(ruleFormRef)">
          结束爬取
        </el-button>
      </div>
    </div>
    <div class="log-ranking">
      <el-table :data="tableData" height="calc(100vh - 35px)" style="width: 96%">
        <el-table-column prop="date" label="下载时间" width="180" />
        <el-table-column prop="name" label="作品名称" width="180" />
        <el-table-column prop="address" label="作者名称" />
        <el-table-column prop="date" label="下载状态" width="180" />
      </el-table>

      <div class="icon" @click="continueOrPause">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  rankingType: string
  pageStart: string
  pageEnd: string
}

const startOrShutDown = ref<boolean>(false) // 启动或者暂停
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

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 继续或暂停
 */
const continueOrPause = () => {
  startOrShutDown.value = !startOrShutDown.value
  console.log('startOrShutDown :>> ', startOrShutDown.value)

  if (startOrShutDown.value) {
    console.log('继续')
  } else {
    console.log('暂停')
  }
}
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
      margin: 0 auto;
    }

    .icon {
      cursor: pointer;
      position: absolute;
      bottom: 40px;
      right: 60px;
    }
  }
}
</style>
