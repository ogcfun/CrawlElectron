<template>
  <div class="setting">
    <i>应用设置</i>

    <section>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="auto" class="demo-ruleForm"
        label-position="top" :size="formSize" style="max-width: 500px" status-icon>
        <el-form-item label="Pixiv账号" prop="pixiv_username">
          <el-input v-model="ruleForm.pixiv_username" placeholder="请填写账号" />
        </el-form-item>
        <el-form-item label="Pixiv密码" prop="pixiv_password">
          <el-input v-model="ruleForm.pixiv_password" type="password" auto-complete="off" placeholder="请填写密码"
            :show-password="true" />
        </el-form-item>
        <el-form-item label="浏览器地址" prop="executablePath">
          <div class="icon-flex">
            <el-input v-model="ruleForm.executablePath" style="width: 460px" placeholder="请填写浏览器地址" />
            <el-icon size="30" @click="openExecutableDialog">
              <FolderOpened />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="图片保存地址" prop="imagePath">
          <div class="icon-flex">
            <el-input v-model="ruleForm.imagePath" style="width: 460px" placeholder="请填写图片保存地址" />
            <el-icon size="30" @click="openFileDialog">
              <FolderOpened />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="可视化" prop="headless">
          <el-radio-group v-model="ruleForm.headless">
            <el-radio value="true">开启</el-radio>
            <el-radio value="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            保存信息
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">清除信息</el-button>
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
const ruleForm = ref<RuleForm>({
  pixiv_username: '',
  pixiv_password: '',
  executablePath: '',
  imagePath: '',
  headless: 'false'
})

const rules = reactive<FormRules<RuleForm>>({
  pixiv_username: [
    { required: true, message: '请输入Pixiv的账号', trigger: 'blur' }
  ],
  pixiv_password: [
    { required: true, message: '请输入Pixiv的密码', trigger: 'blur' }
  ],
  executablePath: [
    { required: true, message: '请填写浏览器地址', trigger: 'blur' }
  ],
  imagePath: [
    { required: true, message: '请填写图片保存地址', trigger: 'blur' }
  ],
  headless: [
    { required: true, message: '请选择是否可视化操作', trigger: 'blur' }
  ]
})

/**
 * 选择浏览器路径
 */
const openExecutableDialog = async () => {
  try {
    const filePath = await window.executablePath.openExecutablePath()
    ruleForm.value.executablePath = filePath
  } catch (err: any) {
    ElMessage({
      message: '选择失败：' + err.message,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  }
}

/**
 * 选择图片保存路径
 */
const openFileDialog = async () => {
  try {
    const filePath = await window.filePath.openFilePath()
    ruleForm.value.imagePath = filePath
  } catch (err: any) {
    ElMessage({
      message: '选择失败：' + err.message,
      type: 'warning',
      grouping: true,
      plain: true,
      offset: 48
    })
  }
}

/**
 * 保存信息到本地
 * @param formEl 
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, _) => {
    if (valid) {
      localStorage.setItem("pixiv_username", ruleForm.value.pixiv_username);
      localStorage.setItem("pixiv_password", ruleForm.value.pixiv_password);
      localStorage.setItem("executablePath", ruleForm.value.executablePath);
      localStorage.setItem("imagePath", ruleForm.value.imagePath);
      localStorage.setItem("headless", ruleForm.value.headless);

      ElMessage({
        message: '信息保存成功',
        type: 'success',
        grouping: true,
        plain: true,
        offset: 48
      })
    } else {
      ElMessage({
        message: '请填写完整信息',
        type: 'warning',
        grouping: true,
        plain: true,
        offset: 48
      })
    }
  })
}

/**
 * 重置表单
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  localStorage.clear()

  ruleForm.value = {
    pixiv_username: '',
    pixiv_password: '',
    executablePath: '',
    imagePath: '',
    headless: 'false'
  }

  ElMessage({
    message: '信息清除成功',
    type: 'success',
    grouping: true,
    plain: true,
    offset: 48
  })
}

/**
 * 获取保存的信息，赋值到表单
 */
function getLocalStorage() {
  const pixiv_username = localStorage.getItem("pixiv_username");
  const pixiv_password = localStorage.getItem("pixiv_password");
  const executablePath = localStorage.getItem("executablePath");
  const imagePath = localStorage.getItem("imagePath");
  const headless = localStorage.getItem("headless");
  ruleForm.value = {
    pixiv_username: pixiv_username === null ? ruleForm.value.pixiv_username : pixiv_username,
    pixiv_password: pixiv_password === null ? ruleForm.value.pixiv_password : pixiv_password,
    executablePath: executablePath === null ? ruleForm.value.executablePath : executablePath,
    imagePath: imagePath === null ? ruleForm.value.imagePath : imagePath,
    headless: headless === null ? ruleForm.value.headless : headless,
  };
}

getLocalStorage()
</script>

<style lang="scss" scoped>
.setting {
  width: 500px;
  margin: 35px auto;

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
