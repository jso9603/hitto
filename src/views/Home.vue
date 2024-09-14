<template>
  <div class="home">
    <img class="main" src="@/assets/img-mohito.png" />
    <div class="desc">ai 통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>

    <div class="boxes">
      <div class="box" @click="onClick('ai', 'AI 번호 생성')">
        <img src="@/assets/ic-ai.svg" alt="ai" />
        <div class="text">GTP가 분석해주는<br/><span>AI 번호 생성</span></div>
      </div>
      <div class="box" @click="onClick('dream', '꿈해몽 생성')">
        <img src="@/assets/img-stella-2d.png" alt="dream" />
        <div class="text">조상신이 점지해주는<br/><span>꿈해몽 생성</span></div>
      </div>
    </div>

    <div class="algorithm">
      <div class="light">
        <img src="@/assets/ic-system-star.png" />
      </div>
      <div class="title">스테판이 생성해주는<br/>정교한 알고리즘</div>
      <div class="desc">ai 통계기반 알고리즘을 통해<br/>더 높은 로또 당첨 확률을 만나보세요!</div>
      <img src="@/assets/ic-system-intro-aicard.png" />
    </div>

    <div class="dream">
      <img class="cloud" src="@/assets/ic-system-cloud.png" />
      <div class="title">꿈자리를 통한<br/>이상적인 번호 조합</div>
      <div class="desc">로또 1등 당첨자들이 가장 많이 꾼꿈을<br/>조합하여 이상적인 번호 생성을 도와드려요.</div>
      <img class="list" src="@/assets/ic-system-list.png" />
    </div>

    <div class="share">
      <div class="title">친구, 지인과 함께<br/>로또 1등에 도전해보세요</div>
      <div class="share-channel">
        <div class="round kakao">
          <img src="@/assets/ic-system-kakao.svg" alt="kakao" />
        </div>
        <div class="round sms">
          <img src="@/assets/ic-system-sms.svg" alt="sms" />
        </div>
        <div class="round url">
          URL
        </div>
        <div class="round more">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

    <div class="floating">
      <div class="count__down">
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

    if (days === 0) {
      this.countdown = `${hours}시 ${minutes}분 ${seconds}초 남음`;
    } else {
      this.countdown = `${days}일 ${hours}시 ${minutes}분 ${seconds}초 남음`;
    }
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
  width: 260px;
  height: auto;
}

.count__down {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #222222E5;
  border-radius: 16px;
  padding: 15px 20px;
  color: #ECEEF0;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  font-variant: common-ligatures tabular-nums;
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

.algorithm > .light > img {
  width: 32px;
  height: auto;
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
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  color: #BABCBE;
}

.dream > .list {
  margin-top: 40px;
  width: auto;
  height: 280px;
}

.share {
  margin-top: 70px;
  margin-bottom: 166px;
}

.title {
  margin-bottom: 20px;
  color: #ECEEF0;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.share-channel {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 20px;
}

.round {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

.kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFE600;
}

.kakao > img,
.sms > img {
  width: 24px;
  height: 24px;
}

.sms {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4AFF81;
}

.url {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2E80FA;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.more {
  background-color: #737577;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.more > div {
  width: 5px;
  height: 5px;
  background-color: #D9D9D9;
  border-radius: 50%;
}

.floating {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 40px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding: 20px;
  background: linear-gradient(360deg, #171717 50%, rgba(23, 23, 23, 0) 100%);
}

.floating > .participation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #ECEEF0;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
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