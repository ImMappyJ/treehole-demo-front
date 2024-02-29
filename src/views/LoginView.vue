<template>
    <div class="login-container">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" @blur="validateEmail"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @blur="validatePassword" :show-password="true"></el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <div class="gap"></div>
          <el-link type="primary" @click="$router.push('/reg');">注册账号</el-link>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { ElMessageBox } from 'element-plus';
  
  const loginForm = ref({
    email: "",
    password: ""
  });
  
  const loginFormRef = ref(null); // 创建对表单组件的引用
  
  const loginRules = ref({
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
    ]
  });
  
  function validateEmail() {
    loginFormRef.value.validateField('email'); // 校验邮箱逻辑
  }
  
  function validatePassword() {
    loginFormRef.value.validateField('password'); // 校验密码逻辑
  }
  
  function submitForm() {
    // 在提交表单之前进行表单验证
    loginFormRef.value.validate().then(valid => {
      if (!valid) {
        ElMessageBox.alert("邮箱密码格式错误", "输入错误");
        return; // 如果表单验证失败，停止执行
      }
  
      axios.post('http://127.0.0.1:5000/auth/log', {
        email: loginForm.value.email,
        pwd: loginForm.value.password
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置Content-Type头部
        },
        withCredentials: true
      }).then(response => {
        if (response.data.code === 200) {
          const fp = response.data.data.fp; // 从响应中获取 fp
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          document.cookie = `fp=${fp}; expires=${expires.toUTCString()}; path=/`;
          ElMessageBox.alert(response.data.message, "即将跳转...");
          setTimeout(() => {
            window.location.href = '/'; // 跳转到首页
          }, 1000);
        } else {
          ElMessageBox.alert(response.data.message, "登录失败");
        }
      }).catch(error => {
        ElMessageBox.alert(error, '提示');
      });
    });
  }
  </script>
  
  <style scoped>
  .login-container {
    width: 400px;
    margin: 0 auto;
    padding-top: 100px;
  }
  
  .login-form {
    margin-top: 20px;
  }
  
  /* Flex 布局 */
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  
  /* 添加间距 */
  .gap {
    width: 40px; /* 或者其他间距大小 */
  }
  </style>
  