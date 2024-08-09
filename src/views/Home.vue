<template>
  <div class="home">
    <img class="main" src="@/assets/ic-system-main.svg" />
    <div class="desc">ai 통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>

    <div class="boxes">
      <div class="box" @click="onClick('ai', 'AI 번호 생성')">
        <img src="@/assets/ic-ai.svg" alt="ai" />
        <div class="text">GTP가 분석해주는<br/><span>AI 번호 생성</span></div>
      </div>
      <div class="box" @click="onClick('dream', '꿈해몽 생성')">
        <img src="@/assets/ic-dreams.svg" alt="dream" />
        <div class="text">조상신이 점지해주는<br/><span>꿈해몽 생성</span></div>
      </div>
    </div>

    <div class="algorithm">
      <div class="light">
        <img src="@/assets/ic-system-star.svg" />
      </div>
      <div class="title">스테판이 생성해주는<br/>정교한 알고리즘</div>
      <div class="desc">ai 통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>
      <img src="@/assets/ic-system-intro-aicard.svg" />
    </div>

    <div class="dream">
      <img class="cloud" src="@/assets/ic-system-cloud.svg" />
      <div class="title">꿈자리를 통한<br/>이상적인 번호 조합</div>
      <div class="desc">로또 1등 당첨자들이 가장 많이 꾼꿈을<br/>조합하여 이상적인 번호 생성을 도와드려요.</div>
      <img class="list" src="@/assets/ic-system-list.svg" />
    </div>

    <!-- <div class="floating">
      <div class="participation">
        <div class="people">
          <div class="person" />
          <div class="person" />
          <div class="person" />
        </div>
        5,230명이 당첨 소감에 참여했어요
      </div>
      <button class="primary" @click="$router.push('/ai')">AI 로또 번호 뽑기</button>
    </div> -->

    <div class="floating">
      <div class="count__down">
        <img src="@/assets/ic-system-timer.svg" />
        {{ countdown }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import Cookies from 'js-cookie'

dayjs.extend(duration)
dayjs.extend(weekday)

@Component
export default class Home extends Vue {
  countdown: string = '';

  onClick(type: string, menu: string) {
    Cookies.set('menu', menu)

    this.$router.push(`/${type}`)
  }

  mounted() {
    this.updateCountdown();
    setInterval(this.updateCountdown, 1000);
  }

  getNextSaturday(): dayjs.Dayjs {
    const now = dayjs();
    let nextSaturday = now.weekday(6).hour(20).minute(30).second(0);

    if (now.isAfter(nextSaturday)) {
      nextSaturday = nextSaturday.add(1, 'week');
    }

    return nextSaturday;
  }

  updateCountdown() {
    const now = dayjs();
    const nextSaturday = this.getNextSaturday();
    const diff = nextSaturday.diff(now);
    const durationObj = dayjs.duration(diff);

    const days = Math.floor(durationObj.asDays());
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();
    const seconds = durationObj.seconds();

    this.countdown = `${days}일 ${hours}시 ${minutes}분 ${seconds}초 남음`;
  }
}
</script>

<style scoped>
.home {
  padding: 32px 20px;
  background-color: #171717;
  text-align: center;
}

.main {
  width: 240px;
  height: 220px;
}

.count__down {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #4AFF81;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  font-variant: common-ligatures tabular-nums;
}

.home > .desc {
  margin-bottom: 40px;
  color: #BABCBE;
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;
}

.boxes {
  width: 100%;
  display: grid;
  grid-template: repeat(1, 1fr) / repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 40px;
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

.algorithm {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.algorithm > .light {
  margin-bottom: 12px;
  width: 32px;
}

.algorithm > .title {
  margin-bottom: 12px;
  font-size: 26px;
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

.algorithm > img {
  width: auto;
  height: 82px;
}

.dream {
  margin-top: 40px;
  margin-bottom: 50px;
}

.dream > .cloud {
  width: 32px;
  height: auto;
}

.dream > .title {
  margin-top: 12px;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  line-height: 36px;
}

.dream > .desc {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;
  color: #BABCBE;
}

.dream > .list {
  margin-top: 40px;
  width: auto;
  height: 280px;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: calc(100% - 40px);
  padding: 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 64.38%);
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #ECEEF0;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
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