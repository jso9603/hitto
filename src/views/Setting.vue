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
  private toggleState: boolean = false

  private async handleToggle(newState: boolean) {
    this.toggleState = newState;

    if (!this.toggleState) {
      await Cookies.remove('user');
      await alert('로그아웃 되었습니다');
      await this.$router.push('/');
    }
  }

  onLeave() {
    // 페이지 이동
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
  padding: 24px 20px;
  position: relative;
  height: calc(100vh - 102px);
}

.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
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