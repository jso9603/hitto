<template>
  <div class="terms">
    <div class="container">
    <h1>서비스 이용약관</h1>
    <h3>제 1조 (목적)</h3>
    <p>이 약관은 모희또(이하 "회사"라 합니다)가 제공하는 로또 번호 생성 서비스(이하 "서비스"라 합니다)의 이용에 관하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

    <h3>제 2조 (이용약관의 효력 및 변경)</h3>
    <ol>
      <li>이 약관은 회사의 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
      <li>회사는 관련 법령을 위배하지 않는 범위 내에서 이 약관을 개정할 수 있으며, 약관을 개정할 경우 그 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 화면에 공지합니다.</li>
    </ol>

    <h3>제 3조 (서비스의 제공 및 변경)</h3>
    <ol>
      <li>회사는 이용자에게 로또 번호 생성 서비스와 관련된 다양한 콘텐츠를 제공합니다.</li>
      <li>회사는 서비스의 내용, 운영 방식 등을 변경할 수 있으며, 변경된 내용은 이용자에게 공지합니다.</li>
    </ol>

    <h3>제 4조 (로또 번호 생성 및 책임)</h3>
    <ol>
      <li>회사가 제공하는 로또 번호 생성 서비스는 순전히 이용자의 재미와 참고용으로 제공되는 것이며, 그 결과에 대한 모든 책임은 이용자 본인에게 있습니다.</li>
      <li>회사는 생성된 번호의 정확성, 유효성, 성공 여부 등에 대해 어떠한 보증도 하지 않으며, 이를 이유로 발생하는 모든 손해에 대해 책임지지 않습니다.</li>
    </ol>

    <h3>제 5조 (수익 창출에 관한 내용)</h3>
    <ol>
      <li>회사는 Google AdSense, Google Ads, 쿠팡 파트너스 등과 같은 제휴 프로그램을 통해 수익을 창출할 수 있으며, 서비스 이용 중 이러한 광고가 노출될 수 있습니다.</li>
      <li>이용자는 서비스 사용 중 표시되는 광고에 대한 클릭, 구매 등으로 발생하는 수익에 대해 회사가 일체의 권리를 가지는 것에 동의합니다.</li>
      <li>투자상품의 가치판단에 대한 사항</li>
      <li>광고로 인한 수익 창출은 서비스의 일환으로 제공되며, 이용자는 광고의 내용 및 형태에 대해 이의를 제기하지 않습니다.</li>
    </ol>

    <h3>제 6조 (개인정보 보호)</h3>
    <ol>
      <li>회사는 이용자의 개인정보를 보호하기 위해 최선을 다하며, 관련 법령에 따라 개인정보를 보호하고 처리합니다.</li>
      <li>이용자는 개인정보 변경 시 지체 없이 회사에 알리며, 회사는 이에 대해 적절한 조치를 취할 책임이 있습니다.</li>
    </ol>

    <h3>제 7조 (서비스 이용의 제한)</h3>
    <ol>
      <li>이용자는 본 약관 및 관련 법령을 준수해야 하며, 이를 위반할 경우 회사는 서비스 이용을 제한할 수 있습니다.</li>
      <li>회사는 아래와 같은 행위에 대해 서비스 이용을 제한할 수 있습니다:</li>
      <ol type="a">
        <li>법령 또는 공공질서 및 미풍양속에 반하는 행위</li>
        <li>회사의 서비스 운영을 고의로 방해하는 행위</li>
        <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
      </ol>
    </ol>

    <h3>제 8조 (책임의 제한)</h3>
    <ol>
      <li>회사는 천재지변, 전쟁, 불가항력적인 사유로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
      <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대해 책임지지 않습니다.</li>
      <li>회사는 이용자가 서비스를 통해 얻은 정보나 자료 등에 대해 신뢰도, 정확성 등에 관하여 책임을 지지 않습니다.</li>
    </ol>

    <h3>제 9조 (약관 외 준칙)</h3>
    <p>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</p>
    
    <h3>제 10조 (관할법원 및 준거법)</h3>
    <p>서비스 이용과 관련하여 발생한 분쟁에 대해서는 대한민국 법을 준거법으로 하며, 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Terms extends Vue { }
</script>

<style scoped>
.terms {
  margin-top: 24px;
  margin-bottom: calc(40px + 64px + env(safe-area-inset-bottom));
  padding: 0 20px;
}

.container {
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
}

h1 {
    padding-top: 48px;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
  }

  h3 {
    margin-top: 48px;
    margin-bottom: 32px;
    font-size: 24px;
    font-weight: 700;
  }

  p {
    font-size: 15px;
    font-weight: 400;
    line-height: 28px;
    margin-bottom: 16px;
  }

  ol > li::marker {
    font-weight: 700;
  }

  ol > li {
    padding-left: 10px;
    padding-right: 20px;
    line-height: 28px;
    font-size: 15px;
    margin-bottom: 10px;
  }

  .detail > ol > li {
    font-size: 16px;
    font-weight: 800;
    margin-top: 20px;
  }

  .detail > ol > ol {
    list-style: hangul;
  }

  .date {
    text-align: center;
    margin: 50px 0px 50px 0px;
  }
</style>