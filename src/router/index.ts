import Vue from 'vue'
import Home from '@/views/Home.vue'
import Ai from '@/views/Ai.vue'
import Backup from '@/views/Backup.vue'
import Random from '@/views/Random.vue'
import SelectHope from '@/views/SelectHope.vue'
import Dream from '@/views/Dream.vue'
import Login from '@/views/Login.vue'
import My from '@/views/My.vue'
import Qr from '@/views/Qr.vue'
import MyNumber from '@/views/MyNumber.vue'
import Guess from '@/views/Guess.vue'
import Challenge from '@/views/Challenge.vue'
import Setting from '@/views/Setting.vue'
import Leave from '@/views/Leave.vue'
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
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/my',
    name: 'my',
    component: My,
  },
  {
    path: '/qr',
    name: 'qr',
    component: Qr,
  },
  {
    path: '/my/number',
    name: 'number',
    component: MyNumber,
  },
  {
    path: '/guess',
    name: 'guess',
    component: Guess,
  },
  {
    path: '/challenge',
    name: 'challenge',
    component: Challenge,
  },
  {
    path: '/my/setting',
    name: 'setting',
    component: Setting,
  },
  {
    path: '/leave',
    name: 'leave',
    component: Leave,
  },
];

const router = new Router({
  mode: 'history',
  routes
})

export default router