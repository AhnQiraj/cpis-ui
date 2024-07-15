<template>
  <div
    :style="{
      width:width,
      padding:padding,
      'align-items':center
    }"
    class="ibps-skeleton-column"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'IbpsSkeletonColumn',
  props: {
    width: {
      type: String,
      width: 'auto'
    },
    padding: {
      type: String,
      default: '0 0 0 0'
    },
    center: {
      type: String,
      default: 'flex-start'
    }
  }
}
</script>
