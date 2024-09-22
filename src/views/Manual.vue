<template>
  <div class="form-container">
    <ManualPopup
      :visible="isPopupVisible"
      :forms="forms"
      :user="user"
      @close="isPopupVisible = false"
      @save="saveData"
    />

    <div
      v-for="(form, index) in forms"
      :key="index"
      class="form-box"
    >
      <div class="form-header">
        <h3>Play {{ form.label }}= {{ form.selectedNumbers.length === 0 }}</h3>
        <button @click="resetForm(index)" :disabled="form.selectedNumbers.length === 0">초기화</button>
        <button @click="removeForm(index)" :disabled="index === 0">삭제</button>
      </div>
      <!-- 여기에 번호 입력하는 영역 -->
      <div class="numbers">
        <div
          v-for="(number, numberIndex) in form.numbers"
          :key="numberIndex"
          class="number-circle"
          @click="selectNumber(index, number)"
          :class="{ selected: form.selectedNumbers.includes(number) }"
        >
          {{ number }}
        </div>
      </div>
    </div>

    <!-- 추가하기 버튼은 5개 이하일 때만 활성화 -->
    <!-- TODO: 나중에 5개 이상 버튼 추가하기 누르면 광고 -->
    <button @click="addForm" v-if="forms.length < 5">추가하기</button>

    <div class="floating">
      <button class="primary" @click="onSave">
        저장하기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs, { Dayjs } from 'dayjs'

import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

import { getLoggedUserInfo } from '@/utils/user'

import ManualPopup from '@/components/ManualPopup.vue'
import { User } from '../models/User'

interface Form {
  label: string
  numbers: number[]
  selectedNumbers: number[]
}

@Component({
  components: {
    ManualPopup,
  },
})
export default class Manual extends Vue {
  isPopupVisible = false
  forms: Form[] = [
    { label: 'A', numbers: this.generateNumbers(), selectedNumbers: [] },
  ]

  user: User = {uid: '', email: ''}

  // 1부터 45까지의 숫자를 생성하는 메서드
  generateNumbers(): number[] {
    return Array.from({ length: 45 }, (_, i) => i + 1)  // 1부터 45까지 배열 생성
  }

  addForm() {
    const nextLabel = String.fromCharCode(65 + this.forms.length)
    this.forms.push({ label: nextLabel, numbers: this.generateNumbers(), selectedNumbers: [] })
  }

  removeForm(index: number) {
    if (this.forms.length > 1) {
      this.forms.splice(index, 1)
    }
  }

  resetForm(index: number) {
    this.forms[index].selectedNumbers = []
  }

  selectNumber(formIndex: number, number: number) {
    const selectedNumbers = this.forms[formIndex].selectedNumbers

    if (!selectedNumbers.includes(number)) {
      selectedNumbers.push(number)
    } else {
      const numberIndex = selectedNumbers.indexOf(number)
      selectedNumbers.splice(numberIndex, 1)
    }
  }

  onSave() {
    console.log(this.forms)

    let allValid = true  // 모든 폼이 유효한지 확인하는 플래그
    this.forms.forEach((form) => {
      const selectedCount = form.selectedNumbers.length

      if (selectedCount < 6) {
        alert(`Play ${form.label}에서 ${6 - selectedCount}개의 숫자를 더 선택해야 합니다.`)
        allValid = false
      } else if (selectedCount > 6) {
        alert(`Play ${form.label}에서 ${selectedCount - 6}개의 숫자를 덜 선택해야 합니다.`)
        allValid = false
      }
    })

    // 모든 폼이 유효할 때만 저장 처리
    if (allValid) {
      // user 정보가 있으면 넘겨주기
      this.isPopupVisible = true
    }
  }

  getLottoWeek(t2: Dayjs) {
    // console.log('회차:', this.getLottoWeek('2024-09-08 15:00'))  // 일
    // console.log('회차:', this.getLottoWeek('2024-09-09 15:00'))  // 월
    // console.log('회차:', this.getLottoWeek('2024-09-10 15:00')) // 화
    // console.log('회차:', this.getLottoWeek('2024-09-11 15:00'))  // 수
    // console.log('회차:', this.getLottoWeek('2024-09-12 13:00')) // 목
    // console.log('회차:', this.getLottoWeek('2024-09-13 13:00')) // 금요일
    // console.log('회차:', this.getLottoWeek('2024-09-14 17:00')) // 토요일 오후 5시, 1137회
    // console.log('회차:', this.getLottoWeek('2024-09-14 18:30')) // 토요일 오후 6시 30분, 1138회
    // console.log('회차:', this.getLottoWeek('2024-09-15 00:00')) // 일요일 자정, 1138회

    const t1 = dayjs('2002-12-07') // 로또 1회차 기준 날짜
    // const currentDate = dayjs(t2) // 입력된 날짜
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

  // 실제 DB에 저장
  async saveData() {
    const user = getLoggedUserInfo() as User
    const round = this.getLottoWeek(dayjs())

    try {
      for (const form of this.forms) {
        const sortedNumbers = [...form.selectedNumbers].sort((a, b) => a - b)

        await addDoc(collection(db, 'manual'), {
          date: dayjs().format('YYYYMMDD HH:mm:ss'),
          numbers: [sortedNumbers.join(', ')],
          uid: user.uid,
          round,
          winningText: '',
        })

        const datas = sessionStorage.getItem(`myChallenge-${round}`)
        const insertData = {
          date: dayjs().format('YYYYMMDD HH:mm:ss'),
          numbers: [sortedNumbers.join(', ')],
          uid: user.uid,
          round,
          winningText: '',
        }

        if (!datas) {
          // sessionStorage에 아무 데이터도 없으면, 배열에 insertData를 넣어서 저장
          sessionStorage.setItem(`myChallenge-${round}`, JSON.stringify(insertData))
        } else {
          const alreadyDatas = JSON.parse(datas)

          const updatedData = Array.isArray(alreadyDatas) ? alreadyDatas : [alreadyDatas]
          updatedData.push(insertData)

          updatedData.sort((a, b) => {
            return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
          })

          sessionStorage.setItem(`myChallenge-${round}`, JSON.stringify(updatedData))
        }
      }

      setTimeout(() => {
        // this.isLoading = false

        this.$router.push('/my/number?tab=manual')
      }, 1000)
    } catch (e) {
      console.error('Error adding document: ', e)
      alert('저장하는 과정에서 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  mounted() {
    const user = getLoggedUserInfo()

    if (user) {
      this.user = user
    }
  }
}
</script>

<style scoped>
.form-container {
  margin-top: 16px;
}

.form-box {
  background-color: #222;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
}

.numbers {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.number-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #414244;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.number-circle.selected {
  background-color: #0085FF;
  border-color: #0085FF;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 40px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding: 20px;
  background: linear-gradient(180deg, rgba(23, 23, 23, 0) 0%, #171717 15.46%, #171717 82.53%);
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
</style>