<template>
  <ElTag :type="type">{{ $slots.default[0].text }}</ElTag>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import { Tag } from 'element-ui'

export default {
  name: 'CpisTag',
  components: {
    ElTag: Tag
  },
  computed: {
    type() {
      return {
        submitted: 'default',
        draft: 'warning',
        completed: 'success',
        cancelled: 'info',
        overdue: 'danger'
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
