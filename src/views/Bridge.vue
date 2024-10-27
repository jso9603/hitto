<template>
  <div class="bridge">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Bridge extends Vue {
  kakaoAddElement: HTMLElement | null = null

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
  }
}
</script>

<style scoped>
.bridge {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
