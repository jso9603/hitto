<template>
  <div class="ai">
    <div class="img-bg">
      <img src='@/assets/img-stefan-3d.png' at="character 이미지" />
    </div>
    
    <div class='typing1' v-html="typedText"></div>

    <div class="floating">
      <div class="participation">        
        5,230명이 추천 번호를 받았어요.
      </div>
      <button class="primary" @click="$router.push('/random')">시작하기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Ai extends Vue {
  typedText = ''

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight);
    window.addEventListener('orientationchange', this.setViewportHeight);

    this.setViewportHeight();

    const contents: string =
      '"저는 스테판입니다.\n단순한 행운이 아닌 체계적인\n전략으로 14번이나\n당첨된 전설적인 인물이죠.\n제 소개는 그만 각설하고..."\n\n"자~ 이제 시작해볼까요?"';
    let saveInterval: number | undefined;

    let index = 0;
    this.typedText = '';
    clearInterval(saveInterval); // 기존 interval 종료

    saveInterval = window.setInterval(() => {
      if (index >= contents.length - 1) {
        clearInterval(saveInterval); // 인덱스가 범위에 도달하면 interval 종료
      }

      if (contents[index] === '\n') {
        // 두 줄바꿈(\n\n)을 확인하여 두 번째 줄바꿈에만 스타일 적용
        if (contents[index + 1] === '\n') {
          this.typedText += '<div class="spacer"></div>'; // 두 번째 줄바꿈에 여백을 추가
          index += 2; // 두 개의 줄바꿈을 건너뜀
        } else {
          this.typedText += '<br />';
          index++;
        }
      } else {
        if (index >= contents.lastIndexOf('"자~ 이제 시작해볼까요?"')) {
          // 마지막 문장에 녹색 색상을 적용
          this.typedText += `<span style="color: #4AFF81;">${contents[index++]}</span>`;
        } else {
          this.typedText += contents[index++];
        }
      }
    }, 50);
  }
}
</script>

<style scoped>
.ai {
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 78px);
  position: relative;
}

.ai > .img-bg {
  position: absolute;
  top: calc(50% - 178px);
  
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4262FF;
  border-radius: 50%;
  margin-bottom: 20px;
}

.ai > .img-bg > img {
  width: 44px;
  height: 44px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.typing1 {
  width: 100%;
  color: #ECEEF0;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.5px;
  text-align: center;

  position: absolute;
  top: calc(50% - 100px); /* 텍스트의 높이 294px의 절반인 147px을 보정 */
  white-space: pre-wrap;
}

::v-deep .spacer {
  display: block;
  margin-top: 20px; /* 줄바꿈 사이 여백 */
}

.startBtn {
  margin-top: 20px;
  background-color: #4AFF81;
  padding: 16.5px 20px;
  border-radius: 40px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;

  opacity: 0;
  /* animation: fadeIn 2s forwards;  */
  animation: slideUp 1s ease-in-out forwards;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(576px - 40px); /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
  padding: 20px;
  background: linear-gradient(180deg, #171717 0%, #171717 64.38%);
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
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
  /* background-color: #414244; */
  border-radius: 50%;
  /* border: 1px solid #181D23; */
}

.floating > .participation > .people > img {
  width: 32px;
  height: 32px;
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

@keyframes slideUp {
  0% {
    transform: translateY(30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>