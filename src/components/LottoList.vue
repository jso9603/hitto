<template>
  <div class="list">
    <div class="tab">
      <div :class="['tab-item', { active: activeTab === 'lottos' }]" @click="setActiveTab('lottos')">Ai 로또</div>
      <div :class="['tab-item', { active: activeTab === 'dream' }]" @click="setActiveTab('dream')">꿈해몽</div>
    </div>
  
    <div v-if="loading">
      <div class="waitinging">
        <img src="@/assets/ic-stefan-2d.svg" class="bounce-animation" />
        <div class="waiting">잠시만 기다려주세요.</div>
      </div>
    </div>
    <div v-else>
      <div v-if="lottoData.length > 0">
        <div
          v-for="(lotto, index) in lottoData"
          :key="lotto.id || index"
          :class="['lotto-result', shouldAddMargin(lotto, index) ? 'with-margin' : '']"
        >
          <div v-if="shouldShowDate(lotto, index)" class="date">
            {{ getFormattedDate(lotto.date) }}
            <div v-if="lotto.isBeforeTheDraw" class="failed"> 추첨 전</div>
            </div>
          <div class="box" :class="getResultClass(lotto)">
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
            <template v-if="lotto.winningText">
              <div class="hr__line-1" />
              <div class="winning-text">
                <img class="cloud" src="@/assets/ic-system-cloud.png" />
                {{ lotto.winningText }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="no-data">
          <img src="@/assets/ic-stefan-2d.svg" />
          <div>행운은 도전하는 자에게 찾아옵니다!<br/>경제적 자유로 가는 첫걸음을 지금 시작해보세요!</div>
          <button @click="onCreate">생성하기</button>
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

interface Lotto {
  totSellamnt: number
  returnValue: string
  drwNoDate: string
  firstWinamnt: number
  firstAccumamnt: number
  drwNo: number
  drwtNo1: number
  drwtNo2: number
  drwtNo3: number
  drwtNo4: number
  drwtNo5: number
  drwtNo6: number
  bnusNo: number
  winningNumbers?: any
  isBeforeTheDraw?: boolean
}

interface User {
  email: string,
  uid: string,
}

@Component
export default class LottoList extends Vue {
  @Prop(Number) week!: number
  @Prop(Object) user!: User

  lottoData: any[] = [] // 나의 번호 데이터를 저장할 배열
  winningNumbers: number[] = [] // 당첨 번호를 저장할 배열
  loading: boolean = true

  private activeTab: string = 'lottos'

  private onCreate() {
    if (Object.keys(this.user).length === 0) {
      this.$router.push('/login')
    } else {
      this.$router.push('/ai')
    }
  }

  private setActiveTab(tab: string) {
    this.activeTab = tab
    setTimeout(() => {
      this.loading = false
    }, 1000)
    this.lottoData = []

    this.fetchLottoData(this.user.uid, tab).then(() => {
      this.$forceUpdate() // 강제로 뷰를 업데이트
    })
  }

  async fetchLottoData(uid: string, dbTable: string) {
    const storageName = dbTable === 'lottos' ? 'myNumbers' : 'myDreams'

    if (sessionStorage.getItem(storageName)) {
      const datas = JSON.parse(sessionStorage.getItem(storageName) as string)
      this.lottoData = datas

      sessionStorage.setItem(storageName, JSON.stringify(this.lottoData))

      this.lottoData = Array.isArray(this.lottoData) ? this.lottoData : [this.lottoData]

      this.lottoData.sort((a, b) => {
        return dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1
      })

      // 각 회차에 대해 API 호출
      for (const lotto of this.lottoData) {
        if (this.week < lotto.round) {
          lotto.isBeforeTheDraw = true
          lotto.winningNumbers = []
        } else {
          const response = await axios.get<Lotto>(`/common.do?method=getLottoNumber&drwNo=${lotto.round}`)
          if (response.data.returnValue === 'success') {
            lotto.winningNumbers = [
              response.data.drwtNo1,
              response.data.drwtNo2,
              response.data.drwtNo3,
              response.data.drwtNo4,
              response.data.drwtNo5,
              response.data.drwtNo6,
              response.data.bnusNo,
            ]
            lotto.isBeforeTheDraw = false
          }
        }
      }

      setTimeout(() => {
        this.loading = false
      }, 1000)
          
    } else {
      try {
        const q = query(collection(db, dbTable), where('uid', '==', uid))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            this.lottoData.push(doc.data())
          })

          this.lottoData.sort((a, b) => {
            return b.date.localeCompare(a.date)
          })

          sessionStorage.setItem(storageName, JSON.stringify(this.lottoData))

          // 각 회차에 대해 API 호출
          for (const lotto of this.lottoData) {
            if (this.week < lotto.round) {
              lotto.isBeforeTheDraw = true
              lotto.winningNumbers = []
            } else {
              const response = await axios.get<Lotto>(`/common.do?method=getLottoNumber&drwNo=${lotto.round}`)
              if (response.data.returnValue === 'success') {
                lotto.winningNumbers = [
                  response.data.drwtNo1,
                  response.data.drwtNo2,
                  response.data.drwtNo3,
                  response.data.drwtNo4,
                  response.data.drwtNo5,
                  response.data.drwtNo6,
                  response.data.bnusNo,
                ]
                lotto.isBeforeTheDraw = false
              }
            }
          }
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error)
      } finally {
        console.log('lottoData: ', this.lottoData)
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    }
  }

  mounted() {
    this.activeTab = this.$route.query.tab as string || 'lottos'
    this.fetchLottoData(this.user.uid, this.activeTab)
  }

  getFormattedDate(dateString: string) {
    return dayjs(dateString).format('YYYY년 MM월 DD일')
  }

  shouldShowDate(lotto: any, index: number) {
    if (index === 0) {
      return true
    }
    return lotto.date !== this.lottoData[index - 1].date
  }

  shouldAddMargin(lotto: any, index: number) {
    // 두 번째 result-box부터 with-margin 클래스를 추가
    // 첫 번째 항목은 항상 false
    if (index === 0) {
      return false
    }
    // 이전 항목과 현재 항목의 날짜가 같은 경우에만 마진 추가
    return lotto.date === this.lottoData[index - 1].date
  }

  isMatchingNumber(lotto: Lotto, num: number): boolean {
    return lotto.winningNumbers && lotto.winningNumbers.includes(num)
  }

  getResultClass(lotto: any) {
    const numbersArray = lotto.numbers.flatMap((num: any) => num.split(',').map((n: any) => Number(n.trim())))
    const matchCount = numbersArray.filter((num: any) => this.isMatchingNumber(lotto, num)).length
  
    return matchCount >= 3 ? 'bordered' : ''
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
.lotto-result {
  margin-top: 24px;
  color: #9C9EA0;
}

.lotto-result.with-margin {
  margin-top: 8px;
}

.box {
  background-color: #222222;
  padding: 24px 20px;
  border-radius: 16px;
}

.box.bordered {
  border: 1px solid #4AFF81;
}

.date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  margin-bottom: 10px;
}

.date > .failed {
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  text-align: center;
  color: #4AFF81;
  border: 1px solid #4AFF81;
  padding:  4px 6px 3px 6px;
  border-radius: 100px;
}

.numbers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.number-set {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.number-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: white;
}

.bonus-number {
  margin-left: 10px;
  font-size: 20px;
}

.hr__line-1 {
  margin: 16px 0;
  height: 1px;
  background-color: #333333;
}

.winning-text {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 15px;
  line-height: 23px;
  color: #ECEEF0;
}

.winning-text > img {
  width: 22px;
  height: 22px;
}

.no-data {
  text-align: center;
  margin: 40px 0;
}

.no-data div {
  margin: 12px auto 16px;
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
  background: linear-gradient(180deg, #FEC03E 0%, #C08405 100%);
}

.blue {
  background: linear-gradient(180deg, #4790FF 0%, #2260BE 100%);
}

.red {
  background: linear-gradient(180deg, #E64D3D 0%, #B62E20 100%);
}

.gray {
  background: linear-gradient(180deg, #BEC3C7 0%, #7C8388 100%);
}

.green {
  background: linear-gradient(180deg, #2ECD70 0%, #09893E 100%);
}

.default-color {
  background-color: #333;
}

.tab {
  display: flex;
  margin-bottom: 20px;
}

.tab-item {
  margin-right: 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #5F6163;
  transition: border-color 0.3s, background-color 0.3s;
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
}

.tab-item.active {
  color: #fff;
}

.tab-content {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.tab-content .option-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #222222;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
}

.option-item.active {
  background-color: #fff;
}

.tab-content .option-item .text {
  margin-left: 10px;
  color: #fff;
}

.option-item.active .text {
  color: #000;
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
  padding: 40px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
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