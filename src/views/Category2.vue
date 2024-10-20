<template>
  <div class="container">
    <div class="page2" key="page2" v-if="selectedMainCategory">
      <div class="title">
        {{mainCategories[selectedMainCategory].icon}}
        <span>{{mainCategories[selectedMainCategory].name}}</span>
      </div>
      <div class="sub__category">
        <div
          v-for="(subCategory, index) in mainCategories[selectedMainCategory].subCategories" :key="index" :value="index"
          @click="onSubCategory(index)"
          :class="{ selected: index === selectedSubCategory }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ subCategory.name }}
          <img :src="index === selectedSubCategory ? require('@/assets/ic-system-dream-select.svg') : require('@/assets/ic-system-dream-unselect.svg')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoriesMixin from '@/mixins/categoriesMixin'

@Component({
  mixins: [CategoriesMixin],
})
export default class Category2 extends Vue {
  selectedMainCategory: number | null = null
  selectedSubCategory: number | null = null
  
  onSubCategory(index: number) {
    this.selectedSubCategory = index

    this.$store.dispatch('updateSubCategory', index.toString())

    this.$router.push({ 
      name: 'Category3',
      params: {
        selectedMainCategory: this.selectedMainCategory!!.toString(),
        selectedSubCategory: index.toString(),
      }
    })
  }

  mounted() {
    this.selectedMainCategory = Number(this.$store.state.selectedMainCategory)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  padding: 0 20px 20px;
  box-sizing: border-box;
}

.talk {
  margin-top: 20px;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
  text-align: center;
  color: #fff;
}

.disclamer {
  margin-top: 24px;
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
  text-align: center;
  color: #737577;
}

.title {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.title span {
  margin-left: 2px;
}

.sub__category div {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 20px;
  background-color: #212736;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;

  opacity: 0;
  transform: translateY(100%);
  animation: slideUp 0.5s forwards;
}

.sub__category div span {
  margin-left: 2px;
}

.sub__category div img {
  margin-left: auto;
}

.sub__category div.selected {
  background-color: #fff;
  color: #202223;
}

.floating {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: calc(100% - 40px);
  padding: 30px;
  background: linear-gradient(180deg, rgba(23, 23, 23, 0) 0%, #171717 15.46%, #171717 82.53%);
}

.floating > button {
  width: 100%;
  min-height: 52px;
  background-color: #ECEEF0;
  padding: 8px 8px;
  border-radius: 24px;
  border-style: none;
  color: #181D23;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  cursor: pointer;
}
</style>