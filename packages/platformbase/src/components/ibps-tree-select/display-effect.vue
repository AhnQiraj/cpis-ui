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
    <span>{{ data[labelKey] }}</span>
  </el-tag>
  <div
    v-else-if="shape === 'icon'"
    class="el-tree-select__icon"
    :style="{width:width?width+'px':null}"
    :class="{
      'is-disabled':readonly
    }"
  >
    <el-tooltip :content="data[labelKey] ">
      <ibps-icon
        :name="showIcon||'book'"
        :color="showColor"
      />
    </el-tooltip>
    <i v-if="!readonly" class=" el-icon-close" @click="handleClose" />
  </div>
  <div
    v-else-if="shape === 'button'"
    class="el-tree-select__button"
  >
    <el-button
      :type="showType"
      :plain="showPlain"
      :round="showRound"
      :circle="showCircle"
      :size="buttonSize"
      :style="showType==='custom'?showStyles:null"
    >
      {{ data[labelKey] }}
      <i v-if="!readonly" class="el-icon-close el-icon--right" @click="handleClose" />
    </el-button>
  </div>
  <div v-else>
    <span>{{ data[labelKey] }}</span>
  </div>
</template>
<script>
const sizeMap = {
  'medium': 'small',
  'small': 'mini',
  'mini': 'smini'
}
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
      default: false
    },
    // 配置数据
    config: Object,
    data: Object,
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    width: [String, Number],
    type: String,
    effect: String,
    icon: String,
    backgroundColor: String,
    color: String,
    // 是否朴素按钮
    plain: Boolean,
    round: Boolean,
    circle: Boolean
  },
  computed: {
    value() {
      return this.data ? this.data[this.valueKey] : null
    },
    configData() {
      return this.$utils.isEmpty(this.config) || this.$utils.isEmpty(this.config[this.value]) ? null : this.config[this.value]
    },
    showStyles() {
      const style = {}
      const backgroundColor = this.showBackgroundColor
      if (backgroundColor) {
        style.backgroundColor = backgroundColor
      }
      const color = this.showColor
      if (color) {
        style.color = color
      }
      const borderColor = this.showBorderColor
      if (borderColor) {
        style.borderColor = borderColor
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
    showColor() {
      return this.getConfig('color', this.color)
    },
    showBackgroundColor() {
      return this.getConfig('backgroundColor', this.backgroundColor)
    },
    showBorderColor() {
      return this.getConfig('borderColor', this.borderColor)
    },
    showPlain() {
      return this.getConfig('plain', this.plain)
    },
    showRound() {
      return this.getConfig('round', this.round)
    },
    showCircle() {
      return this.getConfig('circle', this.circle)
    },
    buttonSize() {
      return sizeMap[this.size] || 'mini'
    }
  },
  methods: {
    getConfig(key, defaultVal) {
      if (this.$utils.isEmpty(this.configData)) {
        return defaultVal
      }
      return this.configData[key] || defaultVal
    },
    handleClose(event) {
      event.stopPropagation()
      this.$emit('close', event)
    }
  }
}
</script>
