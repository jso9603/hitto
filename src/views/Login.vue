<template>
  <div class="container">
    <div class="contents">
      <h3>모두의 희망로또</h3>
      <div class="description">
        행운은 도전하는 자의 것,<br/>지금 경제적 자유에 도전하세요!
      </div>

      <div class="benefit" v-for="(benefit, index) in benefits" :key="index">
        <img :src="require(`@/assets/${benefit.icon}`)" />
        <div class="text">{{benefit.text}}</div>
      </div>

      <div class="floating">
        <div class="participation">
          {{ formattedCount }}명이 로또에 당첨됐어요!
        </div>

        <button @click="kakaoLoginStart" class="kakao">
          <img src="@/assets/ic-system-kakao.svg" />
          카카오로 시작하기
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { User } from '../models/User'

@Component
export default class Login extends Vue {
  redirectUrl: string = ''

  private currentCount: number = 0
  private targetCount: number = 0
  private intervalId: number | null = null

  private benefits = [
    {
      icon: 'ic-stefan-2d.svg',
      text: '무료로 ai 로또 번호를 생성해보세요',
    },
    {
      icon: 'ball.svg',
      text: '매주 로또 1등을 맞춰 보세요',
    },
    {
      icon: 'folder.png',
      text: '로또번호를 보관하고 관리해 보세요',
    },
  ]

  async kakaoLoginStart() {
    // console.log(window.Kakao.Auth.getAccessToken())
    await window.Kakao.Auth.login({
      success: (res: any) => {
        console.log(res)
        window.Kakao.Auth.setAccessToken(res.access_token)
        console.log('카카오 로그인 성공')

        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            const kakaoAccount = res.kakao_account
            console.log('카카오 인가 요청 성공: ', kakaoAccount)

            // DB: find and insert or Ignore
            this.saveUsers(kakaoAccount.email)
          },
          fail: (error: any) => {
            console.log(error)
          },
        })
      },
      fail: (error: any) => {
        console.log(error)
      },
    })
  }

  async saveUsers(email: string) {
    try {
      // 기존 이메일 확인
      const q = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      console.log(querySnapshot)

      if (querySnapshot.empty) {
        const user = {
          email,
          uid: `uid_${Date.now()}` // 고유한 uid 생성
        }
        await addDoc(collection(db, 'users'), user)

        this.storeDispache(user)
      } else {
        const doc = querySnapshot.docs[0]
        const userData = doc.data() as User

        this.storeDispache(userData)
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  storeDispache(user: User) {
    Cookies.set('user', JSON.stringify(user), {expires: 30})

    this.redirectUrl ? this.$router.replace(`/${this.redirectUrl}`) : this.$router.go(-1)
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // 숫자를 포맷팅 (1,000 형태로 표시)
  get formattedCount(): string {
    return this.currentCount.toLocaleString()
  }

  // 카운팅 애니메이션
  private startCounting(): void {
    const duration = 3000
    const steps = 100 // 카운팅 업데이트 횟수 (프레임 수)
    const stepTime = Math.floor(duration / steps) // 각 프레임의 시간 간격 (밀리초)
    const increment = Math.ceil(this.targetCount / steps) // 한 번에 더해질 숫자

    this.intervalId = window.setInterval(() => {
      if (this.currentCount < this.targetCount) {
        this.currentCount += increment
        if (this.currentCount >= this.targetCount) {
          this.currentCount = this.targetCount // 목표값을 초과하지 않도록 설정
          clearInterval(this.intervalId!) // 카운팅이 완료되면 멈춤
        }
      }
    }, stepTime)
  }

  async mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()

    this.targetCount = 985
    this.startCounting()
  }

  created() {
    // ex) /login?redirect=select-hope
    this.redirectUrl = this.$route.query.redirect as string
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* header: 54px, 하단 bottom: 126px */
  height: calc(var(--vh, 1vh) * 100 - 54px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.contents {
  width: calc(100% - 40px);
  margin-top: -63px;
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-family: Pretendard;
  font-size: 26px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: #ECEEF0;
}

.description {
  margin-bottom: 36px;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: center;
  color: #9C9EA0;
}

.benefit {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background-color: #1D2330;
}

.benefit > img {
  width: 24px;
  height: 24px;
}

.benefit > .text {
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  line-height: 23px;
  letter-spacing: -0.5px;
  text-align: left;
  color: #ECEEF0;
}

.get__started {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - 122px);
}

.get__started > img {
  margin-bottom: 16px;
  height: 24px;
  width: auto;
}

.get__started > .text {
  margin-bottom: 36px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
}

.floating > button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background-color: #FFE812;
  border-radius: 40px;
  padding: 14px 29.5px;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  border: none;
}

.floating > button > img {
  width: 22px;
  height: 22px;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 40px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding: 20px;
  background: linear-gradient(180deg, rgba(19, 23, 32, 0) 0%, #131720 15.46%, #131720 82.53%);
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.floating > .participation {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-weight: 400;
  font-size: 15px;
}

.floating > .participation > .people {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
}

.floating > .participation > .people > .person:not(:first-child) {
  margin-left: -6px;
}

.floating > .participation > .people > .person {
  width: 24px;
  height: 24px;
  background-color: #414244;
  border-radius: 50%;
  border: 1px solid #181D23;
}
</style>
