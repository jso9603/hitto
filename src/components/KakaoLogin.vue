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
}
</script>