<template>
  <div class="form-container">
    <ManualPopup
      :visible="isPopupVisible"
      :forms="forms"
      :user="user"
      @close="isPopupVisible = false"
      @save="saveData"
    />

    <div class="week">{{currentRound}}회</div>
    <div class="date">{{getFormattedDate(saturdayDate)}} 추첨</div>

    <div
      v-for="(form, index) in forms"
      :key="index"
      class="form-box"
    >
      <div class="form-header">
        <h3>P-{{ form.label.charCodeAt() - 64 }}</h3>
        <button
          @click="resetForm(index)"
          class="reset"
          :disabled="form.selectedNumbers.length === 0"
          :style="{marginRight: index === 0 ? '0px' : '8px' }"
        >
          초기화
        </button>
        <button v-if="index !== 0" @click="removeForm(index)" class="remove">삭제</button>
      </div>
      <!-- 여기에 번호 입력하는 영역 -->
      <div class="numbers">
        <div
          v-for="(number, numberIndex) in form.numbers"
          :key="numberIndex"
          class="number-circle"
          @click="selectNumber(index, number)"
          :class="[
            form.selectedNumbers.includes(number) ? 'selected' : '', 
            getNumberClass(number)
          ]"
        >
          {{ number }}
        </div>
      </div>
    </div>

    <!-- TODO: 나중에 5개 이상 버튼 추가하기 누르면 광고 -->
    <button class="add" @click="addForm" v-if="forms.length < 5">
      <img src="@/assets/ic-system-plus.svg" />
    </button>

     <button class="primary" @click="onSave">
        저장하기
      </button>

    <!-- <div class="floating">
      <button class="primary" @click="onSave">
        저장하기
      </button>
    </div> -->
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
  week =''
  currentRound = ''
  saturdayDate = ''
  isPopupVisible = false
  forms: Form[] = [
    { label: 'A', numbers: this.generateNumbers(), selectedNumbers: [] },
  ]

  user: User = {uid: '', email: ''}

  get isRoundMatched() {
    const storedRound = sessionStorage.getItem('round')
    return storedRound === this.currentRound
  }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 M월 D일')
  }

  // 1부터 45까지의 숫자를 생성하는 메서드
  generateNumbers(): number[] {
    return Array.from({ length: 45 }, (_, i) => i + 1)  // 1부터 45까지 배열 생성
  }

  addForm() {
    const nextLabel = String.fromCharCode(65 + this.forms.length)
    this.forms.push({ label: nextLabel, numbers: this.generateNumbers(), selectedNumbers: [] })

    this.$nextTick(() => {
    const addedForm = this.$el.querySelectorAll('.form-box')[this.forms.length - 1] // 새로 추가된 form
    if (addedForm) {
      addedForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
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

    if (selectedNumbers.length > 5) {
      alert('최대 6개까지만 선택가능합니다.')
      return
    }

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
        alert(`P-${form.label.charCodeAt(0) - 64}에서 ${6 - selectedCount}개의 숫자를 더 선택해야 합니다.`)
        allValid = false
      } else if (selectedCount > 6) {
        alert(`P-${form.label.charCodeAt(0) - 64}에서 ${selectedCount - 6}개의 숫자를 덜 선택해야 합니다.`)
        allValid = false
      }
    })

    // 모든 폼이 유효할 때만 저장 처리
    if (allValid) {
      // user 정보가 있으면 넘겨주기
      this.isPopupVisible = true
    }
  }

  getSaturdayDate(week: number) {
    const t1 = dayjs('2002-12-07')
    const saturday = t1.add(week, 'week') // 해당 회차의 토요일 날짜 계산
    return saturday.format('YYYY-MM-DD')
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

  getNumberClass(number: number) {
    if (number >= 1 && number <= 10) {
      return 'yellow';
    } else if (number >= 11 && number <= 20) {
      return 'blue';
    } else if (number >= 21 && number <= 30) {
      return 'red';
    } else if (number >= 31 && number <= 40) {
      return 'gray';
    } else if (number >= 41 && number <= 45) {
      return 'green';
    }
    return '';
  }

  mounted() {
    this.week = (this.getLottoWeek(dayjs())).toString()
    this.currentRound = this.week
    this.saturdayDate = this.getSaturdayDate(+this.currentRound - 1)

    const user = getLoggedUserInfo()

    if (user) {
      this.user = user
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 0 20px;

  /* 세로 스냅 적용 */
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}

.week {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  color: #ECEEF0;
  cursor: pointer;
}

.date {
  margin-top: 4px;
  margin-bottom: 24px;
  color: #9C9EA0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}

.form-box {
  background-color: #212736;
  padding: 24px 20px;
  margin-bottom: 12px;
  border-radius: 16px;

  scroll-snap-align: start;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
}

.reset {
  margin-left: auto;
  margin-right: 8px;
}

.reset,
.remove {
  background-color: #2A3246;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: -0.5px;
  color: #BABCBE;
  border: none;
  padding: 8px;
}

h3 {
  margin: 0;
  display: flex;
  align-items: center;
}

h3::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  background-color: #4AFF81;
  border-radius: 50%;
}

.numbers {
  /* display: flex;
  justify-content: space-between;
  flex-wrap: wrap; */
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 16px 0;
  border-radius: 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.number-circle {
  width: 32px;
  height: 32px;
  margin: auto;
  border-radius: 50%;
  color: #BABCBE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
}

.selected.yellow {
  border: 1px solid #FFBD00;
  color: #FFBD00;
}

.selected.blue {
  border: 1px solid #0085FF;
  color: #0085FF;
}

.selected.red {
  border: 1px solid #E64D3D;
  color: #E64D3D;
}

.selected.gray {
  border: 1px solid #9C9EA0;
  color: #9C9EA0;
}

.selected.green {
  border: 1px solid #33C759;
  color: #33C759
}

.add {
  width: 100%;
  min-height: 54px;
  background-color: #212736;
  padding: 8px 8px;
  border-radius: 16px;
  border-style: none;
  color: #ECEEF0;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  cursor: pointer;
  /* margin-bottom: 114px; */
  margin-bottom: 52px;
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
  background: linear-gradient(180deg, rgba(19, 23, 32, 0) 0%, #131720 15.46%, #131720 82.53%);
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

button.primary {
  margin-bottom: 20px;
  width: 100%;
  min-height: 54px;
  background-color: #ECEEF0;
  padding: 8px 8px;
  border-radius: 100px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
}
</style>