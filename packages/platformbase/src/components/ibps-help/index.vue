<template>
  <el-tooltip v-if="type === 'tooltip'" ref="el" :effect="effect" :placement="placement">
    <i class="ibps-help-icon" :class="[icon]" />
    <div slot="content" v-html="showContent" />
  </el-tooltip>
  <el-popover v-else ref="el" :width="width" :title="showTitle" :placement="placement" :trigger="trigger">
    <i slot="reference" class="ibps-help-icon" :class="[icon]" />
    <div v-html="showContent" />
  </el-popover>
</template>
<script>
export default {
  name: 'IbpsHelp',
  props: {
    title: String,
    content: String,
    type: {
      type: String,
      default: 'popover'
    },
    width: {
      type: [Number, String],
      default: 250
    },
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    icon: {
      type: String,
      default: 'ibps-icon-help'
    },
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  computed: {
    showTitle() {
      return this.title || ''
    },
    showContent() {
      return this.content
    }
  },
  beforeDestroy() {
    if (this.$refs.el) {
      this.$refs.el.destroyPopper && this.$refs.el.destroyPopper()
      this.$refs.el.doDestroy && this.$refs.el.doDestroy(true)
      if (this.$refs.el.popperVM) {
        this.$refs.el.popperVM && this.$refs.el.popperVM.$destroy()
        this.$refs.el.popperVM = null
      }
    }
  }
}
</script>
