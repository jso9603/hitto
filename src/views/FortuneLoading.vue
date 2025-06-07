<template>
  <div class="container">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="message"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
      {{ message }}
    </div>
    <div class="random-animation">
      <canvas ref="loadingCanvas" width="160" height="160"></canvas>
    </div>

    <div class="floating">
      <div class="floating-text">
        <div class="text-item">
          {{ currentText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import Cookies from 'js-cookie'

import { Ball } from '../models/Ball'

@Component
export default class FortuneLoading extends Vue {
  private canvas: HTMLCanvasElement | null = null
  private balls: Ball[] = []
  private ballCount = 10 // 공의 개수
  private animationId: number = 0
  private progress: number = 0 // 로딩바 진행 상태
  private colors: string[] = [
    '#FEC03E',
    '#4790FF',
    '#E64D3D',
    '#2ECD70',
    '#BEC3C7',
  ]

  // 원의 중심점과 반지름
  private circleCenter = { x: 80, y: 80 } // canvas의 중앙
  private circleRadius = 80 // 원의 반지름 (로딩 바)

  private messages = ['AI 통계기반', '운세 정보를 생성하고 있어요']
  private floatings = [
    '객관적인 운세 결과를 위해 30초 정도가 소요됩니다',
    '이름과 성별을 분석 중입니다',
    '생년월일과 태어난 시를 분석 중입니다 ',
  ]

  // 현재 보여줄 텍스트의 인덱스
  private currentIndex: number = 0

  private fortuneUserName: string = ''

  // 애니메이션으로 보여줄 텍스트 (현재의 텍스트)
  get currentText() {
    return this.floatings[this.currentIndex]
  }

  initCanvas() {
    this.canvas = this.$refs.loadingCanvas as HTMLCanvasElement
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d')

      // 고해상도 스크린을 위해 배율 설정
      const dpr = window.devicePixelRatio || 1
      // 실제 픽셀 크기와 스타일 크기 분리
      const canvasSize = 160 // 화면상에서의 크기
      this.canvas.width = canvasSize * dpr // 실제 픽셀 크기
      this.canvas.height = canvasSize * dpr // 실제 픽셀 크기

      this.canvas.style.width = `${canvasSize}px` // 화면 상의 크기
      this.canvas.style.height = `${canvasSize}px` // 화면 상의 크기

      ctx?.scale(dpr, dpr) // 배율 조정

      if (ctx) {
        // 공 생성 및 초기화
        for (let i = 0; i < this.ballCount; i++) {
          const color = this.colors[i % this.colors.length]
          this.balls.push({
            x: this.circleCenter.x + (Math.random() - 0.5) * this.circleRadius, // 원 안에서 임의의 위치
            y: this.circleCenter.y + (Math.random() - 0.5) * this.circleRadius,
            radius: 8, // 공 크기
            dx: (Math.random() - 0.5) * 6, // 속도 조정
            dy: (Math.random() - 0.5) * 6,
            color: color,
          })
        }
      }
    }
  }

  // 애니메이션 시작
  animateBalls() {
    const ctx = this.canvas?.getContext('2d')
    if (ctx && this.canvas) {
      const width = this.canvas.width
      const height = this.canvas.height

      const draw = () => {
        // 캔버스 지우기
        ctx.clearRect(0, 0, width, height)

        // 로딩바 그리기 (파란 원형 선)
        this.drawLoadingBar(ctx)

        // 공 그리기 및 위치 업데이트
        this.balls.forEach((ball) => {
          this.drawBall(ctx, ball)
          this.updateBallPosition(ball)
        })

        // 공끼리의 충돌 처리
        this.handleBallCollisions()

        // 다음 프레임 요청
        this.animationId = requestAnimationFrame(draw)
      }

      draw()
    }
  }

  // 공 그리기 함수
  drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    const gradient = ctx.createLinearGradient(
      ball.x,
      ball.y - ball.radius, // 그라데이션 시작점 (위쪽)
      ball.x,
      ball.y + ball.radius, // 그라데이션 끝점 (아래쪽)
    )

    if (ball.color === '#4790FF') {
      gradient.addColorStop(0, '#74B9FF') // 밝은 파랑
      gradient.addColorStop(1, '#2980B9') // 어두운 파랑
    } else if (ball.color === '#FEC03E') {
      gradient.addColorStop(0, '#FFD700') // 밝은 노랑
      gradient.addColorStop(1, '#FFA500') // 어두운 오렌지
    } else if (ball.color === '#E64D3D') {
      gradient.addColorStop(0, '#FF6F61') // 밝은 빨강
      gradient.addColorStop(1, '#C0392B') // 어두운 빨강
    } else if (ball.color === '#2ECD70') {
      gradient.addColorStop(0, '#66FF99') // 밝은 초록
      gradient.addColorStop(1, '#27AE60') // 어두운 초록
    } else if (ball.color === '#BEC3C7') {
      gradient.addColorStop(0, '#E0E0E0') // 밝은 회색
      gradient.addColorStop(1, '#7C8388') // 어두운 회색
    }

    // 공 그리기
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2) // 공의 형태
    ctx.fillStyle = gradient // 그라데이션을 색상으로 설정
    ctx.fill()
    ctx.closePath()
  }

  // 공의 위치를 업데이트하는 함수
  updateBallPosition(ball: Ball) {
    const ctx = this.canvas?.getContext('2d') // context 가져오기

    if (!ctx) return

    ball.x += ball.dx
    ball.y += ball.dy

    const distX = ball.x - this.circleCenter.x
    const distY = ball.y - this.circleCenter.y
    const distance = Math.sqrt(distX * distX + distY * distY)

    // 로딩바 안쪽 경계(반지름 - 로딩바 두께 - 공의 반지름)에 부딪힐 경우 반사
    const boundaryRadius = 57

    // 공이 원의 경계에 부딪혔을 때
    if (distance > boundaryRadius) {
      const angle = Math.atan2(distY, distX)
      ball.dx = -ball.dx
      ball.dy = -ball.dy

      // 공을 경계 안쪽으로 이동시킴
      ball.x = this.circleCenter.x + boundaryRadius * Math.cos(angle)
      ball.y = this.circleCenter.y + boundaryRadius * Math.sin(angle)
    }
  }

  // 공끼리 충돌 처리 함수
  handleBallCollisions() {
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const dx = this.balls[j].x - this.balls[i].x
        const dy = this.balls[j].y - this.balls[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // 두 공이 충돌했을 경우 반사 처리
        if (distance < this.balls[i].radius + this.balls[j].radius) {
          const angle = Math.atan2(dy, dx)
          const sin = Math.sin(angle)
          const cos = Math.cos(angle)

          // 공의 위치 회전
          const pos0 = { x: 0, y: 0 }
          const pos1 = { x: dx * cos + dy * sin, y: dy * cos - dx * sin }

          // 공의 속도 회전
          const vel0 = {
            x: this.balls[i].dx * cos + this.balls[i].dy * sin,
            y: this.balls[i].dy * cos - this.balls[i].dx * sin,
          }
          const vel1 = {
            x: this.balls[j].dx * cos + this.balls[j].dy * sin,
            y: this.balls[j].dy * cos - this.balls[j].dx * sin,
          }

          // 충돌 후 속도
          const vxTotal = vel0.x - vel1.x
          vel0.x =
            ((this.balls[i].radius - this.balls[j].radius) * vel0.x +
              2 * this.balls[j].radius * vel1.x) /
            (this.balls[i].radius + this.balls[j].radius)
          vel1.x = vxTotal + vel0.x

          // 공 위치 조정
          const absV = Math.abs(vel0.x) + Math.abs(vel1.x)
          const overlap =
            this.balls[i].radius +
            this.balls[j].radius -
            Math.abs(pos0.x - pos1.x)
          pos0.x += (vel0.x / absV) * overlap
          pos1.x += (vel1.x / absV) * overlap

          // 위치를 다시 회전
          const pos0F = {
            x: pos0.x * cos - pos0.y * sin,
            y: pos0.y * cos + pos0.x * sin,
          }
          const pos1F = {
            x: pos1.x * cos - pos1.y * sin,
            y: pos1.y * cos + pos1.x * sin,
          }

          this.balls[j].x = this.balls[i].x + pos1F.x
          this.balls[j].y = this.balls[i].y + pos1F.y
          this.balls[i].x += pos0F.x
          this.balls[i].y += pos0F.y

          // 속도를 다시 회전
          const vel0F = {
            x: vel0.x * cos - vel0.y * sin,
            y: vel0.y * cos + vel0.x * sin,
          }
          const vel1F = {
            x: vel1.x * cos - vel1.y * sin,
            y: vel1.y * cos + vel1.x * sin,
          }

          this.balls[i].dx = vel0F.x
          this.balls[i].dy = vel0F.y
          this.balls[j].dx = vel1F.x
          this.balls[j].dy = vel1F.y
        }
      }
    }
  }

  // 파란 원형 로딩바 그리기
  drawLoadingBar(ctx: CanvasRenderingContext2D) {
    const dpr = window.devicePixelRatio || 1 // 배율 적용

    const centerX = this.canvas!.width / 2 // 배율 적용하여 좌표 조정
    const centerY = this.canvas!.height / 2
    const radius = 70 * dpr // 배율에 맞게 반지름 조정
    const lineWidth = 13 * dpr // 선 두께를 dpr에 맞게 조정
    const startAngle = -Math.PI / 2 // 12시 방향에서 시작
    const endAngle = startAngle + Math.PI * 2 * (this.progress / 100) // 진행 상태에 따라 각도를 조정

    // 배경 원형 그리기 (회색 원)
    ctx.beginPath()
    ctx.arc(centerX / dpr, centerY / dpr, radius / dpr, 0, Math.PI * 2)
    ctx.strokeStyle = '#242A3B'
    ctx.lineWidth = lineWidth / dpr
    ctx.stroke()
    ctx.closePath()

    // 그라데이션 추가
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      this.canvas!.height / dpr,
    )
    gradient.addColorStop(0.0, '#61D59D') // 진한 초록색이 처음부터 끝까지 유지
    gradient.addColorStop(0.8, '#61D59D') // 진한 초록색 유지
    gradient.addColorStop(1.0, '#61D59D') // 마지막에 색상이 옅어짐

    // 진행 상태에 따른 원형 그라데이션 그리기
    ctx.beginPath()
    ctx.arc(centerX / dpr, centerY / dpr, radius / dpr, startAngle, endAngle)
    ctx.strokeStyle = gradient // 그라데이션 적용
    ctx.lineWidth = lineWidth / dpr
    ctx.lineCap = 'round' // 원형 끝을 둥글게
    ctx.stroke()
    ctx.closePath()
  }

  // 프로그레시브 바 진행 함수
  incrementProgress() {
    setInterval(() => {
      if (this.progress >= 100) {
        this.progress = 0 // progress가 100%에 도달하면 다시 0으로 초기화
      } else {
        this.progress += 1 // progress 증가
      }
    }, 30) // 30ms마다 1씩 증가
  }

  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // 컴포넌트가 파괴되기 전 애니메이션을 멈추기
  beforeDestroy() {
    cancelAnimationFrame(this.animationId)
  }

  startTextFlip() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.floatings.length
    }, 4000) // 3초마다 텍스트 전환
  }

  async getFortune() {
    console.log(process.env.VUE_APP_GPT_API_KEY)

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `
                당신은 운세 전문가입니다. 사용자에게 오늘의 재물운, 연애운, 사업운, 건강운, 시험운을 각각 한국어로 1줄 요약과 5줄 이상의 상세 설명으로 알려주세요.
              응답은 반드시 JSON 형식으로 주세요. 형식은 아래와 같이 해주세요:
              {
                "fortunes": [
                  { "category": "재물운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "연애운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "사업운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "건강운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "시험운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" }
                ]
              }
              `,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_GPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // 운세 데이터를 파싱하여 각 항목에 저장
      const result = JSON.parse(response.data.choices[0].message.content)

      if (result.fortunes && Array.isArray(result.fortunes)) {
        this.$router.push({
          name: 'ChatGPT',
          params: {
            fortunes: JSON.stringify(result.fortunes),
            fortuneUserName: this.fortuneUserName,
          },
        })
      } else {
        console.error('운세 데이터가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('운세 데이터를 불러오는 중 오류가 발생했습니다:', error)
    }
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()

    this.initCanvas()
    this.animateBalls()
    this.incrementProgress() // 로딩바를 진행시키는 함수 호출

    this.startTextFlip()

    const fortuneUserName = this.$route.params.fortuneName
    if (fortuneUserName) {
      this.fortuneUserName = fortuneUserName
      Cookies.set('fortuneName', this.fortuneUserName, { expires: 1 })
    }

    // 광고 호출 및 콜백 등록
    setTimeout(() => {
      if ((window as any).flutter_inappwebview) {
        // eslint-disable-next-line no-extra-semi
        ;(window as any).flutter_inappwebview.callHandler('AdChannel', 'showAd')

        // 광고 완료 콜백
        if (!(window as any).flutterAdDone) {
          // eslint-disable-next-line no-extra-semi
          ;(window as any).flutterAdDone = () => {
            this.getFortune()
          }
        }

        // 광고 실패 콜백
        if (!(window as any).flutterAdFailed) {
          // eslint-disable-next-line no-extra-semi
          ;(window as any).flutterAdFailed = () => {
            alert('광고가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
          }
        }
      } else {
        // 웹 fallback 처리
        this.getFortune()
      }
    }, 3000)
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 54px);
}

@keyframes slideUp2 {
  0% {
    transform: translateY(50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  /* animation: slideUp 2s ease-in-out forwards; */
  opacity: 0;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;

  transform: translateY(50%);
  animation: slideUp2 1s forwards;
}

canvas {
  margin-top: 32px;
}

.floating {
  position: fixed;
  bottom: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 40px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  display: flex;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(
    180deg,
    rgba(19, 23, 32, 0) 0%,
    #131720 15.46%,
    #131720 82.53%
  );
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
}

.floating-text {
  font-size: 14px;
  font-weight: 400;
  color: #737577;
  text-align: center;
  padding: 10px 20px;
  border-radius: 8px;
  position: relative;
}

.text-item {
  width: 100%;
  text-align: center;
  animation: slide-up 4s infinite;
  opacity: 0;
  animation-fill-mode: forwards; /* 애니메이션 종료 후 상태 유지 */
}

@keyframes slide-up {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
