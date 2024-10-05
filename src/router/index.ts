import Vue from 'vue'
import Home from '@/views/Home.vue'
import Ai from '@/views/Ai.vue'
import Backup from '@/views/Backup.vue'
import Random from '@/views/Random.vue'
import AfterLogin from '@/views/AfterLogin.vue'
import SelectHope from '@/views/SelectHope.vue'
import Dream from '@/views/Dream.vue'
import Category from '@/views/Category.vue'
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
    path: '/select-hope',
    name: 'Select-Hope',
    component: SelectHope,
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
  }
];

const router = new Router({
  mode: 'history',
  routes
})

export default router