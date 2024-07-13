<template>
  <div>
    <a v-if="!email" @click="kakaoLoginStart()">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
      />
    </a>
    <div v-else>
      <p>email: {{ email }}</p>
      <!-- <button type="button" @click="kakaoLogout">카카오 로그아웃</button> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { db } from '../../src/config/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

@Component
export default class KakaoLogin extends Vue {
  email: string = ''

  async kakaoLoginStart() {
    if (window.Kakao.Auth.getAccessToken()) {
      window.Kakao.API.request({
        url: '/v1/user/unlink',
        success: async (response: any) => {
          console.log(response)
        },
        fail: async (error: any) => {
          console.log(error)
        },
      })
      window.Kakao.Auth.setAccessToken(undefined)
    }


    window.Kakao.Auth.login({
      success: async () => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          data: {
            property_keys: ['kakao_account.email']
          },
          success: async (response: any) => {
            console.log(response)
            
            this.email = response.kakao_account.email

            // DB: insert or Ignore
            await this.saveUsers(response.kakao_account.email)
          },
          fail: async (error: any) => {
            console.log(error)
          },
        })
      },
      fail: async (error: any) => {
        console.log(error)
      },
    })
  }

  async saveUsers(email: string) {
    try {
        // 기존 이메일 확인
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          // 이메일이 존재하지 않으면 추가
          const user = {
            email,
            uid: `uid_${Date.now()}` // 고유한 uid 생성
          };
          const docRef = await addDoc(collection(db, 'users'), user)
          console.log('이메일이 없어서 추가됨!! ', docRef.id)
        } else {
          console.log('이미 이메일이 있음!!')
        }
      } catch (e) {
        console.error('Error adding document: ', e);
      }
  }
}
</script>