<template>
  <div v-if="visible" class="modal-overlay" @click.self="closePopup">
    <div class="modal-content">
      <div class="bar" />
      <div class="modal-header">
        <h2>생성번호를 저장하시겠습니까?</h2>
        <p>카카오로 시작하면 번호를 저장하고 관리할 수 있어요!</p>
      </div>
      <div class="lotto-numbers">
        <div
          v-for="(form, index) in forms"
          :key="index"
          class="form-row"
        >
          <div class="label">P-{{ form.label.charCodeAt() - 64 }}</div>
          <div class="numbers">
            <div
              v-for="(number, numberIndex) in sortedSelectedNumbers(form.selectedNumbers)"
              :key="numberIndex"
              :class="['number-circle', getNumberClass(number)]"
            >
              {{ number }}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="kakao-btn" @click="startWithKakao" v-if="!user.email">
          <img src="@/assets/ic-system-kakao.svg" alt="Kakao" /> 카카오로 시작하기
        </button>
        <button class="save-btn" @click="onSave" v-if="user.email">저장하기</button>
        <button class="later-btn" @click="closePopup">나중에 할게요</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Cookies from 'js-cookie'

import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { User } from '../models/User'

@Component
export default class ManualPopup extends Vue {
  @Prop({ type: Array, required: true }) forms!: any[]
  @Prop({ type: Object, required: true }) user!: User
  @Prop({ type: Boolean, default: false }) visible!: boolean

  closePopup() {
    this.$emit('close')
    this.$router.replace('/')
  }

  saveData() {
    this.$emit('save')
  }

  sortedSelectedNumbers(selectedNumbers: number[]): number[] {
    return [...selectedNumbers].sort((a, b) => a - b)
  }

  getNumberClass(num: number): string {
    if (num >= 1 && num <= 10) return 'yellow'
    if (num >= 11 && num <= 20) return 'blue'
    if (num >= 21 && num <= 30) return 'red'
    if (num >= 31 && num <= 40) return 'gray'
    if (num >= 41 && num <= 45) return 'green'
    return 'default-color'
  }

  async startWithKakao() {
    await window.Kakao.Auth.login({
      success: (res: any) => {
        console.log(res)
        window.Kakao.Auth.setAccessToken(res.access_token)
        console.log('카카오 로그인 성공')

        window.Kakao.API.request({
          url: '/v2/user/me',
          success: async (res: any) => {
            console.log('카카오 인가 요청 성공')

            const kakaoAccount = res.kakao_account
            console.log(kakaoAccount)

            try {
            // 이메일로 기존 유저 검색
            const q = query(collection(db, 'users'), where('email', '==', kakaoAccount.email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
              // 이메일이 이미 존재할 경우
              const existingUserDoc = querySnapshot.docs[0]
              const existingUser = existingUserDoc.data() as User
              console.log('이미 존재하는 사용자:', existingUser)

              Cookies.set('user', JSON.stringify(existingUser), {expires: 30})
            } else {
              // 새로운 유저 생성
              const newUser = {
                email: kakaoAccount.email,
                uid: `uid_${Date.now()}` // 고유한 uid 생성
              }

              // Firestore에 사용자 추가
              await addDoc(collection(db, 'users'), newUser)
              console.log('새로운 사용자 추가:', newUser)
              Cookies.set('user', JSON.stringify(newUser), {expires: 30})
            }
          } catch (e) {
            console.error('사용자 저장 중 오류 발생:', e)
          }

            this.saveData()
          },
          fail: (error: any) => {
            console.log(error)
          },
        })
      },
      fail: (error: any) => {
        console.log(error)
      },
    })
  }

  onSave() {
    this.saveData()
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
  color: #737577;
}

.modal-footer {
  margin-top: 24px;
}

.lotto-numbers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background: #222222;
  padding: 20px;
  border-radius: 16px;
  color: #DEE0E2;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
}

.lotto-numbers .label {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: #DEE0E2;
}

.form-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
}

.form-row:last-child {
  margin-bottom: 0;
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
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
}

.yellow {
  border: 1px solid #DD9A17;
  color: #DD9A17;
}

.blue {
  border: 1px solid #0085FF;
  color: #0085FF;
}

.red {
  border: 1px solid #E64D3D;
  color: #E64D3D;
}

.gray {
  border: 1px solid #9C9EA0;
  color: #9C9EA0;
}

.green {
  border: 1px solid #33C759;
  color: #33C759
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
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.save-btn {
  background-color: #61D59D;
  color: #202223;
  border: none;
  width: 100%;
  padding: 15px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kakao-btn img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.later-btn {
  margin-top: 8px;
  background-color: transparent;
  color: #333;
  border: 1px solid #BABCBE;
  width: 100%;
  padding: 15px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  cursor: pointer;
}
</style>
