<template>
  <div class="cpis-form-section">
    <!-- 标题区域 -->
    <div class="flex items-center cpis-form-section__header" v-if="title || $slots.title">
      <slot name="title">
        <div class="cpis-form-section__title">{{ title }}</div>
      </slot>
      <div v-if="$slots.right" class="ml-auto">
        <slot name="right"></slot>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="cpis-form-section__content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CpisFormSection',
  props: {
    title: {
      type: String,
      default: ''
    },
    // 每行显示的列数
    columns: {
      type: [Number, String],
      default: 1
    },
    // 列间距
    gutter: {
      type: Number,
      default: 0
    }
  },

  computed: {
    contentStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
        gap: `${this.gutter}px`
      }
    }
  },

  provide() {
    return {
      formSection: this
    }
  }
}
</script>

<style lang="scss">
.cpis-form-section {
  margin-bottom: 16px;

  &__header {
    @apply bg-primary-1 h-[32px]
    margin-bottom: 8px;
  }

  &__title {
    @apply text-gray-8 text-base font-bold leading-[32px];
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      @apply bg-primary-6;
    }
  }

  &__content {
    position: relative;
  }
}
</style>
