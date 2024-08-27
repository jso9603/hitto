<template>
  <div v-if="visible" class="modal-overlay" @click.self="closePopup">
    <div class="modal-content">
      <div class="bar" />
      <div class="modal-header">
        <h2>생성된 로또 번호를<br/>저장할까요?</h2>
        <p>카카오로 시작하면 번호를 저장하고 관리할 수 있어요!</p>
      </div>
      <div class="modal-body">
        <div class="lotto-numbers">
          <div class="label">생성 번호</div>
          <div class="numbers">
            <div
              v-for="(num, index) in numbers"
              :key="index"
              :class="['number-circle', getNumberClass(num)]"
            >
              {{ num }}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="kakao-btn" @click="startWithKakao">
          <img src="@/assets/ic-system-kakao.svg" alt="Kakao" /> 카카오로 시작하기
        </button>
        <button class="later-btn" @click="closePopup">나중에 할게요</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class LoginPopup extends Vue {
  @Prop({ type: Array, default: () => [] }) numbers!: number[];
  @Prop({ type: Boolean, default: false }) visible!: boolean;

  closePopup() {
    this.$emit('close');
  }

  startWithKakao() {
    // 카카오 시작하기 로직 처리
    console.log('카카오로 시작');
    this.closePopup();
  }

  getNumberClass(num: number): string {
    if (num >= 1 && num <= 10) return 'yellow';
    if (num >= 11 && num <= 20) return 'blue';
    if (num >= 21 && num <= 30) return 'red';
    if (num >= 31 && num <= 40) return 'gray';
    if (num >= 41 && num <= 45) return 'green';
    return 'default-color';
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000066;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 10;
}

.modal-content {
  background: #fff;
  padding: 0 20px calc(28px + env(safe-area-inset-bottom));
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  width: 100%;
  max-width: calc(576px - 80px);
}

.bar {
  margin: 16px auto 24px;
  width: 50px;
  height: 5px;
  gap: 0px;
  border: 100px;
  background-color: #DEE0E2;
}

.modal-header h2 {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  text-align: left;
  color: #202223;
}

.modal-header p {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  color: #5F6163;
}

.modal-footer {
  margin-top: 24px;
}

.lotto-numbers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222222;
  padding: 20px;
  border-radius: 16px;
  color: #DEE0E2;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
}

.lotto-numbers .label {
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  color: #DEE0E2;
}

.lotto-numbers .status {
  background-color: #ECEEF0;
  border-radius: 40px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  color: #202223;
}

.lotto-numbers .numbers {
  display: flex;
  gap: 6px;
}

.number-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
}

.yellow {
  background-color: #fec03e;
}

.blue {
  background-color: #4790ff;
}

.red {
  background-color: #e64d3d;
}

.gray {
  background-color: #bec3c7;
}

.green {
  background-color: #2ecd70;
}

.result {
  display: flex;
  justify-content: space-between;
}

.kakao-btn {
  background-color: #FFE812;
  color: #181D23;
  border: none;
  width: 100%;
  padding: 15px;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kakao-btn img {
  margin-right: 8px;
}

.later-btn {
  margin-top: 8px;
  background-color: transparent;
  color: #333;
  border: 1px solid #ccc;
  width: 100%;
  padding: 15px;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  cursor: pointer;
}
</style>
