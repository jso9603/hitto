<template>
  <div class="my">
    <div class="summary">
      <div class="img-bg">
        <img src="@/assets/img-stefan-3d.png" class="person" />
      </div>
      <div class="nickname">{{nickname}}</div>
      <div class="email">
        <div class="kakao">
          <img src="@/assets/ic-system-kakao.svg" />
        </div>
        <div v-if="user !== null">{{user.email}}</div>
        <div v-if="user === null" class="kakao-login" @click="onLogin">카카오 계정으로 로그인해주세요.</div>
      </div>
    </div>

    <div class="coopang" @click="onCoopang">
      <img src="@/assets/AD.png" alt="쿠팡 광고" />
    </div>

    <div class="menu">
      <div class="title">서비스</div>
        <div
          v-for="item in services"
          :key="item.title"
          class="service-item"
          @click="onService(item)"
        >
          <span class="service-title">{{ item.title }}</span>
          <span
            v-if="item.badge"
            class="badge"
            :style="{ color: item.badgeBg, backgroundColor: `${item.badgeBg}14` }"
          >
            {{ item.badge }}
          </span>
          <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">저장소</div>
      <div v-for="item in repositories" :key="item.title" class="service-item" @click="onNumber(item.title)">
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">일반</div>
      <div v-for="(item, i) in general" :key="item.title" class="service-item" @click="onGeneral(i)">
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <!-- <div class="coopang-disclamer">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div> -->

    <ins class="adsbygoogle"
     style="display:inline-block;width:335px;height:60px"
     data-ad-client="ca-pub-7548744760182744"
     data-ad-slot="7638100912">
    </ins>

    <ins class="kakao_ad_area" style="display:none;"
      data-ad-unit = "DAN-2u949GtMCSfxJbji"
      data-ad-width = "320"
      data-ad-height = "50">
    </ins>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { getLoggedUserInfo } from '@/utils/user'

@Component
export default class My extends Vue {
  nickname = ''
  user: any = {}

  services = [
    {
      title: 'AI 생성',
      link: '/ai',
      badge: '인기',
      badgeBg: '#FF604F',
    },
    {
      title: '수동 생성',
      link: '/manual',
    },
    {
      title: '꿈해몽 생성',
      link: '/dream',
    },
    {
      title: '오늘의 운세',
      link: '/today',
      badge: '추천',
      badgeBg: '#61D59D',
    },
  ]

  repositories = [{ title: '나의 로또 번호' }]

  general = [
    {
      title: '고객센터',
    },
    {
      title: '광고 문의',
    },
    {
      title: '개인 정보 보호 및 약관',
    },
  ]

  private adjectives: string[] = [
    '희망찬', '용감한', '즐거운', '활기찬', '씩씩한', '지혜로운', '사랑스러운', '기쁜', '자유로운', '귀여운',
  ]

  private animals: string[] = [
    '돼지', '호랑이', '사자', '고양이', '강아지', '곰', '여우', '토끼', '독수리', '판다',
  ]

  onCoopang() {
    window.open('https://link.coupang.com/a/bU6BtZ', '_blank')
  }

  generateNickname(uid: string): string {
    const firstDigit = parseInt(uid.split('_')[1].charAt(0))
    const lastDigit = parseInt(uid.slice(-1), 10)
    const number = parseInt(uid.split('_')[1].substring(0, 4))

    const adjective = this.adjectives[firstDigit % this.adjectives.length - 1]
    const index = lastDigit % this.animals.length - 1
    const adjustedIndex = index < 0 ? 0 : index
    const animal = this.animals[adjustedIndex]

    return `${adjective}${animal}${number}`
  }

  onGeneral(index: number) {
    if (index === 0) {
      const openKakaoUrl = 'https://open.kakao.com/o/gc9Y3ZSg'
      window.open(openKakaoUrl, '_blank')
    } else if (index === 1) {
      this.openEmail('광고문의')
    } else {
      this.$router.push('/terms')
    }
  }

  onService(item: { title: string, link: string }) {
    this.$store.dispatch('updateMenuName', item.title)
    this.$router.push(item.link)
  }

  onNumber(title: string) {
    this.$store.dispatch('updateMenuName', title)

    if (this.user) {
      this.$router.push('/my/number')
    } else {
      this.$router.replace(`/login?redirect=my`)
    }
  }

  openEmail(subjectTitle: string) {
    const email = 'mohito.project@gmail.com'
    const subject = encodeURIComponent(subjectTitle)
    const body = encodeURIComponent('여기에 내용을 입력하세요.')

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`
    window.location.href = mailtoLink
  }

  onLogin() {
    this.$router.replace('/login?redirect=my')
  }

  created() {
    const user = getLoggedUserInfo()
    
    if (user) {
      try {
        this.user = user
        this.nickname = this.generateNickname(this.user.uid)
      } catch (error) {
        this.user = null
      }
    } else {
      this.user = null
      this.nickname = 'Guest'
    }
  }

  mounted() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }
}
</script>

<style scoped>
.my {
  margin-top: 10px;
  margin-bottom: calc(40px + 64px + env(safe-area-inset-bottom));
  padding: 0 20px;
}

.summary {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.summary > .img-bg {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0085FF;
  border-radius: 50%;
  margin-bottom: 12px;
}

.summary > .img-bg > img {
  width: 42px;
  height: 42px;
  text-align: center;
}

.summary > .nickname {
  margin-bottom: 4px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color:#ECEEF0;
}

.summary > .email {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  color: #9C9EA0;
}

.kakao-login {
  cursor: pointer;
}

.summary > .email > .kakao {
  background-color: #ECEEF0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 75px;
}

.summary > .email > .kakao > img {
  width: 13.5px;
  height: 13.5px;
}

.coopang {
  padding: 7px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #375666;
  border-radius: 12px;
}

.coopang > img {
  width: auto;
  height: 40px;
}

.menu {
  margin-bottom: 28px;
  font-size: 14px;
  font-weight: 600;
  color: #9C9EA0;
}

.menu > .title {
  margin-bottom: 1px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: left;
  color: #9C9EA0;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 7px 0;
  cursor: pointer;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item > img {
  margin-left: auto;
}

.badge {
  margin-left: 8px;
  display: table;
  padding: 4px 7px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
}

.service-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: #ECEEF0;
}

.coopang-disclamer {
  margin-top: 48px;
  color: #FFFFFF4D;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}
</style>