<template>
  <div class="setting">
    <div class="menu">
      <div class="label">
        <div class="title">
          연결된 계정
          <div class="email" v-if="user">
            <div class="kakao">
              <img src="@/assets/ic-system-kakao.svg" />
            </div>
            {{user.email}}
          </div>
        </div>
      </div>
      <div class="contents">
        <ToggleSwitch @change="handleToggle"></ToggleSwitch>
      </div>
    </div>

    <div class="leave" @click="onLeave">탈퇴하기</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { getLoggedUserInfo } from '@/utils/user'

@Component({
  components: {
    ToggleSwitch,
  }
})
export default class Setting extends Vue {
  user: any | null = null
  private toggleState: boolean = true

  private async handleToggle(newState: boolean) {
    this.toggleState = newState;

    if (!this.toggleState) {
      await Cookies.remove('user');
      await alert('로그아웃 되었습니다');
      await this.$router.push('/');
    }
  }

  // iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  // 특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음
  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  onLeave() {
    this.$router.push('/leave');
  }

  mounted() {
    window.addEventListener('resize', this.setViewportHeight);
    window.addEventListener('orientationchange', this.setViewportHeight);

    this.setViewportHeight();
  }

  created() {
    const user = getLoggedUserInfo();
    if (user) {
      this.user = user;
    }
  }
}
</script>

<style scoped>
.setting {
  margin: 0;
  padding: 0 20px;
  position: relative;
  /* iOS에서 100vh가 실제 뷰포트 높이와 정확히 일치하지 않는 경우가 있음
  특히, 주소창이나 툴바 같은 UI 요소가 나타나거나 사라질 때 브라우저의 뷰포트 높이가 달라질 수 있음 */
  /* margin-top: 20px까지 제외시킨다. */
  height: calc(var(--vh, 1vh) * 100 - 78px);
}

.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0;
}

.menu > .label {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: #ECEEF0;
}

.menu > .label > .title {
  margin-bottom: 4px;
}

.menu > .label > .title > .email {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #9C9EA0;
}

.menu > .label > .title > .email > .kakao {
  background-color: #ECEEF0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 75px;
}

.kakao > img {
  width: 13.5px;
  height: 13.5px;
}

.leave {
  position: absolute;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9C9EA0;
  text-decoration: underline;
  bottom: calc(20px + env(safe-area-inset-bottom));
  cursor: pointer;
}
</style>