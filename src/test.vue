<template>
  <div>
    <div class="random__lotto">
      <h1>로또 번호 추첨기</h1>
      <button @click="generateNumbers">번호 추첨</button>
      <ul>
        <li v-for="number in lottoNumbers" :key="number">{{ number }}</li>
      </ul>
    </div>

    <div class="kakao__login">
      <KakaoLogin />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import KakaoLogin from './components/KakaoLogin.vue'

@Component({
  components: {
    KakaoLogin
  }
})
export default class App extends Vue {
  lottoNumbers: number[] = []

  generateNumbers() {
    const numbers = new Set<number>()
    while (numbers.size < 6) {
      const randomNum = Math.floor(Math.random() * 45) + 1
      numbers.add(randomNum)
    }
    this.lottoNumbers = Array.from(numbers)
  }
}
</script>

<style>
</style>
