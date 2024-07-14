<template>
  <div>
    <div class="recent__history">
      <h1>최근 1개월 당첨번호</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

@Component
export default class Recent extends Vue {

  getWeek() {
    const t1 = dayjs('20021207')
    const t2 = dayjs()
    const dff = dayjs.duration(t2.diff(t1)).asDays()

    return Math.floor(dff / 7) + 1
  }

  created() {
    dayjs.extend(duration)

    const week = this.getWeek()
    console.log('week', week)
  }
}
</script>

<style>
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
</style>
