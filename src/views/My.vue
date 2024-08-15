<template>
  <div class="my">
    <div class="summary">
      <img :src="userImage" class="person" />
      <div class="nickname">{{nickname}}</div>
      <div class="email">
        <div class="kakao">
          <img src="@/assets/ic-system-kakao.svg" />
        </div>
        {{user.email}}
      </div>
    </div>

    <div class="ad" />

    <div class="menu">
      <div class="title">서비스</div>
        <div v-for="item in services" :key="item.title" class="service-item" @click="$router.push(item.link)">
          <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
          <span class="service-title">{{ item.title }}</span>
          <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">저장소</div>
      <div v-for="item in repositories" :key="item.title" class="service-item" @click="onNumber(item.title)">
        <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">일반</div>
      <div v-for="(item, i) in general" :key="item.title" class="service-item" @click="onGeneral(i)">
        <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

@Component
export default class My extends Vue {
  nickname = '';
  user: any = {};

  services = [
    {
      title: 'Ai 로또생성',
      icon: 'ic-ai.svg',
      link: '/ai',
    },
    {
      title: '꿈해몽 생성',
      icon: 'ic-dreams.svg',
      link: '/dream',
    },
  ];

  repositories = [
    {
      title: '나의 번호 관리',
      icon: 'ic-system-star.svg',
    }
  ];

  general = [
    {
      title: '문의하기',
      icon: 'ic-system-setting.svg',
    },
    {
      title: '이용약관',
      icon: 'ic-system-setting.svg',
    },
    {
      title: '개인정보처리방침',
      icon: 'ic-system-setting.svg',
    },
  ];

  private adjectives: string[] = [
    '희망찬', '용감한', '즐거운', '활기찬', '씩씩한', '지혜로운', '사랑스러운', '기쁜', '자유로운'
  ];

  private animals: string[] = [
    '돼지', '호랑이', '사자', '고양이', '강아지', '곰', '여우', '토끼', '독수리'
  ];

  get userImage(): string {
    const lastDigit = parseInt(this.user.uid.slice(-1), 10);

    let imageName = "";

    if (lastDigit >= 1 && lastDigit <= 3) {
      imageName = 'ic-system-user1.svg';
    } else if (lastDigit >= 4 && lastDigit <= 6) {
      imageName = 'ic-system-user2.svg';
    } else if (lastDigit >= 7 && lastDigit <= 9) {
      imageName = 'ic-system-user3.svg';
    } else {
      imageName = 'ic-system-user1.svg';
    }

    return require(`@/assets/${imageName}`);
  }

  generateNickname(uid: string): string {
    const firstDigit = parseInt(uid.split('_')[1].charAt(0));
    const lastDigit = parseInt(uid.slice(-1), 10);
    const number = parseInt(uid.split('_')[1].substring(0, 4));

    const adjective = this.adjectives[firstDigit % this.adjectives.length - 1];
    const animal = this.animals[lastDigit % this.animals.length - 1];

    return `${adjective}${animal}${number}`;
  }

  onGeneral(index: number) {
    if (index === 0) {
      this.openEmail();
    }
  }

  onNumber(title: string) {
    Cookies.set('menu', title)
    this.$router.push('/my/number')
  }

  openEmail() {
    const email = 'mohito.project@gmail.com'; 
    const subject = encodeURIComponent('문의사항');
    const body = encodeURIComponent('여기에 내용을 입력하세요.');

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  created() {
    const userData = Cookies.get('user') as string;
    this.user = JSON.parse(userData);

    this.nickname = this.generateNickname(this.user.uid);
  }
}
</script>

<style scoped>
.my {
  margin-top: 24px;
  padding: 0 20px;
}

.summary {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.summary > img {
  width: 64px;
  height: 64px;
  text-align: center;
  margin-bottom: 8px;
}

.summary > .nickname {
  margin-bottom: 4px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color:#ECEEF0;
}

.summary > .email {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  color: #9C9EA0;
}

.summary > .email > .kakao {
  background-color: #ECEEF0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 75px;
}

.summary > .email > .kakao > img {
  width: 13.5px;
  height: 13.5px;
}

.ad {
  margin-bottom: 24px;
  background-color: #F3F3F3;
  border-radius: 12px;
  width: 100%;
  height: 62px;
}

.menu {
  margin-bottom: 28px;
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: #9C9EA0;
}

.menu > .title {
  margin-bottom: 1px;
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  text-align: left;
  color: #9C9EA0;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 7px 0;
  cursor: pointer;
}

.service-item:last-child {
  border-bottom: none;
}

.service-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.service-title {
  flex-grow: 1;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: #ECEEF0;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}
</style>