<template>
  <div class="fortune">
    <h1>오늘의 운세</h1>
    <input v-model="userBirthDate" type="date" placeholder="생년월일을 입력하세요" />
    <button @click="getHoroscope(userBirthDate)">운세 확인</button>

    <div v-if="userHoroscope">
      <h2>운세 결과</h2>
      <p>{{ userHoroscope }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs';
import { horoscopes, yearFortuneModifiers } from '../datas/horoscopeData';

@Component
export default class FortuneTelling extends Vue {
  userBirthDate: string = ''; // 사용자가 입력한 생년월일
  userHoroscope: string = ''; // 계산된 운세 결과

  // 운세를 계산하는 메서드
  getHoroscope(birthDate: string) {
    // 사용자가 입력한 생년월일이 없으면 알림
    if (!birthDate) {
      alert('생년월일을 입력하세요');
      return;
    }

    // 오늘 날짜
    const currentDate: string = dayjs().format('MM-DD');
    const birthYear: number = parseInt(birthDate.slice(0, 4), 10); // 출생년도
    const birthMonthDay: string = dayjs(birthDate).format('MM-DD'); // 생월일 (월-일)
    console.log('birthMonthDay: ', birthMonthDay)

    // 기본 운세 가져오기 (현재 날짜 기반)
    const dailyFortune = horoscopes[currentDate] || {
      base: '오늘의 운세를 찾을 수 없습니다.',
      categories: { love: '알 수 없음', money: '알 수 없음', health: '알 수 없음' }
    };

    // 출생년도에 따른 운세 보정
    const yearModulus: number = birthYear % 10;
    const yearFortune = yearFortuneModifiers[yearModulus] || '특별한 변화는 없습니다.';

    // 최종 운세 결합
    this.userHoroscope = `
      오늘의 기본 운세: ${dailyFortune.base} 
      추가 운세: ${yearFortune}
      사랑운: ${dailyFortune.categories.love}
      금전운: ${dailyFortune.categories.money}
      건강운: ${dailyFortune.categories.health}
    `;
  }
}
</script>

<style scoped>
.fortune {
  color: #FFF;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #0085ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0073e6;
}

input[type="date"] {
  display: block;
  margin: 0 auto 20px;
  padding: 10px;
  font-size: 16px;
}

h2 {
  margin-top: 20px;
  text-align: center;
}

p {
  text-align: center;
  font-size: 18px;
}
</style>