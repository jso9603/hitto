<template>
  <div class="navbar">
    <div class="nav-item" @click="onTab('home')">
      <img :src="homeIcon" alt="Home" class="nav-icon">
      <p :class="{ active: isHomeActive }">홈</p>
    </div>
    <div class="nav-item" @click="onTab('more')">
      <img :src="moreIcon" alt="More" class="nav-icon">
      <p :class="{ active: isMoreActive }">더보기</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Navigation extends Vue {
  get homeIcon() {
    return this.$route.path === '/' || this.$route.path === '/home'
      ? require('@/assets/img-home-enable.svg')
      : require('@/assets/img-home-disable.svg')
  }

  get moreIcon() {
    return this.$route.path === '/my'
      ? require('@/assets/img-all-enable.svg')
      : require('@/assets/img-all-disable.svg')
  }

  get isHomeActive() {
    return this.$route.path === '/' || this.$route.path === '/home'
  }

  get isMoreActive() {
    return this.$route.path === '/my'
  }

  onTab(tab: string) {
    switch(tab) {
      case 'home':
        this.$router.push('/')
        break
      case 'more':
        this.$router.push('/my')
        break
      default:
        break
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 576px; /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  width: 100%;
  height: 64px;
  background-color: #1d2330;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 1px solid #272e40;
  border-left: none;
  border-right: none;
  border-bottom: none;
  backdrop-filter: blur(10px);
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  line-height: 12px;
  text-align: center;
  color: #737577;
  cursor: pointer;
}

.nav-icon {
  width: 22px;
  height: 22px;
  margin-bottom: 4px;
}

p {
  margin: 0;
}

.active {
  font-size: 11px;
  font-weight: 500;
  line-height: 12px;
  text-align: center;
  color: #ECEEF0;
}
</style>