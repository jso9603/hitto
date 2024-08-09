<template>
  <div class="my">
    <div class="summary">
      <img :src="userImage" class="person" />
      <div class="email">{{user.email}}</div>
    </div>

    <div class="ad" />

    <div class="menu">
      <div class="title">서비스</div>
        <div v-for="item in services" :key="item.title" class="service-item">
          <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
          <span class="service-title">{{ item.title }}</span>
          <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">저장소</div>
      <div v-for="item in repositories" :key="item.title" class="service-item">
        <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>

    <div class="menu">
      <div class="title">일반</div>
      <div v-for="item in general" :key="item.title" class="service-item">
        <img :src="require(`@/assets/${item.icon}`)" class="service-icon" />
        <span class="service-title">{{ item.title }}</span>
        <img src="@/assets/ic-system-arrow-right.svg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class My extends Vue {
  // TODO
  // store에서 email, uid 가져와서 처리 필요

  user = {
    uid: 'uid_1720850205303',
    email: 'test@gmail.com',
  }

  services = [
    {
      title: 'Ai 로또생성',
      icon: 'ic-ai.svg',
    },
    {
      title: '꿈해몽 생성',
      icon: 'ic-dreams.svg',
    },
  ];

  repositories = [
    {
      title: 'Ai 로또생성',
      icon: 'ic-system-star.svg',
    }
  ];

  general = [
    {
      title: '이용약관',
      icon: 'ic-system-setting.svg',
    },
    {
      title: '개인정보처리방침',
      icon: 'ic-system-setting.svg',
    },
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

.summary > .email {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color:#ECEEF0;
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