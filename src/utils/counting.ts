import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../src/config/firebaseConfig'

async function getCountingFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'counting'))
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0] // 첫 번째 문서 가져오기
      const counting = doc.data().counting
      return counting || 0
    }
    return 0
  } catch (error) {
    console.error('Error getting counting from Firestore:', error)
    return 0
  }
}

// 세션에 값을 저장하기
function setSessionCount(value: number): void {
  sessionStorage.setItem('counting', value.toString())
}

// 세션에서 값을 가져오기
function getSessionCount(): number {
  const count = sessionStorage.getItem('counting')
  return count ? parseInt(count, 10) : 0
}

// Firestore와 sessionStorage를 결합한 함수
export async function getCounting() {
  const sessionCount = getSessionCount()
  
  if (sessionCount > 0) {
    return sessionCount
  }
  
  const firestoreCount = await getCountingFromFirestore()
  setSessionCount(firestoreCount)
  return firestoreCount
}