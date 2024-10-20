<template>
  <div class="container">
    <div class="page1" key="page1">
      <div class="talk">꿈을 선택해주세요</div>

      <div class="tab-container">
        <div class="tab">
          <div :class="['tab-item', { active: activeTab === 'automatic' }]" @click="setActiveTab('automatic')">꿈 종류</div>
          <div :class="['tab-item', { active: activeTab === 'manual' }]" @click="setActiveTab('manual')">직접 입력</div>
          <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>
      </div>

      <template v-if="activeTab === 'automatic'">
        <div class="main__category">
          <div
            v-for="(category, index) in mainCategories"
            :key="index"
            :value="index"
            @click="onMainCategory(index)"
            :class="{ selected: index === selectedMainCategory }"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            {{category.icon}}
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
        <div class="disclamer">모희또 서비스에서 제공하는 생성번호는 참고 용도이며,<br/>그로 인한 책임은 사용자에게 있습니다.</div>
      </template>

      <template v-if="activeTab === 'manual'">
        <div class="textarea-box">
          <textarea
            ref="myTextarea"
            class="custom-textarea"
            v-model="impression"
            @input="handleInput"
          />
          <div class="placeholder" @click="onPlaceholder" v-if="!impression">{{ placeholderText }}</div>
          <div class="textarea-footer">
            <span class="current">{{ impression.length }}<span class="max"> / 300</span></span>
          </div>
        </div>
      </template>
    </div>

    <div class="floating" v-if="activeTab === 'manual'">
      <button
        class="primary"
        @click="onConfirm"
      >
        입력 완료
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CategoriesMixin from '@/mixins/categoriesMixin'

@Component({
  mixins: [CategoriesMixin]
})
export default class Category extends Vue {
  selectedMainCategory: number | null = null
  selectedSubCategory: number | null = null
  selectedLastCategory: number | null = null

  impression: string = ''
  placeholderText: string = '꿈꾸었던 꿈의 이야기를 설명해주세요.'
  textareaHeight = 50
  maxHeight = 300

  private activeTab: string = 'automatic'

  private get indicatorStyle() {
    return {
      transform: this.activeTab === 'automatic' ? 'translateX(0)' : 'translateX(100%)',
    }
  }

  adjustTextareaHeight(): void {
    const textarea = this.$refs.myTextarea as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // 높이를 초기화 후 다시 계산
      const scrollHeight = textarea.scrollHeight; // 높이를 측정
      this.textareaHeight = Math.min(scrollHeight, this.maxHeight); // 최대 높이를 넘지 않도록 제한
    }
  }
  
  private setActiveTab(tab: string) {
    this.activeTab = tab
  }

  onMainCategory(index: number) {
    this.selectedMainCategory = index

    this.$store.dispatch('updateMainCategory', index.toString())

    this.$router.push({ 
      name: 'Category2',
      params: { selectedMainCategory: index.toString() }
    })
  }

  private handleInput(event: Event) {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement
    const placeholder = document.querySelector('.placeholder') as HTMLDivElement
    
    if (textarea && placeholder) {
      // 텍스트 영역에 입력된 값이 없으면 placeholder를 보여줌
      placeholder.style.display = textarea.value ? 'none' : 'block'
    }

    const target = event.target as HTMLTextAreaElement
    if (target.value.length > 300) {
      target.value = target.value.slice(0, 300)
    }
    this.impression = target.value
  }

  private onPlaceholder() {
    (this.$refs.myTextarea as HTMLTextAreaElement).focus()
  }

  private onConfirm() {
    if (this.impression.length < 10) {
      alert('최소 10글자 이상 작성해주세요.')
    } else {
      this.$router.push('/random')
    }
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

.tab-container {
  margin-top: 32px;
  margin-bottom: 20px;
  padding: 4px;
  background-color: #212736;
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
  color: #ffffff80;
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

.textarea-box {
  padding: 20px;
  border-radius: 16px;
  background-color: #212736;
  position: relative;
}

.custom-textarea {
  padding: 0;
  width: 100%;
  height: 150px;
  max-height: 300px;
  border: none;
  outline: none;
  background-color: #212736;
  color: #b3b3b3;
  resize: none;
  font-size: 15px;
  font-weight: 500;
  line-height: 23px;
  white-space: pre-line;
}

.placeholder {
  position: absolute;
  top: 16px;
  color: #9C9EA0;
  white-space: pre-line;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  color: #b3b3b3;
  font-size: 14px;
}

.textarea-footer span {
  color: #ECEEF0;
  font-size: 14px;
  font-weight: 400;
}

.textarea-footer span.max {
  color: #737577;
  font-size: 14px;
  font-weight: 400;
}

.main__category {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
}

.main__category > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1; /* flex-grow로 남은 공간을 채움 */
  width: calc(33.333% - 16px); /* 각 요소의 최대 너비 설정 */
  padding: 16px;
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
  box-sizing: border-box;
}

.main__category > div > .category-name {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  color: #FFF;
}

.main__category div.selected {
  background-color: #fff;
  color: #202223;
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