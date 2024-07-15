<template>
  <div class="el-selector" @click="handleFocus">
    <div v-if="selected && selected.length > 0" ref="tags" :style="{ 'max-width': inputWidth + 'px', width: '100%' }" :class="editable ? 'el-selector__tags' : 'el-selector__readonly'">
      <template v-for="(item, index) in selected">
        <el-tag
          v-if="$utils.isNotEmpty(item)"
          :key="item + index"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          disable-transitions
          @close="
            e => {
              deleteTag(e, index)
            }
          "
        >
          <span class="el-selector__tags-text"><ibps-ellipsis :length="textShowlength"> {{ item }}</ibps-ellipsis></span>
        </el-tag>
      </template>
    </div>
    <template v-if="editable">
      <el-input ref="reference" v-model="selectedLabel" :disabled="selectDisabled" :validate-event="false" :size="selectSize" :placeholder="currentPlaceholder" type="text" :class="inputClass" @focus="handleFocus" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false">
        <i v-if="prefixIconClass" slot="prefix" :class="prefixIconClass" />
      </el-input>
    </template>
    <slot />
  </div>
</template>
<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import emitter from 'element-ui/lib/mixins/emitter'
const sizeMap = {
  medium: 36,
  small: 32,
  mini: 28
}
export default {
  name: 'IbpsSelector',
  mixins: [emitter],
  props: {
    items: {
      type: Array
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    disabledIcon: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showPlaceholder: {
      // 是否显示占位符
      type: Boolean,
      default: false
    },
    /**
     * 只读样式 【text original】
     */
    readonlyText: {
      type: String,
      default: 'original'
    },
    inputBorderStyle: {
      type: String
    },
    textShowlength: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      query: '',
      inputLength: 20,
      inputWidth: 0,
      inputHovering: false,
      selected: []
    }
  },
  computed: {
    hasValue() {
      return this.items && this.items.length > 0
    },
    selectedLabel() {
      return this.hasValue ? ' ' : ''
    },
    prefixIconClass() {
      let classes = ['el-selector__caret', 'el-input__icon']
      if ((this.disabled || this.readonly) && !this.disabledIcon) {
        return
      }
      if (this.hasValue) {
        classes = [...classes, this.icon, 'is-show-close']
      } else {
        classes.push(this.icon)
      }
      return classes
    },
    inputClass() {
      let classes = []
      if (this.readonlyText === 'text') {
        classes = ['el-selector__readonly-text']
      }
      if (this.inputBorderStyle) {
        classes = [...classes, 'el-selector__' + this.inputBorderStyle]
      }
      return classes
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled || this.readonly
    },
    selectSize() {
      return this.size || (this.elFormItem || {}).elFormItemSize || (this.$ELEMENT || {}).size
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small'
    },
    editable() {
      if (this.readonly && this.readonlyText !== 'original') {
        return false
      } else {
        return true
      }
    },
    currentPlaceholder() {
      if (!this.showPlaceholder && (this.readonly || this.selectDisabled)) {
        return ''
      }
      if (!this.items || (Array.isArray(this.items) && this.items.length === 0)) {
        return this.placeholder
      } else {
        return ''
      }
    }
  },
  watch: {
    items() {
      this.setSelected()
    }
  },
  mounted() {
    addResizeListener(this.$el, this.handleResize)
    const reference = this.$refs.reference
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleResize)
  },
  methods: {
    setSelected() {
      const result = []
      if (Array.isArray(this.items)) {
        this.items.forEach(item => {
          result.push(item)
        })
      }
      this.selected = result
      if (this.multiple) {
        this.$nextTick(this.resetInputHeight)
      }
    },
    resetInputWidth() {
      if (!this.$refs.reference) {
        return
      }
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },
    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) {
          return
        }
        const inputEl = this.$refs.reference.$refs.input
        const tags = this.$refs.tags
        let height = sizeMap[this.selectSize] || 40
        if (this.selected.length !== 0) {
          height = Math.max(tags.clientHeight + (tags.clientHeight > height ? 6 : 0), height)
        }
        inputEl.style.height = `${height}px`
      })
    },
    handleResize() {
      this.resetInputWidth()
      if (this.multiple) {
        this.resetInputHeight()
      }
    },
    handleFocus() {
      if (this.disabled) {
        return
      }
      this.$refs.reference.blur()
      this.$emit('click')
    },
    deleteTag(e, index) {
      e.preventDefault()
      e.stopPropagation()
      this.$emit('remove', index)
    }
  }
}
</script>
