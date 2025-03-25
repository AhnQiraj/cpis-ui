<template>
  <ElTag class="cpis-tag" ref="elTag" v-on="$listeners" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="scopeData">
      <slot :name="name" v-bind="scopeData"></slot>
    </template>
  </ElTag>
</template>
<script>
import { Tag } from 'element-ui'
export default {
  name: 'CpisTag',
  comments: {
    ElTag: Tag
  },
  methods: {
    // some method
  }
}
</script>
<style lang="scss">
.cpis-tag {
  color: red;
}
</style>
