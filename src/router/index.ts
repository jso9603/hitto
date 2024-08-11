import Vue from 'vue'
import Home from '@/views/Home.vue'
import Ai from '@/views/Ai.vue'
import Backup from '@/views/Backup.vue'
import Recent from '@/views/Recent.vue'
import Random from '@/views/Random.vue'
import Result from '@/views/Result.vue'
import SelectHope from '@/views/SelectHope.vue'
import Dream from '@/views/Dream.vue'
import Login from '@/views/Login.vue'
import My from '@/views/My.vue'
import Qr from '@/views/Qr.vue'
import MyNumber from '@/views/MyNumber.vue'
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
    path: '/recent',
    name: 'Recent',
    component: Recent
  },
  {
    path: '/random',
    name: 'Random',
    component: Random,
  },
  {
    path: '/result',
    name: 'Result',
    component: Result,
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
];

const router = new Router({
  mode: 'history',
  routes
})

export default router