<template>
  <div
    :style="{
      width:width,
      padding:padding,
      'justify-content': center
    }"
    class="ibps-skeleton-row"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'IbpsSkeletonRow',
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    padding: {
      type: String,
      default: '0 0 0 0'
    },
    center: {
      type: String,
      default: 'flex-start'
    }
  },
  data() {
    return {
    }
  }
}
</script>
