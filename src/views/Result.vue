<template>
  <div class="container">
    <div class='typing1'>"기운이 느껴져?<br/>한 주 동안 즐겁게 기다려보자구~"</div>
    <div class="sub">마음에 들지 않으면 다시 생성할 수 있어요!</div>

    <div class="result__box">
      <div v-for="(round, index) in lottoNumbers" :key="index" class="round">
        <div class="row">
          <div v-for="number in round.slice(0, 4)" :key="number" :class="getNumberClass(number)">
            {{ number }}
          </div>
        </div>
        <div class="row">
          <div v-for="number in round.slice(4, 6)" :key="number" :class="getNumberClass(number)">
            {{ number }}
          </div>
          <div class="plus">+</div>
          <div :class="[getNumberClass(round[6]), 'last']">
            {{ round[6] }}
          </div>
        </div>
      </div>
    </div>

    <div class="floating">
      <div class="participation">
        <div class="people">
          <div class="person" />
          <div class="person" />
          <div class="person" />
        </div>
        지난 주 5,230명이 당첨됐어요
      </div>
      <button class="primary" @click="$router.push('/select-hope')">선택 완료</button>
      <button class="none" @click="$router.push('/ai')">다시 생성</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Result extends Vue {
  private lottoNumbers: number[][] = [];

  private generateLottoNumbers(rounds: number) {
    for (let i = 0; i < rounds; i++) {
      const numbers = new Set<number>();
      while (numbers.size < 7) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNum);
      }
      this.lottoNumbers.push(Array.from(numbers).sort((a, b) => a - b));
    }
  }

  private getNumberClass(number: number) {
    if (number <= 10) return 'red';
    else if (number <= 20) return 'orange';
    else if (number <= 30) return 'green';
    else if (number <= 40) return 'blue';
    else return 'purple';
  }

  mounted() {
    this.generateLottoNumbers(1); // 예시로 5개의 라운드를 생성
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #171717;
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

.sub {
  margin-bottom: 32px;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #9C9EA0;
}

.result__box {
  padding: 32px 20px;
  background-color: #222222;
}
.round {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.row > div {
  width: 50px;
  height: 50px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}

.plus {
  font-size: 48px;
  color: #fff;
}

.red {
  border: 2px solid red !important;
}

.orange {
  border: 2px solid orange !important;
}

.green {
  border: 2px solid green !important;
}

.blue {
  border: 2px solid blue !important;
}

.purpe {
  border: 2px solid purple !important;
}

.last {
  background-color: transparent !important;
  border-width: 2px;
  border-style: solid;
  border: none;
}

.red.last {
  background-color: red !important;
}

.orange.last {
  background-color: orange !important;
}

.green.last {
  background-color: green !important;
}

.blue.last {
  background-color: blue !important;
}

.purple.last {
  background-color: purple !important;
}

.floating {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #fff;
  font-weight: 300;
}

.floating > .participation > .people {
  display: flex;
  flex-direction: row;
}

.floating > .participation > .people > .person:not(:first-child) {
  margin-left: -6px;
}

.floating > .participation > .people > .person {
  width: 24px;
  height: 24px;
  background-color: #414244;
  border-radius: 50%;
  border: 1px solid #181D23;
}

.floating > button {
  width: 100%;
  /* max-width 사이즈에 양옆 padding 값 */
  max-width: calc(576px - 40px);
  min-height: 52px;
  background-color: #4AFF81;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
}
</style>
