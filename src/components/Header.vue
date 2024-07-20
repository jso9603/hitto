<template>
  <div class="header">
    <img src="@/assets/ic-system-logo.svg" />
    <div class="profile" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 20px;
  background-color: #202223;
}

img {
  width: auto;
  height: 18px;
  cursor: pointer;
}

.profile {
  width: 32px;
  height: 32px;
  background-color: #414244;
  border-radius: 50%;
}
</style>