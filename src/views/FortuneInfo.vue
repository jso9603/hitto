<template>
  <div class="form-container">
    <div class="form-title">운세 정보를 입력해주세요</div>

    <div class="form-row">
      <div class="form-group group-2-3">
        <!-- 이름 입력 필드 -->
        <input
          type="text"
          v-model="name"
          placeholder="별명"
          maxlength="6"
          class="form-input"
          :class="{
            'input-filled': name,
            'input-empty': !name,
            'input-error': nameError,
          }"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
        <span v-if="nameError" class="error-text">{{ nameError }}</span>
      </div>

      <div class="form-group group-1-3">
        <!-- 성별 선택 필드 -->
        <select
          v-model="gender"
          class="form-select"
          :class="{ placeholder: !gender, 'input-error': genderError }"
        >
          <option disabled value="">성별</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <span v-if="genderError" class="error-text">{{ genderError }}</span>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group group-2-3">
        <!-- 생년월일 입력 필드 -->
        <input
          type="text"
          pattern="[0-9]+"
          v-model="birthday"
          placeholder="생년월일"
          maxlength="8"
          class="form-input"
          :class="{
            'input-filled': birthday,
            'input-empty': !birthday,
            'input-error': birthdayError,
          }"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
        <span v-if="birthdayError" class="error-text">{{ birthdayError }}</span>
      </div>

      <div class="form-group group-1-3">
        <!-- 양력/음력 선택 필드 -->
        <select
          v-model="calendarType"
          class="form-select"
          :class="{
            placeholder: !calendarType,
            'input-error': calendarTypeError,
          }"
        >
          <!-- <option disabled value="">양력/음력</option> -->
          <option value="solar">양력</option>
          <option value="lunar">음력</option>
          <option value="leap">윤달</option>
        </select>
        <span v-if="calendarTypeError" class="error-text">{{
          calendarTypeError
        }}</span>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group group-2-3">
        <!-- 출생 시간 선택 필드 -->
        <select
          v-model="birthTime"
          class="form-select"
          :class="{ placeholder: !birthTime, 'input-error': birthTimeError }"
        >
          <option disabled value="">출생 시간</option>
          <option value="no">생시 모름</option>
          <option value="01:30">축시 (01:30 ~ 03:29)</option>
          <option value="03:30">인시 (03:30 ~ 05:29)</option>
          <option value="05:30">묘시 (05:30 ~ 07:29)</option>
          <option value="07:30">진시 (07:30 ~ 09:29)</option>
          <option value="09:30">사시 (09:30 ~ 11:29)</option>
          <option value="11:30">오시 (11:30 ~ 13:29)</option>
          <option value="13:30">미시 (13:30 ~ 15:29)</option>
          <option value="15:30">신시 (15:30 ~ 17:29)</option>
          <option value="17:30">유시 (17:30 ~ 19:29)</option>
          <option value="19:30">술시 (19:30 ~ 21:29)</option>
          <option value="21:30">해시 (21:30 ~ 23:29)</option>
          <option value="23:30">자시 (23:30 ~ 01:29)</option>
        </select>
        <span v-if="birthTimeError" class="error-text">{{
          birthTimeError
        }}</span>
      </div>

      <!-- <div class="form-group group-1-3">
        <select v-model="zodiac" class="form-select" :class="{ 'placeholder': !zodiac, 'input-error': zodiacError }">
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
        <span v-if="zodiacError" class="error-text">{{ zodiacError }}</span>
      </div> -->
    </div>

    <div class="form-notice">
      <p>
        양력 또는 음력을 선택하여 정확한 생년월일과 출생 시간을 입력해 주세요.
      </p>
      <p>
        제공된 정보는 저장되지 않으며, 사용자의 사생활 보호를 최우선으로 합니다.
      </p>
    </div>

    <div class="floating">
      <button @click="onConfirm">운세보기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class FortuneInfo extends Vue {
  name = ''
  gender = ''
  birthday = ''
  calendarType = 'solar'
  birthTime = ''
  zodiac = ''
  inputFocused = false

  nameError = ''
  genderError = ''
  birthdayError = ''
  calendarTypeError = ''
  birthTimeError = ''
  zodiacError = ''

  // 실시간으로 name 입력을 감시하고 오류 메시지 설정
  @Watch('name')
  onNameChange() {
    if (!this.name) {
      this.nameError = '별명을 입력해주세요.'
    } else {
      this.nameError = ''
    }
  }

  // 실시간으로 gender 선택을 감시
  @Watch('gender')
  onGenderChange() {
    if (!this.gender) {
      this.genderError = '성별을 선택해주세요.'
    } else {
      this.genderError = ''
    }
  }

  // 실시간으로 생년월일을 감시
  @Watch('birthday')
  onBirthdayChange() {
    if (!this.isValidBirthday(this.birthday)) {
      this.birthdayError = '생년월일을 8자리로 정확히 입력해주세요.'
    } else {
      this.birthdayError = ''
    }
  }

  // 실시간으로 calendarType 선택을 감시
  @Watch('calendarType')
  onCalendarTypeChange() {
    if (!this.calendarType) {
      this.calendarTypeError = '양력 또는 음력을 선택해주세요.'
    } else {
      this.calendarTypeError = ''
    }
  }

  // 실시간으로 birthTime 선택을 감시
  @Watch('birthTime')
  onBirthTimeChange() {
    if (!this.birthTime) {
      this.birthTimeError = '출생 시간을 선택해주세요.'
    } else {
      this.birthTimeError = ''
    }
  }

  validateBirthday() {
    if (!this.birthday || !this.isValidBirthday(this.birthday)) {
      this.birthdayError = '유효한 값을 입력해주세요!'
    } else {
      this.birthdayError = '' // 유효한 경우 오류 초기화
    }
  }

  // 생년월일 유효성 검사 함수 (1920년 이후만 유효하게)
  isValidBirthday(birthday: string): boolean {
    const regex = /^\d{8}$/ // YYYYMMDD 형식의 8자리 숫자
    if (!regex.test(birthday)) {
      return false
    }

    const year = parseInt(birthday.slice(0, 4), 10)
    const month = parseInt(birthday.slice(4, 6), 10)
    const day = parseInt(birthday.slice(6, 8), 10)

    // 월은 1~12 범위, 일은 각 월에 맞는 범위로 제한
    if (year < 1920 || month < 1 || month > 12) return false

    // 각 월의 일수 체크 (윤년 고려 안함)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return day >= 1 && day <= daysInMonth[month - 1]
  }

  resetError() {
    this.nameError = ''
    this.genderError = ''
    this.birthdayError = ''
    this.calendarTypeError = ''
    this.birthTimeError = ''
    this.zodiacError = ''
  }

  onConfirm() {
    let valid = true
    this.resetError()

    if (!this.name) {
      this.nameError = '별명을 입력해주세요.'
      valid = false
      return
    }

    if (!this.gender) {
      this.genderError = '성별을 선택해주세요.'
      valid = false
      return
    }

    if (!this.birthday || !this.isValidBirthday(this.birthday)) {
      this.birthdayError = '생년월일을 8자리로 정확히 입력해주세요.'
      valid = false
      return
    }

    if (!this.calendarType) {
      this.calendarTypeError = '양력 또는 음력을 선택해주세요.'
      valid = false
      return
    }

    if (!this.birthTime) {
      this.birthTimeError = '출생 시간을 선택해주세요.'
      valid = false
      return
    }

    if (valid) {
      const userInfo = {
        name: this.name,
        gender: this.gender,
        birthday: this.birthday,
        calendarType: this.calendarType,
        birthTime: this.birthTime,
        zodiac: this.zodiac,
      }

      console.log('userInfo: ', userInfo)
      this.$store.dispatch('updateAdsEndPoint', 'loading')
      this.$store.dispatch('updateFortuneUser', userInfo)
      this.$router.push('/bridge')
      // this.$router.push({
      //   name: 'FortuneLoading',
      //   params: { fortuneName: this.name}
      // })
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 0 20px;
}

.form-title {
  color: #eceef0;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  gap: 8px; /* 각 그룹 간의 간격 */
  margin-bottom: 10px;
}

.form-group {
  /* flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px; */
  display: flex;
  flex-direction: column;
}

.group-2-3 {
  flex: 2; /* 2/3 비율 */
}

/* 1/3 너비 */
.group-1-3 {
  flex: 1; /* 1/3 비율 */
}

.form-input,
.form-select {
  /* width: 100%; */
  padding: 0 16px;
  /* padding: 12px 16px; */
  border-radius: 12px;
  border: 1px solid #2e364b;
  background-color: #1d2330;
  color: #9c9ea0;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  min-height: 46px !important;
  line-height: 18px;
}

.form-select {
  appearance: none;
  background-image: url('@/assets/ic-outline-arrow-down.svg');
  background-repeat: no-repeat;
  background-position: right 16px center; /* 아이콘의 위치 조정 */
  background-size: 18px 18px; /* 아이콘 크기 */
  min-height: 48px !important;
}

/* placeholder (선택되지 않은 기본값) 스타일 */
.form-select.placeholder {
  color: #9c9ea0;
}

/* 선택된 옵션 스타일 */
.form-select:not(.placeholder) {
  color: #9c9ea0;
}

.form-input.input-empty {
  border: 1px solid #2e364b;
}

/* .form-input.input-filled {
  border: 1px solid #ECEEF0;
} */

.form-input:focus,
.form-select:focus {
  border: 1px solid #eceef0; /* 활성화 상태 */
  outline: none;
  color: #ffffffcc;
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
  align-items: flex-start;
  margin-left: 8px;
}

.form-notice p::before {
  content: '';
  display: inline-block;
  margin-right: 10px;
  width: 3px;
  height: 3px;
  background-color: #737577;
  margin-top: 8px;
  border-radius: 50%;
}

/* 오류 상태일 때의 스타일 */
.input-error {
  border-color: #ff604f !important;
}

/* 오류 메시지 스타일 */
.error-text {
  color: #ff604f;
  font-size: 13px;
  margin-top: 8px;
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
  background: linear-gradient(
    180deg,
    rgba(19, 23, 32, 0) 0%,
    #131720 15.46%,
    #131720 82.53%
  );
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}

.floating > button {
  width: 100%;
  min-height: 52px;
  background-color: #eceef0;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: #181d23;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
</style>
