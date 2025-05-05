<template>
  <div class="home">
    <img class="main" src="@/assets/img-mohito.png" />
    <div class="desc">
      행운은 도전하는 자의 것,<br />스테판에게 행운의 번호를 받아보세요
    </div>

    <div class="boxes">
      <div
        v-for="menu in menus"
        :key="menu.title"
        class="box"
        @click="onStart(menu.title)"
      >
        <div class="title">{{ menu.title }}</div>
        <div class="text">{{ menu.text }}</div>
        <div
          v-if="menu.badge"
          class="badge"
          :style="{ color: menu.badgeBg, backgroundColor: `${menu.badgeBg}14` }"
        >
          {{ menu.badge }}
        </div>
        <img :src="require(`@/assets/${menu.icon}`)" at="menu 이미지" />
      </div>
    </div>
    <div class="algorithm">
      <div class="light">
        <img src="@/assets/ic-system-star.png" />
      </div>
      <div class="title">스테판이 생성해주는<br />정교한 알고리즘</div>
      <div class="desc">
        AI 통계기반 알고리즘을 통해<br />행운의 번호를 받고 도전해보세요.
      </div>
      <img src="@/assets/ic-system-intro-aicard.png" />
    </div>

    <div class="dream">
      <img class="cloud" src="@/assets/ic-system-cloud.png" />
      <div class="title">꿈자리를 통한<br />이상적인 번호 조합</div>
      <div class="desc">
        1등 당첨자들이 가장 많이 꾼꿈을 조합하여<br />이상적인 번호 생성을
        도와드려요.
      </div>
      <img
        class="list"
        src="@/assets/ic-system-list.png"
        :style="{ 'margin-bottom': initApp ? '90px' : '' }"
      />
    </div>

    <div class="share" v-if="!initApp">
      <div class="title">친구, 지인과 함께<br />로또 1등에 도전해보세요</div>
      <div class="share-channel">
        <div class="round kakao" @click="shareKakao">
          <img src="@/assets/ic-system-kakao.svg" alt="kakao" />
        </div>
        <div class="round sms" @click="shareSms">
          <img src="@/assets/ic-system-sms.svg" alt="sms" />
        </div>
        <div class="round url" @click="shareUrl">URL</div>
        <div class="round more" @click="shareNative">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

    <!-- <div class="floating">
      <div class="count__down">
        <div class="timer">당첨까지 남은 시간</div>
        {{ countdown }}
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(duration)
dayjs.extend(weekday)

@Component
export default class Home extends Vue {
  countdown: string = ''
  initApp: boolean = false

  menus = [
    {
      title: 'AI 생성',
      text: '통계기반 알고리즘',
      icon: 'img-stefan-3d.png',
      badge: '인기',
      badgeBg: '#FF604F',
    },
    {
      title: '수동 생성',
      text: '나만의 번호 관리',
      icon: 'img-custom-3d.png',
    },
    {
      title: '꿈해몽 생성',
      text: '조상님 알고리즘',
      icon: 'img-stella-3d.png',
    },
    {
      title: '오늘의 운세',
      text: '매일매일 희망루틴',
      icon: 'img-sunny-3d.png',
      badge: '추천',
      badgeBg: '#61D59D',
    },
  ]

  onStart(menuTitle: string) {
    this.$store.dispatch('updateMenuName', menuTitle)

    switch (menuTitle) {
      case 'AI 생성':
        this.$router.push('/ai')
        break
      case '수동 생성':
        this.$router.push('/manual')
        break
      case '꿈해몽 생성':
        this.$router.push('/dream')
        break
      case '오늘의 운세':
        this.$router.push('/today')
        break
      default:
        break
    }
  }

  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const source = urlParams.get('source')
    if (source === 'app') {
      // 앱(WebView)에서 접근한 경우 처리
      this.initApp = true
      this.$store.dispatch('updateApp', true)
    }

    this.updateCountdown()
    setInterval(this.updateCountdown, 1000)
  }

  getNextSaturday(): dayjs.Dayjs {
    const now = dayjs()
    let nextSaturday = now.weekday(6).hour(20).minute(30).second(0)

    if (now.isAfter(nextSaturday)) {
      nextSaturday = nextSaturday.add(1, 'week')
    }

    return nextSaturday
  }

  updateCountdown() {
    const now = dayjs()
    const nextSaturday = this.getNextSaturday()
    const diff = nextSaturday.diff(now)
    const durationObj = dayjs.duration(diff)

    const days = Math.floor(durationObj.asDays())
    const hours = durationObj.hours()
    const minutes = durationObj.minutes()
    const seconds = durationObj.seconds()

    if (days === 0) {
      this.countdown = `${hours} : ${minutes} : ${seconds}`
    } else {
      this.countdown = `${days}일 ${hours} : ${minutes} : ${seconds}`
    }
  }

  shareKakao() {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '모두의 희망로또',
        description: '친구, 지인과 함께 로또 1등에 도전해보세요.',
        imageUrl:
          'https://firebasestorage.googleapis.com/v0/b/hitto-1b119.appspot.com/o/meta.png?alt=media&token=cd390b5c-4a74-4891-9671-a3db7a14260d',
        link: {
          mobileWebUrl: 'https://mohito.co.kr',
          webUrl: 'https://mohito.co.kr',
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: 'https://mohito.co.kr',
            webUrl: 'https://mohito.co.kr',
          },
        },
      ],
    })
  }

  shareSms() {
    const message =
      '친구, 지인과 함께 로또 1등에 도전해보세요. 모두의 희망로또!: https://mohito.co.kr'
    const phoneNumber = ''
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
  }

  shareUrl() {
    const currentUrl = 'https://mohito.co.kr'

    // Check if navigator.clipboard.writeText is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          this.$store.dispatch('showCopyImage')
        })
        .catch((err) => {
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

  shareNative() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: '모두의 희망로또',
          text: '친구, 지인과 함께 로또 1등에 도전해보세요.',
          url: 'https://mohito.co.kr',
        })
        .then(() => {
          console.log('공유 성공')
        })
        .catch((error: any) => {
          console.error('공유 실패:', error)
        })
    } else {
      alert('이 브라우저에서는 지원되지 않습니다.')
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.main {
  width: 250px;
  height: 140px;
}

.timer {
  font-size: 14px;
  font-weight: 400;
  line-height: 16.71px;
  text-align: center;
  color: #babcbe;
}

.count__down {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  background-color: #1d2330cc;
  border-radius: 16px;
  border: 1px solid #2e364b;
  padding: 16px;
  color: #61d59d;
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
  font-variant: common-ligatures tabular-nums;
  backdrop-filter: blur(10px);
  transition: backdrop-filter 0.3s ease;
}

.home > .desc {
  margin-bottom: 50px;
  color: #9c9ea0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.boxes {
  width: 100%;
  display: grid;
  grid-template: repeat(1, 1fr) / repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 50px;
}

.box {
  position: relative;
  min-height: 128px;
  padding: 16px;
  background-color: #1d2330;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
}

.box > .title {
  margin-bottom: 6px;
  color: #eceef0;
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
}

.box > .text {
  color: #9c9ea0;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
}

.box > .badge {
  margin-top: 8px;
  margin-bottom: 16px;
  display: table;
  padding: 4px 7px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
}

.box > img {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
}

.text > span {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  display: inline-block;
}

.algorithm {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.algorithm > .light {
  margin-bottom: 12px;
  width: 32px;
}

.algorithm > .light > img {
  width: 32px;
  height: auto;
}

.algorithm > .title {
  margin-bottom: 12px;
  font-size: 26px;
  font-weight: 900;
  line-height: 36px;
  color: #eceef0;
}

.algorithm > .desc {
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #9c9ea0;
}

.algorithm > img {
  width: auto;
  height: 82px;
}

.dream {
  margin-top: 40px;
}

.dream > .cloud {
  width: 32px;
  height: auto;
}

.dream > .title {
  margin-top: 12px;
  color: #eceef0;
  font-size: 26px;
  font-weight: 900;
  line-height: 36px;
}

.dream > .desc {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #9c9ea0;
}

.dream > .list {
  margin-top: 40px;
  width: auto;
  height: 280px;
}

.share {
  margin-top: 40px;
  margin-bottom: 90px;
}

.title {
  margin-bottom: 20px;
  color: #eceef0;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.share-channel {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 20px;
}

.round {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

.kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffe600;
}

.kakao > img,
.sms > img {
  width: 24px;
  height: 24px;
}

.sms {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #61d59d;
}

.url {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2e80fa;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.more {
  background-color: #737577;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.more > div {
  width: 5px;
  height: 5px;
  background-color: #d9d9d9;
  border-radius: 50%;
}

.floating {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 32px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  backdrop-filter: blur(6px);
}
</style>
