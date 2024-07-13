import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { FirebaseOptions } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyCssAplmS-z1kSRvtwXBqafOZ_ig7MCsV4",
  authDomain: "hitto-1b119.firebaseapp.com",
  projectId: "hitto-1b119",
  storageBucket: "hitto-1b119.appspot.com",
  messagingSenderId: "324388398876",
  appId: "1:324388398876:web:c11b3de568d9aa81b4bcd9",
  measurementId: "G-LJHQQWYZNH"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

export { db }