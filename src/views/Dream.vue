<template>
  <div class="container">
    <div class="page1" key="page1" v-if="showPage === 1">
      <div class="talk">"기묘한 꿈을 꾸웠느냐"</div>
      <div class="main__category">
        <div
          v-for="(category, index) in mainCategories"
          :key="index"
          :value="index"
          @click="onMainCategory(index)"
          :class="{ selected: index === selectedMainCategory }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{category.icon}}
          <span>{{ category.name }}</span>
          <img :src="index === selectedMainCategory ? require('@/assets/ic-system-dream-select.svg') : require('@/assets/ic-system-dream-unselect.svg')" />
        </div>
      </div>
    </div>

    <div class="page2" key="page2" v-else-if="showPage === 2">
      <div class="title">
        {{mainCategories[selectedMainCategory].icon}}
        <span>{{mainCategories[selectedMainCategory].name}}</span>
      </div>
      <div class="sub__category">
        <div
          v-for="(subCategory, index) in mainCategories[selectedMainCategory].subCategories" :key="index" :value="index"
          @click="onSubCategory(index)"
          :class="{ selected: index === selectedSubCategory }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ subCategory.name }}
          <img :src="index === selectedSubCategory ? require('@/assets/ic-system-dream-select.svg') : require('@/assets/ic-system-dream-unselect.svg')" />
        </div>
      </div>
    </div>

    <div class="page3" key="page3" v-else>
      <div class="title">
        {{mainCategories[selectedMainCategory].subCategories[selectedSubCategory].name}}
      </div>
      <div class="sub__category">
        <div
          v-for="(item, index) in mainCategories[selectedMainCategory].subCategories[selectedSubCategory].items" :key="index"
          @click="onLastCategory(index)"
          :class="{ selected: index === selectedLastCategory }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ item }}
          <img :src="index === selectedLastCategory ? require('@/assets/ic-system-dream-select.svg') : require('@/assets/ic-system-dream-unselect.svg')" />
        </div>
      </div>
    </div>

    <div class="floating">
      <div class="participation">
        <div class="people">
          <div class="person" />
          <div class="person" />
          <div class="person" />
        </div>
        {{ formattedCount }}명이 당첨 소감에 참여했어요
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { db } from '../../src/config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

interface SubCategory {
  name: string;
  items: string[];
}

interface MainCategory {
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

@Component
export default class Dream extends Vue {
selectedMainCategory: number | null = null
selectedSubCategory: number | null = null
selectedLastCategory: number | null = null

private currentCount: number = 0
private targetCount: number = 0
private intervalId: number | null = null

private showPage: number = 1

mainCategories: MainCategory[] = [
  {
    name: '가족 및 인간관계',
    icon: '🤱',
    subCategories: [
      {
        name: '부모님과 관련된 꿈',
        items: [
          '부모님과 함께 저녁을 먹는 꿈을 꿨어요.',
          '부모님께 혼나는 꿈을 꿨어요.',
          '부모님과 여행을 가는 꿈을 꿨어요.',
          '부모님과 대화를 나누는 꿈을 꿨어요.',
          '부모님께 선물을 받는 꿈을 꿨어요.',
          '부모님이 아프신 꿈을 꿨어요.',
          '부모님께서 나를 자랑하는 꿈을 꿨어요.',
          '부모님과 함께 집안일을 하는 꿈을 꿨어요.',
          '부모님께서 나에게 조언을 주시는 꿈을 꿨어요.',
          '부모님께서 나를 걱정하시는 꿈을 꿨어요.'
        ]
      },
      {
        name: '형제/자매와 관련된 꿈',
        items: [
          '형제와 다투는 꿈을 꿨어요.',
          '형제와 함께 놀이터에서 노는 꿈을 꿨어요.',
          '형제와 함께 공부하는 꿈을 꿨어요.',
          '형제와 함께 TV를 보는 꿈을 꿨어요.',
          '형제와 경쟁하는 꿈을 꿨어요.',
          '형제가 나를 도와주는 꿈을 꿨어요.',
          '형제가 나에게 선물을 주는 꿈을 꿨어요.',
          '형제와 함께 게임을 하는 꿈을 꿨어요.',
          '형제와 함께 모험을 떠나는 꿈을 꿨어요.',
          '형제와 함께 식사하는 꿈을 꿨어요.'
        ]
      },
      {
        name: '연인과 관련된 꿈',
        items: [
          '연인과 손을 잡고 산책하는 꿈을 꿨어요.',
          '연인과 다투는 꿈을 꿨어요.',
          '연인에게서 프로포즈를 받는 꿈을 꿨어요.',
          '연인과 헤어지는 꿈을 꿨어요.',
          '연인과 결혼하는 꿈을 꿨어요.',
          '연인과 함께 영화 보는 꿈을 꿨어요.',
          '연인이 나를 떠나는 꿈을 꿨어요.',
          '연인과 함께 요리하는 꿈을 꿨어요.',
          '연인이 나를 안아주는 꿈을 꿨어요.',
          '연인과 함께 여행 가는 꿈을 꿨어요.'
        ]
      },
      {
        name: '친구와 관련된 꿈',
        items: [
          '친구들과 파티를 하는 꿈을 꿨어요.',
          '친구와 함께 여행을 떠나는 꿈을 꿨어요.',
          '친구와 중요한 비밀을 나누는 꿈을 꿨어요.',
          '친구와 함께 놀러 가는 꿈을 꿨어요.',
          '친구가 나에게 도움을 주는 꿈을 꿨어요.',
          '친구와 다투는 꿈을 꿨어요.',
          '친구에게서 선물을 받는 꿈을 꿨어요.',
          '친구와 함께 공부하는 꿈을 꿨어요.',
          '친구와 함께 스포츠를 즐기는 꿈을 꿨어요.',
          '친구와 함께 사진을 찍는 꿈을 꿨어요.'
        ]
      },
      {
        name: '조부모님과 관련된 꿈',
        items: [
          '할머니와 할아버지께서 집에 오시는 꿈을 꿨어요.',
          '조부모님과 함께 시간을 보내는 꿈을 꿨어요.',
          '조부모님께서 나에게 조언해주시는 꿈을 꿨어요.',
          '조부모님께 선물을 받는 꿈을 꿨어요.',
          '조부모님께서 나를 위해 기도해주시는 꿈을 꿨어요.',
          '조부모님께서 나를 칭찬하시는 꿈을 꿨어요.',
          '조부모님과 함께 여행을 가는 꿈을 꿨어요.',
          '조부모님께서 나를 위해 요리해주시는 꿈을 꿨어요.',
          '조부모님과 함께 사진을 찍는 꿈을 꿨어요.',
          '조부모님과 함께 놀이터에서 노는 꿈을 꿨어요.'
        ]
      }
    ]
  },
  {
    name: '재물 및 금전운',
    icon: '🏡',
    subCategories: [
      {
        name: '돈과 관련된 꿈',
        items: [
          '지갑을 잃어버리는 꿈을 꿨어요.',
          '큰 돈을 주워서 기분 좋은 꿈을 꿨어요.',
          '돈이 가득한 가방을 발견하는 꿈을 꿨어요.',
          '돈을 기부하는 꿈을 꿨어요.',
          '돈을 받는 꿈을 꿨어요.',
          '돈을 빌려주는 꿈을 꿨어요.',
          '돈이 쌓여 있는 방을 발견하는 꿈을 꿨어요.',
          '돈을 세는 꿈을 꿨어요.',
          '돈이 불타는 꿈을 꿨어요.',
          '돈을 은행에 입금하는 꿈을 꿨어요.'
        ]
      },
      {
        name: '복권/로또와 관련된 꿈',
        items: [
          '복권에 당첨되는 꿈을 꿨어요.',
          '로또 번호를 맞추는 꿈을 꿨어요.',
          '복권을 사는 꿈을 꿨어요.',
          '복권을 잃어버리는 꿈을 꿨어요.',
          '복권을 친구에게 주는 꿈을 꿨어요.',
          '로또를 구매하는 꿈을 꿨어요.',
          '복권 당첨금을 수령하는 꿈을 꿨어요.',
          '복권을 찢는 꿈을 꿨어요.',
          '로또 번호를 계산하는 꿈을 꿨어요.',
          '복권 추첨 방송을 보는 꿈을 꿨어요.'
        ]
      },
      {
        name: '금고와 관련된 꿈',
        items: [
          '금고에서 돈을 꺼내는 꿈을 꿨어요.',
          '금고를 열어보니 보물이 가득한 꿈을 꿨어요.',
          '금고가 사라지는 꿈을 꿨어요.',
          '금고를 잃어버리는 꿈을 꿨어요.',
          '금고를 잠그는 꿈을 꿨어요.',
          '금고를 여는 비밀번호를 잊어버리는 꿈을 꿨어요.',
          '금고 안에 비밀 서류를 발견하는 꿈을 꿨어요.',
          '금고가 고장 나는 꿈을 꿨어요.',
          '금고를 훔치는 꿈을 꿨어요.',
          '금고에 보석을 넣는 꿈을 꿨어요.'
        ]
      },
      {
          name: '은행과 관련된 꿈',
          items: [
            '은행에서 대출을 받는 꿈을 꿨어요.',
            '은행 직원과 대화하는 꿈을 꿨어요.',
            '은행에서 돈을 인출하는 꿈을 꿨어요.',
            '은행에 예금하는 꿈을 꿨어요.',
            '은행 계좌를 개설하는 꿈을 꿨어요.',
            '은행에서 돈을 잃어버리는 꿈을 꿨어요.',
            '은행에서 대기하는 꿈을 꿨어요.',
            '은행에서 강도를 만나는 꿈을 꿨어요.',
            '은행에서 통장을 잃어버리는 꿈을 꿨어요.',
            '은행에 돈을 기부하는 꿈을 꿨어요.'
          ]
        },
        {
          name: '투자와 관련된 꿈',
          items: [
            '주식이 폭등하는 꿈을 꿨어요.',
            '투자 상담을 받는 꿈을 꿨어요.',
            '주식이 갑자기 하락하는 꿈을 꿨어요.',
            '부동산에 투자하는 꿈을 꿨어요.',
            '주식 계좌를 확인하는 꿈을 꿨어요.',
            '투자로 큰 돈을 버는 꿈을 꿨어요.',
            '투자 실패로 돈을 잃는 꿈을 꿨어요.',
            '금에 투자하는 꿈을 꿨어요.',
            '주식이 상장하는 꿈을 꿨어요.',
            '친구와 투자 이야기를 나누는 꿈을 꿨어요.'
          ]
        }
      ]
    },
    {
      name: '건강 및 질병',
      icon: '💊',
      subCategories: [
        {
          name: '병원과 관련된 꿈',
          items: [
            '병원에서 진찰을 받는 꿈을 꿨어요.',
            '병원에 입원하는 꿈을 꿨어요.',
            '병원에서 검사 결과를 듣는 꿈을 꿨어요.',
            '병원에서 수술을 받는 꿈을 꿨어요.',
            '병원에서 의사와 대화하는 꿈을 꿨어요.',
            '병원에서 간호를 받는 꿈을 꿨어요.',
            '병원에서 가족을 만나는 꿈을 꿨어요.',
            '병원에서 길을 잃는 꿈을 꿨어요.',
            '병원에서 치료를 받는 꿈을 꿨어요.'
          ]
        }
      ]
    }
  ];

  onMainCategory(index: number) {
    this.selectedMainCategory = index;
    this.showPage = 2;
  }

  onSubCategory(index: number) {
    this.selectedSubCategory = index;
    this.showPage = 3;
  }

  onLastCategory(index: number) {
    this.selectedLastCategory = index;

    this.$router.push('/random')
  }

  // 숫자를 포맷팅 (1,000 형태로 표시)
  get formattedCount(): string {
    return this.currentCount.toLocaleString();
  }

  // Firestore에서 counting 필드 가져오기
  private async getCountingFromFirestore() {
    try {
      const querySnapshot = await getDocs(collection(db, 'counting'));
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // 첫 번째 문서 가져오기
        const counting = doc.data().counting;
        return counting || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting counting from Firestore:', error);
      return 0;
    }
  }

  // 세션에 값을 저장하기
  private setSessionCount(value: number): void {
    sessionStorage.setItem('counting', value.toString());
  }

  // 세션에서 값을 가져오기
  private getSessionCount(): number {
    const count = sessionStorage.getItem('counting');
    return count ? parseInt(count, 10) : 0;
  }

  // 카운팅 애니메이션
  private startCounting(): void {
    const duration = 3000;
    const steps = 100; // 카운팅 업데이트 횟수 (프레임 수)
    const stepTime = Math.floor(duration / steps); // 각 프레임의 시간 간격 (밀리초)
    const increment = Math.ceil(this.targetCount / steps); // 한 번에 더해질 숫자

    this.intervalId = window.setInterval(() => {
      if (this.currentCount < this.targetCount) {
        this.currentCount += increment;
        if (this.currentCount >= this.targetCount) {
          this.currentCount = this.targetCount; // 목표값을 초과하지 않도록 설정
          clearInterval(this.intervalId!); // 카운팅이 완료되면 멈춤
        }
      }
    }, stepTime);
  }

  async mounted() {
    // 세션에 값이 있는지 확인하고, 없으면 Firestore에서 값을 가져옴
    let count = this.getSessionCount();
    if (count === 0) {
      count = await this.getCountingFromFirestore(); // Firestore에서 데이터 가져오기
      this.setSessionCount(count); // 세션에 저장
    }
    this.targetCount = count; // 카운팅 목표값 설정

    this.startCounting();
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

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  padding: 0 20px;
  width: calc(100% - 40px);
  box-sizing: border-box;
}

.talk {
  margin-top: 24px;
  margin-bottom: 36px;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.main__category div {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  padding: 20px;
  background-color: #222;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}

.main__category div span {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.5px;
}

.main__category div img {
  margin-left: auto;
}


.main__category div.selected {
  background-color: #fff;
  color: #202223;
}


.title {
  margin-top: 24px;
  margin-bottom: 32px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: 26px;
}

.title span {
  margin-left: 2px;
}

.sub__category div {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  padding: 20px;
  background-color: #222;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}

.sub__category div span {
  margin-left: 2px;
}

.sub__category div img {
  margin-left: auto;
}


.sub__category div.selected {
  background-color: #fff;
  color: #202223;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: calc(100% - 40px);
  padding: 30px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 64.38%);
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: #ECEEF0;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  font-variant: common-ligatures tabular-nums;
}

.floating > .participation > .people {
  display: flex;
  flex-direction: row;
}

.floating > .participation > .people > .person:not(:first-child) {
  margin-left: -6px;
}

.floating > .participation > .people > .person {
  width: 32px;
  height: 32px;
  background-color: #414244;
  border-radius: 50%;
  border: 1.33px solid #181D23;
}
</style>