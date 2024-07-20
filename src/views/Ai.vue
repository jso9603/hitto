<template>
  <div class="ai">
    <img src='@/assets/ic-stefan.svg' at="character 이미지" />
    <div class='typing1' v-html="typedText"></div>
    <button class="startBtn" v-if="showStartBtn">시작하기</button>
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
  showStartBtn = false

  mounted() {
    const contents = '안녕? 난 스테판이야.\n\n1960년대부터 1990년대까지\n단순한 행운이 아닌 체계적인\n수학적접근 방식과 전략에 기초하여\n14번이나 당첨되었던 전설적인 인물이야.\n\n자~ 이제 시작해볼까?'
    let saveInterval: any

    let index = 0
    this.typedText = ''
    clearInterval(saveInterval) // 기존 interval 종료

    saveInterval = setInterval(() => {
      if(index >= contents.length - 1) { // index가 범위에 도달될 경우 interval 종료
        clearInterval(saveInterval)
        this.showStartBtn = true
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
}
</style>