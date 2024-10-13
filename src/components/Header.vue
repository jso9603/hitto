<template>
  <div :class="['header', headerClass, { 'scrolled': isScrolled }]">
    <template v-if="$route.path === '/' || $route.path === '/home'">
      <img src="@/assets/ic-system-logo.svg" class="logo" @click="$router.replace('/')" />
      <img src="@/assets/ic-system-qr.svg" class="qr" @click="onQr"/>
      <button class="share" @click="onShare">공유</button>
    </template>

    <template
      v-else-if="$route.path === '/ai' || $route.path === '/dream' || $route.path === '/category' || $route.path === '/random' || $route.path === '/manual' || $route.path === '/fortuneInfo' || $route.path === '/today' || $route.path === '/chatGPT' || $route.path === '/loading' || $router.path === '/fortune-loading' || $router.path === '/after-login'"
    >
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">{{ menuName }}</div>
    </template>

    <template v-else-if="$route.path === '/select-hope'">
      <div class="empty"></div>
      <div class="menu">소망 선택</div>
      <button @click="goBackHope" class="close">
        <img src="@/assets/ic-system-close-img.svg" />
      </button>
    </template>

    <template v-else-if="$route.path === '/qr'">
      <div class="empty"></div>
      <img src="@/assets/ic-system-logo.svg" class="logo" @click="$router.replace('/')" />
      <button @click="goClose" class="close">
        <img src="@/assets/ic-system-close-img.svg" />
      </button>
    </template>

    <template v-else-if="$route.path === '/login'">
      <div class="empty"></div>
      <img src="@/assets/ic-system-logo.svg" class="logo" @click="$router.replace('/')" />
      <button @click="goClose" class="close">
        <img src="@/assets/ic-system-close-img.svg" />
      </button>
    </template>

    <template v-else-if="$route.path === '/my'">
      <div class="empty"></div>
      <div class="menu">더보기</div>
      <img src="@/assets/ic-setting.svg" v-if="isLoggedIn || !isNotLoggedIn" @click="onSetting" />
    </template>

    <template v-else-if="$route.path === '/my/number' && ($route.query.tab === 'automatic' || $route.query.tab === 'manual')">
      <button @click="goClose" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">나의 로또번호</div>
      <button class="share" @click="onSelectedRound">회차</button>
    </template>

    <template v-else-if="$route.path === '/my/number'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">나의 로또번호</div>
      <button class="share" @click="onSelectedRound">회차</button>
    </template>

    <template v-else-if="$route.path === '/my/setting'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">설정</div>
      <div class="empty"></div>
    </template>

    <template v-else-if="$route.path === '/leave'">
      <button @click="goBack" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">탈퇴하기</div>
      <div class="empty"></div>
    </template>

    <template v-else-if="$route.path === '/guess' || $route.path === '/Guess'">
      <div class="empty"></div>
      <div class="menu">{{ menuName }}</div>
      <button class="use" @click="use">안내</button>
    </template>

    <template v-else-if="$route.path === '/challenge'">
      <button @click="goBackChallenge" class="back">
        <img src="@/assets/ic-system-back-img.svg" />
      </button>
      <div class="menu">로또 맞추기</div>
      <div class="empty"></div>
    </template>
    <template v-else-if="$route.path === '/terms'">
      <div class="empty"></div>
      <div class="menu">약관</div>
      <button @click="goBack" class="close">
        <img src="@/assets/ic-system-close-img.svg" />
      </button>
      
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

import { getLoggedUserInfo } from '@/utils/user'

@Component({
  computed: {
    ...mapState(['menuName']),
  },
})
export default class Header extends Vue {
  isScrolled: boolean = false
  isNotLoggedIn: boolean = false

  onQr() {
    this.$router.push('/qr')
  }

  onShare() {
    const currentUrl = window.location.href

    // Check if navigator.clipboard.writeText is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        this.$store.dispatch('showCopyImage')
      }).catch(err => {
        console.error('링크 복사에 실패했습니다:', err)
      })
    } else {
      // Fallback for iOS Safari
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      // Ensure the textarea is not visible and doesn't cause layout shifts
      textArea.style.position = 'fixed' // Fixed position to avoid layout changes
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.width = '1px'
      textArea.style.height = '1px'
      textArea.style.padding = '0'
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.style.opacity = '0' // Make it invisible
      textArea.setAttribute('readonly', '')
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$store.dispatch('showCopyImage')
        } else {
          console.error('링크 복사에 실패했습니다.')
        }
      } catch (err) {
        console.error('링크 복사에 실패했습니다:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  get isLoggedIn() {
    const user = getLoggedUserInfo()

    return user ? true : false
  }

  use() {
    console.log('use click!')
  }

  checkLoginStatus(): void {
    const user = getLoggedUserInfo()
    this.isNotLoggedIn = !user
  }

  // 특정 경로에 있을 때만 로그인 상태를 확인하는 watch 설정
  watchPath(newPath: string): void {
    if (newPath === '/my') {
      this.checkLoginStatus()
    }
  }

  mounted() {
    window.addEventListener('scroll', this.handleScroll)

    // 페이지 로드 시 현재 경로가 /my인 경우 바로 확인
    if (this.$route.path === '/my') {
      this.checkLoginStatus()
    }

    // 경로 변경을 감시
    this.$watch('$route.path', this.watchPath)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    this.isScrolled = window.scrollY > 0
  }

  get headerClass() {
    return this.$route.path === '/' ? 'home' : this.$route.path === '/qr' ? 'qr' : 'subpage'
  }

  get showBackButton() {
    return this.$route.path !== '/' && this.$route.path !== '/my'
  }

  get login() {
    return this.$route.path === '/login'
  }

  goBack() {
    if (this.$route.path === '/random') {
      this.$emit('goBack')
    } else {
      this.$router.back()
    }
  }

  goClose() {
    // 소망 선택 > 괜찮아요 > 로그인 상단 X > 다시 들어갔을 때 오류가 날 가능성
    sessionStorage.clear()
    this.$router.replace('/')
  }

  goBackHope() {
    this.$emit('goBack')
  }

  goBackChallenge() {
    this.$router.back()
  }

  onSetting() {
    this.$router.push('/my/setting');
  }

  onSelectedRound() {
    this.$store.dispatch('updateRoundPopup', true)
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  /* background-color: #171717; */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 20px;
  max-width: calc(576px - 40px);
  z-index: 1000;
  transition: backdrop-filter 0.3s ease;
  margin-left: auto;
  margin-right: auto;

  background-color: rgba(255, 255, 255, 0);
  /* opacity: 0; */
}

.header.popup-active {
  background-color: #00000066;
  z-index: 10;
}

.header.scrolled {
  /* 블러효과 (https://www.zappy.ai/kr 참고) */
  backdrop-filter: blur(10px);
  /* background-color: rgba(23, 23, 23, 0.5); */
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

.empty {
  width: 24px;
  height: 24px;
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
  color: #ECEEF0;
  font-size: 18px;
  font-weight: 600;
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
  padding: 5px 13px;
  border-radius: 100px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
  background-color: #2E364B;
  color: #ECEEF0;
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