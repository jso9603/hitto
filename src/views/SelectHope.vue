<template>
  <div class="container">
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
      <button class="primary" @click="onLogin">{{activeTab === 'select' ? '완료' : '작성 완료'}}</button>
      <button class="none" @click="$router.push('/ai')">그냥 넘어갈게요</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

interface SelectOption {
  icon: string;
  text: string;
}

@Component
export default class Result extends Vue {
  private activeTab: string = 'select';
  private selectedIndex: number | null = null;

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
    const userData = Cookies.get('user') as string;
    const user = JSON.parse(userData);

    // Type: lotto, dream
    sessionStorage.setItem('type', 'lotto');
    if (this.activeTab === 'select' && this.selectedIndex) {
        sessionStorage.setItem('hope', `${this.selectOptions[this.selectedIndex].text}`);
      } else {
        sessionStorage.setItem('hope', `${this.impression}`);
      }
    
    if (user.uid && user.email) {
      this.saveLottoNumbers(this.activeTab === 'select' ? 'lottos' : 'dream');
      
    } else {
      this.$router.push('/login');
    }
  }

  saveLottoNumbers = async (collectionName: string) => {
    const userData = Cookies.get('user') as string;
    const user = JSON.parse(userData);

    const t1 = dayjs('20021207')
    const t2 = dayjs()
    const dff = dayjs.duration(t2.diff(t1)).asDays()

    // 돌아오는 회차를 저장
    const round = Math.floor(dff / 7) + 2

    const numbers = [(sessionStorage.getItem('lottoNumbers'))!.replace(/^"|"$/g, '')]

    try {
      // lottos 컬렉션에 새로운 문서 추가
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
        sessionStorage.setItem('myNumbers', JSON.stringify(insertData))
      } else {
        const alreadyDatas = JSON.parse(datas);
        alreadyDatas.push(insertData);

        sessionStorage.setItem('myNumbers', JSON.stringify(alreadyDatas));
      }
      this.$router.push('/my/number');
    } catch (e) {
      console.error('Error adding document: ', e);
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

.floating > button.none {
  margin-top: 8px;
  background-color: #171717;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
}
</style>
