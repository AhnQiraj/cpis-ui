<template>
  <i
    :class="classes"
    :style="styles"
    @click="handleClick"
  />
</template>
<script>
const fontFamily = 'ibps-icon'
export default {
  name: 'IbpsIcon',
  props: {
    name: {
      type: String,
      default: ''
    },
    size: [Number, String],
    color: String,
    fontFamily: {
      type: String,
      default: fontFamily
    },
    custom: {
      type: String,
      default: ''
    },
    colorFilters: Array
  },
  computed: {
    classes() {
      return [
        `${fontFamily}`,
        {
          [`${this.fontFamily}-${this.name}`]: this.name !== '',
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
        if (this.$utils.isNotEmpty(this.colorFilters)) {
          const index = this.colorFilters.findIndex(c => c.type === this.color)
          style.color = this.colorFilters[index].color
        } else {
          style.color = this.color
        }
      }
      return style
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button [class*=ibps-icon-]+span {
  margin-left: 5px;
}
</style>
