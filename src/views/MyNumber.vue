<template>
  <div class="my__number">
    <div class="week">{{week}}회</div>
    <div class="date">{{getFormattedDate(saturdayDate)}} 추첨</div>

    <div v-if="lottoData" class="lotto-result">
      <div class="numbers">
        <div v-for="(number, index) in drawnNumbers" :key="index" :class="getNumberClass(number)" class="number-circle">
          {{ number }}
        </div>
        <span class="plus">+</span>
        <div :class="getNumberClass(bonusNumber)" class="number-circle">
          {{ bonusNumber }}
        </div>
      </div>
    </div>
    <div class="hr__line" />

    <LottoList :week="Number(week)" :user="user"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
import duration from 'dayjs/plugin/duration'
import axios from 'axios'

import LottoList from '@/components/LottoList.vue'
import { Lotto } from '../models/Lotto'

@Component({
  components: {
    LottoList,
  },
})
export default class MyNumber extends Vue {
  week =''
  saturdayDate = ''
  lottoData: any = null

  user: any = {}

  getSaturdayDate(week: number) {
    console.log(week)
    const t1 = dayjs('2002-12-07')
    const t2 = dayjs()

    let diffWeeks = t2.diff(t1, 'week') // 기준 날짜와의 주차 차이
    let currentWeek = diffWeeks + 1 // 회차는 1회차부터 시작하므로 1을 더해줌

    let saturdaySixPM = t2.startOf('week').add(6, 'day').hour(18).minute(0).second(0)

     if (t2.day() === 0 || t2.isAfter(saturdaySixPM)) {
       const saturday = t1.add(currentWeek, 'week')
       return saturday.format('YYYY-MM-DD')
     } else if (t2.day() >= 1 && t2.day() <= 5) {
       const saturday = t1.add(currentWeek - 1, 'week')
       return saturday.format('YYYY-MM-DD')
     } else {
       const saturday = t1.add(currentWeek, 'week')
       return saturday.format('YYYY-MM-DD')
     }
  }

  async fetchLottoData() {
    try {
      const response = await axios.get(`/common.do?method=getLottoNumber&drwNo=${this.week}`)
      this.lottoData = response.data as Lotto
    } catch (error) {
      console.error('로또 데이터를 가져오는 중 오류 발생:', error)
    }
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
    dayjs.extend(duration)

    this.week = (this.getLottoWeek(dayjs()) -1).toString()
    this.saturdayDate = this.getSaturdayDate(+this.week - 1)
    this.fetchLottoData()

    const userData = Cookies.get('user') as string
    this.user = JSON.parse(userData)
  }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 M월 D일')
  }

  get drawnNumbers() {
    return [
      this.lottoData.drwtNo1,
      this.lottoData.drwtNo2,
      this.lottoData.drwtNo3,
      this.lottoData.drwtNo4,
      this.lottoData.drwtNo5,
      this.lottoData.drwtNo6,
    ]
  }

  get bonusNumber() {
    return this.lottoData.bnusNo
  }

  getNumberClass(number: number) {
    if (number >= 1 && number <= 10) return 'yellow'
    if (number >= 11 && number <= 20) return 'blue'
    if (number >= 21 && number <= 30) return 'red'
    if (number >= 31 && number <= 40) return 'gray'
    if (number >= 41 && number <= 45) return 'green'
    return ''
  }
}
</script>

<style scoped>
.my__number {
  margin-top: 20px;
  margin-bottom: 32px;
  padding-left: 20px;
  padding-right: 20px;
}

.week {
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: #ECEEF0;
}

.date {
  color: #9C9EA0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}

.lotto-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 32px;
}

.numbers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.number-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  color: #ECEEF0;
  border: none;
}

.yellow {
  background: linear-gradient(180deg, #FEC03E 0%, #C08405 100%);
}

.blue {
  background: linear-gradient(180deg, #4790FF 0%, #2260BE 100%);
}

.red {
  background: linear-gradient(180deg, #E64D3D 0%, #B62E20 100%);
}

.gray {
  background: linear-gradient(180deg, #BEC3C7 0%, #7C8388 100%);
}

.green {
  background: linear-gradient(180deg, #2ECD70 0%, #09893E 100%);
}

.plus {
  font-size: 18px;
  margin: 0 8px;
  color: white;
}

.hr__line {
  height: 10px;
  margin: 32px -20px;
  background-color: #111111;
}
</style>