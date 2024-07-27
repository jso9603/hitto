import Vue from 'vue'
import Home from '@/views/Home.vue'
import Ai from '@/views/Ai.vue'
import Backup from '@/views/Backup.vue'
import Recent from '@/views/Recent.vue'
import Random from '@/views/Random.vue'
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
  }
];

const router = new Router({
  mode: 'history',
  routes
})

export default router