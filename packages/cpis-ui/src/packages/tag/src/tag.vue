<template>
  <ElTag :type="computedType" :size="size" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </ElTag>
</template>

<script>
import { Tag } from 'element-ui'

export default {
  name: 'CpisTag',
  components: {
    ElTag: Tag
  },
  computed: {
    computedType() {
      return {
        submitted: 'default',
        draft: 'warning',
        completed: 'success',
        end: 'success',
        cancelled: 'info',
        cancel: 'info',
        overdue: 'danger',
        default: 'default'
      }[this.$props.type]
    }
  },
  props: {
    size: {
      type: String,
      default: 'small',
      comment: '标签大小'
    },
    type: {
      type: String,
      default: 'default',
      comment: '标签类型'
    }
  }
}
</script>
