<template>
  <div class="ibps-skeleton-square-wrap">
    <div
      v-for=" i in count"
      :key="i"
      :style="{
        'backgroundColor':backColor,
        'width':width,
        'height':height,
        'margin':margin
      }"
      class="ibps-skeleton-square"
    />
  </div>
</template>
<script>
export default {
  name: 'IbpsSkeletonSquare',
  props: {
    backColor: {
      type: String,
      default: '#efefef'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '12px'
    },
    margin: {
      type: String,
      default: '0 0 0 0'
    },
    count: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
    }
  }
}
</script>
