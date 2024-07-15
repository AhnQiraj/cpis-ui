<template>
  <div
    ref="ibpsSkeletonCircle"
    :style="{
      'backgroundColor':backColor,
      'width':diameter,
      'height':diameter,
      'border-radius':'50%',
      'margin':margin
    }"
    class="ibps-skeleton-circle"
  />
</template>
<script>
export default {
  name: 'IbpsSkeletonCircle',
  props: {
    backColor: {
      type: String,
      default: '#efefef'
    },
    diameter: {
      type: String,
      default: '50px'
    },
    margin: {
      type: String,
      default: '0 0 0 0'
    }
  }
}
</script>
