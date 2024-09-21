<template>
  <div class="not-found">
    <img src="@/assets/img-stefan-404.png" alt="not-found" />
    <div class="title">Opps!</div>
    <div class="text">
      페이지가 길을 잃었네요<br/>
      아마도 몰디브에서 모히또 한 잔 마시는 중일지도!
    </div>
    <button @click="onHome">홈으로</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {
  private onHome() {
    this.$router.replace('/')
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  height: calc(var(--vh, 1vh) * 100 - 54px);
  position: relative;
}

img {
  margin-bottom: 16px;
  width: 64px;
  height: 64px;
}

.title {
  margin-top: 16px;
  font-size: 22px;
  font-weight: 700;
  line-height: 26px;
  color: #FFF;
}

.text {
  margin-top: 16px;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  color: #ECEEF0;
}

button {
  margin-top: 16px;
  padding: 12px 20px;
  background-color: #ECEEF0;
  border-radius: 44px;
  border-style: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: #181D23;
}
</style>