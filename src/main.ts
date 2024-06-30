import Vue from 'vue'
import App from './App.vue'

(window as any).Kakao.init('79fd3f27e5e967175591c9ab913b617d')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
