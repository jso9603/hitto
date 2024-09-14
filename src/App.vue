<template>
  <div class="app">
    <Header @goBack="openPopup" />
  
    <transition name="fade">
      <div class="noti" v-if="showCopyImage">
        <img src="@/assets/img-link.png" />
        <div>링크가 복사되었어요!</div>
      </div>
    </transition>

    <LoginPopup
      :numbers="myNumbers"
      :visible="isPopupVisible"
      @close="isPopupVisible = false"
    />
  
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
import LoginPopup from '@/components/LoginPopup.vue'

import { getLoggedUserInfo } from '@/utils/user'

import { mapState } from 'vuex'

@Component({
  components: {
    Header,
    Navigation,
    LoginPopup,
  },
   computed: {
    ...mapState(['showCopyImage']),
  },
})
export default class App extends Vue {
  private isPopupVisible = false
  private LoginPopupNumbers: number[] = []

  get myNumbers() {
    const numbersStr = sessionStorage.getItem('lottoNumbers')
    const cleanedStr = numbersStr && numbersStr.replace(/^"|"$/g, '')

    return cleanedStr && cleanedStr.split(',').map(num => Number(num.trim()))
  }

  get showNavigation() {
    const currentPath = this.$route.path.toLowerCase()

    if (currentPath === '/' || currentPath === '/home' || currentPath === '/guess' || currentPath === '/my') {
      return true
    }
    return false
  }

  private openPopup(): void {
    const user = getLoggedUserInfo()
    const storedNumbers = sessionStorage.getItem('lottoNumbers')
    
    if (!user && storedNumbers) {
      // 문자열에서 양쪽의 따옴표를 제거하고, 쉼표로 분리하여 배열로 변환 후 숫자로 변환
      this.LoginPopupNumbers = storedNumbers
        .replace(/^"|"$/g, '')  // 양 끝의 따옴표 제거
        .split(',')             // 쉼표로 문자열 분리
        .map(num => Number(num.trim())) // 각 요소를 숫자로 변환
    }

    this.isPopupVisible = true
  }

  private closePopup(): void {
    this.isPopupVisible = false
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
  line-height: 20px;
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

.noti > img {
  width: 24px;
  height: 24px;
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
