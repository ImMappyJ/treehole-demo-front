<template>
  <HeaderMenu :user-info="userInfo.data" :is-logged-in="isLoggedIn" />

  <RouterView :user-info="userInfo.data" />
</template>

<script>
import { RouterView } from 'vue-router'
import HeaderMenu from './components/HeaderMenu.vue'
import { getUserInfo } from './utils/userutils'
import { getCookieValue } from './utils/cookieutils'
import { reactive } from 'vue'
export default {
  name: 'App',
  components: {
    HeaderMenu,
    RouterView
  },
  data() {
    return {
      userInfo: reactive({ data: {} }),
      isLoggedIn: getCookieValue('fp') !== ''
    }
  },
  created() {
    if (this.isLoggedIn) {
      getUserInfo().then((data) => {
        this.userInfo.data = data
      })
    }
  }
}
</script>
