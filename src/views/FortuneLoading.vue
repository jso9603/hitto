<template>
  <div class="loading">
    <transition name="fade" mode="out-in">
      <div class="title">AI 통계기반<br/>로또 번호를 생성하고 있어요</div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class FortuneLoading extends Vue {
  loading = false

  async getFortune() {
    console.log(process.env.VUE_APP_GPT_API_KEY)
    this.loading = true
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `
                당신은 운세 전문가입니다. 사용자에게 오늘의 재물운, 연애운, 사업운, 건강운, 시험운을 각각 한국어로 1줄 요약과 5줄 이상의 상세 설명으로 알려주세요.
              응답은 반드시 JSON 형식으로 주세요. 형식은 아래와 같이 해주세요:
              {
                "fortunes": [
                  { "category": "재물운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "연애운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "사업운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "건강운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "시험운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" }
                ]
              }
              `
            }
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_GPT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 운세 데이터를 파싱하여 각 항목에 저장
      const result = JSON.parse(response.data.choices[0].message.content)

    if (result.fortunes && Array.isArray(result.fortunes)) {
      this.$router.push({ 
        name: '/chatGPT', // 이동할 라우트 이름
        params: { fortunes: JSON.stringify(result.fortunes) }
      })
    } else {
      console.error('운세 데이터가 올바르지 않습니다.')
    }
    } catch (error) {
      console.error('운세 데이터를 불러오는 중 오류가 발생했습니다:', error)
    } finally {
      this.loading = false
    }
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  async mounted() {
    window.addEventListener('resize', this.setViewportHeight)
    window.addEventListener('orientationchange', this.setViewportHeight)

    this.setViewportHeight()

    this.getFortune()
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.loading {
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 54px);
  position: relative;
  color: #fff;
  text-align: center;
}
</style>