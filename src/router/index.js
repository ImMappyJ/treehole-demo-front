import { createRouter, createWebHistory } from 'vue-router'
import IndexViewVue from '@/views/IndexView.vue'
import LoginViewVue from '@/views/LoginView.vue'
import HotRankViewVue from '@/views/HotRankView.vue'
import RegisterViewVue from '@/views/RegisterView.vue'
import PostArticleViewVue from '@/views/PostArticleView.vue'
import ArticlePageViewVue from '@/views/ArticlePageView.vue'
import SearchArticleViewVue from '@/views/SearchArticleView.vue'
import UserSettingViewVue from '@/views/UserSettingView.vue'
import UserArticleSettingVue from '@/components/UserArticleSetting.vue'
import UserInfoSettingVue from '@/components/UserInfoSetting.vue'
import { checkLoginStatus } from '@/utils/userutils'
import { ElMessageBox } from 'element-plus'

const whiteList = ['/', '/login', '/reg', '/about', '/rank']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => IndexViewVue
    },
    {
      path: '/login',
      name: 'login',
      component: () => LoginViewVue
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => HotRankViewVue
    },
    {
      path: '/about',
      name: 'about',
      component: () => HotRankViewVue
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => RegisterViewVue
    },
    {
      path: '/post',
      name: 'post',
      component: () => PostArticleViewVue
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => ArticlePageViewVue,
      props: true
    },
    {
      path: '/search/:query',
      name: 'search',
      component: () => SearchArticleViewVue,
      props: true
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => UserSettingViewVue,
      children: [
        {
          path: '',
          redirect: '/setting/info'
        },
        {
          path: 'info',
          component: () => UserInfoSettingVue
        },
        {
          path: 'article',
          component: () => UserArticleSettingVue
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 根据登录状态检查逻辑进行判断
  const isLoggedIn = checkLoginStatus()

  // 如果未登录且当前路由不是白名单页面，则跳转到登录页
  if (!isLoggedIn && whiteList.indexOf(to.path) === -1) {
    next('/login')
    ElMessageBox.alert('请登录', '提示')
  } else {
    next() // 继续导航
  }
})

export default router
