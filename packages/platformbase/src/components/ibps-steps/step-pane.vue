<template>
  <div
    v-if="active"
    v-show="active"
    :id="`pane-${paneName}`"
    class="el-step-pane"
    role="steppanel"
    :aria-hidden="!active"
    :aria-labelledby="`step-${paneName}`"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'IbpsStepPane',
  componentName: 'IbpsStepPane',
  props: {
    title: String,
    icon: String,
    description: String,
    status: String,
    disabled: Boolean
  },
  data() {
    return {
      index: null
    }
  },
  computed: {
    active() {
      return parseInt(this.$parent.currentActive) === parseInt(this.index)
    },
    paneName() {
      return this.index
    }
  },
  updated() {
    this.$parent.$emit('step-nav-update')
  }
}
</script>
