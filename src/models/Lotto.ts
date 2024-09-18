export interface Lotto {
  totSellamnt: number  // 총 상금
  returnValue: string  // 성공 혹은 실패
  drwNoDate: string  // 날짜
  firstWinamnt: number  // 1등 상금액
  firstAccumamnt: number // ?
  drwNo: number  // 회차
  drwtNo1: number  // 로또번호 1
  drwtNo2: number  // 로또번호 2
  drwtNo3: number  // 로또번호 3
  drwtNo4: number  // 로또번호 4
  drwtNo5: number  // 로또번호 5
  drwtNo6: number  // 로또번호 6
  bnusNo: number // 로또 보너스 번호
  winningNumbers?: any // 당첨 번호를 저장할 배열
  isBeforeTheDraw?: boolean // 당첨 전
}
