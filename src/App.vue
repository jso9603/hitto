<template>
  <div class="app">
    <Header />
    <transition name="fade">
      <div class="noti" v-if="showCopyImage">
        <img src="@/assets/ic-system-noti.svg" />
        <div>링크가 복사되었어요!</div>
      </div>
    </transition>
    <div class="content">
      <router-view />
    </div>
    <Navigation v-if="showNavigation" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '@/components/Header.vue'
import Navigation from '@/components/Navigation.vue'
import { mapState } from 'vuex'

@Component({
  components: {
    Header,
    Navigation,
  },
   computed: {
    ...mapState(['showCopyImage']),
  },
})
export default class App extends Vue {
  get showNavigation() {
    if (this.$route.path === '/' || this.$route.path === '/home' || this.$route.path === '/guess' || this.$route.path === '/my') {
      return true
    }
    return false
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  max-width: 576px;
  margin: 0 auto;
  background-color: #171717;
  font-family: 'Pretendard', sans-serif;
}


.app {
  position: relative;
}

.noti {
  width: calc(100% - 80px);
  max-width: 576px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #222222E5;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.09px;
  color: #ECEEF0;
  border-radius: 16px;
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 100;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.content {
  padding-top: 54px;
}
</style>
