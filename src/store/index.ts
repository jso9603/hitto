import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showCopyImage: false,
    user: {
      uid: null,
      email: null,
    },
    menuName: '',
  },
  mutations: {
    setShowCopyImage(state, payload) {
      state.showCopyImage = payload
    },
    setUser(state, payload) {
      state.user.uid = payload.uid
      state.user.email = payload.email
    },
    clearUser(state) {
      state.user.uid = null
      state.user.email = null
    },
    setMenuName(state, menuName) {
      state.menuName = menuName
    },
  },
  actions: {
    showCopyImage({ commit }) {
      commit('setShowCopyImage', true)
      setTimeout(() => {
        commit('setShowCopyImage', false)
      }, 2000) // 2초 동안 표시
    },
    loginUser({ commit }, user) {
      // 로그인 시 받아온 user 정보 (uid, email)을 state에 저장
      commit('setUser', user)
    },
    logoutUser({ commit }) {
      // 로그아웃 시 user 정보를 초기화
      commit('clearUser')
    },
    updateMenuName({ commit }, menuName) {
      // menuName 업데이트
      commit('setMenuName', menuName)
    },
  },
  getters: {
    menuName(state) {
      return state.menuName // menuName을 가져오는 getter 추가
    },
  },
})