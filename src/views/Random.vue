<template>
  <div class="container" :class="{ add: !showPage1 }">
    <SelectHopePopup
      :visible="isPopupVisible"
      @close="isPopupVisible = false"
    />

    <LoginPopup
      v-if="showLoginPopup"
      :numbers="LoginPopupNumbers"
      :visible="isLoginPopupVisible"
      @close="isLoginPopupVisible = false"
    />

    <transition name="fade" mode="out-in">
      <div class="page1" v-if="showPage1" key="page1">
        <div v-if="showMessage">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            {{ message }}
          </div>
        </div>
        <div class="random-animation">
          <canvas ref="loadingCanvas" width="160" height="160"></canvas>
        </div>
      </div>

      <div class="page2" v-else key="page2">
        <div :class="['img-bg', background]" :style="{ animationDelay: `0s` }">
          <img :src="require(`@/assets/${charater}`)" at="character 이미지" />
        </div>

        <div v-if="showMessage2">
          <div
            v-for="(message, index) in messages2"
            :key="index"
            class="message2"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            {{ message }}
          </div>
        </div>

        <div class="result__box">
          <div
            v-for="(round, index) in lottoNumbers"
            :key="index"
            class="round"
          >
            <div class="row">
              <div
                v-for="number in round.slice(0, 3)"
                :key="number"
                :class="getNumberClass(number)"
              >
                {{ number }}
              </div>
            </div>
            <div class="row">
              <div
                v-for="number in round.slice(3, 5)"
                :key="number"
                :class="getNumberClass(number)"
              >
                {{ number }}
              </div>
              <div :class="[getNumberClass(round[6])]">
                {{ round[5] }}
              </div>
            </div>
          </div>
        </div>

        <div class="floating">
          <button class="none" @click="oneMore">재선택</button>
          <button :disabled="isLoading" class="primary" @click="onSelectedBall">
            <div v-if="isLoading" class="loading-spinner">
              <img src="@/assets/ic-progress-black.svg" />
            </div>
            <template v-if="!isLoading">선택하기</template>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

import { getLoggedUserInfo } from '@/utils/user'
import { Ball } from '../models/Ball'
import SelectHopePopup from '@/components/SelectHopePopup.vue'
import LoginPopup from '@/components/LoginPopup.vue'

import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { User } from '../models/User'

@Component({
  components: {
    SelectHopePopup,
    LoginPopup,
  },
  computed: {
    ...mapState(['menuName']),
    ...mapState(['showLoginPopup']),
  },
})
export default class Random extends Vue {
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

  private messages: string[] = ['AI 통계기반', '로또 번호를 생성하고 있어요']
  private messages2 = ['로또 번호를 생성했어요!', '맘에 드시나요?']
  private selectedMessage: string | null = null
  private showMessage: boolean = false
  private showMessage2: boolean = false

  private showPage1: boolean = true
  private isPopupVisible: boolean = false

  private isLoading = false
  charater = ''
  background = ''

  // 확률 높은 숫자들
  highProbNumbers: number[] = [6, 7, 12, 14, 17, 24, 26, 27, 33, 34, 42, 43, 45]
  private lottoNumbers: number[][] = []

  isLoginPopupVisible = false
  private LoginPopupNumbers: number[] = []

  get showLoginPopup() {
    return this.$store.state.showLoginPopup
  }

  get dynamicHeight() {
    return `calc(var(--vh, 1vh) * 100 - ${this.showPage1 ? '54px' : '192px'})`
  }

  oneMore() {
    location.reload() // 페이지 새로고침
  }

  // Canvas 초기화 및 공 생성
  // HTML5 <canvas> 엘리먼트의 width와 height는 디스플레이 해상도와 실제 픽셀 값 간의 불일치로 인해 그래픽이 흐릿하게 보일 수 있음.
  // 특히 고해상도 디스플레이에서는 더 뚜렷하게 나타날 수 있음.
  // 이를 해결하기 위해, 캔버스의 CSS 크기와 실제 픽셀 크기를 분리하여 고해상도 디스플레이에서도 선명한 렌더링을 유지하도록
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

  // 컴포넌트가 파괴되기 전 애니메이션을 멈추기
  beforeDestroy() {
    cancelAnimationFrame(this.animationId)

    // 컴포넌트가 파괴될 때 전역 함수 제거
    delete (window as any).loginSuccess
    delete (window as any).loginFailure
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  private selectRandomMessageWithDelay() {
    this.showMessage = true

    setTimeout(() => {
      this.showPage1 = false
      this.showMessage2 = true
      this.generateHighNumbers(1)
    }, 3000)
  }

  private handleBackButton(): void {
    if (this.$route.path !== '/') {
      // this.$router.replace('/')
      const user = getLoggedUserInfo()

      if (
        !user &&
        this.$route.path === '/random' &&
        sessionStorage.getItem('lottoNumbers')
      ) {
        this.showPopup()

        // 히스토리를 조작하여 페이지 이동을 막음
        history.pushState(null, '', window.location.href)
      }
    }
  }

  showPopup() {
    const storedNumbers = sessionStorage.getItem('lottoNumbers')

    if (storedNumbers) {
      // 문자열에서 양쪽의 따옴표를 제거하고, 쉼표로 분리하여 배열로 변환 후 숫자로 변환
      this.LoginPopupNumbers = storedNumbers
        .replace(/^"|"$/g, '') // 양 끝의 따옴표 제거
        .split(',') // 쉼표로 문자열 분리
        .map((num) => Number(num.trim())) // 각 요소를 숫자로 변환
    }

    this.isLoginPopupVisible = true
  }

  created() {
    this.background = this.$store.state.menuName!.includes('꿈해몽')
      ? 'yellow-bg'
      : 'blue-bg'
    this.charater = this.$store.state.menuName!.includes('꿈해몽')
      ? 'img-stella-3d.png'
      : 'img-stefan-3d.png'
  }

  loginSuccess(accessToken: string, email: string) {
    this.saveUsers(email)
  }

  loginFailure(errorMessage: any) {
    alert(errorMessage)
  }

  async saveUsers(email: string) {
    try {
      // 기존 이메일 확인
      const q = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      console.log('querySnapshot: ', querySnapshot)

      if (querySnapshot.empty) {
        const user = {
          email,
          uid: `uid_${Date.now()}`, // 고유한 uid 생성
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
    Cookies.set('user', JSON.stringify(user), { expires: 30 })
    this.saveLottoNumbers()
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()

    // 페이지 로드 시 히스토리 상태 추가 (페이지 이동 막기 위해 pushState 사용)
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', this.handleBackButton)

    this.initCanvas()
    this.animateBalls()
    this.incrementProgress() // 로딩바를 진행시키는 함수 호출

    this.selectRandomMessageWithDelay()

    // eslint-disable-next-line no-extra-semi
    ;(window as any).loginSuccess = (accessToken: string, email: string) => {
      this.loginSuccess(accessToken, email)
      return {
        loginFailure: this.loginFailure,
      }
    }
  }

  // 처음 공
  // private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  //   ctx.beginPath()
  //   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  //   ctx.fillStyle = ball.color // 볼의 색깔을 지정
  //   ctx.fill()
  //   ctx.closePath()
  // }

  // 그라데이션
  // private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  //   const gradient = ctx.createRadialGradient(ball.x - ball.radius / 2, ball.y - ball.radius / 2, ball.radius / 4, ball.x, ball.y, ball.radius)
  //   gradient.addColorStop(0, 'white')
  //   gradient.addColorStop(1, ball.color)

  //   ctx.beginPath()
  //   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  //   ctx.fillStyle = gradient // 볼의 색깔을 그라데이션으로 지정
  //   ctx.fill()
  //   ctx.closePath()
  // }

  getRandomNumbers(array: number[], count: number): number[] {
    const result = []
    const _array = [...array]
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * _array.length)
      result.push(_array.splice(index, 1)[0])
    }
    return result
  }

  getRemainingNumbers(exclude: number[]): number[] {
    const remaining = []
    for (let i = 1; i <= 45; i++) {
      if (!exclude.includes(i) && !this.highProbNumbers.includes(i)) {
        remaining.push(i)
      }
    }
    return remaining
  }

  generateLotteryNumbers(): number[] {
    // const selectedHighProbNumbers = this.getRandomNumbers(this.highProbNumbers, 3)
    // const remainingNumbers = this.getRemainingNumbers(selectedHighProbNumbers)
    // const selectedRemainingNumbers = this.getRandomNumbers(remainingNumbers, 3)
    // return selectedHighProbNumbers.concat(selectedRemainingNumbers).sort((a, b) => a - b)

    // 연속되는 숫자가 나오는 번호대는 더이상 나오지 않도록 수정
    // ex) 16, 17이 나오면 더이상 10번대는 나오지 않게 / 연속되는 수는 번호대와 상관없음  => 16, 17, 27, 28 나올 수 있음
    const ranges = [
      { min: 1, max: 10 },
      { min: 11, max: 20 },
      { min: 21, max: 30 },
      { min: 31, max: 40 },
      { min: 41, max: 45 },
    ]

    const selectedNumbers: number[] = []
    const selectedRanges: Set<number> = new Set()
    let attempts = 0

    // 첫 번째 3개의 번호는 자릿대별로 중복 없이 선택
    while (selectedNumbers.length < 3 && attempts < 20) {
      const number = this.getRandomNumbers(this.highProbNumbers, 1)[0]
      const range = ranges.findIndex((r) => number >= r.min && number <= r.max)

      if (!selectedRanges.has(range) && !selectedNumbers.includes(number)) {
        selectedNumbers.push(number)
        selectedRanges.add(range)
      }
      attempts++
    }

    // 나머지 3개의 번호는 전체 자릿대에서 중복 없이 선택
    const remainingNumbers = this.getRemainingNumbers(selectedNumbers)
    attempts = 0

    while (selectedNumbers.length < 6 && attempts < 20) {
      const number = this.getRandomNumbers(remainingNumbers, 1)[0]
      const range = ranges.findIndex((r) => number >= r.min && number <= r.max)

      // 이미 선택된 번호나 자릿대는 제외하고 추가
      if (!selectedNumbers.includes(number) && !selectedRanges.has(range)) {
        selectedNumbers.push(number)
        selectedRanges.add(range)
      }
      attempts++
    }

    // 만약 조건으로 인해 6개의 숫자가 선택되지 않았다면, 남은 숫자에서 추가로 뽑기
    while (selectedNumbers.length < 6) {
      const number = this.getRandomNumbers(remainingNumbers, 1)[0]
      if (!selectedNumbers.includes(number)) {
        selectedNumbers.push(number)
      }
    }

    return selectedNumbers.sort((a, b) => a - b)
  }

  generateHighNumbers(rounds: number) {
    this.lottoNumbers = []
    for (let i = 0; i < rounds; i++) {
      this.lottoNumbers.push(this.generateLotteryNumbers())
    }

    const ball = this.lottoNumbers[0].join(', ')
    sessionStorage.setItem('lottoNumbers', JSON.stringify(ball))
  }

  private getNumberClass(number: number) {
    if (number <= 10) return 'yellow'
    else if (number <= 20) return 'blue'
    else if (number <= 30) return 'red'
    else if (number <= 40) return 'grey'
    else return 'green'
  }

  private onSelectedBall() {
    this.isLoading = true

    // // (session 저장: store는 refresh하면 정보 없어짐)
    // const ball = this.lottoNumbers[0].join(', ')
    // sessionStorage.setItem('lottoNumbers', JSON.stringify(ball))

    // this.isLoading = false
    // // this.$router.push('/select-hope')
    // this.isPopupVisible = true
    this.onLogin()
  }

  private async onLogin() {
    const user = getLoggedUserInfo()
    console.log('user:', user)

    try {
      sessionStorage.setItem('hope', '')
      sessionStorage.setItem('hope-select', 'false')

      if (user) {
        await this.saveLottoNumbers()
      } else {
        console.log('isApp:', this.$store.state.isApp)
        // 앱, 웹 구분
        this.$store.state.isApp
          ? this.webviewLogin()
          : this.$router.replace('/login?redirect=after-login')
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
      alert('저장하는 데 오류가 발생했습니다. 잠시후 다시 시도해주세요')
      return
    }
  }

  webviewLogin() {
    console.log('웹뷰 로그인 요청')
    if ((window as any).LoginChannel) {
      // eslint-disable-next-line no-extra-semi
      ;(window as any).LoginChannel.postMessage('Login Requested')
    }
  }

  getLottoWeek(t2: Dayjs) {
    // console.log('회차:', this.getLottoWeek('2024-09-08 15:00'))  // 일
    // console.log('회차:', this.getLottoWeek('2024-09-09 15:00'))  // 월
    // console.log('회차:', this.getLottoWeek('2024-09-10 15:00')) // 화
    // console.log('회차:', this.getLottoWeek('2024-09-11 15:00'))  // 수
    // console.log('회차:', this.getLottoWeek('2024-09-12 13:00')) // 목
    // console.log('회차:', this.getLottoWeek('2024-09-13 13:00')) // 금요일
    // console.log('회차:', this.getLottoWeek('2024-09-14 17:00')) // 토요일 오후 5시, 1137회
    // console.log('회차:', this.getLottoWeek('2024-09-14 18:30')) // 토요일 오후 8시 30분, 1138회
    // console.log('회차:', this.getLottoWeek('2024-09-15 00:00')) // 일요일 자정, 1138회

    const t1 = dayjs('2002-12-07') // 번호 1회차 기준 날짜
    // const currentDate = dayjs(t2) // 입력된 날짜
    const currentDate = t2
    let diffWeeks = currentDate.diff(t1, 'week') // 기준 날짜와의 주차 차이
    let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

    // 이번 주 토요일 오후 8시를 계산
    let saturdayEightPM = currentDate
      .startOf('week')
      .add(6, 'day')
      .hour(20)
      .minute(0)
      .second(0)

    console.log('현재 날짜:', currentDate.format('YYYY-MM-DD HH:mm'))
    console.log(
      '이번 주 토요일 오후 8시:',
      saturdayEightPM.format('YYYY-MM-DD HH:mm'),
    )

    // 만약 현재 시간이 그 주의 토요일 오후 8시 이후라면 다음 회차로 설정
    if (currentDate.day() === 0 || currentDate.isAfter(saturdayEightPM)) {
      currentWeek += 1
      console.log('현재 시간이 토요일 오후 8시 이후입니다.')
    } else if (currentDate.day() >= 1 && currentDate.day() <= 5) {
      // 월요일(1) ~ 금요일(5) 사이에는 다음 회차로 미리 더해줌 (1주가 안지나서 그런지 계속 -1되서 보여짐)
      currentWeek += 1
    } else {
      console.log('현재 시간이 토요일 오후 8시 이전입니다.')
    }

    return currentWeek
  }

  private async saveLottoNumbers() {
    this.isLoading = true

    const userData = Cookies.get('user') as string
    let user = null

    if (userData) {
      try {
        user = JSON.parse(userData)

        const round = this.getLottoWeek(dayjs())

        const numbers = [
          sessionStorage.getItem('lottoNumbers')!.replace(/^"|"$/g, ''),
        ]

        try {
          // automatic or dream 컬렉션에 새로운 문서 추가
          await addDoc(collection(db, 'automatic'), {
            date: dayjs().format('YYYYMMDD HH:mm:ss'),
            numbers,
            uid: user.uid,
            round,
            winningText: '',
          })

          const datas = sessionStorage.getItem(`myNumbers-${round}`)
          const insertData = {
            date: dayjs().format('YYYYMMDD HH:mm:ss'),
            numbers,
            uid: user.uid,
            round,
            winningText: '',
          }

          if (!datas) {
            // sessionStorage에 아무 데이터도 없으면, 배열에 insertData를 넣어서 저장
            sessionStorage.setItem(
              `myNumbers-${round}`,
              JSON.stringify(insertData),
            )
          } else {
            const alreadyDatas = JSON.parse(datas)

            const updatedData = Array.isArray(alreadyDatas)
              ? alreadyDatas
              : [alreadyDatas]
            updatedData.push(insertData)

            updatedData.sort((a, b) => {
              return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
            })

            sessionStorage.setItem(
              `myNumbers-${round}`,
              JSON.stringify(updatedData),
            )
          }

          sessionStorage.removeItem('hope')
          sessionStorage.removeItem('lottoNumbers')
          sessionStorage.removeItem('type')

          setTimeout(() => {
            this.isLoading = false

            this.$router.push('/my/number?tab=automatic')
          }, 1000)
        } catch (e) {
          this.isLoading = false

          console.error('Error adding document: ', e)
          alert('저장하는 과정에서 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        this.isLoading = false

        console.error('Failed to parse user data:', error)
        user = null
      }
    } else {
      user = null
      this.showPopup()
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.container {
  margin: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  position: relative;
  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 54px);
}

.add {
  /* height: calc(var(--vh, 1vh) * 100 - 158px); */
  transition: height 2s ease;
}

.page1 {
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

@keyframes slideUp3 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.img-bg {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  margin-bottom: 16px;

  /* transform: translateY(100%); */
  animation: slideUp3 0.5s forwards;
}

.img-bg.yellow-bg {
  background-color: #fcd53f;
}

.img-bg.blue-bg {
  background-color: #0085ff;
}

.img-bg > img {
  width: 42px;
  height: 42px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.page2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -72px;
}

.random-animation {
  /* display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; */
  margin: 0;
  /* background-color: #171717; */
  border-radius: 50%;
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

.message:last-child {
  margin-bottom: 32px;
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
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

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.message2 {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;

  opacity: 0;
  transform: translateY(50%);
  animation: slideUp2 1s forwards;
}

.message2:last-child {
  margin-bottom: 32px;
}

.typing1 {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.result__box {
  opacity: 0;
  animation-delay: 3s;
  animation: fadeIn 3s forwards;
}

.round {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.row > div {
  width: 50px;
  height: 50px;
  /* margin: 6px; */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
}

.yellow {
  border: 2px solid #dd9a17;
  color: #dd9a17;
}

.blue {
  border: 2px solid #0085ff;
  color: #0085ff;
}

.red {
  border: 2px solid #e64d3d;
  color: #e64d3d;
}

.grey {
  border: 2px solid #9c9ea0;
  color: #9c9ea0;
}

.green {
  border: 2px solid #33c759;
  color: #33c759;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.floating > button {
  width: 100%;
  min-height: 54px;
  background-color: #eceef0;
  padding: 8px 8px;
  border-radius: 100px;
  border-style: none;
  color: #202223;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
}

.floating > button.primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.floating > button.none {
  background-color: transparent;
  border: 1px solid #414244;
  color: #eceef0;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
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
