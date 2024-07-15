<template>
  <div class="ibps-layout">
    <div v-if="$slots.west" ref="west" class="ibps-layout_west">
      <slot name="west" />
    </div>
    <div class="ibps-layout__body">
      <slot />
    </div>
    <div v-if="$slots.east" ref="east" class="ibps-layout_east">
      <slot name="east" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'IbpsLayout'
}
</script>
<style lang="scss">
.ibps-layout {
  display: flex;
  .ibps-container-full {
    border: 0 !important;
  }
  .ibps-layout__body {
    flex: 1;
    margin: 0;
  }
}
</style>
