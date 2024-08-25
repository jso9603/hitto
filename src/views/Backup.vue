<template>
<div>
  <div class="random__lotto">
    <h1>로또 번호 추첨기</h1>
    <button @click="generateNumbers">번호 추첨</button>
    <li v-for="(numbers, index) in lottoNumbers" :key="index">
      {{ index + 1 }}회차: {{ numbers.join(', ') }}
    </li>
  </div>

  <div class="high-probability">
    <div>확률 높은 번호 추첨</div>
    <button @click="generateHighNumbers">확률 높은 번호 추첨</button>
    <li v-for="(set, index) in lotterySets" :key="index">
      {{ index + 1 }}회차: {{ set.join(', ') }}
    </li>
  </div>
</div>
  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Backup extends Vue {
  lottoNumbers: number[][] = []

  // 확률 높은 숫자를 숫자 번대로 2개씩 선택
  highProbNumbers: number[] = [1, 3, 6, 7, 12, 14, 17, 24, 26, 27, 33, 34, 42, 43, 45]
  lotterySets: number[][] = []

 // Function to generate a single set of lottery numbers
  generateLotteryNumbers(): number[] {
    const selectedHighProbNumbers = this.getRandomNumbers(this.highProbNumbers, 3)
    const remainingNumbers = this.getRemainingNumbers(selectedHighProbNumbers)
    const selectedRemainingNumbers = this.getRandomNumbers(remainingNumbers, 3)
    return selectedHighProbNumbers.concat(selectedRemainingNumbers).sort((a, b) => a - b)
  }

  // Helper function to get random numbers from an array
  getRandomNumbers(array: number[], count: number): number[] {
    const result = []
    const _array = [...array]
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * _array.length)
      result.push(_array.splice(index, 1)[0])
    }
    return result
  }

  // Helper function to get the remaining numbers
  getRemainingNumbers(exclude: number[]): number[] {
    const remaining = []
    for (let i = 1; i <= 45; i++) {
      if (!exclude.includes(i) && !this.highProbNumbers.includes(i)) {
        remaining.push(i)
      }
    }
    return remaining
  }

  // Function to generate 5 sets of lottery numbers
  generateHighNumbers() {
    this.lotterySets = [];
    for (let i = 0; i < 5; i++) {
      this.lotterySets.push(this.generateLotteryNumbers())
    }
  }

  generateNumbers() {
    const rounds = 5 // 5회차
    this.lottoNumbers = []

    for (let i = 0; i < rounds; i++) {
      const numbers = new Set<number>()
      while (numbers.size < 6) {
        const randomNum = Math.floor(Math.random() * 45) + 1
        numbers.add(randomNum)
      }
      this.lottoNumbers.push(Array.from(numbers))
    }
  }
}
</script>