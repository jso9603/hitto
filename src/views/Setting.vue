<template>
  <div class="setting">
    <div class="menu">
      <div class="label">
        <div class="title">연결된 계정</div>
      </div>
      <div class="content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Setting extends Vue {
  
}
</script>

<style scoped>
.setting {
  padding: 24px 20px;
}

.menu {
  display: flex;
  align-items: cent4er;
}
</style>