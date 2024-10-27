<template>
  <div class="bridge">
    <transition name="fade" mode="out-in">
      <div ref="kakaoAddElement">
        <ins
          class="kakao_ad_area"
          :style="{ display: 'none' }"
          data-ad-unit="DAN-B96ItoJ9qcght7ba"
          data-ad-width="300"
          data-ad-height="250"
        >
        </ins>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Bridge extends Vue {
  kakaoAddElement: HTMLElement | null = null

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  mounted() {
    this.$nextTick(() => {
      this.kakaoAddElement = this.$refs.kakaoAddElement as HTMLElement

      if (this.kakaoAddElement) {
        const script = document.createElement('script')
        script.setAttribute(
          'src',
          'https://t1.daumcdn.net/kas/static/ba.min.js',
        )
        script.setAttribute('charset', 'utf-8')
        script.setAttribute('async', 'true')
        this.kakaoAddElement.appendChild(script)
      } else {
        console.error('kakaoAddElement is not defined')
      }
    })

    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.bridge {
  opacity: 1;
  margin: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 54px);
}
</style>
