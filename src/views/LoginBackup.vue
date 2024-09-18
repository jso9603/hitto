<template>
  <div class="container">
    <div class="get__started">
      <img src="@/assets/ic-system-logo.svg" />
      <div class="text">행운의 숫자로 꿈꾸는 경제적 자유</div>
      <button @click="kakaoLoginStart" class="kakao">
        <img src="@/assets/ic-system-kakao.svg" />
        카카오로 시작하기
      </button>
    </div>

    <div class="floating">
      <div class="participation">
        <div class="people">
          <div class="person" />
          <div class="person" />
          <div class="person" />
        </div>
        5,230명이 당첨 소감에 참여했어요
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
            console.log('카카오 인가 요청 성공')
            const kakaoAccount = res.kakao_account
            console.log(kakaoAccount)

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

  mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()
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
  height: calc(var(--vh, 1vh) * 100 - 54px);
  background-color: #171717;
  display: flex;
  flex-direction: column;
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

.get__started > button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #FFE812;
  border-radius: 40px;
  padding: 14px 29.5px;
  color: #181D23;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  border: none;
}


.floating {
  position: fixed;
  margin-top: 32px;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-weight: 300;
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
