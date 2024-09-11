<template>
  <el-tag type="success">123</el-tag>
</template>
<script>
import { Tag } from 'element-ui'
export default {
  name: 'CpisTag',
  props: {
    type: {
      type: String,
      default: 'info'
    }
  },
  components: {
    ElTag: Tag
  }
}
</script>
