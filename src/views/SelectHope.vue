<template>
  <transition name="fade" mode="out-in">
    <div class="container">
      <LoginPopup
        :numbers="LoginPopupNumbers"
        :visible="isPopupVisible"
        @close="isPopupVisible = false"
      />

      <div v-if="isLoading">
        <div class="waitinging">
          <img src="@/assets/ic-stefan-2d.svg" class="bounce-animation" />
          <div class="waiting">잠시만 기다려주세요.</div>
        </div>
      </div>

      <div v-else>
        <div class="img-bg">
          <img src='@/assets/img-stefan-3d.png' at="character 이미지" />
        </div>

        <div v-for="(message, index) in texts" :key="index" class="text" :style="{ animationDelay: `${index * 0.2}s` }">
          {{ message }}
        </div>

        <div class="tab-container">
          <div class="tab">
            <div :class="['tab-item', { active: activeTab === 'select' }]" @click="setActiveTab('select')">소망 선택</div>
            <div :class="['tab-item', { active: activeTab === 'input' }]" @click="setActiveTab('input')">직접입력</div>
            <div class="tab-indicator" :style="indicatorStyle"></div>
          </div>
        </div>
        <div class="tab-content">
          <div v-if="activeTab === 'select'">
            <div
              v-for="(option, index) in selectOptions"
              :key="index"
              :class="['option-item', { active: selectedIndex === index }]"
              @click="selected(index)"
            >
              <span class="icon">{{ option.icon }}</span>
              <span class="tab-text">{{ option.text }}</span>
            </div>
          </div>
          <div v-if="activeTab === 'input'" class="textarea-box">
            <textarea
              ref="myTextarea"
              class="custom-textarea"
              v-model="impression"
              @input="handleInput"
            />
            <div class="placeholder" @click="onPlaceholder" v-if="!impression">{{ placeholderText }}</div>
            <div class="textarea-footer">
              <span class="current">{{ impression.length }}<span class="max"> / 300</span></span>
            </div>
          </div>
        </div>

        <div :class="['floating', { select: activeTab === 'select' }]">
          <button
            class="primary"
            :disabled="isLoading || activeTab === 'select' ? selectedIndex === null : impression.length < 1"
            @click="onLogin"
          >
            <template v-if="activeTab === 'select'">
              <img :src="selectedIndex !== null ? require('@/assets/ic-system-challenge.svg') : require('@/assets/ic-system-challenge-off.svg')" />
            </template>
            
            {{activeTab === 'select' ? '선택하기' : '입력 완료'}}
          </button>
          <button v-if="activeTab === 'select'" class="none" :disabled="isLoading" @click="onItsOk">넘어가기</button>
        </div>
      </div>
      
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs, { Dayjs } from 'dayjs'
import Cookies from 'js-cookie'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import LoginPopup from '@/components/LoginPopup.vue'

import { getLoggedUserInfo } from '@/utils/user'
import { SelectOption } from '../models/Select'

@Component({
  components: {
    LoginPopup,
  },
})
export default class Result extends Vue {
  private activeTab: string = 'select'
  private selectedIndex: number | null = null
  private LoginPopupNumbers: number[] = []

  isLoading = false

  impression: string = ''
  placeholderText: string = '진솔한 당첨소감을 작성해보세요.\n꼭 이루어질거예요!'

  isPopupVisible = false

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

  texts = ['"이제 소망을 선택해보세요.', '토요일 좋은 일이 생길거예요"']

  private setActiveTab(tab: string) {
    this.activeTab = tab
  }

  get indicatorStyle() {
    return {
      transform: this.activeTab === 'select' ? 'translateX(0)' : 'translateX(100%)',
    }
  }

  private selected(index: number) {
    this.selectedIndex = index
  }

  private handleInput(event: Event) {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement
    const placeholder = document.querySelector('.placeholder') as HTMLDivElement
    
    if (textarea && placeholder) {
      // 텍스트 영역에 입력된 값이 없으면 placeholder를 보여줌
      placeholder.style.display = textarea.value ? 'none' : 'block'
    }

    const target = event.target as HTMLTextAreaElement
    if (target.value.length > 300) {
      target.value = target.value.slice(0, 300)
    }
    this.impression = target.value
  }

  private onPlaceholder() {
    (this.$refs.myTextarea as HTMLTextAreaElement).focus()
  }

  private onItsOk() {
    this.onLogin()
  }

  private async onLogin() {
    const user = getLoggedUserInfo()

    if (user) {
      try {
        if (this.activeTab === 'select') {
          sessionStorage.setItem('hope', this.selectedIndex === null ? '' : this.selectedIndex!.toString())
          sessionStorage.setItem('hope-select', 'true')
        } else {
          sessionStorage.setItem('hope', `${this.impression}`)
          sessionStorage.setItem('hope-select', 'false')
        }

        await this.saveLottoNumbers()
      } catch (error) {
        console.error('Failed to parse user data:', error)
        alert('저장하는 데 오류가 발생했습니다. 잠시후 다시 시도해주세요')
        return
      }
    } else {
      if (this.activeTab === 'select') {
        sessionStorage.setItem('hope', this.selectedIndex === null ? '' : this.selectedIndex!.toString())
        sessionStorage.setItem('hope-select', 'true')
      } else {
        sessionStorage.setItem('hope', `${this.impression}`)
        sessionStorage.setItem('hope-select', 'false')
      }
      
      //   const storedNumbers = sessionStorage.getItem('lottoNumbers')
      //   if (storedNumbers) {
      //   // 문자열에서 양쪽의 따옴표를 제거하고, 쉼표로 분리하여 배열로 변환 후 숫자로 변환
      //   this.LoginPopupNumbers = storedNumbers
      //     .replace(/^"|"$/g, '')  // 양 끝의 따옴표 제거
      //     .split(',')             // 쉼표로 문자열 분리
      //     .map(num => Number(num.trim())) // 각 요소를 숫자로 변환
      // }
      // this.isPopupVisible = true
      this.$router.replace('/login?redirect=select-hope')
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

  private async saveLottoNumbers() {
    this.isLoading = true

    const userData = Cookies.get('user') as string
    let user = null

    if (userData) {
      try {
        user = JSON.parse(userData)

        const round = this.getLottoWeek(dayjs())

        const numbers = [(sessionStorage.getItem('lottoNumbers'))!.replace(/^"|"$/g, '')]

        try {
          // automatic or dream 컬렉션에 새로운 문서 추가
          const winningText = this.activeTab === 'select' ? this.selectedIndex === null ? '' : this.selectOptions[this.selectedIndex!].text : this.impression
          await addDoc(collection(db, 'automatic'), {
            date: dayjs().format('YYYYMMDD HH:mm:SS'),
            numbers,
            uid: user.uid,
            round,
            winningText: winningText,
          })

          const datas = sessionStorage.getItem('myNumbers')
          const insertData = {
            date: dayjs().format('YYYYMMDD HH:mm:SS'),
            numbers,
            uid: user.uid,
            round,
            winningText: winningText,
          }

          if (!datas) {
            // sessionStorage에 아무 데이터도 없으면, 배열에 insertData를 넣어서 저장
            sessionStorage.setItem('myNumbers', JSON.stringify(insertData))
          } else {
            const alreadyDatas = JSON.parse(datas)

            const updatedData = Array.isArray(alreadyDatas) ? alreadyDatas : [alreadyDatas]
            updatedData.push(insertData)

            updatedData.sort((a, b) => {
              return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
            })

            sessionStorage.setItem('myNumbers', JSON.stringify(updatedData))
          }

          sessionStorage.removeItem('hope')
          sessionStorage.removeItem('lottoNumbers')
          sessionStorage.removeItem('type')

          setTimeout(() => {
            this.isLoading = false

            this.$router.push('/my/number?tab=automatic')
          }, 2000)
          
        } catch (e) {
          console.error('Error adding document: ', e)
          alert('저장하는 과정에서 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
        user = null
      }
    } else {
      user = null
      this.showPopup()
    }
  }

  private handleBackButton(): void {
    const user = getLoggedUserInfo()

    if (!user && this.$route.path === '/select-hope' && sessionStorage.getItem('lottoNumbers')) {
      this.showPopup()

      // 히스토리를 조작하여 페이지 이동을 막음
      history.pushState(null, '', window.location.href)
    }
  }

  showPopup() {
    const storedNumbers = sessionStorage.getItem('lottoNumbers')
    
    if (storedNumbers) {
      // 문자열에서 양쪽의 따옴표를 제거하고, 쉼표로 분리하여 배열로 변환 후 숫자로 변환
      this.LoginPopupNumbers = storedNumbers
        .replace(/^"|"$/g, '')  // 양 끝의 따옴표 제거
        .split(',')             // 쉼표로 문자열 분리
        .map(num => Number(num.trim())) // 각 요소를 숫자로 변환
    }

    this.isPopupVisible = true
  }

  mounted() {
    // 페이지 로드 시 히스토리 상태 추가 (페이지 이동 막기 위해 pushState 사용)
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', this.handleBackButton)
  }

  // redirect (login)
  created() {
    if (sessionStorage.getItem('hope') && sessionStorage.getItem('lottoNumbers')) {
      if (sessionStorage.getItem('hope-select') === 'true') {
        this.selectedIndex = Number(sessionStorage.getItem('hope'))
        this.activeTab = 'select'
      } else {
        this.impression = sessionStorage.getItem('hope') || ''
        this.activeTab = 'input'
      }
      
      this.saveLottoNumbers()
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes slideUp3 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp2 {
  0% {
    transform: translateY(50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.container {
  margin-bottom: calc(104px + env(safe-area-inset-bottom));
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #171717;
}

.text {
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;

  opacity: 0;
  transform: translateY(50%);
  animation: slideUp2 1s forwards;
  animation-delay: 0.3s;
}

.img-bg {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  background-color: #4262FF;
  border-radius: 50%;
  margin-bottom: 12px;
  opacity: 0;
  transform: translateY(50%);
  animation: slideUp2 1s forwards;
}

.img-bg > img {
  width: 44px;
  height: 44px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.tab-container {
  margin-top: 32px;
  padding: 4px;
  background-color: #222222;
  border-radius: 100px;

  opacity: 0;
  animation: slideUp3 1s forwards;
  animation-delay: 0.5s;
}

.tab {
  display: flex;
  border-radius: 100px;
  width: 100%;
  position: relative;
  margin: 2px 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  border-radius: 100px;
  font-size: 14px;
  color: #737577;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 50%; /* 탭 인디케이터 너비는 두 개의 탭에 맞춰 50%로 설정 */
  background-color: #ECEEF0;
  border-radius: 100px;
  transition: transform 0.3s ease; /* 슬라이드 트랜지션 */
  z-index: 0; /* 텍스트 뒤에 배경 인디케이터를 배치 */
}

.tab-item.active {
  color: #202223;
  /* background-color: #ECEEF0; */
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
}

.tab-content {
  margin-top: 20px;
  width: 100%;
  text-align: center;

  opacity: 0;
  animation: slideUp3 1s forwards;
  animation-delay: 0.7s;
}

.tab-content .option-item {
  display: flex;
  align-items: center;
  padding: 18px;
  background-color: #222222;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  font-weight: 600;
}

.option-item.active {
  background-color: #fff;
}

.tab-content .option-item .tab-text {
  margin-left: 10px;
  color: #fff;
}

.option-item.active .tab-text {
  color: #000;
}

.textarea-box {
  padding: 16px 20px;
  border-radius: 10px;
  background-color: #2a2a2a;
  position: relative;
}

.custom-textarea {
  padding: 0;
  width: 100%;
  height: 46px;
  border: none;
  outline: none;
  background-color: #2a2a2a;
  color: #b3b3b3;
  resize: none;
  font-size: 15px;
  font-weight: 500;
  line-height: 23px;
  white-space: pre-line;
}

.placeholder {
  position: absolute;
  top: 16px;
  color: #9C9EA0;
  white-space: pre-line;
  font-size: 15px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  color: #b3b3b3;
  font-size: 14px;
}

.textarea-footer span {
  color: #FFFFFF;
  font-size: 13px;
  line-height: 17px;
  font-weight: 400;
}

.textarea-footer span.max {
  color: #D3D5D9;
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
}

.floating.select {
  display: flex;
  gap: 10px;
  flex-direction: row-reverse;
}

.floating.select > button.none {
  width: 100%;
  min-height: 52px;
  background-color: #333333;
  padding: 8px 8px;
  border-radius: 100px;
  border-style: none;
  color: #ECEEF0;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
}

.floating > button {
  width: 100%;
  min-height: 52px;
  background-color: #4AFF81;
  padding: 8px 8px;
  border-radius: 100px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
}

.floating > button.primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.floating > button:disabled {
  background-color: #333333;
  color: #737577;
}

.floating > button.none {
  background-color: #171717;
  color: #9C9EA0;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7.5px);
  }
}

.waitinging {
  padding: 40px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}

.waiting {
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: center;
  color: #9C9EA0;
}

.bounce-animation {
  animation: bounce 2s infinite;
}
</style>
