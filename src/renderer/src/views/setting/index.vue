<template>
  <div class="setting">
    <i>应用设置</i>

    <section>
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        label-position="top"
        :size="formSize"
        style="max-width: 320px"
        status-icon
      >
        <el-form-item label="Pixiv账号" prop="pixiv_username">
          <el-input v-model="ruleForm.pixiv_username" />
        </el-form-item>
        <el-form-item label="Pixiv密码" prop="pixiv_password">
          <el-input v-model="ruleForm.pixiv_password" />
        </el-form-item>
        <el-form-item label="浏览器地址" prop="executablePath">
          <div class="icon-flex">
            <el-input v-model="ruleForm.executablePath" style="width: 260px" />
            <el-icon size="30" @click="openExecutableDialog"><FolderOpened /></el-icon>
          </div>
        </el-form-item>
        <el-form-item label="图片保存地址" prop="imagePath">
          <div class="icon-flex">
            <el-input v-model="ruleForm.imagePath" style="width: 260px" />
            <el-icon size="30"><FolderOpened /></el-icon>
          </div>
        </el-form-item>
        <el-form-item label="可视化" prop="headless">
          <el-input v-model="ruleForm.headless" />
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  pixiv_username: string
  pixiv_password: string
  executablePath: string
  imagePath: string
  headless: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  pixiv_username: '',
  pixiv_password: '',
  executablePath: '',
  imagePath: '',
  headless: ''
})

const rules = reactive<FormRules<RuleForm>>({
  pixiv_username: [
    { required: true, message: '请输入Pixiv的账号', trigger: 'blur' },
    { min: 3, max: 5, message: '长度应为 6 至 24', trigger: 'blur' }
  ],
  pixiv_password: [
    { required: true, message: '请输入Pixiv的密码', trigger: 'blur' },
    { min: 3, max: 5, message: '长度应为 6 至 24', trigger: 'blur' }
  ],
  executablePath: [
    { required: true, message: '请填写浏览器地址', trigger: 'blur' },
    { min: 3, max: 5, message: '长度应为 6 至 24', trigger: 'blur' }
  ],
  imagePath: [
    { required: true, message: '请填写图片保存地址', trigger: 'blur' },
    { min: 3, max: 5, message: '长度应为 6 至 24', trigger: 'blur' }
  ],
  headless: [
    { required: true, message: '是否可视化操作', trigger: 'blur' },
    { min: 3, max: 5, message: '长度应为 6 至 24', trigger: 'blur' }
  ]
})

/**
 * 实现文件夹选择功能
 */
const openExecutableDialog = async () => {
  const filePath = await window.electronAPI.openFile()
  console.log('filePath :>> ', filePath)
}
</script>

<style lang="scss" scoped>
.setting {
  width: 300px;
  margin: 0 auto;

  section {
    margin-top: 60px;
  }

  .icon-flex {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .el-icon {
      width: 30px;
      cursor: pointer;

      &:active {
        color: #d5d5d5;
      }
    }
  }
}
</style>
