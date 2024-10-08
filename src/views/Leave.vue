<template>
  <div class="leave">
    <img src="@/assets/img-stefan.svg" />
    <div class="title">모히또를 떠나신다니 아쉬워요!</div>
    <div class="desc">지금 탈퇴하면 아래 정보와 혜택이 모두 사라져요.<br/>회원 탈퇴 신청 전에 아래 사항을 꼭 확인해주세요!</div>

    <div class="benefits">
      <div class="benefit" v-for="(benefit, index) in benefits" :key="index">
        <div>{{index + 1}}.</div>
        {{benefit}}
      </div>
    </div>

    <div class="floating">
      <div class="participation">{{ formattedCount }}명이 추천 번호를 받았어요</div>
      <button
        class="primary"
        @click="onCancel"
      >
        좀 더 써볼게요
      </button>
      <button :disabled="isLoading" class="none" @click="onLeave">
        <div v-if="isLoading" class="loading-spinner">
          <img src="@/assets/ic-progress.svg" />
        </div>
        <template v-if="!isLoading">탈퇴할게요</template>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

import { db } from '../../src/config/firebaseConfig'
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore'

import { getCounting } from '@/utils/counting'
import { getLoggedUserInfo } from '@/utils/user'

@Component
export default class Leave extends Vue {
  private isLoading = false

  private currentCount: number = 0
  private targetCount: number = 0
  private intervalId: number | null = null

  private benefits = [
    "저장된 '내 번호' 정보가 모두 사라져요",
    "회원 전용 다양한 혜택 제공이 중단돼요",
    "저장된 '내 번호' 정보가 모두 사라져요",
  ]

  private onCancel() {
    this.$router.back()
  }

  private async onLeave() {
    const user = getLoggedUserInfo()

    if (user) {
      try {
        this.isLoading = true

        const batch = writeBatch(db) // Firestore 배치 생성

        // 삭제해야 할 컬렉션들
        const collections = ['manual', 'automatic', 'users']

        for (const collectionName of collections) {
          // 해당 컬렉션에서 uid가 같은 문서들을 쿼리
          const q = query(collection(db, collectionName), where('uid', '==', user.uid))
          const querySnapshot = await getDocs(q)

          querySnapshot.forEach((doc) => {
            // 각 문서를 배치에 추가
            batch.delete(doc.ref)
          })
        }

        // 배치 커밋: 모든 삭제 작업 실행
        await batch.commit()
        console.log(`All documents with uid ${user.uid} have been successfully deleted from collections.`)

        sessionStorage.clear()

        Cookies.remove('user')
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false

        await alert('탈퇴가 정상적으로 처리되었습니다. 그동안 이용해주셔서 감사합니다')
        await this.$router.replace('/')
      }
    }
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
    this.targetCount = await getCounting()
    this.startCounting()
  }
}
</script>

<style scoped>
.leave {
  position: relative;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 102px);
}

img {
  width: 60px;
  height: 60px;
}

.title {
  margin-top: 16px;
  font-size: 22px;
  font-weight: 700;
  line-height: 26px;
  color: #fff;
}

.desc {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: #9C9EA0;
}

.benefits {
  margin-top: 48px;
}

.benefits > .benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 20px 16px 20px;
  border-radius: 16px;
  background-color: #1D2330;
  font-size: 15px;
  font-weight: 600;
  line-height: 23px;
  color: #fff;
}

.benefits > .benefit > div {
  font-size: 15px;
  font-weight: 600;
  line-height: 23px;
  color: #4AFF81;
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
}

.floating > .participation {
  margin-bottom: 15px;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  color: #fff;
}

.floating > button {
  width: 100%;
  min-height: 52px;
  background-color: #ECEEF0;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
}

.floating > button:disabled {
  background-color: #414244;
  color: #181D23;
}

.floating > button.none {
  background-color: transparent;
  color: #9C9EA0;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.loading-spinner > img {
  width: 20px;
  height: 20px;
  animation: rotate 1s linear infinite;
}
</style>