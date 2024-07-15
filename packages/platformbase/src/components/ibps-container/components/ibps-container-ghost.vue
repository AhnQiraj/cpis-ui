<template>
  <div class="ibps-container-ghost">
    <div v-if="$slots.header" ref="header" class="ibps-container-ghost__header">
      <slot name="header" />
    </div>
    <div ref="body" class="ibps-container-ghost__body">
      <slot />
    </div>
    <div v-if="$slots.footer" ref="footer" class="ibps-container-ghost__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
import scroll from "./mixins/normal"
export default {
  name: "IbpsContainerGhost",
  mixins: [scroll],
  mounted() {
    // 增加滚动事件监听
    this.addScrollListener()
  },
  beforeDestroy() {
    // 移除滚动事件监听
    this.removeScrollListener()
  }
}
</script>
