<template>
  <div class="ai">
    <img src='@/assets/ic-stefan.svg' at="character 이미지" />
    <div class='typing1' v-html="typedText"></div>

    <div class="floating">
      <div class="participation">
        <div class="people">
          <img src="@/assets/ic-system-user1.svg" class="person" />
          <img src="@/assets/ic-system-user2.svg" class="person" />
          <img src="@/assets/ic-system-user3.svg" class="person" />
        </div>
        5,230명이 추천 번호를 받았어요.
      </div>
      <button class="primary" @click="$router.push('/random')">시작하기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// TODO
// 1. 개행 (\n\n)이 너무 넓음
// 2. 너비 맞췄으면..

@Component
export default class Ai extends Vue {
  typedText = ''

  mounted() {
    const contents = '저는 스테판입니다.\n\n단순한 행운이 아닌 체계적인\n전략으로 14번이나\n당첨된 전설적인 인물입니다.\n\n자~ 이제 시작해볼까요?'
    let saveInterval: any

    let index = 0
    this.typedText = ''
    clearInterval(saveInterval) // 기존 interval 종료

    saveInterval = setInterval(() => {
      if(index >= contents.length - 1) { // index가 범위에 도달될 경우 interval 종료
        clearInterval(saveInterval)
      }

      if(contents[index] === '\n') { // 개행문자 일 경우 <br /> 삽입
        this.typedText += '<br />'
        index++
      } else {
        this.typedText += contents[index++]
      }
    }, 50)
  }
}
</script>

<style scoped>
.ai {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* 전체 height에서 header값 제거 */
  height: calc(100vh - 54px);
}

.ai > img {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 12px;
}

.typing1 {
  width: 100%;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
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
  max-width: 576px; /* 중앙 정렬을 보장하기 위해 최대 너비 설정 */
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