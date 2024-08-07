import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showCopyImage: false,
  },
  mutations: {
    setShowCopyImage(state, payload) {
      state.showCopyImage = payload;
    },
  },
  actions: {
    showCopyImage({ commit }) {
      
      commit('setShowCopyImage', true);
      setTimeout(() => {
        commit('setShowCopyImage', false);
      }, 2000); // 2초 동안 표시
    },
  },
});