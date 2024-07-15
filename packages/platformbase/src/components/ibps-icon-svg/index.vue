<template>
  <svg
    :class="classes"
    :style="styles"
    aria-hidden="true"
  >
    <use :xlink:href="icon" />
  </svg>
</template>
<script>
const fontFamily = 'ibps-icon-svg'
const prefixCls = 'ibps'
export default {
  name: 'IbpsIconSvg',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String]
    },
    color: String,
    custom: {
      type: String,
      default: ''
    }
  },
  computed: {
    icon() {
      return `#${prefixCls}-${this.name}`
    },
    classes() {
      return [
        `${fontFamily}`,
        {
          [`${this.custom}`]: this.custom !== ''
        }
      ]
    },
    styles() {
      const style = {}
      if (this.size) {
        style['font-size'] = `${this.size}px`
      }
      if (this.color) {
        style.fill = this.color
      }
      return style
    }
  }
}
</script>
<style scoped>
.ibps-icon-svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
