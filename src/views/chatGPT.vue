<template>
  <div class="fortune">
    <h1>오늘의 운세</h1>
    <button @click="getFortune">운세 보기</button>
    <p v-if="loading">운세를 불러오는 중...</p>
    <div v-else>
      {{fortuneResponse}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class ChatGPT extends Vue {
  fortuneResponse = ''
  loading = false

  async getFortune() {
    this.loading = true;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `
                당신은 운세 전문가입니다. 사용자에게 오늘의 재물운, 연애운, 사업운, 건강운, 시험운을 각각 한국어로 1줄 요약과 5줄 이상의 상세 설명으로 알려주세요.
              응답은 반드시 JSON 형식으로 주세요. 형식은 아래와 같이 해주세요:
              {
                "fortunes": [
                  { "category": "재물운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "연애운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "사업운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "건강운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" },
                  { "category": "시험운", "summary": "1줄 요약", "text": "5줄 이상의 상세 설명" }
                ]
              }
              `
            }
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GPT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 운세 데이터를 파싱하여 각 항목에 저장
      this.fortuneResponse = response.data.choices[0].message.content
    } catch (error) {
      console.error('운세 데이터를 불러오는 중 오류가 발생했습니다:', error);
      this.fortuneResponse = '오류입니다...'
    } finally {
      this.loading = false;
    }
  }

  // 최종 API response
  // [
  //   {
  //       "category": "재물운",
  //       "summary": "오늘은 재물 운이 좋아요! 뜻밖의 수입이 기대됩니다.",
  //       "text": "금전적으로 뜻밖의 기회가 찾아올 것으로 예상됩니다. 오늘은 귀하에게 행운의 날이 될 수 있으니 금전적인 일에 주의를 기울이세요. 예상치 못한 수입이 들어올 수도 있으며, 재물 운이 좋아서 투자나 경제활동을 위한 계획을 세우기에도 좋은 날입니다. 안도하고 긍정적인 마음가짐을 유지하여 재물 운을 최대한 발휘해보세요."
  //   },
  //   {
  //       "category": "연애운",
  //       "summary": "오늘은 연인과의 소중한 시간을 보내기에 좋은 날이에요.",
  //       "text": "오늘은 연인과의 관계가 좋아질 수 있는 날입니다. 서로 간에 소통이 원활하고 이해심이 깊어지는 시간을 가질 수 있을 것입니다. 상대방에게 좋은 말과 표현을 통해 감사하다는 마음을 전해보세요. 또한 서로의 의견을 존중하고 신뢰를 쌓는 것이 중요합니다. 오늘은 연인과의 소중한 순간을 함께 보낼 수 있는 날이니 서로를 위로하고 응원해주는 마음을 가지고 지내보세요."
  //   },
  //   {
  //       "category": "사업운",
  //       "summary": "사업 운이 밝아 보이는 날이에요. 새로운 계획을 세워보세요.",
  //       "text": "오늘은 사업에 대한 기회가 찾아올 수 있는 날입니다. 새로운 아이디어나 계획을 세우는데 도움이 되는 하루일 것입니다. 현재 진행 중이던 프로젝트나 계획이 원활하게 진행되며, 새로운 기회에 대한 문을 열어주는 시간이 될 것입니다. 협력자나 동료들과의 소통을 통해 더 많은 가능성을 모색해보세요. 자신의 역량을 믿고 새로운 도전에 대한 에너지를 채우는 것이 좋은 결과를 가져다 줄 것입니다."
  //   },
  //   {
  //       "category": "건강운",
  //       "summary": "건강에 신경 써야 할 날이에요. 적절한 휴식이 필요합니다.",
  //       "text": "오늘은 건강 상태에 조금 더 신경 써야 할 날일 수 있습니다. 지나치게 바쁜 일정이나 스트레스로 인해 피로가 누적될 수 있으니, 적절한 휴식과 식사를 유지하는 것이 중요합니다. 몸과 마음의 피로를 해소하기 위해 명상이나 운동을 통해 건강한 생활습관을 유지해보세요. 자신의 몸의 신호를 잘 듣고 적절한 조치를 취한다면 건강을 유지하는 데 도움이 될 것입니다."
  //   },
  //   {
  //       "category": "시험운",
  //       "summary": "시험에 대해 긍정적으로 준비하세요. 좋은 결과가 기대됩니다.",
  //       "text": "시험을 준비하거나 대면해야 하는 경우에는 긍정적인 마음가짐을 유지하세요. 노력한 만큼의 결과를 얻을 수 있을 것이며, 자신에게 자신감을 심어주는 것이 중요합니다. 실력을 키우기 위한 노력과 자기계발에 힘쓴 결과가 시험 결과에 반영될 것입니다. 자신의 능력을 믿고 차분하게 시험에 임한다면 좋은 성적을 얻을 수 있을 것이니 자신을 믿고 임해보세요."
  //   }
  // ]
}
</script>

<style scoped>
.fortune {
  color: #FFF;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #0085ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0073e6;
}

input[type="date"] {
  display: block;
  margin: 0 auto 20px;
  padding: 10px;
  font-size: 16px;
}

h2 {
  margin-top: 20px;
  text-align: center;
}

p {
  text-align: center;
  font-size: 18px;
}
</style>