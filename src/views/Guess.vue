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
import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
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
    const challengeData = JSON.parse(Cookies.get('challenge') || '{}');
    if (challengeData && this.week === challengeData.round) {
      alert('회차당 1번만 제출 가능합니다');
      return;
    } else {
      this.$router.push(`/challenge?week=${this.week}`)
    }
  }

  mounted() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
  }

  isAfterSaturday9() {
    const now = dayjs();
    let saturday9 = dayjs().day(6).hour(21).minute(0).second(0);  // 이번 주 토요일 6시

    // dayjs().day(6)를 사용할 때 dayjs가 현재 주의 "토요일"을 참조
    // 현재 dayjs().day(6)는 토요일을 기준으로 시간을 계산하는데, 일요일이 되면 dayjs().day(6)는 다가오는 토요일(다음 주 토요일)을 참조
    // 그래서 일요일이 되면 dayjs().day(6)은 일주일 후의 토요일 오후 9시를 참조하게 되며,
    // 이로 인해 now.isAfter(saturday9)는 false를 반환

    // day(6)를 사용할 때는 현재 요일을 고려하여, 다음 주가 아니라 이번 주의 토요일 9시를 기준으로 할 수 있도록 해야함

    // 만약 현재 시간이 일요일이면 지난 토요일을 참조하도록 처리
    if (now.day() === 0) {
      // 일요일일 경우 지난 토요일로 변경 (지난 토요일 9시)
      saturday9 = dayjs().subtract(1, 'week').day(6).hour(21).minute(0).second(0);
    }
    return now.isAfter(saturday9);
  }

  getLottoWeek(t2: Dayjs) {
    const t1 = dayjs('2002-12-07') // 로또 1회차 기준 날짜
    const currentDate = t2
    let diffWeeks = currentDate.diff(t1, 'week') // 기준 날짜와의 주차 차이
    let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

    // 이번 주 토요일 오후 6시를 계산
    let saturdaySixPM = currentDate.startOf('week').add(6, 'day').hour(18).minute(0).second(0)

    console.log('현재 날짜:', currentDate.format('YYYY-MM-DD HH:mm'))
    console.log('이번 주 토요일 오후 6시:', saturdaySixPM.format('YYYY-MM-DD HH:mm'))

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

  created() {
    window.scrollTo(0, 0)

    dayjs.extend(duration)

    this.week = this.getLottoWeek(dayjs()).toString()
    this.saturdayDate = this.getSaturdayDate(+this.week)
    console.log('week: ', this.week)
  }

  beforeDestroy(): void {
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