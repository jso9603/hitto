<template>
  <div class="list">
    <div class="tab-container">
      <div class="tab">
        <div :class="['tab-item', { active: activeTab === 'automatic' }]" @click="setActiveTab('automatic')">자동 번호</div>
        <div :class="['tab-item', { active: activeTab === 'manual' }]" @click="setActiveTab('manual')">수동 번호</div>
        <div class="tab-indicator" :style="indicatorStyle"></div>
      </div>
    </div>
  
    <div v-if="loading">
      <div class="waitinging">
        <div class="bg-img bounce-animation">
          <img src="@/assets/ic-stefan-2d.svg"/>
        </div>
        <div class="waiting">잠시만 기달려주세요</div>
      </div>
    </div>
    <div v-else>
      <div v-if="lottoData.length > 0" class="result-zone">
        <div
          v-for="(lotto, index) in lottoData"
          :key="lotto.id || index"
          class="lotto-result"
        >
          <div class="box" :class="getResultClass(lotto)">
            <div v-if="isRoundMatched" class="before-the-draw">추첨 대기</div>
            <div v-if="!isRoundMatched" class="draw" v-html="calculateRank(lotto)"></div>
            <div class="date">{{ getFormattedDate(lotto.date) }}</div>
            <div class="numbers">
              <div v-for="(set, setIndex) in lotto.numbers" :key="setIndex" class="number-set">
                <div
                  v-for="(num, numIndex) in set.split(', ').slice(0, 5)"
                  :key="numIndex"
                  :class="['number-circle', lotto.winningNumbers ? isMatchingNumber(lotto, Number(num)) ? getNumberClass(num) : 'default-color' : '']"
                >
                  {{ num }}
                </div>
                <div
                  :class="['number-circle', isMatchingNumber(lotto, Number(lotto.numbers[lotto.numbers.length - 1].split(', ').slice(-1)[0])) ? getNumberClass(Number(lotto.numbers[lotto.numbers.length - 1].split(', ').slice(-1)[0])) : 'default-color']"
                >
                    {{ lotto.numbers[lotto.numbers.length - 1].split(', ').slice(-1)[0] }}
                  </div>
              </div>
            </div>
            <button class="open-card">열기</button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="no-data">
          <div class="bg-img">
            <img src="@/assets/ic-stefan-2d.svg" />
          </div>
          <div class="no-data-title">생성이력이 없어요</div>
          <div class="no-data-text">행운은 도전하는 자에게 찾아옵니다<br/>경제적 자유로 가는 첫 걸음, 모히또</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { db } from '../config/firebaseConfig'
import { collection, query, getDocs, where } from 'firebase/firestore'
import axios from 'axios'

import { User } from '../models/User'
import { Lotto, LottoData } from '../models/Lotto'

@Component
export default class LottoList extends Vue {
  @Prop(Number) week!: number
  @Prop(Object) user!: User
  @Prop(Boolean) isRoundMatched!: boolean

  lottoData: LottoData[] = [] // 나의 번호 데이터를 저장할 배열
  winningNumbers: number[] = [] // 당첨 번호를 저장할 배열
  loading: boolean = true

  private isUrlTab: boolean = false
  private activeTab: string = 'automatic'

  private get indicatorStyle() {
    return {
      transform: this.activeTab === 'automatic' ? 'translateX(0)' : 'translateX(100%)',
    }
  }

  private onCreate() {
    if (Object.keys(this.user).length === 0) {
      this.$router.push('/login')
    } else {
      this.$router.push('/ai')
    }
  }

  private setActiveTab(tab: string) {
    this.activeTab = tab

    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
    this.lottoData = []

    this.fetchLottoData(this.user.uid, tab).then(() => {
      this.$forceUpdate() // 강제로 뷰를 업데이트
    })
  }

  private calculateRank(lottoData: LottoData): string {
    // 사용자가 찍은 번호 (문자열을 숫자 배열로 변환)
    const userNumbers = lottoData.numbers[0].split(', ').map(Number)

    if (!lottoData.winningNumbers || lottoData.winningNumbers.length === 0) {
      return '추첨 대기'
    }

    // 당첨 번호 6개
    const winningNumbers = lottoData.winningNumbers.slice(0, 6)
    // 보너스 번호
    const bonusNumber = lottoData.winningNumbers[6]

    // 일치하는 번호 개수
    const matchedNumbers = userNumbers.filter(num => winningNumbers.includes(num)).length
    // 보너스 번호 일치 여부
    const isBonusMatched = userNumbers.includes(bonusNumber)

    // 등수 계산
    if (matchedNumbers === 6) {
      return '<span>1등</span> 당첨'
    } else if (matchedNumbers === 5 && isBonusMatched) {
      return '<span>2등</span> 당첨'
    } else if (matchedNumbers === 5) {
      return '<span>3등</span> 당첨'
    } else if (matchedNumbers === 4) {
      return '<span>4등</span> 당첨'
    } else if (matchedNumbers === 3) {
      return '<span>5등</span> 당첨'
    } else {
      return '낙첨'
    }
  }

  async fetchLottoData(uid: string, dbTable: string) {
    const storageName = dbTable === 'automatic' ? 'myNumbers' : 'myChallenge'

    // sessionStorage에서 데이터 로드
    const cachedData = sessionStorage.getItem(`${storageName}-${this.week}`)
    if (cachedData && !this.isUrlTab) {
      this.lottoData = JSON.parse(cachedData)

      console.log(this.lottoData)
      this.processLottoData(this.lottoData)
      this.loading = false

      return
    }

    // TODO: pagination
    try {
      const q = query(
        collection(db, dbTable),
        where('uid', '==', uid),
        where('round', '==', this.week)
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          this.lottoData.push(doc.data() as any)
        })

        this.lottoData.sort((a, b) => dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1)
        sessionStorage.setItem(`${storageName}-${this.week}`, JSON.stringify(this.lottoData))
      }
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error)
    } finally {
      console.log('lottoData: ', this.lottoData)
      this.processLottoData(this.lottoData)
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }

  private async processLottoData(lottoData: any[]) {
    for (const lotto of lottoData) {
      if (this.week < lotto.round) {
        lotto.isBeforeTheDraw = true
        lotto.winningNumbers = []
      } else {
        const cachedWinningNumbers = sessionStorage.getItem(`winningNumbers_${lotto.round}`)
        if (cachedWinningNumbers) {
          lotto.winningNumbers = JSON.parse(cachedWinningNumbers)
        } else {
          const response = await axios.get<Lotto>(`/common.do?method=getLottoNumber&drwNo=${lotto.round}`)
          if (response.data.returnValue === 'success') {
            lotto.winningNumbers = [
              response.data.drwtNo1, response.data.drwtNo2, response.data.drwtNo3,
              response.data.drwtNo4, response.data.drwtNo5, response.data.drwtNo6, response.data.bnusNo
            ]
            sessionStorage.setItem(`winningNumbers_${lotto.round}`, JSON.stringify(lotto.winningNumbers))
          }
        }
      }
    }

    this.loading = false
  }

  mounted() {
    this.isUrlTab = this.$route.query.tab ? true : false
    this.activeTab = this.$route.query.tab as string || 'automatic'
    this.fetchLottoData(this.user.uid, this.activeTab)
  }

  // 로딩 시간 측정
  // const startTime = performance.now()
  // this.fetchLottoData(this.user.uid, this.activeTab).then(() => {
  //   const endTime = performance.now() // 로딩 끝난 시간
  //   const loadingTime = endTime - startTime // 로딩 시간 계산
  //   console.log(`로딩 시간: ${loadingTime} ms`)
  // })

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('MM월 DD일')
  }

  isMatchingNumber(lotto: Lotto, num: number): boolean {
    return lotto.winningNumbers && lotto.winningNumbers.includes(num)
  }

  getResultClass(lottoData: LottoData) {
  const userNumbers = lottoData.numbers.flatMap((num: any) => num.split(',').map((n: any) => Number(n.trim())))

  if (lottoData.winningNumbers === undefined) {
    return ''
  }

  const winningNumbers = lottoData.winningNumbers.slice(0, 6)
  const matchCount = userNumbers.filter((num: any) => winningNumbers.includes(num)).length

  let rank = matchCount >= 3 ? 'bordered' : ''
  return rank
}

  getNumberClass(num: number) {
    if (num >= 1 && num <= 10) return 'yellow'
    if (num >= 11 && num <= 20) return 'blue'
    if (num >= 21 && num <= 30) return 'red'
    if (num >= 31 && num <= 40) return 'gray'
    if (num >= 41 && num <= 45) return 'green'
    return ''
  }
}
</script>

<style scoped>
.tab-container {
  margin: 24px auto 12px;
  padding: 4px;
  background-color: #222222;
  border-radius: 100px;
  height: 42px;
}

.tab {
  display: flex;
  border-radius: 100px;
  width: 100%;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  border-radius: 100px;
  font-size: 14px;
  color: #737577;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 50%; /* 탭 인디케이터 너비는 두 개의 탭에 맞춰 50%로 설정 */
  background-color: #ECEEF0;
  border-radius: 100px;
  transition: transform 0.3s ease; /* 슬라이드 트랜지션 */
  z-index: 0; /* 텍스트 뒤에 배경 인디케이터를 배치 */
}

.tab-item.active {
  color: #202223;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
}

.result-zone {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}

.lotto-result {
  width: calc(50% - 6px);
  margin-top: 12px;
  color: #9C9EA0;
}

.box {
  background-color: #222222;
  padding: 16px;
  border-radius: 16px;
}

.box.bordered {
  border: 1px solid #5F6163;
}

.before-the-draw {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #ECEEF0;
}

::v-deep .draw {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #ECEEF0;
}

::v-deep .draw > span {
  color: #4AFF81;
}

.date {
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #9C9EA0;
}

.numbers {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.number-set {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  /* width: 100%; */
  width: 130px;
}

.number-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #414244;
  color: #414244;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
}

.bonus-number {
  margin-left: 10px;
  font-size: 20px;
}

.no-data {
  text-align: center;
  margin: 72px 0;
}

.bg-img {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #0085FF;
}

.bg-img > img {
  width: 32px;
  height: 32px;
}

.no-data > .no-data-title {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #FFF;
}

.no-data > .no-data-text {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: center;
  color: #9C9EA0;
}

.no-data button {
  padding: 13px 16px;
  border: none;
  border-radius: 40px;
  background-color: #ECEEF0;
  color: #181D23;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
}

.no-data button:hover {
  background-color: #ECEEF0;
}

.yellow {
  border: 1px solid #FFBD00;
  color: #FFBD00;
}

.blue {
  border: 1px solid #0085FF;
  color: #0085FF;
}

.red {
  border: 1px solid #E64D3D;
  color: #E64D3D;
}

.gray {
  border: 1px solid #9C9EA0;
  color: #9C9EA0;
}

.green {
  border: 1px solid #33C759;
  color: #33C759
}

.open-card {
  margin-top: 28px;
  width: 100%;
  padding: 10px 14px 10px 14px;
  border-radius: 100px;
  border: 1px solid #222222;
  background-color: #333333;
  color: #ECEEF0;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7.5px);
  }
}

.waitinging {
  padding: 48px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}

.waiting {
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: center;
  color: #9C9EA0;
}

.bounce-animation {
  animation: bounce 2s infinite;
}
</style>