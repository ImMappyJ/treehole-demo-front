<template>
  <div class="post-page">
    <el-form :model="postForm" ref="postForm" label-width="100px">
      <!-- 标题表单项 -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="postForm.title"></el-input>
      </el-form-item>
      <!-- 分类表单项 -->
      <el-form-item label="分类" prop="type">
        <el-select v-model="postForm.type" placeholder="请选择分类">
          <el-option
            v-for="type in types"
            :key="type.id"
            :label="type.name"
            :value="type.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 内容表单项 -->
      <el-form-item label="内容" prop="context">
        <!-- 富文本编辑器（示例中为输入框） -->
        <el-input v-model="postForm.context" type="textarea"></el-input>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">发帖</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { getCookieValue } from '@/utils/cookieutils'

export default {
  name: 'PostPage',
  data() {
    return {
      postForm: {
        title: '',
        type: '',
        context: '',
        fp: getCookieValue('fp')
      },
      types: [] // 存放所有分类
    }
  },
  mounted() {
    this.fetchTypes() // 页面加载时获取所有分类
  },
  methods: {
    fetchTypes() {
      axios
        .get('http://127.0.0.1:5000/article/types')
        .then((response) => {
          this.types = response.data.data.types
        })
        .catch((error) => {
          console.error('Error fetching types:', error)
        })
    },
    handleSubmit() {
      // 检查标题和内容是否为空
      if (!this.postForm.title || !this.postForm.context) {
        this.$message.error('标题和内容不能为空')
        return // 如果标题或内容为空，停止执行后续逻辑
      }

      // 添加发送POST请求时携带的cookie
      const headers = {
        'Content-Type': 'application/json'
      }

      axios
        .post('http://127.0.0.1:5000/article/post', this.postForm, { headers })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success(response.data.message)
            // 提取文章ID并构造文章详情页路径
            const articleId = response.data.data.article_id
            const articleDetailPath = `/article/${articleId}`
            // 使用路由导航跳转到文章详情页
            this.$router.push(articleDetailPath)
          } else {
            this.$message.warning(response.data.message)
          }
        })
        .catch((error) => {
          console.error('Error posting article:', error)
          this.$message.error('发帖失败')
        })
    }
  }
}
</script>

<style scoped>
.post-page {
  padding: 20px;
}
</style>
