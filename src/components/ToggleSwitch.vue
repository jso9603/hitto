<template>
  <div class="toggle-switch" @click="toggle">
    <div class="toggle-track" :class="{ 'is-checked': isChecked }">
      <div class="toggle-thumb"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ToggleSwitch extends Vue {
  private isChecked: boolean = true

  private toggle(): void {
    this.isChecked = !this.isChecked;
    this.$emit('change', this.isChecked);
  }
}
</script>

<style scoped>
.toggle-switch {
  width: 52px;
  height: 26px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-track {
  width: 100%;
  height: 100%;
  background-color: #2e2e2e;
  border-radius: 25px;
  position: relative;
  transition: background-color 0.3s ease;
  border: 2px solid #5F6163;
}

.toggle-track.is-checked {
  background-color: #171717;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: #737577;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 2px;
  transition: transform 0.3s ease;
}

.toggle-track.is-checked .toggle-thumb {
  background-color: #FFFFFF;
  transform: translateX(24px);
}
</style>
