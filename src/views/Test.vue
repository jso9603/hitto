<template>
  <div class="loading-container">
    <!-- 원형 로딩바 안에 Canvas를 배치 -->
    <div class="loading-bar">
      <canvas ref="loadingCanvas" width="160" height="160"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// Ball 인터페이스 정의 (타입스크립트에서 사용할 타입)
interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
}

@Component
export default class Test extends Vue {
  // 참조할 canvas 엘리먼트
  private canvas: HTMLCanvasElement | null = null;
  private balls: Ball[] = [];
  private ballCount = 10; // 공의 개수
  private animationId: number = 0;
  private progress: number = 0; // 로딩바 진행 상태
  private colors: string[] = ['#FEC03E', '#4790FF', '#E64D3D', '#2ECD70', '#BEC3C7'];

  // 원의 중심점과 반지름
  private circleCenter = { x: 80, y: 80 }; // canvas의 중앙
  private circleRadius = 80; // 원의 반지름 (로딩 바)

  // 컴포넌트가 마운트될 때 애니메이션 초기화
  mounted() {
    this.initCanvas();
    this.animateBalls();
    this.incrementProgress(); // 로딩바를 진행시키는 함수 호출
  }

  // Canvas 초기화 및 공 생성
  initCanvas() {
    this.canvas = this.$refs.loadingCanvas as HTMLCanvasElement;
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        // 공 생성 및 초기화
        for (let i = 0; i < this.ballCount; i++) {
          const color = this.colors[i % this.colors.length];
          this.balls.push({
            x: this.circleCenter.x + (Math.random() - 0.5) * this.circleRadius, // 원 안에서 임의의 위치
            y: this.circleCenter.y + (Math.random() - 0.5) * this.circleRadius,
            radius: 10, // 공 크기
            dx: (Math.random() - 0.5) * 6, // 속도 조정
            dy: (Math.random() - 0.5) * 6,
            color: color,
          });
        }
      }
    }
  }

  // 애니메이션 시작
  animateBalls() {
    const ctx = this.canvas?.getContext('2d');
    if (ctx && this.canvas) {
      const width = this.canvas.width;
      const height = this.canvas.height;

      const draw = () => {
        // 캔버스 지우기
        ctx.clearRect(0, 0, width, height);

        // 로딩바 그리기 (파란 원형 선)
        this.drawLoadingBar(ctx);

        // 공 그리기 및 위치 업데이트
        this.balls.forEach((ball) => {
          this.drawBall(ctx, ball);
          this.updateBallPosition(ball);
        });

        // 공끼리의 충돌 처리
        this.handleBallCollisions();

        // 다음 프레임 요청
        this.animationId = requestAnimationFrame(draw);
      };

      draw();
    }
  }

  // 공 그리기 함수
  drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
    const gradient = ctx.createLinearGradient(
    ball.x, ball.y - ball.radius, // 그라데이션 시작점 (위쪽)
    ball.x, ball.y + ball.radius  // 그라데이션 끝점 (아래쪽)
  );

  if (ball.color === '#4790FF') {
    gradient.addColorStop(0, '#74B9FF');  // 밝은 파랑
    gradient.addColorStop(1, '#2980B9');  // 어두운 파랑
  } else if (ball.color === '#FEC03E') {
    gradient.addColorStop(0, '#FFD700');  // 밝은 노랑
    gradient.addColorStop(1, '#FFA500');  // 어두운 오렌지
  } else if (ball.color === '#E64D3D') {
    gradient.addColorStop(0, '#FF6F61');  // 밝은 빨강
    gradient.addColorStop(1, '#C0392B');  // 어두운 빨강
  } else if (ball.color === '#2ECD70') {
    gradient.addColorStop(0, '#66FF99');  // 밝은 초록
    gradient.addColorStop(1, '#27AE60');  // 어두운 초록
  } else if (ball.color === '#BEC3C7') {
    gradient.addColorStop(0, '#E0E0E0');  // 밝은 회색
    gradient.addColorStop(1, '#7C8388');  // 어두운 회색
  }

  // 공 그리기
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // 공의 형태
  ctx.fillStyle = gradient; // 그라데이션을 색상으로 설정
  ctx.fill();
  ctx.closePath();
  }


  // 공의 위치를 업데이트하는 함수
  updateBallPosition(ball: Ball) {
    const ctx = this.canvas?.getContext('2d'); // context 가져오기

    if (!ctx) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    const distX = ball.x - this.circleCenter.x;
    const distY = ball.y - this.circleCenter.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // 로딩바 안쪽 경계(반지름 - 로딩바 두께 - 공의 반지름)에 부딪힐 경우 반사
    const boundaryRadius = 65;

    // 공이 원의 경계에 부딪혔을 때
    if (distance > boundaryRadius) {
      const angle = Math.atan2(distY, distX);
      ball.dx = -ball.dx;
      ball.dy = -ball.dy;

      // 공을 경계 안쪽으로 이동시킴
      ball.x = this.circleCenter.x + boundaryRadius * Math.cos(angle);
      ball.y = this.circleCenter.y + boundaryRadius * Math.sin(angle);
    }
  }

  // 공끼리 충돌 처리 함수
  handleBallCollisions() {
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const dx = this.balls[j].x - this.balls[i].x;
        const dy = this.balls[j].y - this.balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 두 공이 충돌했을 경우 반사 처리
        if (distance < this.balls[i].radius + this.balls[j].radius) {
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // 공의 위치 회전
          const pos0 = { x: 0, y: 0 };
          const pos1 = { x: dx * cos + dy * sin, y: dy * cos - dx * sin };

          // 공의 속도 회전
          const vel0 = { x: this.balls[i].dx * cos + this.balls[i].dy * sin, y: this.balls[i].dy * cos - this.balls[i].dx * sin };
          const vel1 = { x: this.balls[j].dx * cos + this.balls[j].dy * sin, y: this.balls[j].dy * cos - this.balls[j].dx * sin };

          // 충돌 후 속도
          const vxTotal = vel0.x - vel1.x;
          vel0.x = ((this.balls[i].radius - this.balls[j].radius) * vel0.x + 2 * this.balls[j].radius * vel1.x) / (this.balls[i].radius + this.balls[j].radius);
          vel1.x = vxTotal + vel0.x;

          // 공 위치 조정
          const absV = Math.abs(vel0.x) + Math.abs(vel1.x);
          const overlap = (this.balls[i].radius + this.balls[j].radius) - Math.abs(pos0.x - pos1.x);
          pos0.x += vel0.x / absV * overlap;
          pos1.x += vel1.x / absV * overlap;

          // 위치를 다시 회전
          const pos0F = { x: pos0.x * cos - pos0.y * sin, y: pos0.y * cos + pos0.x * sin };
          const pos1F = { x: pos1.x * cos - pos1.y * sin, y: pos1.y * cos + pos1.x * sin };

          this.balls[j].x = this.balls[i].x + pos1F.x;
          this.balls[j].y = this.balls[i].y + pos1F.y;
          this.balls[i].x += pos0F.x;
          this.balls[i].y += pos0F.y;

          // 속도를 다시 회전
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

  // 파란 원형 로딩바 그리기
  drawLoadingBar(ctx: CanvasRenderingContext2D) {
    const centerX = this.canvas!.width / 2;
    const centerY = this.canvas!.height / 2;
    const radius = 80; // 로딩바의 반지름
    const startAngle = -Math.PI / 2; // 12시 방향에서 시작
    const endAngle = startAngle + (Math.PI * 2 * (this.progress / 100)); // 진행 상태에 따라 각도를 조정

    // 배경 원형 그리기 (회색 원)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#202223';
    ctx.lineWidth = 13;
    ctx.stroke();
    ctx.closePath();

    // 그라데이션 추가
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas!.height);
    gradient.addColorStop(0.0, 'rgba(74, 255, 129, 0)'); // 시작점 (투명)
    gradient.addColorStop(1.0, '#4AFF81'); // 끝점 (초록색)

    // 진행 상태에 따른 원형 그라데이션 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = gradient; // 그라데이션 적용
    ctx.lineWidth = 13;
    ctx.lineCap = 'round'; // 원형 끝을 둥글게
    ctx.stroke();
    ctx.closePath();
  }

  // 프로그레시브 바 진행 함수
  incrementProgress() {
  const interval = setInterval(() => {
    if (this.progress >= 100) {
      this.progress = 0; // progress가 100%에 도달하면 다시 0으로 초기화
    } else {
      this.progress += 1; // progress 증가
    }
  }, 30); // 30ms마다 1씩 증가

  console.log(interval)
}

  // 컴포넌트가 파괴되기 전 애니메이션을 멈추기
  beforeDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-bar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
}
</style>
