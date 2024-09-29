<template>
  <div class="my__number">
    <RoundPopup
      :visible="isPopupVisible"
      :round="week"
      :current="currentRound"
      @close="isPopupVisible = false"
      @selected="onSelected"
    />

    <div class="week" @click="onChangedRound">
      {{currentRound}}회
      <div class="selected">
        <img src="@/assets/ic-arrow-down.svg" />
      </div>
    </div>

    <div class="date">
      {{getFormattedDate(saturdayDate)}} 추첨
      <span v-if="isRoundMatched">예정</span>
    </div>

    <LottoList
      :week="Number(currentRound)"
      :user="user"
      :key="currentRound"
      :isRoundMatched="isRoundMatched"
    />

    <div class="floating" v-if="isRoundMatched">
      <button class="primary" @click="onOneMoreNumber">
        <img src="@/assets/ic-system-challenge.svg" />
        추가 번호 생성하기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
import duration from 'dayjs/plugin/duration'

import RoundPopup from '@/components/RoundPopup.vue'
import LottoList from '@/components/LottoList.vue'
import { User } from '../models/User'

@Component({
  components: {
    RoundPopup,
    LottoList,
  },
})
export default class MyNumber extends Vue {
  week =''
  currentRound = ''
  saturdayDate = ''
  isPopupVisible = false

  user: User = {email: '', uid: ''}

  get isRoundMatched() {
    const storedRound = sessionStorage.getItem('round')
    return storedRound === this.currentRound
  }

  onChangedRound() {
    this.isPopupVisible = true
  }

  onSelected(selectedRound: number) {
    this.currentRound = selectedRound.toString()
    this.saturdayDate = this.getSaturdayDate(+this.currentRound - 1)

    this.isPopupVisible = false
  }

  getSaturdayDate(week: number) {
    const t1 = dayjs('2002-12-07')
    const saturday = t1.add(week, 'week') // 해당 회차의 토요일 날짜 계산
    return saturday.format('YYYY-MM-DD')
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

  onOneMoreNumber() {
    this.$router.push('/ai')
  }

  adjustHtmlHeight = () => {
    const bodyHeight = document.body.scrollHeight
    const windowHeight = window.innerHeight

    if (windowHeight > bodyHeight) {
      document.documentElement.style.height = '100%' // html에 height: 100% 추가
    } else {
      document.documentElement.style.height = '' // 조건에 맞지 않으면 height 속성 제거
    }
  }

  created() {
    window.addEventListener('resize', this.adjustHtmlHeight)
    window.addEventListener('load', this.adjustHtmlHeight)

    dayjs.extend(duration)

    this.week = (this.getLottoWeek(dayjs())).toString()
    this.currentRound = this.week
    sessionStorage.setItem('round', this.week)
    
    this.saturdayDate = this.getSaturdayDate(+this.week - 1)

    const userData = Cookies.get('user') as string
    this.user = JSON.parse(userData)
  }

  // getSaturdayDate(week: number) {
  //   console.log(week)
  //   const t1 = dayjs('2002-12-07')
  //   const t2 = dayjs()

  //   let diffWeeks = t2.diff(t1, 'week') // 기준 날짜와의 주차 차이
  //   let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

  //   let saturdaySixPM = t2.startOf('week').add(6, 'day').hour(18).minute(0).second(0)

  //    if (t2.day() === 0 || t2.isAfter(saturdaySixPM)) {
  //      const saturday = t1.add(currentWeek, 'week')
  //      return saturday.format('YYYY-MM-DD')
  //    } else if (t2.day() >= 1 && t2.day() <= 5) {
  //      const saturday = t1.add(currentWeek - 1, 'week')
  //      return saturday.format('YYYY-MM-DD')
  //    } else {
  //      const saturday = t1.add(currentWeek, 'week')
  //      return saturday.format('YYYY-MM-DD')
  //    }
  // }

  // getLottoWeek(t2: Dayjs) {
  //   const t1 = dayjs('2002-12-07') // 로또 1회차 기준 날짜
  //   const currentDate = t2
  //   let diffWeeks = currentDate.diff(t1, 'week') // 기준 날짜와의 주차 차이
  //   let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

  //   // 이번 주 토요일 오후 6시를 계산
  //   let saturdaySixPM = currentDate.startOf('week').add(6, 'day').hour(18).minute(0).second(0)

  //   console.log('현재 날짜:', currentDate.format('YYYY-MM-DD HH:mm'))
  //   console.log('이번 주 토요일 오후 6시:', saturdaySixPM.format('YYYY-MM-DD HH:mm'))

  //   // 만약 현재 시간이 그 주의 토요일 오후 6시 이후라면 다음 회차로 설정
  //   if (currentDate.day() === 0 || currentDate.isAfter(saturdaySixPM)) {
  //     currentWeek += 1
  //     console.log('현재 시간이 토요일 오후 6시 이후입니다.')
  //   } else if (currentDate.day() >= 1 && currentDate.day() <= 5) {
  //     // 월요일(1) ~ 금요일(5) 사이에는 다음 회차로 미리 더해줌 (1주가 안지나서 그런지 계속 -1되서 보여짐)
  //     currentWeek += 1
  //   } else {
  //     console.log('현재 시간이 토요일 오후 6시 이전입니다.')
  //   }

  //   return currentWeek
  // }

  // created() {
  //   dayjs.extend(duration)

  //   this.week = (this.getLottoWeek(dayjs()) -1).toString()
  //   this.saturdayDate = this.getSaturdayDate(+this.week - 1)

  //   const userData = Cookies.get('user') as string
  //   this.user = JSON.parse(userData)
  // }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 M월 D일')
  }
}
</script>

<style scoped>
.my__number {
  margin-top: 10px;
  margin-bottom: 32px;
  padding-left: 20px;
  padding-right: 20px;
}

.week {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 26px;
  font-weight: 600;
  line-height: 32px;
  text-align: center;
  color: #ECEEF0;
  cursor: pointer;
}

.selected {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333333;
  border-radius: 50%;
  cursor: pointer;
}

.selected > img {
  width: 18px;
  height: 18px;
}

.date {
  margin-top: 8px;
  color: #9C9EA0;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: center;
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
  background-color: #4AFF81;
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
</style>