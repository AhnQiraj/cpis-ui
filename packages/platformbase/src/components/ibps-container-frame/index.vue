<template>
  <ibps-container>
    <iframe :src="src" class="ibps-container-frame" frameborder="0" />
  </ibps-container>
</template>
<script>
export default {
  name: "IbpsContainerFrame",
  props: {
    src: {
      type: String,
      required: false,
      default: ""
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
