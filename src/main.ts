import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
;(window as any).Kakao.init('79fd3f27e5e967175591c9ab913b617d')

Vue.config.productionTip = false

// Vue Router 라우트 변경시 Flutter에 알림
router.afterEach((to, from) => {
  if ((window as any).flutter_inappwebview) {
    // eslint-disable-next-line no-extra-semi
    ;(window as any).flutter_inappwebview.callHandler(
      'routeChanged',
      to.fullPath,
    )
  }
})

// Flutter → window.history.back() 시 Vue가 변경 알림을 Flutter에 다시 전달
window.addEventListener('popstate', () => {
  const path = window.location.pathname
  console.log('[Vue] popstate detected, path =', path)

  if ((window as any).flutter_inappwebview) {
    // eslint-disable-next-line no-extra-semi
    ;(window as any).flutter_inappwebview.callHandler('routeChanged', path)
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
