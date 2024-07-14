import Vue from 'vue'
import Home from '@/views/Home.vue'
import Recent from '@/views/Recent.vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recent',
    name: 'Recent',
    component: Recent
  }
];

const router = new Router({
  mode: 'history',
  routes
})

export default router