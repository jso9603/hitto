<template>
  <div class="container">
    <div v-if="isLoading">
      <div class="waitinging">
        <img src="@/assets/ic-system-stefan.svg" class="bounce-animation" />
        <div class="waiting">잠시만 기다려주세요.</div>
      </div>
    </div>

    <div v-else>
      <div class='typing1'>"이제 마지막이야~소망을 선택해봐.<br/>토요일 너에게도 ✨행운이 갈거야"</div>

      <div class="tab">
        <div :class="['tab-item', { active: activeTab === 'select' }]" @click="setActiveTab('select')">소망 선택</div>
        <div :class="['tab-item', { active: activeTab === 'input' }]" @click="setActiveTab('input')">직접입력</div>
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
            <span class="text">{{ option.text }}</span>
          </div>
        </div>
        <div v-if="activeTab === 'input'">
          <textarea
            class="custom-textarea"
            v-model="impression"
            placeholder="진솔한 당첨소감을 작성해보세요.\n꼭 이루어질거예요!"
            @input="handleInput"
          />
          <div class="textarea-footer">
            <span>{{ impression.length }} / 300</span>
          </div>
        </div>
      </div>

      <div class="floating">
        <button
          class="primary"
          :disabled="activeTab === 'select' ? !selectedIndex : impression.length < 1"
          @click="onLogin"
        >
          {{activeTab === 'select' ? '완료' : '작성 완료'}}
        </button>
        <button class="none" @click="onLogin">그냥 넘어갈게요</button>
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
import { getLoggedUserInfo } from '@/utils/user'

interface SelectOption {
  icon: string;
  text: string;
}

@Component
export default class Result extends Vue {
  private activeTab: string = 'select';
  private selectedIndex: number | null = null;

  isLoading = false;

  impression: string = '';

  private selectOptions: SelectOption[] = [
    { icon: '✨', text: '포르쉐 파나메라 사게해주세요.' },
    { icon: '🏡', text: '반포 아크로리버파크 사게해주세요.' },
    { icon: '✈️', text: '몰디브에서 모히또 한잔하고 싶어요.'},
    { icon: '🤱', text: '자녀 교육에 걱정 없게 해주세요!'},
    { icon: '🦄', text: '꿈꾸던 사업을 시작하고 싶어요!'},
  ];

  private setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  private selected(index: number) {
    this.selectedIndex = index;
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (target.value.length > 300) {
      target.value = target.value.slice(0, 300);
    }
    this.impression = target.value;
  }

  private onLogin() {
    const user = getLoggedUserInfo();
    if (user) {
      try {
        if (this.activeTab === 'select' && this.selectedIndex) {
          sessionStorage.setItem('hope', `${this.selectOptions[this.selectedIndex].text}`);
        } else {
          sessionStorage.setItem('hope', `${this.impression}`);
        }

        this.saveLottoNumbers(Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        alert('저장하는 데 오류가 발생했습니다. 잠시후 다시 시도해주세요');
      }
    } else {
      this.$router.push('/login?redirect=select-hope');
    }
  }

  saveLottoNumbers = async (collectionName: string) => {
    this.isLoading = true;

    const userData = Cookies.get('user') as string;
    const user = JSON.parse(userData);

    const t1 = dayjs('20021207')
    const t2 = dayjs()
    const dff = dayjs.duration(t2.diff(t1)).asDays()

    // 돌아오는 회차를 저장
    const round = Math.floor(dff / 7) + 2

    const numbers = [(sessionStorage.getItem('lottoNumbers'))!.replace(/^"|"$/g, '')]

    try {
      // lottos or dream 컬렉션에 새로운 문서 추가
      await addDoc(collection(db, collectionName), {
        date: dayjs().format('YYYYMMDD'),
        numbers,
        uid: user.uid,
        round,
        winningText: sessionStorage.getItem('hope'),
      });

      const datas = sessionStorage.getItem('myNumbers');
      const insertData = {
        date: dayjs().format('YYYYMMDD'),
        numbers,
        uid: user.uid,
        round,
        winningText: sessionStorage.getItem('hope'),
      }

      if (!datas) {
        // sessionStorage에 아무 데이터도 없으면, 배열에 insertData를 넣어서 저장
        sessionStorage.setItem('myNumbers', JSON.stringify(insertData));
      } else {
        const alreadyDatas = JSON.parse(datas);

        const updatedData = Array.isArray(alreadyDatas) ? alreadyDatas : [alreadyDatas];
        updatedData.push(insertData);
        sessionStorage.setItem('myNumbers', JSON.stringify(updatedData));
      }

      sessionStorage.removeItem('hope');
      sessionStorage.removeItem('lottoNumbers');
      sessionStorage.removeItem('type');

      this.isLoading = false;

      this.$router.push('/my/number');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('저장하는 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  // redirect (login)
  created() {
    if (sessionStorage.getItem('hope') && sessionStorage.getItem('lottoNumbers')) {
      this.saveLottoNumbers(Cookies.get('menu') === 'AI 번호 생성' ? 'lottos' : 'dream');
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  width: calc(100% - 40px);
  box-sizing: border-box;
  background-color: #171717;
}

.typing1 {
  margin-bottom: 36px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.tab {
  display: flex;
  margin-bottom: 20px;
}

.tab-item {
  margin-right: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #5F6163;
  transition: border-color 0.3s, background-color 0.3s;
}

.tab-item.active {
  color: #fff;
}

.tab-content {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.tab-content .option-item {
  display: flex;
  align-items: center;
  width: 100%;
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

.tab-content .option-item .text {
  margin-left: 10px;
  color: #fff;
}

.option-item.active .text {
  color: #000;
}

.custom-textarea {
  width: 100%;
  height: 100px;
  padding: 15px;
  border: none;
  outline: none;
  border-radius: 10px;
  background-color: #2a2a2a;
  color: #b3b3b3;
  resize: none;
  font-size: 16px;
  white-space: pre-line; /* 줄바꿈을 위한 스타일 */
}

.custom-textarea::placeholder {
  color: #737577;
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

.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px; /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding: 20px;
  background: linear-gradient(180deg, #171717 0%, #171717 64.38%);
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

.floating > button:disabled {
  background-color: #414244;
  color: #181D23;
}

.floating > button.none {
  margin-top: 8px;
  background-color: #171717;
  color: #fff;
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
  width: 100%;
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
