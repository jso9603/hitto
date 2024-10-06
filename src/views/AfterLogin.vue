<template>
  <div class="container" :class="{ add: !showPage1 }">
    <LoginPopup
      v-if="showLoginPopup"
      :numbers="LoginPopupNumbers"
      :visible="isLoginPopupVisible"
      @close="isLoginPopupVisible = false"
    />

    <div class="page2">
      <div :class="['img-bg', background]" :style="{ animationDelay: `0s` }">
        <img :src="require(`@/assets/${charater}`)" at="character 이미지" />
      </div>

      <div v-if="showMessage2">
        <div v-for="(message, index) in messages2" :key="index" class="message2" :style="{ animationDelay: `${index * 0.2}s` }">
          {{ message }}
        </div>
      </div>

      <div class="result__box">
        <div v-for="(round, index) in lottoNumbers" :key="index" class="round">
          <div class="row">
            <div v-for="number in round.slice(0, 3)" :key="number" :class="getNumberClass(number)">
              {{ number }}
            </div>
          </div>
          <div class="row">
            <div v-for="number in round.slice(3, 5)" :key="number" :class="getNumberClass(number)">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

import { getLoggedUserInfo } from '@/utils/user'
import LoginPopup from '@/components/LoginPopup.vue'

import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

@Component({
  components: {
    LoginPopup,
  },
  computed: {
    ...mapState(['menuName']),
    ...mapState(['showLoginPopup']),
  },
})
export default class AfterLogin extends Vue {
  // 원의 중심점과 반지름
  private circleCenter = { x: 80, y: 80 } // canvas의 중앙
  private circleRadius = 80 // 원의 반지름 (로딩 바)

  private messages: string[] = ['AI 통계기반', '로또 번호를 생성하고 있어요']
  private messages2 = ['로또 번호를 생성했어요!', '맘에 드시나요?']
  private selectedMessage: string | null = null
  private showMessage2: boolean = true

  private showPage1: boolean = true
  private isPopupVisible: boolean = false

  private isLoading = false
  charater = ''
  background = ''

  // 확률 높은 숫자들
  highProbNumbers: number[] = [1, 3, 6, 7, 12, 14, 17, 24, 26, 27, 33, 34, 42, 43, 45]
  private lottoNumbers: number[][] = []

  isLoginPopupVisible = false
  private LoginPopupNumbers: number[] = []

  get showLoginPopup() {
    return this.$store.state.showLoginPopup;
  }

  get dynamicHeight() {
    return `calc(var(--vh, 1vh) * 100 - ${this.showPage1 ? '54px' : '192px'})`
  }

  oneMore() {
    this.$router.replace('/random')
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  private handleBackButton(): void {
    if (this.$route.path !== '/') {
      // this.$router.replace('/')
      const user = getLoggedUserInfo()

      if (!user && this.$route.path === '/random' && sessionStorage.getItem('lottoNumbers')) {
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
        .replace(/^"|"$/g, '')  // 양 끝의 따옴표 제거
        .split(',')             // 쉼표로 문자열 분리
        .map(num => Number(num.trim())) // 각 요소를 숫자로 변환
    }

    this.isLoginPopupVisible = true
  }

  created() {
    this.background = this.$store.state.menuName!.includes('꿈해몽') ? 'yellow-bg' : 'blue-bg'
    this.charater = this.$store.state.menuName!.includes('꿈해몽') ? 'img-stella-3d.png' : 'img-stefan-3d.png'
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()

    const storedLottoNumbers = sessionStorage.getItem('lottoNumbers')
    console.log(storedLottoNumbers)
    
    if (storedLottoNumbers) {
      // 문자열을 숫자 배열로 변환
      const numberArray = storedLottoNumbers
        .replace(/^"|"$/g, '')  // 양 끝의 따옴표 제거
        .split(',')             // 쉼표로 문자열 분리
        .map(num => Number(num.trim())) // 각 요소를 숫자로 변환

      // 1차원 배열을 2차원 배열로 변환하여 lottoNumbers에 추가
      this.lottoNumbers.push(numberArray);
    }

    // 페이지 로드 시 히스토리 상태 추가 (페이지 이동 막기 위해 pushState 사용)
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', this.handleBackButton)
  }
  
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
    const selectedHighProbNumbers = this.getRandomNumbers(this.highProbNumbers, 3)
    const remainingNumbers = this.getRemainingNumbers(selectedHighProbNumbers)
    const selectedRemainingNumbers = this.getRandomNumbers(remainingNumbers, 3)
    return selectedHighProbNumbers.concat(selectedRemainingNumbers).sort((a, b) => a - b)
  }

  generateHighNumbers(rounds: number) {
    this.lottoNumbers = [];
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
    this.saveLottoNumbers()
  }

  getLottoWeek(t2: Dayjs) {
    const t1 = dayjs('2002-12-07') // 로또 1회차 기준 날짜
    // const currentDate = dayjs(t2) // 입력된 날짜
    const currentDate = t2
    let diffWeeks = currentDate.diff(t1, 'week') // 기준 날짜와의 주차 차이
    let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

    // 이번 주 토요일 오후 6시를 계산
    let saturdaySixPM = currentDate.startOf('week').add(6, 'day').hour(18).minute(0).second(0)

    // 만약 현재 시간이 그 주의 토요일 오후 6시 이후라면 다음 회차로 설정
    if (currentDate.day() === 0 || currentDate.isAfter(saturdaySixPM)) {
      currentWeek += 1
      console.log('현재 시간이 토요일 오후 6시 이후입니다.')
    } else if (currentDate.day() >= 1 && currentDate.day() <= 5) {
      // 월요일(1) ~ 금요일(5) 사이에는 다음 회차로 미리 더해줌 (1주가 안지나서 그런지 계속 -1되서 보여짐)
      currentWeek += 1
    } else {
      console.log('현재 시간이 토요일 오후 6시 이전입니다.')
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
        const numbers = [(sessionStorage.getItem('lottoNumbers'))!.replace(/^"|"$/g, '')]

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
            sessionStorage.setItem(`myNumbers-${round}`, JSON.stringify(insertData))
          } else {
            const alreadyDatas = JSON.parse(datas)

            const updatedData = Array.isArray(alreadyDatas) ? alreadyDatas : [alreadyDatas]
            updatedData.push(insertData)

            updatedData.sort((a, b) => {
              return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
            })

            sessionStorage.setItem(`myNumbers-${round}`, JSON.stringify(updatedData))
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
  background-color: #FCD53F;
}

.img-bg.blue-bg {
  background-color: #0085FF;
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
  border: 2px solid #DD9A17;
  color: #DD9A17;
}

.blue {
  border: 2px solid #0085FF;
  color: #0085FF;
}

.red {
  border: 2px solid #E64D3D;
  color: #E64D3D;
}

.grey {
  border: 2px solid #9C9EA0;
  color: #9C9EA0;
}

.green {
  border: 2px solid #33C759;
  color: #33C759;
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
  background: linear-gradient(180deg, rgba(19, 23, 32, 0) 0%, #131720 15.46%, #131720 82.53%);
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  
}

.floating > button {
  width: 100%;
  min-height: 54px;
  background-color: #ECEEF0;
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
  color: #ECEEF0;
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
