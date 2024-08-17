<template>
  <div class="participants">
    <div
      v-if="myData"
      class="participant"
    >
      <img :src="userImage" />
      <div class="info">
        <div class="id">{{nickname}}</div>
        <div class="text">{{myData.winningText}}</div>
      </div>
    </div>

    <div
      v-for="(participant, index) in participants"
      :key="index"
      class="participant"
      :style="{ animationDelay: `${index * 0.4}s` }"
    >
      <img :src="require(`@/assets/ic-system-user${participant.img}.svg`)" />
      <div class="info">
        <div class="id">{{participant.id}}</div>
        <div class="text">{{participant.winningText}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Cookies from 'js-cookie'

@Component
export default class GuessParticipants extends Vue {
  @Prop(String) week!: string;

  participants = []
  myData = {}

  nickname = ''
  user: any = {}

  private adjectives: string[] = [
    '희망찬', '용감한', '즐거운', '활기찬', '씩씩한', '지혜로운', '사랑스러운', '기쁜', '자유로운'
  ];

  private animals: string[] = [
    '돼지', '호랑이', '사자', '고양이', '강아지', '곰', '여우', '토끼', '독수리'
  ];

  get userImage(): string {
    if (this.user !== null) {
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
    } else {
      return require(`@/assets/ic-system-user3.svg`);
    }
  }

  generateNickname(uid: string): string {
    const firstDigit = parseInt(uid.split('_')[1].charAt(0));
    const lastDigit = parseInt(uid.slice(-1), 10);
    const number = parseInt(uid.split('_')[1].substring(0, 4));

    const adjective = this.adjectives[firstDigit % this.adjectives.length - 1];
    const animal = this.animals[lastDigit % this.animals.length - 1];

    return `${adjective}${animal}${number}`;
  }

  created() {
    this.participants = require('@/datas/guess/data.json');

    const userData = Cookies.get('user');

    if (userData) {
      try {
        this.user = JSON.parse(userData);
        this.nickname = this.generateNickname(this.user.uid);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.user = null;
      }
    } else {
      this.user = null;
      this.nickname = 'Guest';
    }

    const challengeData = JSON.parse(Cookies.get('challenge') || '{}');
    if (challengeData && this.week === challengeData.round) {
      this.myData = challengeData;
    }
  }
}
</script>

<style scoped>
@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.participant {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}

.participant > img {
  width: 32px;
  height: 32px;
}

.participant > .info > .id {
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
  color: #ECEEF0;
}

.participant > .info > .text {
  font-family: Pretendard;
font-size: 14px;
font-weight: 400;
line-height: 21px;
text-align: left;
color: #9C9EA0;

}
</style>