<template>
  <div class="container">
    <transition name="fade" mode="out-in">
      <div class="page1" v-if="showPage1" key="page1">
        <div class='typing1' v-html="typedText"></div>
        <div class="random-animation">
          <canvas ref="animationCanvas" width="260" height="260"></canvas>
        </div>

        <div v-if="showMessage">
          <div v-for="(message, index) in messages" :key="index" class="message" :style="{ animationDelay: `${index * 0.5}s` }">
            <img :src="message.icon" class="icon" />
            <span class="text">{{ message.text }}</span>
          </div>
        </div>
      </div>

      <div class="page2" v-else key="page2">
        <div class='typing2'>"기운이 느껴져?<br/>한 주 동안 즐겁게 기다려보자구~"</div>
        <div class="sub">마음에 들지 않으면 다시 생성할 수 있어요!</div>

        <div class="result__box">
          <div v-for="(round, index) in lottoNumbers" :key="index" class="round">
            <div class="row">
              <div v-for="number in round.slice(0, 4)" :key="number" :class="getNumberClass(number)">
                {{ number }}
              </div>
            </div>
            <div class="row">
              <div v-for="number in round.slice(4, 6)" :key="number" :class="getNumberClass(number)">
                {{ number }}
              </div>
              <div class="plus">+</div>
              <div :class="[getNumberClass(round[6]), 'last']">
                {{ round[6] }}
              </div>
            </div>
          </div>
        </div>

        <div class="floating">
          <div class="participation">
            <div class="people">
              <div class="person" />
              <div class="person" />
              <div class="person" />
            </div>
            지난 주 5,230명이 당첨됐어요
          </div>
          <button class="primary" @click="$router.push('/select-hope')">선택 완료</button>
          <button class="none" @click="oneMore">다시 생성</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface Ball {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  color: string // 색깔 속성 추가
}

interface Message {
  text: string;
  icon: string;
}

@Component
export default class Random extends Vue {
  typedText = ''
  private animationCanvas: HTMLCanvasElement | null = null;
  private ballCount: number = 7;
  private balls: Ball[] = [];
  private circleCenter = { x: 130, y: 130 }; // 중심점 (캔버스의 중간 지점)
  private circleRadius: number = 125; // 원의 반지름 (큰 원의 상하좌우가 잘려보임)
  private animationId: number = 0;
  private colors: string[] = ['#0070FF', '#FFC83D', '#ECEEF0', '#FE4000', '#97999B', '#4EFF92'];
  private image: HTMLImageElement | null = null;

  private messages: Message[] = [
    { text: '최근 3개월 통계를 찾아보고 있어요', icon: require('@/assets/ic-system-random-message1.svg') },
    { text: 'AI가 선별하는 번호를 찾아보고 있어요', icon: require('@/assets/ic-system-random-message2.svg') },
    { text: '더 좋은 번호가 있는지 찾아보고 있어요', icon: require('@/assets/ic-system-random-message3.svg') }
  ];
  private selectedMessage: Message | null = null;
  private showMessage: boolean = false;

  private showPage1: boolean = true;

  typingText() {
    const contents = `“스테판이 ai 통계기반\n로또 번호를 생성하고 있어요"`
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

  oneMore() {
    location.reload(); // 페이지 새로고침
  }

  initCanvas() {
    this.animationCanvas = this.$refs.animationCanvas as HTMLCanvasElement;
    if (this.animationCanvas) {
      this.image = new Image();
      this.image.src = require('@/assets/union.png'); // 사용할 이미지 경로

       this.image.onload = () => {
        this.balls = []; // 이전 상태 초기화
        for (let i = 0; i < this.ballCount; i++) {
          const color = this.colors[i % this.colors.length]; // 색깔을 순환하여 할당
          this.balls.push({
            x: this.circleCenter.x,
            y: this.circleCenter.y,
            radius: 15,
            dx: (Math.random() - 0.5) * 9.2, // 속도를 3배로 증가
            dy: (Math.random() - 0.5) * 9.2, // 속도를 3배로 증가
            color: color,
          });
        }
        const ctx = this.animationCanvas?.getContext('2d');
        if (ctx) {
          this.animate(ctx);
        }
      };
    }
  }

  private animate(ctx: CanvasRenderingContext2D) {
    if (this.animationCanvas) {
      ctx.clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);
      this.drawCircle(ctx);
      this.balls.forEach(ball => {
        this.drawBall(ctx, ball);
        this.updateBallPosition(ball);
      });
      this.handleBallCollisions();
      this.animationId = requestAnimationFrame(() => this.animate(ctx));
    }
  }

  private restartAnimation() {
    if (this.animationCanvas) {
      const ctx = this.animationCanvas.getContext('2d');
      if (ctx) {
        cancelAnimationFrame(this.animationId);
        ctx.clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);
      }
      this.initCanvas();
    }
  }

  mounted() {
    this.typingText();
    this.initCanvas();
    this.selectRandomMessageWithDelay();
  }

  // 처음 공
  // private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  //   ctx.beginPath();
  //   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = ball.color; // 볼의 색깔을 지정
  //   ctx.fill();
  //   ctx.closePath();
  // }

  // 그라데이션
  // private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  //   const gradient = ctx.createRadialGradient(ball.x - ball.radius / 2, ball.y - ball.radius / 2, ball.radius / 4, ball.x, ball.y, ball.radius);
  //   gradient.addColorStop(0, 'white');
  //   gradient.addColorStop(1, ball.color);

  //   ctx.beginPath();
  //   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = gradient; // 볼의 색깔을 그라데이션으로 지정
  //   ctx.fill();
  //   ctx.closePath();
  // }
  private drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    const gradient = ctx.createRadialGradient(ball.x - ball.radius / 2, ball.y - ball.radius / 2, ball.radius / 4, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, ball.color);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color; // 볼의 색깔을 그라데이션으로 지정
    ctx.fill();
    ctx.closePath();

    if (this.image) {
      ctx.save();
      ctx.globalAlpha = 0.5; // 이미지의 투명도를 설정
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.clip();

      const imageSize = ball.radius * 2 * 0.5; // 이미지 크기를 줄임
      ctx.drawImage(this.image, ball.x - imageSize / 2, ball.y - imageSize / 2, imageSize, imageSize);
      ctx.closePath();
      ctx.restore();
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.circleCenter.x, this.circleCenter.y, this.circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#BABCBE';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.closePath();
  }

  private updateBallPosition(ball: Ball) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    const distX = ball.x - this.circleCenter.x;
    const distY = ball.y - this.circleCenter.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Check for collisions with the circle boundary
    if (distance + ball.radius > this.circleRadius) {
      const angle = Math.atan2(distY, distX);
      ball.dx = -ball.dx;
      ball.dy = -ball.dy;

      ball.x = this.circleCenter.x + (this.circleRadius - ball.radius) * Math.cos(angle);
      ball.y = this.circleCenter.y + (this.circleRadius - ball.radius) * Math.sin(angle);
    }
  }

  private handleBallCollisions() {
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const dx = this.balls[j].x - this.balls[i].x;
        const dy = this.balls[j].y - this.balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.balls[i].radius + this.balls[j].radius) {
          // Handle collision
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Rotate ball positions
          const pos0 = { x: 0, y: 0 };
          const pos1 = { x: dx * cos + dy * sin, y: dy * cos - dx * sin };

          // Rotate ball velocities
          const vel0 = { x: this.balls[i].dx * cos + this.balls[i].dy * sin, y: this.balls[i].dy * cos - this.balls[i].dx * sin };
          const vel1 = { x: this.balls[j].dx * cos + this.balls[j].dy * sin, y: this.balls[j].dy * cos - this.balls[j].dx * sin };

          // Collision reaction
          const vxTotal = vel0.x - vel1.x;
          vel0.x = ((this.balls[i].radius - this.balls[j].radius) * vel0.x + 2 * this.balls[j].radius * vel1.x) / (this.balls[i].radius + this.balls[j].radius);
          vel1.x = vxTotal + vel0.x;

          // Update ball positions to avoid overlap
          const absV = Math.abs(vel0.x) + Math.abs(vel1.x);
          const overlap = (this.balls[i].radius + this.balls[j].radius) - Math.abs(pos0.x - pos1.x);
          pos0.x += vel0.x / absV * overlap;
          pos1.x += vel1.x / absV * overlap;

          // Rotate positions back
          const pos0F = { x: pos0.x * cos - pos0.y * sin, y: pos0.y * cos + pos0.x * sin };
          const pos1F = { x: pos1.x * cos - pos1.y * sin, y: pos1.y * cos + pos1.x * sin };

          // Adjust ball positions
          this.balls[j].x = this.balls[i].x + pos1F.x;
          this.balls[j].y = this.balls[i].y + pos1F.y;
          this.balls[i].x += pos0F.x;
          this.balls[i].y += pos0F.y;

          // Rotate velocities back
          const vel0F = { x: vel0.x * cos - vel0.y * sin, y: vel0.y * cos + vel0.x * sin };
          const vel1F = { x: vel1.x * cos - vel1.y * sin, y: vel1.y * cos + vel1.x * sin };

          this.balls[i].dx = vel0F.x;
          this.balls[i].dy = vel0F.y;
          this.balls[j].dx = vel1F.x;
          this.balls[j].dy = vel1F.y;
        }
      }
    }
  }

  private selectRandomMessageWithDelay() {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * this.messages.length);
      this.selectedMessage = this.messages[randomIndex];
      this.showMessage = true;

      setTimeout(() => {
        // this.$router.push('/result');
        this.showPage1 = false;
        this.generateLottoNumbers(1);
      }, 3000);

    }, 2000); // 2초 지연
  }

  private lottoNumbers: number[][] = [];

  private generateLottoNumbers(rounds: number) {
    for (let i = 0; i < rounds; i++) {
      const numbers = new Set<number>();
      while (numbers.size < 7) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNum);
      }
      this.lottoNumbers.push(Array.from(numbers).sort((a, b) => a - b));
    }
  }

  private getNumberClass(number: number) {
    if (number <= 10) return 'yellow';
    else if (number <= 20) return 'blue';
    else if (number <= 30) return 'red';
    else if (number <= 40) return 'grey';
    else return 'green';
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

.container {
 padding: 0 20px;
}

/* .container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  background-color: #171717;
} */

.page1 {
  margin-top: 30px;
  background-color: #171717;
  text-align: center;
}

.typing1 {
  margin-bottom: 24px;
  width: 100%;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  min-height: 66px;
}

.typing2 {
  margin-bottom: 24px;
  width: 100%;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
}

.random-animation {
  /* display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; */
  margin: 0;
  background-color: #171717;
  border-radius: 50%;
}

canvas {
  margin-bottom: 25px;
  /* width: 260px;
  height: 260px; */
  /* border: 4px solid; */
}

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  /* animation: slideUp 2s ease-in-out forwards; */
  opacity: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  transform: translateY(100%);
  animation: slideUp 2s forwards;
  margin-bottom: 8px;
}

.message img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.message > span {
  margin-top: 4px;
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}



.typing1 {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.sub {
  margin-bottom: 32px;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
  text-align: center;
  color: #9C9EA0;
}

.result__box {
  padding: 32px 20px;
  background-color: #222222;
  border-radius: 16px;
}
.round {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.row > div {
  width: 50px;
  height: 50px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: bold;
}

.plus {
  font-size: 48px;
  color: #fff;
}

.yellow {
  border: 2px solid #FEC03E !important;
  color: #FEC03E !important;
}

.blue {
  border: 2px solid #4790FF !important;
  color: #4790FF !important;
}

.red {
  border: 2px solid #E64D3D !important;
  color: #E64D3D !important;
}

.grey {
  border: 2px solid #BEC3C7 !important;
  color: #BEC3C7 !important;
}

.green {
  border: 2px solid #2ECD70 !important;
  color: #2ECD70 !important;
}

.last {
  background-color: transparent !important;
  border-width: 2px;
  border-style: solid;
  border: none;
  color: #171717 !important;
}

.yellow.last {
  background-color: #FEC03E !important;
}

.blue.last {
  background-color: #4790FF !important;
}

.red.last {
  background-color: #E64D3D !important;
}

.grey.last {
  background-color: #BEC3C7 !important;
}

.green.last {
  background-color: #2ECD70 !important;
}

.floating {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: calc(100% - 40px);
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

.floating > button.none {
  margin-top: 8px;
  background-color: #171717;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
}
</style>
