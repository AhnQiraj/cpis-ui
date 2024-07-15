<template>
  <li class="ibps-list-item" :class="classes">
    <template v-if="itemLayout === 'vertical' && $slots.extra">
      <div class="ibps-list-item-main">
        <slot />
        <ul v-if="$slots.action" class="ibps-list-item-action">
          <slot name="action" />
        </ul>
      </div>
      <div class="ibps-list-item-extra">
        <slot name="extra" />
      </div>
    </template>
    <template v-else>
      <slot />
      <ul v-if="$slots.action" class="ibps-list-item-action">
        <slot name="action" />
      </ul>
      <div class="ibps-list-item-extra">
        <slot name="extra" />
      </div>
    </template>
  </li>
</template>
<script>
export default {
  name: 'IbpsListItem',
  inject: ['ListInstance'],
  computed: {
    itemLayout() {
      return this.ListInstance.itemLayout
    },
    isItemContainsTextNode() {
      let result
      this.$slots.default.forEach(item => {
        if (typeof item === 'string') {
          result = true
        }
      })
      return result
    },
    isFlexMode() {
      const extra = this.$slots.extra
      if (this.itemLayout === 'vertical') {
        return !!extra
      }
      return !this.isItemContainsTextNode
    },
    classes() {
      return [
        {
          'ibps-list-item-no-flex': !this.isFlexMode
        }
      ]
    }
  }
}
</script>
