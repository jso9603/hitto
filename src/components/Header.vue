<template>
  <div :class="['header', headerClass, { 'scrolled': isScrolled }]">
    <template v-if="showBackButton">
      <div v-if="login">
        <img src="@/assets/ic-system-logo.svg" class="logo" />
        <button @click="goBack" class="close">
          <img src="@/assets/ic-system-close-img.svg" />
        </button>
      </div>
      <div v-else>
        <button @click="goBack" class="back">
          <img src="@/assets/ic-system-back-img.svg" />
        </button>
        <div class="menu">{{ menuName }}</div>
        <button class="use" @click="use">이용안내</button>
      </div>
    </template>
    <div v-else>
      <img src="@/assets/ic-system-logo.svg" class="logo" />
      <button class="share" @click="share">공유하기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

@Component
export default class Header extends Vue {
  isScrolled: boolean = false;

  share() {
    console.log('share click!');
  }
  use() {
    console.log('use click!');
  }

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  get headerClass() {
    return this.$route.path === '/' ? 'home' : 'subpage';
  }

  get showBackButton() {
    return this.$route.path !== '/';
  }

  get login() {
    return this.$route.path === '/login';
  }

  get menuName() {
    return Cookies.get('menu')
  }

  goBack() {
    this.$router.go(-1);
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 20px;
  background-color: #171717;
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 40px);
  z-index: 1000;
  transition: backdrop-filter 0.3s ease;
}

.header.scrolled {
  /* 블러효과 (https://www.zappy.ai/kr 참고) */
  backdrop-filter: blur(10px);
  background-color: rgba(23, 23, 23, 0.5);
}

.home > div,
.subpage > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
}

.back,
.close {
  display: contents;
  background-color: transparent;
  border: none;
  width: 24px;
  height: auto;
}

.back > img {
  margin-left: -2px;
}

.close > img {
  margin-right: -2px;
}

.menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.use {
  padding: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
  background-color: transparent;
  border: none;
}

img.logo {
  width: auto;
  height: 18px;
  cursor: pointer;
}

.share {
  padding: 4px 9px;
  border-radius: 8px;
  border: 1px solid #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  background-color: transparent;
  color: #fff;
}
</style>