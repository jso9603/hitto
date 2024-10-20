import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showCopyImage: false,
    user: {
      uid: null,
      email: null,
    },
    menuName: '',
    showRoundPopup: false,
    selectedMainCategory: null,
    selectedSubCategory: null,
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
    setRoundPopup(state, payload) {
      state.showRoundPopup = payload
    },
    setSelectedMainCategory(state, category) {
      state.selectedMainCategory = category
    },
    setSelectedSubCategory(state, subCategory) {
      state.selectedSubCategory = subCategory
    }
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
    updateRoundPopup({ commit }, roundPopup) {
      commit('setRoundPopup', roundPopup)
    },
    updateMainCategory({ commit }, category) {
      commit('setSelectedMainCategory', category)
    },
    updateSubCategory({ commit }, subCategory) {
      commit('setSelectedSubCategory', subCategory)
    }
  },
  getters: {
    menuName(state) {
      return state.menuName // menuName을 가져오는 getter 추가
    },
    roundPopup(state) {
      return state.showRoundPopup
    },
    getSelectedMainCategory: (state) => state.selectedMainCategory,
    getSelectedSubCategory: (state) => state.selectedSubCategory,
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage // 상태를 localStorage에 저장
    })
  ]
})