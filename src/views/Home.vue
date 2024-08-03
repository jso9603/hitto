<template>
  <div class="home">
    <div class="badge">동행복권</div>
    <div class="title">모두의 희망로또</div>
    <div class="desc">통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>

    <div class="boxes">
      <div class="box" @click="onClick('ai')">
        <img src="@/assets/ic-ai.svg" alt="ai" />
        <div class="text">GTP가 분석해주는<br/><span>AI 번호 생성</span></div>
      </div>
      <div class="box" @click="onClick('dreams')">
        <img src="@/assets/ic-dreams.svg" alt="dreams" />
        <div class="text">조상신이 점지해주는<br/><span>꿈해몽 생성</span></div>
      </div>
      <div class="box" @click="onClick('statistics')">
        <img src="@/assets/ic-statistics.svg" alt="statistics" />
        <div class="text">통계는 거짓말 안해<br/><span>통계 생성</span></div>
      </div>
      <div class="box" @click="onClick('lottery')">
        <img src="@/assets/ic-Scratchticket.svg" alt="lottery" />
        <div class="text">매일 매일 우주의 기운<br/><span>복권 긁기</span></div>
      </div>
    </div>

    <div class="algorithm">
      <div class="light">✨</div>
      <div class="title">스테판이 생성해주는 정교한 알고리즘</div>
      <div class="desc">ai 통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>
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
      <button class="primary" @click="$router.push('/ai')">AI 로또 번호 뽑기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {

  onClick(type: string) {
    this.$router.push(`/${type}`)
  }
}
</script>

<style scoped>
.home {
  padding: 24px 20px;
  background-color: #171717;
  height: calc(100vh - 54px);
  text-align: center;
}
.badge {
  margin: 0 auto 18px;
  display: inline-block;
  padding: 6px 12px 5px;
  border-radius: 100px;
  border: 1px solid #31E663;
  color: #31E663;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
}

.home > .title {
  margin-bottom: 12px;
  font-size: 36px;
  font-weight: 900;
  line-height: 44px;
  color: #fff;
}

.home > .desc {
  margin-bottom: 40px;
  color: #BABCBE;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
}

.boxes {
  width: 100%;
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 60px;
}

.box {
  padding: 30px 20px;
  background-color: #222222;
  border-radius: 16px;
  cursor: pointer;
}

.box  > img {
  width: 38px;
  height: 38px;
  margin-bottom: 12px;
}

.text {
  color: #9C9EA0;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.text > span {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  display: inline-block;
}

.algorithm > .light {
  width: 32px;
  height: 36px;
}
.algorithm > .title {
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 900;
  line-height: 36px;
  color: #fff;
}

.algorithm > .desc {
  margin-bottom: 40px;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  color: #BABCBE;
}

.floating {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
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
</style>