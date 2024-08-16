<template>
  <div class="participants">
    <div class="animation">
      <div
        v-for="(participant, index) in participants"
        :key="index"
        class="participant"
        :style="{ animationDelay: `${index * 0.4}s` }"
      >
        <img :src="require(`@/assets/ic-system-user${participant.img}.svg`)" />
        <div class="info">
          <div class="id">{{participant.id}}</div>
          <div class="text">{{participant.winningText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import data from '@/datas/guess/data.json'

@Component
export default class GuessParticipants extends Vue {
  participants = [];

  created() {
    this.participants = data;
  }
}
</script>

<style scoped>
@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.participant {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}

.participant > img {
  width: 32px;
  height: 32px;
}

.participant > .info > .id {
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
  color: #ECEEF0;
}

.participant > .info > .text {
  font-family: Pretendard;
font-size: 14px;
font-weight: 400;
line-height: 21px;
text-align: left;
color: #9C9EA0;

}
</style>