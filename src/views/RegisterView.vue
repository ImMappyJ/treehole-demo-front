<template>
  <div class="register-container">
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      label-width="80px"
      class="register-form"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          @blur="validateEmail"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
          @blur="validatePassword"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repeatPassword">
        <el-input
          v-model="registerForm.repeatPassword"
          type="password"
          placeholder="请重复输入密码"
          @blur="validateRepeatPassword"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="registerForm.nickname" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="emailCode">
        <el-input v-model="registerForm.emailCode" placeholder="请输入邮箱验证码"></el-input>
        <el-button @click="sendEmailCode" :disabled="countDownSeconds !== 0">{{
          emailButtonText
        }}</el-button>
      </el-form-item>
      <el-form-item class="button-group">
        <el-button type="primary" @click="submitForm">注册</el-button>
        <div class="gap"></div>
        <el-link type="primary" @click="$router.push('/login')">登录账号</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios'

const registerForm = ref({
  email: '',
  password: '',
  repeatPassword: '',
  nickname: '',
  emailCode: ''
})

const registerFormRef = ref(null)

const registerRules = ref({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
  ],
  repeatPassword: [
    { required: true, message: '请重复输入密码', trigger: 'blur' },
    { validator: validateRepeatPassword, trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
})

const countDownSeconds = ref(0) // 倒计时秒数

const emailButtonText = computed(() => {
  return countDownSeconds.value !== 0
    ? '获取验证码（' + countDownSeconds.value + '）'
    : '获取验证码'
})

function validateEmail() {
  registerFormRef.value.validateField('email')
}

function validatePassword() {
  registerFormRef.value.validateField('password')
}

function validateRepeatPassword(rule, value, callback) {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

function sendEmailCode() {
  // 首先进行邮箱格式验证
  registerFormRef.value.validateField('email').then((isValidEmail) => {
    if (!isValidEmail) {
      ElMessageBox.alert('邮箱格式不正确', '提示')
      return // 如果邮箱格式不正确，则不发送请求
    }
    // 向后端发送请求获取验证码
    axios
      .get('http://127.0.0.1:5000/verify/email', {
        params: {
          email: registerForm.value.email
        }
      })
      .then((response) => {
        const data = response.data
        ElMessageBox.alert(data.message, '提示')
        startCountDown() // 开始倒计时
      })
      .catch((error) => {
        console.error('发送邮箱验证码失败：', error)
        ElMessage.error('发送邮箱验证码失败，请重试')
      })
  })
}

function startCountDown() {
  countDownSeconds.value = 60 // 重置倒计时秒数
  const timer = setInterval(() => {
    countDownSeconds.value--
    if (countDownSeconds.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

function submitForm() {
  registerFormRef.value.validate().then((valid) => {
    if (!valid) {
      ElMessageBox.alert('注册信息格式错误', '输入错误')
      return
    }
    // 向后端提交注册信息
    axios
      .post(
        'http://127.0.0.1:5000/auth/reg',
        {
          email: registerForm.value.email,
          pwd: registerForm.value.password,
          nick: registerForm.value.nickname,
          code: registerForm.value.emailCode
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 设置Content-Type头部
          },
          withCredentials: true
        }
      )
      .then((response) => {
        const data = response.data
        if (data.code === 200) {
          // 注册成功，处理逻辑
          ElMessageBox.alert(data.message, '提示')
          const fp = response.data.data.fp // 从响应中获取 fp
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          document.cookie = `fp=${fp}; expires=${expires.toUTCString()}; path=/`
          setTimeout(() => {
            window.location.href = '/' // 跳转到首页
          }, 1000)
          // 清空表单
          clearForm()
        } else {
          // 注册失败，显示错误信息
          ElMessageBox.alert(data.message, '注册失败')
        }
      })
      .catch((error) => {
        console.error('注册失败：', error)
        ElMessage.error('注册失败，请重试')
      })
  })
}

function clearForm() {
  // 清空表单数据
  registerForm.value.email = ''
  registerForm.value.password = ''
  registerForm.value.repeatPassword = ''
  registerForm.value.nickname = ''
  registerForm.value.emailCode = ''
}
</script>

<style scoped>
.register-container {
  width: 400px;
  margin: 0 auto;
  padding-top: 100px;
}

.register-form {
  margin-top: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.gap {
  width: 40px;
}

.count-down {
  margin-left: 10px;
}
</style>
