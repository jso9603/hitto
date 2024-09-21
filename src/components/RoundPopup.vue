<template>
  <div v-if="visible" class="modal-overlay" @click.self="closePopup">
    <div class="modal-content">
      <div class="bar" />
      <div class="modal-header">
        <h2>회차를 선택해주세요</h2>
        <!-- <p>현재회차와 이전 회차 결과를 검색할 수 있어요</p> -->
      </div>
      <div class="modal-body">
        <div class="round-buttons">
          <div
            v-for="(round, index) in previousRounds"
            :key="index"
            :class="['round-button', { selected: selectedRound === previousRounds[index] }]"
            @click="selectRound(round)"
          >
            <div class="lotto-numbers">{{ round }}회</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class LoginPopup extends Vue {
  @Prop({ type: String, default: '' }) round!: string
  @Prop({ type: String, default: '' }) current!: string
  @Prop({ type: Boolean, default: false }) visible!: boolean

  selectedRound = 0

  get previousRounds() {
    const currentRound = Number(this.round)
    const rounds = []

    for (let i = 0; i < 9; i++) {
      rounds.push(currentRound - i)
    }
    return rounds
  }

  selectRound(round: number) {
    console.log('round: ', round)
    this.selectedRound = round
    this.$emit('selected', round)
  }

  closePopup() {
    this.$emit('close')
  }

  onConfirm() {
    this.$emit('selected', this.round)
  }

  mounted() {
    this.selectedRound = +this.round
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
  padding: 0 20px calc(20px + env(safe-area-inset-bottom));
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
  border-radius: 100px;
  background-color: #DEE0E2;
}

.modal-header h2 {
  margin-bottom: 20px;
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
  color: #737577;
}

.round-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}

.round-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: calc(33.33% - 8px); /* 한 줄에 3개 표시 */
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 44px;
  border-radius: 24px;
  border: 1px solid #ECEEF0;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.round-button.selected {
  height: 46px;
  background-color: #202223; /* 선택된 버튼의 배경색 */
  border: none;
  color: #ffffff; /* 선택된 버튼의 글자색 */
  font-weight: 600;
}

.round-button:not(.selected):hover {
  border: 1px solid #cccccc; /* 선택되지 않은 버튼에 마우스를 올릴 때 */
}
</style>
