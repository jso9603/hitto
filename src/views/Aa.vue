<template>
  <div class="snap-container">
        <div class="snap-card">P-1 카드 1</div>
        <div class="snap-card">P-1 카드 2</div>
        <div class="snap-card">P-1 카드 3</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Aa extends Vue {
}
</script>

<style scoped>
.snap-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100vh;
    scroll-snap-type: y mandatory; /* 세로 방향 스냅 */
}

.snap-card {
    background-color: #2c2c2e;
    border: 1px solid #444;
    border-radius: 10px;
    margin: 10px;
    padding: 20px;
    height: 80vh; /* 카드 높이를 적절히 설정 */
    scroll-snap-align: start; /* 시작 지점에서 스냅 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
}

.snap-card:nth-child(even) {
    background-color: #3a3a3c; /* 짝수 카드의 배경 색 */
}
</style>