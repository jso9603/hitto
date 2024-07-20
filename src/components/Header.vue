<template>
  <div class="header">
    <img src="https://img.icons8.com/?size=100&id=7IoeSMcGv2w5&format=png&color=000000" />
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
  height: 60px;
  background-color: black;
}

img {
  width: 40px;
  height: 40px;
}
</style>