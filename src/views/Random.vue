<template>
  <div>
    <img src="@/assets/content.png" />
    <!-- <div class="random-animation"> -->
    <canvas ref="animationCanvas" width="260" height="260"></canvas>
    <!-- </div> -->
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

@Component
export default class Random extends Vue {
  private animationCanvas: HTMLCanvasElement | null = null;
  private ballCount: number = 7;
  private balls: Ball[] = [];
  private circleCenter = { x: 130, y: 130 }; // 중심점 (캔버스의 중간 지점)
  private circleRadius: number = 130; // 원의 반지름
  private colors: string[] = ['#0070FF', '#FFC83D', '#ECEEF0', '#FE4000', '#97999B', '#4EFF92'];
  private image: HTMLImageElement | null = null;

  mounted() {
    this.animationCanvas = this.$refs.animationCanvas as HTMLCanvasElement;

    if (this.animationCanvas) {
      this.image = new Image();
      this.image.src = require('@/assets/union.png'); // 사용할 이미지 경로
      // for (let i = 0; i < this.ballCount; i++) {
      //   const color = this.colors[i % this.colors.length]; // 색깔을 순환하여 할당
      //   this.balls.push({
      //     x: this.circleCenter.x,
      //     y: this.circleCenter.y,
      //     radius: 15,
      //     // dx: (Math.random() - 0.5) * 12,
      //     // dy: (Math.random() - 0.5) * 12,
      //     // 일단 테스트를 위해 속도 줄임
      //     dx: (Math.random() - 0.5) * 4,
      //     dy: (Math.random() - 0.5) * 4,
      //     color: color,
      //   });
      // }
      // const ctx = this.animationCanvas.getContext('2d');
      // if (ctx) {
      //   this.animate(ctx);
      // }
      
      this.image.onload = () => {
        for (let i = 0; i < this.ballCount; i++) {
          const color = this.colors[i % this.colors.length]; // 색깔을 순환하여 할당
          this.balls.push({
            x: this.circleCenter.x,
            y: this.circleCenter.y,
            radius: 20,
            dx: (Math.random() - 0.5) * 8, // 속도를 2배로 증가
            dy: (Math.random() - 0.5) * 8, // 속도를 2배로 증가
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

    // 이미지를 그라데이션 위에 그립니다.
    if (this.image) {
      ctx.save();
      ctx.globalAlpha = 0.5; // 이미지의 투명도를 설정
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.clip();

      const imageSize = ball.radius * 2 * 0.5; // 이미지 크기를 0.7로 줄임
      ctx.drawImage(this.image, ball.x - imageSize / 2, ball.y - imageSize / 2, imageSize, imageSize);
      ctx.closePath();
      ctx.restore();
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.circleCenter.x, this.circleCenter.y, this.circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ECEEF0';
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

  private animate(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, 500, 500);
    this.drawCircle(ctx);
    this.balls.forEach(ball => {
      this.drawBall(ctx, ball);
      this.updateBallPosition(ball);
    });
    this.handleBallCollisions();
    requestAnimationFrame(() => this.animate(ctx));
  }
}
</script>

<style>
img {
  width: 100%;
  height: 100vh;

  z-index: 1;
  position: relative;
}

.random-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;

  z-index: 100;
  position: relative;
}

canvas {
  width: 260px;
  height: 260px;
  border: 4px solid;

  position: absolute;
  z-index: 100;
  top: 40%;
  left: 35%;
}
</style>
