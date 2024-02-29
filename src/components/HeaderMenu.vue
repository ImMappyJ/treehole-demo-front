<template>
  <div id="header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="/"
        ><el-icon><House /></el-icon>首页</el-menu-item
      >
      <el-menu-item index="/rank"
        ><el-icon><Trophy /></el-icon>排行榜</el-menu-item
      >
      <el-menu-item v-if="isLoggedIn" index="/post"
        ><el-icon><EditPen /></el-icon>发帖</el-menu-item
      >
      <!-- 新添加的发帖按钮 -->
      <el-menu-item v-if="isLoggedIn">
        <el-input
          placeholder="搜索"
          style="width: 150px"
          v-model="query"
          @keyup.enter="handleSearch"
        ></el-input>
        <!-- 添加搜索框 -->
        <el-button type="primary" @click="handleSearch"
          ><el-icon><Search /></el-icon>搜索</el-button
        >
        <!-- 添加搜索按钮 -->
      </el-menu-item>
      <div style="flex-grow: 0.9" />
      <el-menu-item v-if="!isLoggedIn" index="/login"
        ><el-icon><User /></el-icon>注册|登录</el-menu-item
      >
      <el-sub-menu v-if="isLoggedIn" index="user">
        <template #title
          ><el-icon><User /></el-icon>{{ this.userInfo.nick }}</template
        >
        <el-menu-item index="/setting">个人中心</el-menu-item>
        <el-menu-item index="/login" @click="handleLogout">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { outdatedAllCookie } from '@/utils/cookieutils'

export default {
  name: 'HeaderView',
  data() {
    return {
      activeIndex: null,
      query: ''
    }
  },
  computed: {},
  props: {
    isLoggedIn: Boolean,
    userInfo: Object
  },
  methods: {
    handleSelect(index) {
      this.$router.push(index) // 执行编程式导航到指定路由
    },
    handleLogout() {
      // 删除所有cookie
      outdatedAllCookie()
      ElMessageBox.alert('正在跳转至登录界面', '退出登录')
      location.reload()
    },
    handleSearch() {
      // 处理搜索逻辑
      window.location.href = '/search/' + this.query
    }
  },
  mounted() {
    const router = useRouter()
    const route = useRoute()

    router.afterEach(() => {
      const rootPath = route.matched[0].path.replace(/\/:[^/]+/g, '')
      this.activeIndex = rootPath
    })
  }
}
</script>
