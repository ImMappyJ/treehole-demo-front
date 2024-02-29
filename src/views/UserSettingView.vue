<template>
  <div class="user-setting">
    <el-menu class="el-menu-vertical" @select="goTo">
      <el-menu-item index="/info">
        <el-icon><i class="icon-my-info"></i></el-icon>
        <span>我的信息</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <el-icon><i class="icon-my-posts"></i></el-icon>
        <span>我的帖子</span>
      </el-menu-item>
    </el-menu>
    <router-view :user-info="userInfo"></router-view>
  </div>
</template>

<script>

export default {
  name: 'UserSetting',
  props: {
    userInfo: Object
  },
  methods: {
    goTo(index) {
      this.$router.push('/setting' + index)
    }
  }
}
</script>

<style scoped>
.user-setting {
  margin-top: 50px;
  display: flex;
  height: 100%;
}
</style>
