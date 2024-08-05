<template>
  <div class="container">
    <div class="get__started">
      <img src="@/assets/ic-system-logo.svg" />
      <div class="text">행운의 숫자로 꿈꾸는 경제적 자유</div>
      <button @click="onKakao" class="kakao">
        <img src="@/assets/ic-system-kakao.svg" />
        카카오로 시작하기
      </button>
    </div>

    <div class="floating">
      <div class="participation">
        <div class="people">
          <div class="person" />
          <div class="person" />
          <div class="person" />
        </div>
        5,230명이 당첨 소감에 참여했어요
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  onKakao() {
    console.log('kakao!!')
  }
}
</script>

<style scoped>
.container {
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  height: 100vh;
  background-color: #171717;
}

.get__started {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - 122px);
}

.get__started > img {
  margin-bottom: 16px;
  height: 24px;
  width: auto;
}

.get__started > .text {
  margin-bottom: 36px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
}

.get__started > button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #FFE812;
  border-radius: 40px;
  padding: 14px 29.5px;
  color: #181D23;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  border: none;
}


.floating {
  position: fixed;
  margin-top: 32px;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-weight: 300;
}

.floating > .participation > .people {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
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
</style>
