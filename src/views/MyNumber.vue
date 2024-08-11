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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import axios from 'axios'

interface Lotto{
  totSellamnt: number,  // 총 상금
  returnValue: string,  // 성공 혹은 실패
  drwNoDate: string,  // 날짜
  firstWinamnt: number,  // 1등 상금액
  firstAccumamnt: number, // ?
  drwNo: number,  // 회차
  drwtNo1: number,  // 로또번호 1
  drwtNo2: number,  // 로또번호 2
  drwtNo3: number,  // 로또번호 3
  drwtNo4: number,  // 로또번호 4
  drwtNo5: number,  // 로또번호 5
  drwtNo6: number,  // 로또번호 6
  bnusNo: number, // 로또 보너스 번호
}

@Component
export default class MyNumber extends Vue {
  week =''
  saturdayDate = ''
  lottoData: any = null

  // 이번주 번호
  getWeek() {
    const t1 = dayjs('20021207')
    const t2 = dayjs()
    const dff = dayjs.duration(t2.diff(t1)).asDays()

    return Math.floor(dff / 7) + 1
  }

  getSaturdayDate(week: number) {
    const t1 = dayjs('2002-12-07');
    const saturday = t1.add(week - 1, 'week').day(6); // 주차 계산 후 그 주의 토요일로 이동
    return saturday.format('YYYY-MM-DD');
  }

  async fetchLottoData() {
    try {
      const response = await axios.get(`/common.do?method=getLottoNumber&drwNo=${this.week}`);
      this.lottoData = response.data as Lotto;
      console.log('로또 데이터:', this.lottoData);
    } catch (error) {
      console.error('로또 데이터를 가져오는 중 오류 발생:', error);
    }
  }

  created() {
    dayjs.extend(duration)

    const currentWeek = this.getWeek();
    this.week = this.getWeek().toString()
    this.saturdayDate = this.getSaturdayDate(currentWeek);
    console.log('week', this.week)
    console.log('Saturday Date', this.saturdayDate);

    this.fetchLottoData();
  }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 M월 D일');
  }


  get drawnNumbers() {
    return [
      this.lottoData.drwtNo1,
      this.lottoData.drwtNo2,
      this.lottoData.drwtNo3,
      this.lottoData.drwtNo4,
      this.lottoData.drwtNo5,
      this.lottoData.drwtNo6,
    ];
  }

  get bonusNumber() {
    return this.lottoData.bnusNo;
  }

  getNumberClass(number: number) {
    if (number >= 1 && number <= 10) return 'yellow';
    if (number >= 11 && number <= 20) return 'blue';
    if (number >= 21 && number <= 30) return 'red';
    if (number >= 31 && number <= 40) return 'gray';
    if (number >= 41 && number <= 45) return 'green';
    return '';
  }
}
/* moment 라이브러리를 사용한 이 함수는 2002년 12월 7일부터 오늘까지의 주차를 계산합니다.

함수의 결과는 다음과 같습니다:

t1은 2002년 12월 7일을 나타냅니다.
t2는 현재 날짜를 나타냅니다.
dff는 t1부터 t2까지의 일수를 계산합니다.
Math.floor(dff/7)+1은 주차를 계산하고 1을 더해 반환합니다.
결과값은 2002년 12월 7일부터 현재까지 몇 주가 지났는지를 나타내는 숫자입니다. */

/* const t1 = moment('20021207');
  const t2 = moment();
  const dff = moment.duration(t2.diff(t1)).asDays();
  return Math.floor(dff/7)+1; */
</script>

<style scoped>
.my__number {
  margin-top: 20px;
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
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 32px;
}

.numbers {
  display: flex;
  align-items: center;
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
  margin: 0 8px;
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
  margin: 0 -20px;
  background-color: #111111;
}
</style>