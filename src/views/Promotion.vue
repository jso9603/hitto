<template>
  <!-- stefan241012@yopmail 계정을 이용한 홍보용 로또 번호를 뽑는 페이지 -->
  <div class="promotion">
    <div v-if="isLoading">생성 및 저장 중...</div>
    <div v-else>완료</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import dayjs from 'dayjs'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

@Component
export default class Promotion extends Vue {
  private isLoading = false
  private user = { email: 'stefan241012@yopmail.com', uid: '1111333332222' }

  // 확률 높은 숫자들
  highProbNumbers: number[] = [1, 3, 6, 7, 10, 12, 14, 17, 23, 24, 26, 27, 29, 33, 34, 38, 42, 43, 45]
  private lottoNumbers: number[][] = []

  mounted() {
    this.generateHighNumbers(98)
    this.saveLottoNumbers()
  }

  getRandomNumbers(array: number[], count: number): number[] {
    const result = []
    const _array = [...array]
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * _array.length)
      result.push(_array.splice(index, 1)[0])
    }
    return result
  }

  getRemainingNumbers(exclude: number[]): number[] {
    const remaining = []
    for (let i = 1; i <= 45; i++) {
      if (!exclude.includes(i) && !this.highProbNumbers.includes(i)) {
        remaining.push(i)
      }
    }
    return remaining
  }
  
  generateLotteryNumbers(): number[] {
    const selectedHighProbNumbers = this.getRandomNumbers(this.highProbNumbers, 3)
    const remainingNumbers = this.getRemainingNumbers(selectedHighProbNumbers)
    const selectedRemainingNumbers = this.getRandomNumbers(remainingNumbers, 3)
    return selectedHighProbNumbers.concat(selectedRemainingNumbers).sort((a, b) => a - b)
  }

  generateHighNumbers(rounds: number) {
    this.lottoNumbers = [];
    for (let i = 0; i < rounds; i++) {
      this.lottoNumbers.push(this.generateLotteryNumbers())
    }

    const ball = this.lottoNumbers[0].join(', ')
    sessionStorage.setItem('lottoNumbers', JSON.stringify(ball))
  }

  private async saveLottoNumbers() {
    this.isLoading = true
    let user = null

      try {
        user = this.user

        // 홍보용으로 쓰일 당첨 회차
        const round = 1141

        for (let i = 0; i < this.lottoNumbers.length; i++) {
          const numbers = [this.lottoNumbers[i].join(', ')]

          try {
            await addDoc(collection(db, 'promotion'), {
              date: dayjs().format('YYYYMMDD HH:mm:ss'),
              numbers,
              uid: `uid_${user.uid}`,
              round,
            })
          } catch (e) {
            this.isLoading = false

            console.error('Error adding document: ', e)
            alert('저장하는 과정에서 오류가 발생했습니다. 다시 시도해주세요.')
          }
        }
      } catch (error) {
        this.isLoading = false

        console.error('Failed to parse user data:', error)
        user = null
      }
    }
}
</script>

<style scoped>
.promotion {
  color: #FFF;
}
</style>