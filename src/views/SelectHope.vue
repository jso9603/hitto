<template>
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
      <div class="text">"이제 소망을 선택해보세요.<br/>토요일 좋은 일이 생길거예요"</div>

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

      <div class="floating">
        <button
          class="primary"
          :disabled="isLoading || activeTab === 'select' ? selectedIndex === null : impression.length  < 1"
          @click="onLogin"
        >
          {{activeTab === 'select' ? '선택할게요' : '입력했어요'}}
        </button>
        <button class="none" :disabled="isLoading" @click="onLogin">괜찮아요</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import LoginPopup from '@/components/LoginPopup.vue'

import { getLoggedUserInfo } from '@/utils/user'

interface SelectOption {
  icon: string
  text: string
}

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
    { icon: '✨', text: '포르쉐 파나메라 사게해주세요.' },
    { icon: '🏡', text: '반포 아크로리버파크 사게해주세요.' },
    { icon: '✈️', text: '몰디브에서 모히또 한잔하고 싶어요.'},
    { icon: '🤱', text: '자녀 교육에 걱정 없게 해주세요!'},
    { icon: '🦄', text: '꿈꾸던 사업을 시작하고 싶어요!'},
  ]

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

  private async onLogin() {
    const user = getLoggedUserInfo()

    if (user) {
      try {
        // my에서 탭으로 분류
        sessionStorage.setItem('type', Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream')
        if (this.activeTab === 'select') {
          sessionStorage.setItem('hope', this.selectedIndex!.toString())
          sessionStorage.setItem('hope-select', 'true')
        } else {
          sessionStorage.setItem('hope', `${this.impression}`)
          sessionStorage.setItem('hope-select', 'false')
        }

        await this.saveLottoNumbers(Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream')
      } catch (error) {
        console.error('Failed to parse user data:', error)
        alert('저장하는 데 오류가 발생했습니다. 잠시후 다시 시도해주세요')
      }
    } else {
      sessionStorage.setItem('type', Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream')
      if (this.activeTab === 'select') {
        sessionStorage.setItem('hope', this.selectedIndex!.toString())
        sessionStorage.setItem('hope-select', 'true')
      } else {
        sessionStorage.setItem('hope', `${this.impression}`)
        sessionStorage.setItem('hope-select', 'false')
      }
      
      // this.$router.replace('/login?redirect=select-hope')
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
  }

  isAfterSaturday6() {
    const now = dayjs()
    let saturday9 = dayjs().day(6).hour(18).minute(0).second(0) // 이번 주 토요일 9시

    // dayjs().day(6)를 사용할 때 dayjs가 현재 주의 "토요일"을 참조
    // 현재 dayjs().day(6)는 토요일을 기준으로 시간을 계산하는데, 일요일이 되면 dayjs().day(6)는 다가오는 토요일(다음 주 토요일)을 참조
    // 그래서 일요일이 되면 dayjs().day(6)은 일주일 후의 토요일 오후 9시를 참조하게 되며,
    // 이로 인해 now.isAfter(saturday9)는 false를 반환

    // day(6)를 사용할 때는 현재 요일을 고려하여, 다음 주가 아니라 이번 주의 토요일 9시를 기준으로 할 수 있도록 해야함

    // 만약 현재 시간이 일요일이면 지난 토요일을 참조하도록 처리
    if (now.day() === 0) {
      // 일요일일 경우 지난 토요일로 변경 (지난 토요일 9시)
      saturday9 = dayjs().subtract(1, 'week').day(6).hour(18).minute(0).second(0)
    }
    return now.isAfter(saturday9)
  }

  private async saveLottoNumbers(collectionName: string) {
    this.isLoading = true

    const userData = Cookies.get('user') as string
    let user = null

    if (userData) {
      try {
        user = JSON.parse(userData)

        const t1 = dayjs('20021207')
        const t2 = dayjs()
        const dff = dayjs.duration(t2.diff(t1)).asDays()

        // 돌아오는 회차를 저장
        const currentWeek = Math.floor(dff / 7) + 1

        let round = 0
        if (this.isAfterSaturday6()) {
          round = (currentWeek)
        } else {
          round = (currentWeek - 1)
        }

        const numbers = [(sessionStorage.getItem('lottoNumbers'))!.replace(/^"|"$/g, '')]

        try {
          // lottos or dream 컬렉션에 새로운 문서 추가
          await addDoc(collection(db, collectionName), {
            date: dayjs().format('YYYYMMDD HH:MM'),
            numbers,
            uid: user.uid,
            round,
            winningText: this.activeTab === 'select' ? this.selectOptions[this.selectedIndex!].text : this.impression,
          })

          const datas = Cookies.get('menu') === 'AI 번호 생성' ? sessionStorage.getItem('myNumbers') : sessionStorage.getItem('myDreams')
          const insertData = {
            date: dayjs().format('YYYYMMDD HH:MM'),
            numbers,
            uid: user.uid,
            round,
            winningText: this.activeTab === 'select' ? this.selectOptions[this.selectedIndex!].text : this.impression,
          }

          if (!datas) {
            // sessionStorage에 아무 데이터도 없으면, 배열에 insertData를 넣어서 저장
            const sessionStorageName = Cookies.get('menu') === 'AI 번호 생성' ? 'myNumbers' : 'myDreams'
            sessionStorage.setItem(sessionStorageName, JSON.stringify(insertData))
          } else {
            const alreadyDatas = JSON.parse(datas)

            const updatedData = Array.isArray(alreadyDatas) ? alreadyDatas : [alreadyDatas]
            updatedData.push(insertData)

            updatedData.sort((a, b) => {
              return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
            })

            const sessionStorageName = Cookies.get('menu') === 'AI 번호 생성' ? 'myNumbers' : 'myDreams'
            sessionStorage.setItem(sessionStorageName, JSON.stringify(updatedData))
          }

          sessionStorage.removeItem('hope')
          sessionStorage.removeItem('lottoNumbers')
          sessionStorage.removeItem('type')

          setTimeout(() => {
            this.isLoading = false

            this.$router.push(`/my/number?tab=${Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream'}`)
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
      
      this.saveLottoNumbers(Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream')
    }
  }
}
</script>

<style scoped>
.container {
  margin-bottom: calc(152px + env(safe-area-inset-bottom));
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #171717;
}

.text {
  margin-bottom: 32px;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.tab-container {
  padding: 4px;
  background-color: #222222;
  border-radius: 100px;
}

.tab {
  display: flex;
  border-radius: 100px;
  width: 100%;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
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

.floating > button:disabled {
  background-color: #414244;
  color: #181D23;
}

.floating > button.none {
  background-color: #171717;
  color: #9C9EA0;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
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
