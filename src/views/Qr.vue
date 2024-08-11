<template>
  <div class="qr">
    <div class="text">QR코드로 간편하게<br/>로또당첨 확인하세요</div>
    <div class="qr__zone">
      <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
    </div>
    <img src="@/assets/ic-system-qr-close.svg" @click="onQrClose" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeStream } from 'vue-qrcode-reader'

@Component({
  components: {
    QrcodeStream,
  },
})
export default class Qr extends Vue {
  onDecode(decodedString: string) {
    this.checkLottery(decodedString);
  }

  onInit(promise: Promise<void>) {
    promise.catch((error) => {
      if (error.name === 'NotAllowedError') {
        alert('카메라 접근이 거부되었습니다.');
      } else {
        alert('카메라 초기화에 실패했습니다.');
      }
    });
  }

  checkLottery(url: string) {
    // QR 코드에서 읽은 URL로 이동
    window.location.href = url;
  }

  onQrClose() {
    this.$router.go(-1);
  }
}
</script>

<style scoped>
.qr {
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* 헤더 사이즈 */
  height: calc(100vh - 54px);
  background-color: #333;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.text {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  line-height: 33px;
  color: #ECEEF0;
}

.qr__zone {
  width: 300px;
  height: 280px;
  background-color: white;
  border: 2px solid;
  border-radius: 24px;
  /* border-image-source: linear-gradient(131.67deg, #4AFF81 3.05%, #9348F1 97.51%);
  border-image-slice: 1;
  border-image-outset: 0;
  border-image-repeat: round;
  -webkit-mask-image: linear-gradient(white, white); */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

.qr__zone::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(131.67deg, #4AFF81 3.05%, #9348F1 97.51%);
  z-index: -1;
}

::v-deep video.qrcode-stream-camera {
  border-radius: 24px;
  border: 2px solid;
  border-image-source: linear-gradient(131.67deg, #4AFF81 3.05%, #9348F1 97.51%);
  border-image-slice: 1; /* 이 값을 1로 설정하여 전체 이미지가 적용되도록 */
  border-image-outset: 0;
  border-image-repeat: round; /* Border를 둥글게 만듭니다 */
  -webkit-mask-image: linear-gradient(white, white);
  border: 2px solid;


}
</style>