<template>
  <div class="form-container">
    <div class="form-title">사주 정보를 입력해주세요</div>

    <div class="form-group">
      <!-- 이름 입력 필드 -->
      <input
        type="text"
        v-model="name"
        placeholder="이름"
        class="form-input"
        :class="{ 'input-filled': name, 'input-empty': !name }"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
      />

      <!-- 성별 선택 필드 -->
      <select v-model="gender" class="form-select" :class="{ 'placeholder': !gender }">
        <option disabled value="">성별</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
    </div>

    <div class="form-group">
      <!-- 생년월일 입력 필드 -->
      <input
        type="number"
        v-model="birthday"
        placeholder="생년월일"
        maxlength="8"
        class="form-input"
        :class="{ 'input-filled': birthday, 'input-empty': !birthday }"
        @focus="inputFocused = true"
        @blur="inputFocused = false"
      />

      <!-- 양력/음력 선택 필드 -->
      <select v-model="calendarType" class="form-select" :class="{ 'placeholder': !calendarType }">
        <option disabled value="">양력/음력</option>
        <option value="solar">양력</option>
        <option value="lunar">음력</option>
      </select>
    </div>

    <div class="form-group">
      <!-- 출생 시간 선택 필드 -->
      <select v-model="birthTime" class="form-select" :class="{ 'placeholder': !birthTime }">
        <option disabled value="">출생 시간</option>
        <option value="01:30">축시: 01:30 ~ 03:29</option>
        <option value="03:30">인시: 03:30 ~ 05:29</option>
        <option value="05:30">묘시: 05:30 ~ 07:29</option>
        <option value="07:30">진시: 07:30 ~ 09:29</option>
        <option value="09:30">사시: 09:30 ~ 11:29</option>
        <option value="11:30">오시: 11:30 ~ 13:29</option>
        <option value="13:30">미시: 13:30 ~ 15:29</option>
        <option value="15:30">신시: 15:30 ~ 17:29</option>
        <option value="17:30">유시: 17:30 ~ 19:29</option>
        <option value="19:30">술시: 19:30 ~ 21:29</option>
        <option value="21:30">해시: 21:30 ~ 23:29</option>
        <option value="23:30">자시: 23:30 ~ 01:29</option>
      </select>

      <!-- 띠 선택 필드 -->
      <select v-model="zodiac" class="form-select" :class="{ 'placeholder': !zodiac }">
        <option disabled value="">띠</option>
        <option value="rat">쥐</option>
        <option value="ox">소</option>
        <option value="tiger">호랑이</option>
        <option value="rabbit">토끼</option>
        <option value="dragon">용</option>
        <option value="snake">뱀</option>
        <option value="horse">말</option>
        <option value="sheep">양</option>
        <option value="monkey">원숭이</option>
        <option value="rooster">닭</option>
        <option value="dog">개</option>
        <option value="pig">돼지</option>
      </select>
    </div>

    <div class="form-notice">
      <p>양력 또는 음력을 선택하여 정확한 생년월일과 출생 시간을 입력해 주세요.</p>
      <p>제공된 정보는 저장되지 않으며, 사용자의 사생활 보호를 최우선으로 합니다.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class FortuneInfo extends Vue {
  name = ''
  gender = ''
  birthday = ''
  calendarType = ''
  birthTime = ''
  zodiac = ''
  inputFocused = false
}
</script>

<style scoped>
.form-container {
  padding: 0 20px;
}

.form-title {
  color: #ECEEF0;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0 16px;
  /* padding: 12px 16px; */
  border-radius: 12px;
  border: 1px solid #2E364B;
  background-color: #1D2330;
  color: #ECEEF0;
  font-size: 16px;
  transition: all 0.2s;
  min-height: 48px !important;
}

.form-select {
  appearance: none;
  background-image: url('@/assets/ic-outline-arrow-down.svg');
  background-repeat: no-repeat;
  background-position: right 16px center; /* 아이콘의 위치 조정 */
  background-size: 18px 18px; /* 아이콘 크기 */
}

/* placeholder (선택되지 않은 기본값) 스타일 */
.form-select.placeholder {
  color: #737577;
}

/* 선택된 옵션 스타일 */
.form-select:not(.placeholder) {
  color: #ECEEF0;
}

.form-input.input-empty {
  border: 1px solid #2E364B;
}

/* .form-input.input-filled {
  border: 1px solid #ECEEF0;
} */

.form-input:focus,
.form-select:focus {
  border: 1px solid #ECEEF0; /* 활성화 상태 */
  outline: none;
}

.form-notice {
  margin-top: 24px;
  font-size: 13px;
  color: #737577;
  line-height: 19px;
  font-weight: 400;
}

.form-notice p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.form-notice p::before {
  content: '';
  display: inline-block;
  margin-right: 10px;
  width: 3px;
  height: 3px;
  background-color: #737577;
}
</style>