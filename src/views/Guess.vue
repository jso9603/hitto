<template>
  <div class="guess" ref="guessRef">
    <div class="week">{{week}}회</div>
    <div class="date">{{getFormattedDate(saturdayDate)}} 추첨</div>

    <div class="numbers">
      <div v-for="(number, index) in 5" :key="index" class="number-circle">
        ?
      </div>
      <span class="plus">+</span>
      <div class="number-circle">
        ?
      </div>
    </div>
    <div class="hr__line" />

    <button
      class="challenge"
      :disabled="isButtonDisabled"
      @click="onChallenge"
    >
      <img src="@/assets/ic-system-challenge.svg" />
      <span class="text">1등 도전하기</span>
    </button>

    <GuessParticipants :week="this.week" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import GuessParticipants from '@/components/GuessParticipants.vue'

@Component({
  components: {
    GuessParticipants,
  },
})
export default class Guess extends Vue {
  week =''
  saturdayDate = ''
  isButtonDisabled = false

  private rightValue: number = 0
  private guessWidth: number = 0

   getWeek() {
    const t1 = dayjs('20021207')
    const t2 = dayjs()
    const dff = dayjs.duration(t2.diff(t1)).asDays()

    return Math.floor(dff / 7) + 2
  }

  getSaturdayDate(week: number) {
    const t1 = dayjs('2002-12-07')
    const saturday = t1.add(week - 1, 'week')
    return saturday.format('YYYY-MM-DD')
  }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 M월 D일')
  }

  checkButtonDisabled() {
    const now = dayjs();
    const saturdaySixPM = dayjs().day(6).hour(18).minute(0).second(0) // 이번 주 토요일 18:00
    const saturdayMidnight = saturdaySixPM.add(6, 'hours') // 토요일 18:00에서 6시간 후 (즉, 자정)

      // 현재 시간이 토요일 18:00부터 자정(6시간) 사이인지 확인
      this.isButtonDisabled = now.isAfter(saturdaySixPM) && now.isBefore(saturdayMidnight)
  }

  handleScroll(): void {
    const challengeElement = document.querySelector('.challenge') as any;
    const scrollPosition = window.scrollY;
    const windowWidth = window.innerWidth;

    if (windowWidth <= 576) {
      // 화면 너비가 576px 이하일 때
      challengeElement.style.right = '20px'; // 오른쪽 끝에 붙음
    } else {
      // 화면 너비가 576px 이상일 때
      challengeElement.style.right = `${(windowWidth - 576) / 2}px`; // 화면 중앙 기준으로 오른쪽 고정
    }

    if (scrollPosition === 0) {
      // 스크롤이 0일 때
      challengeElement.classList.remove('expanded'); // 너비 줄이기
    } else {
      // 스크롤이 내려갈 때
      if (windowWidth <= 576) {
        // 화면 너비가 576px 이하일 때
        challengeElement.style.right = '20px'; // 화면 오른쪽에 붙음
        challengeElement.classList.add('expanded'); // 너비 늘리기
        } else {
          // 화면 너비가 576px 이상일 때
          challengeElement.classList.add('expanded'); // 너비 늘리기
        }
      
    }
  }

  onChallenge() {
    this.$router.push(`/challenge?week=${this.week}`)
  }

  private setRightValue(): void {
    const guessElement = this.$refs.guessRef as HTMLElement
    if (guessElement) {
      this.guessWidth = guessElement.offsetWidth // guess 요소의 너비를 가져옴
      this.rightValue = this.guessWidth // right 값을 너비 + 20px으로 설정
      console.log('right', this.rightValue)
    }
  }

  mounted() {
    // // this.setRightValue()
    // window.addEventListener('resize', this.setRightValue)

    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)

    // window.addEventListener('DOMContentLoaded', this.handleScroll);
  }

  created() {
    window.scrollTo(0, 0)

    dayjs.extend(duration)

    const currentWeek = this.getWeek()
    this.week = this.getWeek().toString()
    this.saturdayDate = this.getSaturdayDate(currentWeek)
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.setRightValue)
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.guess {
  position: relative;
  height: calc(100vh - 64px + env(safe-area-inset-bottom));
  margin-top: 20px;
  padding: 0 20px;
  margin-bottom: calc(94px + env(safe-area-inset-bottom));
}

.week {
  margin-bottom: 4px;
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: #ECEEF0;
}

.date {
  margin-bottom: 16px;
  color: #9C9EA0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}

.numbers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.number-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  color: #ECEEF0;
  border: none;
}

.plus {
  font-size: 18px;
  color: white;
}

.hr__line {
  height: 10px;
  margin: 24px -20px 32px;
  background-color: #111111;
}

.challenge {
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 4px;
  position: fixed;
  right: 20px;
  bottom: 84px;
  background-color: #4AFF81;
  border: none;
  border-radius: 40px;
  padding: 16px;
  text-align: center;
  color: #181D23;
  cursor: pointer;
  transition: right 0.5s ease, width 0.5s ease;
  width: 54px;
  overflow: hidden;
}

.challenge .text {
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.expanded {
  width: 140px;
}

.challenge.expanded .text {
  opacity: 1;
}
</style>