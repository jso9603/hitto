<template>
  <div class="webview-test">
    <button @click="webviewLogin">웹뷰 로그인</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {
  mounted() {
    // eslint-disable-next-line no-extra-semi
    ;(window as any).loginSuccess = (accessToken: string, email: string) => {
      this.loginSuccess(accessToken, email)
      return {
        loginFailure: this.loginFailure,
      }
    }
  }

  beforeDestroy() {
    // 컴포넌트가 파괴될 때 전역 함수 제거
    delete (window as any).loginSuccess
    delete (window as any).loginFailure
  }

  webviewLogin() {
    console.log('웹뷰 로그인 요청')
    if ((window as any).LoginChannel) {
      // eslint-disable-next-line no-extra-semi
      ;(window as any).LoginChannel.postMessage('Login Requested')
    }
  }

  loginSuccess(accessToken: string, email: string) {
    console.log('로그인 성공! 액세스 토큰:', accessToken)
    console.log('이메일:', email)
  }

  loginFailure(errorMessage: any) {
    console.log('로그인 실패:', errorMessage)
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
    특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  height: calc(var(--vh, 1vh) * 100 - 54px);
  position: relative;
}

img {
  margin-bottom: 16px;
  width: 60px;
  height: 60px;
}

.title {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  color: #fff;
}

.text {
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  color: #9c9ea0;
}

button {
  padding: 12px 20px;
  background-color: #eceef0;
  border-radius: 44px;
  border-style: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: #181d23;
}
</style>
