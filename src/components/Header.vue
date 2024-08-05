<template>
  <div :class="['header', { 'scrolled': isScrolled }]">
    <img src="@/assets/ic-system-logo.svg" />
    <button class="share" @click="share">공유하기</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  isScrolled: boolean = false;

  share() {
    console.log('share click!');
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
  /* 블러효과??? */
  backdrop-filter: blur(10px);
}

img {
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