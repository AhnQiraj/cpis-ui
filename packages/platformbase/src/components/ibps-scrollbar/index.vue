<template>
  <el-scrollbar ref="scrollbar" class="ibps-scrollbar" v-bind="$attrs" v-on="$listeners">
    <slot />
  </el-scrollbar>
</template>
<script>
import { addResizeListener, removeResizeListener } from "element-ui/lib/utils/resize-event"
export default {
  name: "IbpsScrollbar",
  inheritAttrs: false,
  mounted() {
    const scrollbar = this.$refs.scrollbar
    addResizeListener(scrollbar.$el, scrollbar.update)
    this.$once("hook:beforeDestroy", () => {
      removeResizeListener(scrollbar.$el, scrollbar.update)
    })
  }
}
</script>
<style lang="scss">
.ibps-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow: auto;
  }
}
</style>
