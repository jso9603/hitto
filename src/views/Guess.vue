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

    <GuessParticipants :week="this.week" />

<!-- :style="{ right: rightValue + 'px' }"  -->
    <button
      
      :class="['challenge', { expanded: isScrolled }]"
      :disabled="isButtonDisabled"
      @click="onChallenge"
    >
      <img src="@/assets/ic-system-challenge.svg" />
      <span v-if="isScrolled">1등 도전하기</span>
    </button>
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
  private isScrolled: boolean = false

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
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 100 // 스크롤이 100px 이상일 때 버튼을 확대
  }

  onChallenge() {
    this.$router.push(`/challenge?week=${this.week}`)
  }

  private setRightValue(): void {
    const guessElement = this.$refs.guessRef as HTMLElement
    if (guessElement) {
      this.guessWidth = guessElement.offsetWidth // guess 요소의 너비를 가져옴
      this.rightValue = this.guessWidth - 20 // right 값을 너비 + 20px으로 설정
    }
  }

  mounted() {
    this.setRightValue()
    window.addEventListener('resize', this.setRightValue)

    window.addEventListener('scroll', this.handleScroll)
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
  display: flex;
  align-items: center;
  gap: 4px;
  position: fixed;
  right: 0;
  bottom: 84px;
  background-color: #4AFF81;
  border: none;
  border-radius: 40px;
  padding: 16px;
  text-align: center;
  color: #181D23;
  cursor: pointer;
  transform: translateX(calc(-100% - 20px));
  transition: transform 0.5s ease;
}

.expanded {
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  transform: translateX(0%);
}
</style>