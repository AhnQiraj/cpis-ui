<template>
  <el-tag
    v-if="shape ==='tag'"
    :closable="!readonly"
    :size="size"
    :type="showType"
    :effect="showEffect"
    :style="showStyles"
    disable-transitions
    @close.stop="handleClose"
  >
    <i v-if="$utils.isNotEmpty(icon)" :style="$utils.isNotEmpty(dataValue) ?'padding-right:5px;':''" :class="icon" />
    <span>{{ $utils.isNotEmpty(dataValue)?dataValue:'' }}</span>
  </el-tag>
  <div v-else class="ibps-tag_text">
    <span :style="showStyles">{{ $utils.isNotEmpty(dataValue)?dataValue:'' }}</span>
  </div>
</template>
<script>
export default {
  props: {
    // 展示形式
    shape: {
      type: String,
      default: 'tag'
    },
    // 尺寸
    size: {
      type: String
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: true
    },
    // 配置数据
    config: Object,
    data: [String, Number],
    width: [String, Number],
    typeface: String,
    fontSize: String,
    type: String,
    effect: String,
    icon: String,
    backgroundColor: String,
    color: String
  },
  data() {
    return {
      fontFamily: {
        // default: 'inherit',
        Tahoma: 'Tahoma, Segoe, sans-serif',
        Helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        Verdana: 'Verdana, Geneva, sans-serif',
        Georgia: 'Georgia, "Times New Roman", serif',
        heiti: '"Hiragino Sans GB", STXihei, "Microsoft YaHei", sans-serif',
        kaiti: 'KaiTi, STKaiti, Georgia, "Times New Roman", serif',
        songti: 'Simsun, Georgia, "Times New Roman", serif'
      },
      dataValue: this.data
    }
  },
  computed: {
    showStyles() {
      const style = {}
      if (this.shape === 'tag') {
        if (this.type === 'custom') {
          const backgroundColor = this.showBackgroundColor
          if (backgroundColor) {
            style.backgroundColor = backgroundColor
          } else {
            style.backgroundColor = '#FFFFFF'
          }
          const color = this.showColor
          if (color) {
            style.color = color
          }
          const border = this.border
          if (border) {
            style.border = border
          }
        }
      } else {
        const color = this.showColor
        if (color) {
          style.color = color
        }
      }
      // 共有样式
      const typeface = this.showTypeface
      if (typeface) {
        style.fontFamily = typeface
      }
      const fontSize = this.showFontSize
      if (fontSize) {
        style.fontSize = fontSize
      }
      const bold = this.showBold
      if (bold) {
        style.fontWeight = 'bold'
      }
      return style
    },
    showEffect() {
      return this.getConfig('effect', this.effect)
    },
    showType() {
      return this.getConfig('type', this.type || (this.shape === 'tag' ? 'info' : null))
    },
    showIcon() {
      return this.getConfig('icon', this.icon)
    },
    showBold() {
      if (this.$utils.isEmpty(this.config) || this.$utils.isEmpty(this.config.bold)) {
        return false
      }
      return this.config.bold
    },
    showFontSize() {
      if (this.$utils.isEmpty(this.config) || this.$utils.isEmpty(this.config.fontSize)) {
        return this.fontSize
      }
      if (this.config.fontSize === 'default') {return}
      return this.config.fontSize + 'px'
    },
    showTypeface() {
      if (this.$utils.isEmpty(this.config) || this.$utils.isEmpty(this.config.typeface)) {
        return ''
      }
      return this.fontFamily[this.config.typeface]
    },
    showColor() {
      return this.getConfig('color', this.color)
    },
    showBackgroundColor() {
      return this.getConfig('backgroundColor', this.backgroundColor)
    },
    showBorderColor() {
      return this.getConfig('borderColor', this.borderColor)
    },
    border() {
      if (this.$utils.isEmpty(this.config) || this.$utils.isEmpty(this.config.border)) {return ''}
      if (this.config.border === 'none') {return '0'}
      let _color = ''
      if (this.$utils.isNotEmpty(this.showBorderColor)) {_color = this.showBorderColor}
      return `1px ${this.config.border} ${_color}`
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        this.dataValue = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getConfig(key, defaultVal) {
      if (this.$utils.isEmpty(this.config)) {
        return defaultVal
      }
      return this.config[key] || defaultVal
    },
    handleClose(event) {
      event.stopPropagation()
      this.$emit('close', event)
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-tag_text{
  padding: 10px;
  display: inline-block;
  box-sizing: border-box;
}
</style>
