<template>
  <div class="home">
    <div class="badge">모두의 희망</div>
    <div class="title">일주일의<br/>행복한 기다림</div>
    <div class="desc">행운의 숫자로 꿈꾸는 로또 당첨!</div>

    <div class="boxes">
      <div class="box">
        <img src="https://img.icons8.com/?size=100&id=mhjz7OcdWFZz&format=png&color=000000" />
        <div class="text">GTP가 분석해주는<br/><span>AI 번호 생성</span></div>
      </div>
      <div class="box">
        <img src="https://img.icons8.com/?size=100&id=16079&format=png&color=000000" />
        <div class="text">조상신이 점지해주는<br/><span>꿈해몽 생성</span></div>
      </div>
      <div class="box">
        <img src="https://img.icons8.com/?size=100&id=HshIQgiZ35nI&format=png&color=000000" />
        <div class="text">통계는 거짓말 안해<br/><span>통계 생성</span></div>
      </div>
      <div class="box">
        <img src="https://img.icons8.com/?size=100&id=1S1netqOMZ4h&format=png&color=000000" />
        <div class="text">매일 매일 우주의 기운<br/><span>복권 긁기</span></div>
      </div>
    </div>

    <div class="floating">
      <div class="participation">5,230명이 당첨 소망에 참여했어요</div>
      <button class="primary">AI 로또 번호 뽑기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
}
</script>

<style scoped>
.home {
  background-color: #000;
  height: calc(100vh - 60px);
  text-align: center;
}
.badge {
  margin: 40px auto 20px;
  display: inline-block;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid green;
  color: green;
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  line-height: 50px;
}

.desc {
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 20px;
}

.boxes {
  width: 100%;
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  gap: 8px;
}

.box {
  padding: 20px;
  background-color: #393838;
  border-radius: 10px;
}

.box  > img {
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
}

.text {
  color: grey;
  font-size: 12px;
}
.text > span {
  color: #fff;
  font-size: 16px;
  display: inline-block;
  margin-top: 6px;
}

.floating {
  position:fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}

.floating > .participation {
  margin-bottom: 10px;
  color: #fff;
  font-weight: 300;
}

.floating > button {
  width: 100%;
  min-height: 56px;
  background-color: green;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: black;
  font-size: 20px;
  font-weight: 600;
}
</style>