<template>
  <div class="fortune">
    <div class="today">{{today}}</div>
    <div class="name">{{fortuneUserName}}님</div>

    <div class="img">
      <img src='@/assets/img-fortune.png' at="fortune 이미지" />
    </div>

    <div v-for="fortune in fortunes" :key="fortune.category" class="fortune-box">
      <div class="category">{{fortune.category}}</div>
      <div class="summary">{{fortune.summary}}</div>
      <div class="text">{{fortune.text}}</div>
    </div>

    <div class="share">
      <div class="title">친구, 지인과 함께<br/>로또 1등에 도전해보세요</div>
      <div class="share-channel">
        <div class="round kakao" @click="shareKakao">
          <img src="@/assets/ic-system-kakao.svg" alt="kakao" />
        </div>
        <div class="round sms" @click="shareSms">
          <img src="@/assets/ic-system-sms.svg" alt="sms" />
        </div>
        <div class="round url" @click="shareUrl">
          URL
        </div>
        <div class="round more" @click="shareNative">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cookies from 'js-cookie'

import dayjs from 'dayjs'

interface Fortune {
  category: string,
  summary: string,
  text: string,
}

@Component
export default class ChatGPT extends Vue {
  fortunes: Fortune[] = []
  fortuneResponse = ''
  loading = true

  fortuneUserName = ''

  get today () {
    return dayjs().format('YYYY년 MM월 DD일')
  }

  shareKakao() {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '모두의 희망로또',
        description: '친구, 지인과 함께 로또 1등에 도전해보세요.',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/hitto-1b119.appspot.com/o/img-mohito.png?alt=media&token=3d83642a-91c5-46ac-b144-095bcf728016',
        link: {
          mobileWebUrl: 'https://mohito.co.kr',
          webUrl: 'https://mohito.co.kr',
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: 'https://mohito.co.kr',
            webUrl: 'https://mohito.co.kr',
          },
        },
      ],
    })
  }

  shareSms() {
    const message = '친구와 함께 로또1등 당첨 도전해보세요. 모두의 희망로또!: https://mohito.co.kr'
    const phoneNumber = ''
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
  }

  shareUrl() {
    const currentUrl = 'https://mohito.co.kr'

    // Check if navigator.clipboard.writeText is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        this.$store.dispatch('showCopyImage')
      }).catch(err => {
        console.error('링크 복사에 실패했습니다:', err)
      })
    } else {
      // Fallback for iOS Safari
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      // Ensure the textarea is not visible and doesn't cause layout shifts
      textArea.style.position = 'fixed' // Fixed position to avoid layout changes
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.width = '1px'
      textArea.style.height = '1px'
      textArea.style.padding = '0'
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.style.opacity = '0' // Make it invisible
      textArea.setAttribute('readonly', '')
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$store.dispatch('showCopyImage')
        } else {
          console.error('링크 복사에 실패했습니다.')
        }
      } catch (err) {
        console.error('링크 복사에 실패했습니다:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  shareNative() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: '모두의 희망로또',
        text: '친구, 지인과 함께 로또 1등에 도전해보세요.',
        url: 'https://mohito.co.kr',
      })
      .then(() => {
        console.log('공유 성공')
      })
      .catch((error: any) => {
        console.error('공유 실패:', error)
      })
    } else {
      alert('이 브라우저에서는 지원되지 않습니다.')
    }
  }

  // 자정까지 남은 시간을 계산하여 fortune 데이터를 localStorage에 저장하는 함수
  setTodayFortune(fortunes: any) {    
    // 오늘 자정 시간을 계산
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)  // 자정 시간 설정 (내일 00:00:00)
    
    const data = {
      fortunes: fortunes,          // 저장할 fortune 데이터
      expiry: tomorrow.getTime()   // 자정의 시간을 만료 시간으로 저장
    }
    
    // localStorage에 저장 (todayFortune)
    localStorage.setItem('todayFortune', JSON.stringify(data))
  }

  // todayFortune 데이터를 가져오는 함수 (만료 시간 확인)
  getTodayFortune() {
    const storedData = localStorage.getItem('todayFortune')
    
    if (storedData) {
      const data = JSON.parse(storedData)
      
      // 현재 시간과 만료 시간을 비교
      const now = new Date()
      if (now.getTime() > data.expiry) {
        // 만료 시간이 지났으면 localStorage에서 삭제
        localStorage.removeItem('todayFortune')
        return null // 만료된 데이터는 null 반환
      }
      
      return data.fortunes // 만료되지 않았다면 fortune 데이터 반환
    }
    
    return null // 저장된 데이터가 없으면 null 반환
  }

  mounted() {
    const fortunesData = this.$route.params.fortunes
    const fortuneUserName = this.$route.params.fortuneUserName
    this.fortuneUserName = fortuneUserName

    if (fortunesData) {
      this.fortunes = JSON.parse(fortunesData) // 전달받은 데이터를 파싱하여 사용
      this.setTodayFortune(fortunesData)

      console.log(fortunesData)
    } else {
      const todayFortune = this.getTodayFortune()
      if (todayFortune) {
        console.log('오늘의 운세:', todayFortune)
        this.fortunes = JSON.parse(todayFortune)
      } else {
        console.log('운세 데이터가 만료되었습니다.')
      }

      this.fortuneUserName = Cookies.get('fortuneName') as string
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
  margin-top: 20px;
  padding: 0 20px;
}

.today {
  color: #9C9EA0;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
}

.name {
  margin-top: 4px;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.img {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.img > img {
  margin-right: 10px;
  width: 120px;
  height: 120px;
}


.fortune-box {
  background-color: #212736;
  border-radius: 16px;
  padding: 24px;

  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 12px;
}

.category {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  color: #61D59D;
}

.summary {
  margin-bottom: 12px;
  color: #ECEEF0;
  font-size: 17px;
  font-weight: 600;
  line-height: 25px;
}

.text {
  color: #9C9EA0;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
}

.share {
  margin-top: 32px;
  margin-bottom: 40px;
}

.title {
  margin-bottom: 20px;
  color: #ECEEF0;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
}

.share-channel {
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 20px;
}

.round {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

.kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFE600;
}

.kakao > img,
.sms > img {
  width: 24px;
  height: 24px;
}

.sms {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #61D59D;
}

.url {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2E80FA;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.more {
  background-color: #737577;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.more > div {
  width: 5px;
  height: 5px;
  background-color: #D9D9D9;
  border-radius: 50%;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading > .box {
  min-height: 150px;
  background-color: #212736;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 12px;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}
</style>