<template>
  <div class="today">
    <div class="img-bg">
      <img src='@/assets/img-fortune.png' at="fortune 이미지" />
    </div>
    
    <div class='typing1' v-html="typedText"></div>

    <div class="floating">
      <div class="participation">        
        {{ formattedCount }}명이 오늘의 운세를 받았어요.
      </div>
      <button class="primary" @click="$router.push('/fortuneInfo')">
        <img src="@/assets/ic-system-challenge.svg" />
        운세보기
      </button>
      <div class="disclamer">
        모희또 서비스에서 제공하는 생성번호는 참고 용도이며,<br/>그로 인한 책임은 사용자에게 있습니다.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { getCounting } from '@/utils/counting'

@Component
export default class TodayFortune extends Vue {
  typedText = ''

  private currentCount: number = 0
  private targetCount: number = 0
  private intervalId: number | null = null

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

    const dream = await getCounting()
    this.targetCount = +dream - 389
    this.startCounting()

    const contents: string =
      '당신의 오늘은 어떨까요?\n쪽집게 스테판에게 물어보세요!'
    let saveInterval: number | undefined

    let index = 0
    this.typedText = ''
    clearInterval(saveInterval) // 기존 interval 종료

    saveInterval = window.setInterval(() => {
      if (index >= contents.length - 1) {
        clearInterval(saveInterval) // 인덱스가 범위에 도달하면 interval 종료
      }

      if (contents[index] === '\n') {
        // 두 줄바꿈(\n\n)을 확인하여 두 번째 줄바꿈에만 스타일 적용
        if (contents[index + 1] === '\n') {
          this.typedText += '<div class="spacer"></div>' // 두 번째 줄바꿈에 여백을 추가
          index += 2 // 두 개의 줄바꿈을 건너뜀
        } else {
          this.typedText += '<br />'
          index++
        }
      } else {
        if (index >= contents.lastIndexOf('"자~ 이제 시작해볼까요?"')) {
          this.typedText += `<span>${contents[index++]}</span>`
        } else {
          this.typedText += contents[index++]
        }
      }
    }, 50);
  }

  beforeDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
</script>

<style scoped>
.today {
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 54px);
  position: relative;
}

.today > .img-bg {
  position: absolute;
  top: calc(50% - 178px);
  
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 16px;
}

.img-bg > img {
  width: 90px;
  height: 90px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.typing1 {
  width: 100%;
  color: #ECEEF0;
  font-size: 22px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.5px;
  text-align: center;

  position: absolute;
  top: calc(50% - 70px); /* 텍스트의 높이 294px의 절반인 147px을 보정 */
  white-space: pre-wrap;
}

::v-deep .spacer {
  display: block;
  margin-top: 20px; /* 줄바꿈 사이 여백 */
}

.startBtn {
  margin-top: 20px;
  background-color: #4AFF81;
  padding: 16.5px 20px;
  border-radius: 40px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;

  opacity: 0;
  /* animation: fadeIn 2s forwards;  */
  animation: slideUp 1s ease-in-out forwards;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  color: #ECEEF0;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  font-variant: common-ligatures tabular-nums;
}

.floating > .participation > .people {
  display: flex;
  flex-direction: row;
}

.floating > .participation > .people > .person:not(:first-child) {
  margin-left: -6px;
}

.floating > .participation > .people > .person {
  /* background-color: #414244; */
  border-radius: 50%;
  /* border: 1px solid #181D23; */
}

.floating > .participation > .people > img {
  width: 32px;
  height: 32px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.disclamer {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
  color: #737577;
  text-align: center;
}

@keyframes slideUp {
  0% {
    transform: translateY(30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>