<template>
  <aside class="el-aside bg-white min-w-[100px] max-w-[300px]" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
export default {
  name: 'CpisContainerAside',
  componentName: 'CpisContainerAside',
  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
}
</script>
