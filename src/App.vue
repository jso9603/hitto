<template>
  <div>
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '@/components/Header.vue'

@Component({
  components: {
    Header,
  }
})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  max-width: 576px;
  margin: 0 auto;
  background-color: #202223;
}
</style>
