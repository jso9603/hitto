import Vue from 'vue'
import Home from '@/views/Home.vue'
import Ai from '@/views/Ai.vue'
import Backup from '@/views/Backup.vue'
import Random from '@/views/Random.vue'
import AfterLogin from '@/views/AfterLogin.vue'
import Dream from '@/views/Dream.vue'
import Category from '@/views/Category.vue'
import Category2 from '@/views/Category2.vue'
import Category3 from '@/views/Category3.vue'
import Login from '@/views/Login.vue'
import My from '@/views/My.vue'
import Qr from '@/views/Qr.vue'
import MyNumber from '@/views/MyNumber.vue'
import Guess from '@/views/Guess.vue'
import Challenge from '@/views/Challenge.vue' 
import Setting from '@/views/Setting.vue'
import Leave from '@/views/Leave.vue'
import Terms from '@/views/Terms.vue'
import NotFound from '@/views/NotFound.vue'
import Manual from '@/views/Manual.vue'
import FortuneInfo from '@/views/FortuneInfo.vue'
import ChatGPT from '@/views/chatGPT.vue'
import TodayFortune from '@/views/TodayFortune.vue'
import FortuneLoading from '@/views/FortuneLoading.vue'
import Promotion from '@/views/Promotion.vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/ai',
    name: 'Ai',
    component: Ai,
  },
  {
    path: '/backup',
    name: 'Backup',
    component: Backup,
  },
  {
    path: '/random',
    name: 'Random',
    component: Random,
  },
  {
    path: '/after-login',
    name: 'AfterLogin',
    component: AfterLogin,
  },
  {
    path: '/dream',
    name: 'Dream',
    component: Dream,
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
  },
  {
    path: '/category2',
    name: 'Category2',
    component: Category2,
  },
  {
    path: '/category3',
    name: 'Category3',
    component: Category3,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/my',
    name: 'My',
    component: My,
  },
  {
    path: '/qr',
    name: 'Qr',
    component: Qr,
  },
  {
    path: '/my/number',
    name: 'Number',
    component: MyNumber,
  },
  {
    path: '/guess',
    name: 'Guess',
    component: Guess,
  },
  {
    path: '/challenge',
    name: 'Challenge',
    component: Challenge,
  },
  {
    path: '/my/setting',
    name: 'Setting',
    component: Setting,
  },
  {
    path: '/leave',
    name: 'Leave',
    component: Leave,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/manual',
    name: 'Manual',
    component: Manual,
  },
  {
    path: '/fortuneInfo',
    name: 'FortuneInfo',
    component: FortuneInfo
  },
  {
    path: '/chatGPT',
    name: 'ChatGPT',
    component: ChatGPT,
  },
  {
    path: '/today',
    name: 'Today',
    component: TodayFortune,
  },
  {
    path: '/loading',
    name: 'Loading',
    component: FortuneLoading,
  },
  {
    path: '/fortune-loading',
    name: 'FortuneLoading',
    component: FortuneLoading,
  },
  {
    path: '/promotion',
    name: 'Promotion',
    component: Promotion,
  }
]

const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 항상 페이지가 바뀔 때 스크롤을 최상단으로 설정 (라우트가 변경될 때 실행)
    return { x: 0, y: 0 };
  }
})

export default router