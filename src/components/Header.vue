<template>
  <div :class="['header', headerClass, { 'scrolled': isScrolled }]">
    <template v-if="$route.path === '/' || $route.path === '/home'">
      <img src="@/assets/ic-system-logo.svg" class="logo" />
      <img src="@/assets/ic-system-qr.svg" class="qr" @click="onQr"/>
      <button class="share" @click="onShare">공유</button>
    </template>

    <template v-else-if="$route.path === '/ai' || $route.path === '/dream' || $route.path === '/random' || $route.path === '/select-hope'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">{{ menuName }}</div>
      <button class="use" @click="use">안내</button>
    </template>

    <template v-else-if="$route.path === '/qr'">
      <img src="@/assets/ic-system-logo.svg" class="logo" />
    </template>

    <template v-else-if="$route.path === '/login'">
      <img src="@/assets/ic-system-logo.svg" class="logo" />
      <button @click="goBack" class="close">
        <img src="@/assets/ic-system-close-img.svg" />
      </button>
    </template>

    <template v-else-if="$route.path === '/my'">
      <div class="menu">나의 모히또</div>
    </template>

    <template v-else-if="$route.path === '/my/number'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">나의 로또번호</div>
    </template>

    <template v-else-if="$route.path === '/guess' || $route.path === '/Guess'">
      <div></div>
      <div class="menu">{{ menuName }}</div>
      <button class="use" @click="use">안내</button>
    </template>

    <template v-else-if="$route.path === '/challenge'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">로또 맞추기</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

@Component
export default class Header extends Vue {
  isScrolled: boolean = false;

  onQr() {
    this.$router.push('/qr')
  }

  onShare() {
  const currentUrl = window.location.href;

  // Check if navigator.clipboard.writeText is available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentUrl).then(() => {
      this.$store.dispatch('showCopyImage');
    }).catch(err => {
      console.error('링크 복사에 실패했습니다:', err);
    });
  } else {
    // Fallback for iOS Safari
    const textArea = document.createElement('textarea');
    textArea.value = currentUrl;
    // Ensure the textarea is not visible and doesn't cause layout shifts
    textArea.style.position = 'fixed'; // Fixed position to avoid layout changes
    textArea.style.top = '0'; 
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0'; // Make it invisible
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.$store.dispatch('showCopyImage');
      } else {
        console.error('링크 복사에 실패했습니다.');
      }
    } catch (err) {
      console.error('링크 복사에 실패했습니다:', err);
    }
    document.body.removeChild(textArea);
  }
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
    return this.$route.path === '/' ? 'home' : this.$route.path === '/qr' ? 'qr' : 'subpage';
  }

  get showBackButton() {
    return this.$route.path !== '/' && this.$route.path !== '/my';
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
  background-color: #171717;
  position: fixed;
  top: 0;
  padding-left: 20px;
  padding-right: 20px;
  width: calc(100% - 40px);
  max-width: 576px;
  z-index: 1000;
  transition: backdrop-filter 0.3s ease;
  margin-left: auto;
  margin-right: auto;
}

.header.scrolled {
  /* 블러효과 (https://www.zappy.ai/kr 참고) */
  backdrop-filter: blur(10px);
  background-color: rgba(23, 23, 23, 0.5);
}

/* .home > div,
.subpage > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
} */

.back,
.close {
  display: contents;
  background-color: transparent;
  border: none;
  width: 24px;
  height: auto;
  cursor: pointer;
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

img.logo {
  width: auto;
  height: 18px;
  cursor: pointer;
}

img.qr {
  margin-left: auto;
  margin-right: 12px;
}

.share,
.use {
  padding: 7px 13px;
  border-radius: 100px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}


.service {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  text-align: center;
  color: #ECEEF0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>