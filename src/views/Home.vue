<template>
<div>
  <div class="random__lotto">
    <h1>로또 번호 추첨기</h1>
    <button @click="generateNumbers">번호 추첨</button>
    <li v-for="(numbers, index) in lottoNumbers" :key="index">
      {{ index + 1 }}회차: {{ numbers.join(', ') }}
    </li>

    <textarea v-model="winningMsg" row="2" cols="30" placeholder="당첨 메시지를 적어라잉" />
    <button @click="saveLottoNumbers">당첨 메시지와 로또번호 저장하기</button>
  </div>

  <div class="kakao__login">
    <KakaoLogin />
  </div>
</div>
  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'
import KakaoLogin from '../components/KakaoLogin.vue'
import { db } from '../config/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

@Component({
  components: {
    KakaoLogin
  }
})
export default class Home extends Vue {
  lottoNumbers: number[][] = []
  winningMsg: string = ''

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

  async getUid() {
    try {
        const q = query(collection(db, 'users'), where('email', '==', Cookies.get('email')))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          return userDoc.data().uid
        } else {
          alert('No user found with the specified email.')
        }
      } catch (e) {
        console.error('Error fetching user document: ', e)
      }
  }

  async saveLottoNumbers() {
    if (Cookies.get('email')) {
      try {
        const uid = await this.getUid()

        const numbers = this.lottoNumbers.map(nums => nums.join(', '))

        const docRef = await addDoc(collection(db, 'lottos'), {
          uid,
          winningText: this.winningMsg,
          numbers
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    } else {
      window.alert('카카오 로그인 안됨')
    }
    
  }
}
</script>