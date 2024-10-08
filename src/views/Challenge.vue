<template>
  <div class="challenge">
    <div class="week"><span>{{week}}회</span><br/>당첨번호를 맞춰보세요</div>

    <div class="marking">
      <h2>✍️ 번호 마킹</h2>

      <div class="number-grid">
        <div 
          v-for="number in numbers" 
          :key="number" 
          :class="getClass(number)"
          @click="selectNumber(number)"
          class="number-item"
        >
          <svg
            width="30"
            height="32"
            viewBox="0 0 30 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.95122 0C0.873591 0 0 0.868296 0 1.93939V6H1.95122V1.93939H28.0488V6H30V1.93939C30 0.868297 29.1264 0 28.0488 0H1.95122ZM1.95122 32C0.873591 32 0 31.1317 0 30.0606V26H1.95122V30.0606H28.0488V26H30V30.0606C30 31.1317 29.1264 32 28.0488 32H1.95122Z"
              fill="#737577"
            />
          </svg>

          <span>{{ number }}</span>
        </div>
      </div>

      <div class="hope">
        <h2>🙏🏻 소망 선택</h2>
        <div
          v-for="(option, index) in selectOptions"
          :key="index"
          :class="['option-item', { active: selectedIndex === index }]"
          @click="selected(index)"
        >
          <span class="icon">{{ option.icon }}</span>
          <span class="text">{{ option.text }}</span>
        </div>
      </div>
    </div>

    <div class="floating">
      <button class="primary" @click="onSave">제출하기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'

import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

import { getLoggedUserInfo } from '@/utils/user'
import { SelectOption } from '../models/Select'

@Component
export default class Challenge extends Vue {
  week = ''
  numbers: number[] = Array.from({ length: 45 }, (_, i) => i + 1)
  selectedNumbers: number[] = []

  private selectOptions: SelectOption[] = [
    { icon: '✨', text: '포르쉐 파나메라 사게해주세요' },
    { icon: '🏡', text: '반포 아크로리버파크 사게해주세요' },
    { icon: '✈️', text: '몰디브에서 모히또 한잔하고 싶어요'},
    { icon: '🏄‍', text: '은퇴해 슬로우 라이프를 즐기고 싶어요'},
    { icon: '🏖️', text: '바다가 보이는 오션뷰에 살고 싶어요'},
    { icon: '🤱', text: '자녀 교육에 걱정 없게 해주세요'},
    { icon: '🦄', text: '꿈꾸던 사업을 시작하고 싶어요'},
    { icon: '🍵', text: '카페를 열어 사장님 라이프 살래요'},
    { icon: '🕌', text: '갓물주가 되어 임대수익을 받고싶어요'},
    { icon: '🇺🇸', text: '해외 ETF투자해 배당수익받고 싶어요'},
    { icon: '🤑', text: '인생 한방! 비트코인에 올인할래요'},
    { icon: '🌳', text: '어려운 이웃을 위해 사회에 기부하고 싶어요'},
  ]
  private selectedIndex: number | null = null

  private selected(index: number) {
    this.selectedIndex = index
  }

  selectNumber(number: number) {
    const index = this.selectedNumbers.indexOf(number)
    if (index > -1) {
      this.selectedNumbers.splice(index, 1) // 이미 선택된 경우, 선택 해제
    } else {
      this.selectedNumbers.length === 6 ? alert('6개까지만 선택할 수 있습니다.') : this.selectedNumbers.push(number) // 선택되지 않은 경우, 선택
    }
  }

  getClass(number: number) {
    if (this.selectedNumbers.includes(number)) {
      return 'selected' // 선택된 경우
    }
    return '' // 선택되지 않은 경우
  }

  async onSave() {
    if (this.selectedNumbers.length < 6) {
      alert('숫자는 6개를 선택해주세요')
      return
    }
    
    if (this.selectedIndex === null) {
      alert('소망도 선택해주세요')
      return
    }

    const challengeData = JSON.parse(Cookies.get('challenge') || '{}')
    if (challengeData && this.week === challengeData.round) {
      alert('회차당 1번만 제출 가능합니다')
      return
    }

    const confirmed = confirm('선택하신 번호가 확실합니까?')
    if (confirmed) {

      const user = getLoggedUserInfo()
      if (user) {
        try {
          // 저장
          const numbers = [this.selectedNumbers.join(', ')]

          const data = {
            date: dayjs().format('YYYYMMDD HH:mm:ss'),
            numbers,
            uid: user.uid,
            round: this.week,
            winningText: this.selectOptions[this.selectedIndex].text,
            type: 'challange',
          }
          sessionStorage.setItem(`myChallenge-${this.week}`, JSON.stringify(data))
          Cookies.set('challenge', JSON.stringify(data), { expires: 14 })

          await addDoc(collection(db, 'manual'), data)

          await alert('더보기 > 내 번호 관리에서 확인하실 수 있습니다.')

          sessionStorage.removeItem('challenge-number')
          sessionStorage.removeItem('challenge-winning')
          sessionStorage.removeItem('challenge-round')

          await this.$router.replace('/my/number?tab=manual')
        } catch (error) {
          console.error('Failed to parse user data:', error)
          alert('저장하는 데 오류가 발생했습니다. 잠시후 다시 시도해주세요')
        }
      } else {
        sessionStorage.setItem('challenge-number', [this.selectedNumbers.join(', ')].toString())
        sessionStorage.setItem('chanllenge-winning', this.selectedIndex.toString())
        sessionStorage.setItem('challenge-round', this.week)

        this.$router.replace(`/login?redirect=challenge?week=${this.week}`)
      }
    }
  }

  created() {
    window.scrollTo(0, 0)

    this.week = this.$route.query.week as string

    if (
      sessionStorage.getItem('challenge-number') &&
      sessionStorage.getItem('chanllenge-winning') &&
      sessionStorage.getItem('challenge-round')
    ) {
      const storedNumbers = sessionStorage.getItem('challenge-number')

      if (storedNumbers) {
        this.selectedNumbers = storedNumbers
          .split(',') 
          .map(num => parseInt(num.trim(), 10))
      }

      const storedWinning = sessionStorage.getItem('chanllenge-winning')

      if (storedWinning) {
        this.selectedIndex = Number(storedWinning)
      }
    }
  }
}
</script>

<style scoped>
.challenge {
  margin-top: 20px;
  margin-bottom: 114px;
  padding: 0 20px;
}

.week {
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  color: #ECEEF0;
}

.week > span {
  color: #4AFF81;
}

h2 {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 21.48px;
  color: #ECEEF0;
}

.number-grid {
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7개의 열로 변경 */
  gap: 10px;
  padding: 20px;
  border-radius: 16px;
  background-color: #222;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.number-item {
  position: relative;
  width: 100%; /* 각 그리드 셀의 너비를 100%로 설정 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.number-item > img {
  width: 32px;
  height: 32px;
}

.number-item > span {
  position: absolute;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  color: #9C9EA0;

}

.number-item.selected:nth-child(-n+10) > svg path,
.number-item.selected:nth-child(-n+10) > span {
  border-color: #FFBD00;
  color: #FFBD00;
  fill: #FFBD00;
}

.number-item.selected:nth-child(n+11):nth-child(-n+20) > svg path,
.number-item.selected:nth-child(n+11):nth-child(-n+20) > span {
  border-color: #4790FF;
  color: #4790FF;
  fill: #4790FF;
}

.number-item.selected:nth-child(n+21):nth-child(-n+30) > svg path,
.number-item.selected:nth-child(n+21):nth-child(-n+30) > span {
  border-color: #E64D3D;
  color: #E64D3D;
  fill: #E64D3D;
}

.number-item.selected:nth-child(n+31):nth-child(-n+40) > svg path,
.number-item.selected:nth-child(n+31):nth-child(-n+40) > span {
  border-color: #ECEEF0;
  color: #ECEEF0;
  fill: #ECEEF0;
}

.number-item.selected:nth-child(n+41):nth-child(-n+45) > svg path,
.number-item.selected:nth-child(n+41):nth-child(-n+45) > span {
  border-color: #2ECD70;
  color: #2ECD70;
  fill: #2ECD70;
}

.hope .option-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #222222;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  font-weight: 600;
}

.option-item.active {
  background-color: #fff;
}

.hope .option-item .text {
  margin-left: 10px;
  color: #fff;
}

.option-item.active .text {
  color: #000;
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
  min-height: 52px;
  background-color: #4AFF81;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: #181D23;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  cursor: pointer;
}
</style>