<template>
  <ElTag :type="computedType" v-bind="$attrs" v-on="$listeners">
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
    type: {
      type: String,
      default: 'default',
      comment: '标签类型'
    }
  }
}
</script>
