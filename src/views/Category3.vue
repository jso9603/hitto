<template>
  <div class="container">
    <div class="page3" key="page3" v-if="isValidCategory(selectedMainCategory, selectedSubCategory)">
      <div class="title">
        {{mainCategories[selectedMainCategory].subCategories[selectedSubCategory].name}}
      </div>
      <div class="sub__category">
        <div
          v-for="(item, index) in mainCategories[selectedMainCategory].subCategories[selectedSubCategory].items" :key="index"
          @click="onLastCategory(index)"
          :class="{ selected: index === selectedLastCategory }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ item }}
          <img :src="index === selectedLastCategory ? require('@/assets/ic-system-dream-select.svg') : require('@/assets/ic-system-dream-unselect.svg')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import CategoriesMixin from '@/mixins/categoriesMixin'
import { mixins } from 'vue-class-component'

@Component
export default class Category3 extends mixins(CategoriesMixin) {
  selectedMainCategory: number | null = null
  selectedSubCategory: number | null = null
  selectedLastCategory: number | null = null

  isValidCategory(mainCategoryIndex: number | null, subCategoryIndex: number | null) {
    if (mainCategoryIndex === null || subCategoryIndex === null) return false
    const mainCategory = this.mainCategories[mainCategoryIndex]
    if (!mainCategory || !mainCategory.subCategories[subCategoryIndex]) return false
    return true
  }

  onLastCategory(index: number) {
    this.selectedLastCategory = index

    this.$router.push('/random')
  }

  mounted() {
    this.selectedMainCategory = Number(this.$store.state.selectedMainCategory)
    this.selectedSubCategory = Number(this.$store.state.selectedSubCategory)
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