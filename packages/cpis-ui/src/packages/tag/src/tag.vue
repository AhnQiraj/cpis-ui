<template>
  <ElTag :type="type" :size='size'>{{ $slots.default[0].text }}</ElTag>
</template>

<script>
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
        overdue: 'danger',
        default: 'default'
      }[this.$props.type]
    }
  },
  props: {
    type: {
      type: String,
      default: 'default',
      comment: '标签类型',
      validator: function (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
    size: {
      type: String,
      comment: '尺寸',
      default: 'medium',
      validator: function (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
  }
}
</script>
