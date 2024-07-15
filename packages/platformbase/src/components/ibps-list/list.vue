<template>
  <div :class="classes">
    <div v-if="header || $slots.header" class="ibps-list-header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="ibps-list-container">
      <ul class="ibps-list-items">
        <slot />
      </ul>
    </div>
    <div v-if="footer || $slots.footer" class="ibps-list-footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
<script>
import Util from '@platform/utils/util'
const prefixCls = 'ibps-list'
export default {
  name: 'IbpsList',
  provide() {
    return {
      ListInstance: this
    }
  },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    itemLayout: {
      validator(value) {
        return Util.oneOf(value, ['horizontal', 'vertical'])
      },
      default: 'horizontal'
    },
    // 或 slot
    header: {
      type: String,
      default: ''
    },
    // 或 slot
    footer: {
      type: String,
      default: ''
    },
    // 含 slot: spin
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return Util.oneOf(value, ['small', 'large', 'default'])
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size
      }
    },
    split: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.size}`,
        `${prefixCls}-${this.itemLayout}`,
        {
          [`${prefixCls}-bordered`]: this.border,
          [`${prefixCls}-split`]: this.split
        }
      ]
    }
  }
}
</script>
