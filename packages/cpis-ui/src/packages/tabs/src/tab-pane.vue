<template>
  <div
    class="el-tab-pane cpis-tab-pane"
    v-if="!lazy || loaded || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'CpisTabPane',

  componentName: 'ElTabPane',

  props: {
    label: String,
    labelContent: Function,
    name: String,
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean
  },

  data() {
    return {
      index: null,
      loaded: false
    }
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index)
      if (active) {
        this.loaded = true
      }
      return active
    },
    paneName() {
      return this.name || this.index
    }
  },

  updated() {
    this.$parent.$emit('tab-nav-update')
  }
}
</script>
<style lang="scss">
.el-tab-pane.cpis-tab-pane {
  height: 100%;
}
</style>
