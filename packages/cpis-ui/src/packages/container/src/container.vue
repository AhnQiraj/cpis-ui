<template>
  <div class="cpis-container flex flex-col gap-10 bg-white p-4">
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'CpisContainer'
}
</script>

<style lang="scss">
.cpis-container {
  .el-button + .el-button,
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 8px;
  }
}
</style>
