<template>
  <div
    v-clickoutside="handleClose"
    class="el-tree-select"
    @click="toggleTree"
  >
    <div
      v-if="$utils.isNotEmpty(selected) && ((!(!multiple && (displayEffectType==='default' )) || !editable) || multiple) "
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' , width: '100%' }"
      :class="editable?'el-tree-select__tags':'el-tree-select__readonly'"
    >
      <!-- <transition-group @after-leave="resetInputHeight"> -->
      <template v-if="multiple">
        <display-effect
          v-for="item in selected"
          :key="item[valueKey]"
          :data="item"
          :label-key="displayLabelKey"
          :value-key="valueKey"
          :readonly="selectDisabled"
          :shape="displayEffectShape"
          :effect="displayEffectEffect"
          :config="displayEffectDataMap"
          @close="deleteTag(item)"
        />
      </template>
      <!---单选--->
      <template v-else>
        <display-effect
          :data="selected"
          :label-key="displayLabelKey"
          :value-key="valueKey"
          :readonly="selectDisabled"
          :shape="displayEffectShape"
          :effect="displayEffectEffect"
          :config="displayEffectDataMap"
          :width="inputWidth-32"
          @close="deleteTag(selected)"
        />
      </template>
      <!-- </transition-group> -->
    </div>
    <template v-if="editable">
      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        :disabled="selectDisabled"
        :placeholder="currentPlaceholder"
        :autocomplete="false"
        :style="{ width: inputLength + 'px'}"
        type="text"
        class="el-tree-select__input"
        @focus="handleFocus"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @input="e => handleQueryChange(e.target.value)"
      >
      <el-input
        ref="reference"
        v-model="selectedLabel"
        :disabled="selectDisabled"
        :readonly="selectReadonly"
        :validate-event="false"
        :size="selectSize"
        :class="{ 'is-focus': visible }"
        :placeholder="currentPlaceholder"
        type="text"
        @focus="handleFocus"
        @keyup.native="onInputChange"
        @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false"
      >
        <template v-if="$slots.prefix" slot="prefix">
          <slot name="prefix" />
        </template>
        <i
          slot="suffix"
          :class="suffixIconClass"
          @click="handleIconClick"
        />
      </el-input>
      <transition name="el-zoom-in-top">
        <div
          v-show="visible"
          ref="popper"
          :style="{minWidth: inputWidth + 'px'}"
          class="el-tree-select-dropdown el-popper"
        >
          <el-scrollbar
            wrap-class="el-tree-select-dropdown__wrap"
          >
            <el-tree
              ref="tree"
              :data="data"
              :lazy="lazy"
              :load="load"
              :check-on-click-node="checkOnClickNode"
              :props="treeProps"
              :show-checkbox="showCheckbox"
              :expand-on-click-node="false"
              :check-strictly="checkStrictly"
              :filter-node-method="filterNodeMethod"
              :default-checked-keys="checkedKeys"
              :node-key="nodeKey"
              :empty-text="emptyText"
              :current-node-key="currentNodeKey"
              default-expand-all
              highlight-current
              @check="handleCheck"
              @node-click="handleNodeClick"
            >
              <template #default="scope">
                <span class="el-tree-node__label">
                  <i v-if="icon" :class="icon(scope.data)" /> {{ scope.node.label }}
                </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </transition>
    </template>
  </div>
</template>
<script>
// 参考 https://github.com/ElemeFE/element/blob/29e76cda035bb8a951e6792a33ba4ff5056515a0/packages/tree-select/src/main.vue
// 可能下个版本出现，再进行修复
// API https://deploy-preview-12104--element.netlify.com/#/zh-CN/component/tree-select
// import ElInput from 'element-ui/packages/input'
// import ElTree from 'element-ui/packages/tree/src/tree.vue'
import Clickoutside from 'element-ui/lib/utils/clickoutside'
import Popper from 'element-ui/lib/utils/vue-popper'
import { isEqual } from 'element-ui/lib/utils/util'
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import emitter from 'element-ui/lib/mixins/emitter'
import PopupManager from '@platform/utils/popup'
import DisplayEffect from './display-effect'
// TODO: 等 vue-popper 合并后，这里还需要做出调整
const popperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    visibleArrow: {
      type: Boolean,
      default: true
    }
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
}
const sizeMap = {
  'medium': 36,
  'small': 32,
  'mini': 28
}
export default {
  name: 'IbpsTreeSelect',
  components: {
    DisplayEffect
  },
  directives: { Clickoutside },
  mixins: [popperMixin, emitter],
  provide() {
    return {
      elTreeSelect: this
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    multiple: Boolean,
    disabled: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyText: { // 只读样式 【text ,original】
      type: String,
      default: 'original',
      validator(val) {
        return ['original', 'text'].indexOf(val) > -1
      }
    },
    clearable: Boolean,
    size: {
      type: String,
      validator(val) {
        return ['medium', 'small', 'mini'].indexOf(val) > -1
      }
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    props: Object,
    placeholder: {
      type: String,
      default() {
        return '请选择'
      }
    },
    selectMode: { // 选值模式 leaf、any
      type: String,
      default: 'any',
      validator: function(value) {
        return ['any', 'leaf'].indexOf(value) !== -1
      }
    },
    displayMode: { // 显示模式 path 、name
      type: String,
      default: 'name',
      validator: function(value) {
        return ['name', 'path'].indexOf(value) !== -1
      }
    },
    separator: { // 树形选项分隔符
      type: String,
      default: '/'
    },
    warningText: {
      type: String,
      default: '请选择叶子节点'
    },
    allowSelection: Function, // 允许的节点
    lazy: Boolean,
    load: Function,
    showCheckbox: Boolean,
    checkStrictly: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    emptyText: String,
    showCheckedStrategy: { // 显示多选按钮
      type: String,
      default: 'child',
      validator(val) {
        return ['all', 'parent', 'child'].indexOf(val) > -1
      }
    },
    icon: Function,
    displayEffect: Object,
    dataKey: {
      type: String,
      default: 'typeKey'
    }
  },
  data() {
    return {
      query: '',
      selectedLabel: '',
      inputLength: 0,
      visible: false,
      inputWidth: 0,
      initialInputHeight: 0,
      inputHovering: false,
      treeVisibleOnFocus: false,
      selected: this.multiple ? [] : {},
      checkOnClickNode: false,
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  computed: {
    suffixIconClass() {
      let classes = ['el-tree-select__caret', 'el-input__icon']
      const criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          // !this.multiple &&
          this.value !== undefined &&
          this.value !== null &&
          this.value !== ''
      if (!this.multiple && criteria) {
        classes = [...classes, 'el-icon-circle-close', 'is-show-close']
      } else {
        classes.push('el-icon-arrow-down')
        if (this.visible) {
          classes.push('is-reverse')
        }
      }
      return classes
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    selectSize() {
      return this.size || (this.elFormItem || {}).elFormItemSize || (this.$ELEMENT || {}).size
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small'
    },
    editable() {
      return !this.readonly || (this.readonly && this.readonlyText === 'original')
    },
    selectReadonly() {
      const isIE = !this.$isServer && !isNaN(Number(document.documentMode))
      return this.readonly || !this.filterable || this.multiple || (!isIE && !this.visible)
    },
    checkedKeys() {
      if (this.multiple && this.showCheckbox) {
        return this.value || []
      } else {
        return []
      }
    },
    currentNodeKey() {
      if (this.multiple) {
        return this.value && this.value.length > 0 ? this.value[0].value : ''
      } else {
        if (this.value && Array.isArray(this.value)) {
          return this.value[0] || ''
        } else {
          return this.value || ''
        }
      }
    },
    currentPlaceholder() {
      if (this.$utils.isEmpty(this.value)) {
        return this.placeholder
      } else {
        return ''
      }
    },
    labelKey() {
      return this.treeProps['label'] || 'name'
    },
    displayLabelKey() {
      return this.displayMode === 'name' ? 'label' : 'path'
    },
    // 显示效果类型
    displayEffectType() {
      return this.displayEffect ? 'effect' : 'default'
    },
    displayEffectShape() {
      return this.displayEffectType === 'default' ? 'tag' : this.displayEffect.shape || 'tag'
    },
    displayEffectEffect() {
      return this.displayEffectType === 'default' ? 'light' : this.displayEffect.effect || 'light'
    },
    displayEffectData() {
      return this.displayEffectType === 'default' ? [] : this.displayEffect.data || []
    },
    displayEffectDataMap() {
      const map = {}
      if (this.displayEffectType === 'default') {
        return map
      } else {
        this.displayEffectData.forEach((data) => {
          map[data[this.dataKey]] = data
        })
        return map
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.updatePopper()
        if (this.multiple && this.filterable) {
          this.$refs.input && this.$refs.input.focus()
        }
        this.$emit('focus', this)
        if (!this.multiple && this.filterable) {
          this.broadcast('ElInput', 'inputSelect')
        }
      } else {
        this.destroyPopper()
        this.$refs.input && this.$refs.input.blur()
        this.$emit('blur', this)
        if (!this.multiple) {
          this.setSelected()
        }
        if (this.filterable) {
          setTimeout(() => {
            this.handleQueryChange('')
          }, 100)
        }
      }
    },
    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight()
      }
      this.setSelected()
      if (!isEqual(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },
    data() {
      this.setSelected()
    },
    props: {
      handler(val, oldVal) {
        this.treeProps = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.multiple && this.showCheckbox) {
      this.checkOnClickNode = true
    }
    if (this.editable) {
      this.referenceElm = this.$refs.reference.$el
      this.popperElm = this.$refs.popper
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
      if (this.referenceElm) {
        const input = this.referenceElm.querySelector('input')
        this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize]
      }
      this.setSelected()
      this.fixZIndex()
      addResizeListener(this.$el, this.handleResize)
    }
  },
  beforeDestroy() {
    this.selected = null
    this.treeProps = null
    if (this.editable) {
      removeResizeListener(this.$el, this.handleResize)
    }
  },
  methods: {
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      PopupManager.getZIndex()
    },
    handleFocus(event) {
      this.treeVisibleOnFocus = true
      this.visible = true
      this.$emit('focus', event)
    },
    handleClose() {
      this.visible = false
    },
    toggleTree() {
      if (this.selectDisabled) {return}
      if (this.treeVisibleOnFocus) {
        this.treeVisibleOnFocus = false
      } else {
        this.visible = !this.visible
      }
    },
    handleIconClick(event) {
      if (this.suffixIconClass.indexOf('el-icon-circle-close') > -1) {
        event.stopPropagation()
        this.removeSelected()
      }
    },
    removeSelected() {
      this.visible = false
      this.$emit('input', '')
      this.emitChange('')
      this.$emit('clear')
      this.selected = this.multiple ? [] : {}
      this.selectedLabel = ''
    },
    emitChange(val) {
      if (!isEqual(this.value, val)) {
        this.$emit('change', val, this.getNodeData(val))
      }
    },
    handleQueryChange(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    },
    handleNodeClick(data, node, tree) {
      if (this.showCheckbox) {return}
      if (typeof this.allowSelection === 'function' && !this.allowSelection(data, node, tree)) {
        return false
      }
      if ((this.selectMode === 'leaf' && !node.isLeaf) || (this.selectMode === 'leaf' && node.data.isLeaf === false)) {
        this.$message.warning(this.warningText)
        return false
      }
      this.setSelectedNode(data, node, tree)
    },
    setSelectedNode(data, node, tree) {
      const value = data[this.nodeKey]
      if (this.multiple) {
        const valueCopy = this.value.slice()
        const index = this.getValueIndex(valueCopy, value)
        if (index > -1) {
          valueCopy.splice(index, 1)
        } else {
          valueCopy.push(value)
        }
        this.$refs.input && this.$refs.input.focus()
        this.$emit('input', valueCopy)
        this.emitChange(valueCopy)
      } else {
        this.$emit('input', value)
        this.emitChange(value)
        this.visible = false
      }
    },
    handleCheck(data, info) {
      const { checkedNodes } = info
      let nodes = []
      switch (this.showCheckedStrategy) {
        case 'parent':
          nodes = this.getTreeCheckedParentNodes()
          break
        case 'child':
          nodes = checkedNodes.filter(({ children }) => !(children && children.length))
          break
        default:
          nodes = checkedNodes
          break
      }
      const values = nodes.map((node) => node[this.nodeKey])
      if (this.filterable) {this.$refs.input && this.$refs.input.focus()}
      this.$emit('input', values)
      this.emitChange(values)
    },
    getTreeCheckedParentNodes() {
      const checkedNodes = []
      const traverse = (node) => {
        const childNodes = node.root ? node.root.childNodes : node.childNodes
        childNodes.forEach(child => {
          if (child.checked && !child.isLeaf) {
            checkedNodes.push({
              label: child.data.label,
              [this.valueKey]: child.data[this.valueKey]
            })
          } else {
            traverse(child)
          }
        })
      }
      traverse(this.$refs.tree.store)
      return checkedNodes
    },
    getNodeData(value) {
      let node = null
      if (Array.isArray(this.data)) {
        const traverse = (arr, lablePrefix = []) => {
          for (let i = 0; i < arr.length; i++) {
            const child = arr[i]
            let labelData = child[this.labelKey]
            if (typeof this.labelKey !== 'string') {
              labelData = this.labelKey(child)
            }
            if (child[this.nodeKey] === value) {
              node = {
                label: labelData,
                [this.valueKey]: child[this.nodeKey],
                path: [...lablePrefix, labelData].join(this.separator),
                data: child
              }
              break
            } else if (child.children && child.children.length > 0) {
              traverse(child.children, [...lablePrefix, labelData])
            }
          }
        }
        traverse(this.data)
      }
      return node
    },
    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
        this.handleQueryChange(this.query)
      }
    },
    filterNodeMethod(value, data) {
      if (!value) {return true}
      this.$nextTick(this.updatePopper)
      if (typeof this.filterMethod === 'function') {
        return this.filterMethod(value, data)
      } else {
        if (data[this.labelKey]) {
          return data[this.labelKey].indexOf(value) !== -1
        } else {
          if (data.label) {
            return data.label.indexOf(value) !== -1
          } else {
            return true
          }
        }
      }
    },
    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference || !this.$refs.tags) {return}
        const inputChildNodes = this.$refs.reference.$el.childNodes
        const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
        const tags = this.$refs.tags
        const sizeInMap = this.initialInputHeight || 40
        if (input) {
          input.style.height = this.selected.length === 0
            ? sizeInMap + 'px'
            : Math.max(
              tags ? (tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)) : 0,
              sizeInMap
            ) + 'px'
        }
        if (this.visible) {
          this.updatePopper()
        }
      })
    },
    getValueIndex(arr = [], value) {
      let index = -1
      arr.some((item, i) => {
        if (item === value) {
          index = i
          return true
        } else {
          return false
        }
      })
      return index
    },
    deletePrevTag(e) {
      if (e.target.value.length <= 0) {
        this.selected.splice(-1, 1)
        const values = this.selected.map(({ value }) => value)
        this.$emit('input', values)
        this.emitChange(values)
      }
    },
    deleteTag(item) {
      if (this.multiple) {
        this.selected = this.selected.filter(selectItem => selectItem !== item)
        const values = this.selected.map(({ value }) => value)
        this.$emit('input', values)
        this.emitChange(values)
      } else {
        this.removeSelected()
      }
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference && this.$refs.reference ? this.$refs.reference.$el.getBoundingClientRect().width : 0
    },
    handleResize() {
      this.resetInputWidth()
      if (this.multiple) {this.resetInputHeight()}
    },
    setSelected() {
      if (this.multiple) {
        const result = []
        if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            const node = this.getNodeData(value)
            if (node) {result.push(node)}
          })
        }
        this.selected = result
        if (result.length === 0) {
          this.selectedLabel = ''
        }
        this.$nextTick(this.resetInputHeight)
      } else {
        const node = this.getNodeData(this.value)
        if (node) {
          this.selected = node
          this.selectedLabel = node[this.displayLabelKey]
          if (this.filterable) {this.query = this.selectedLabel}
        } else {
          this.selected = {}
          this.selectedLabel = ''
          if (this.filterable) {this.query = ''}
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '@platform/assets/styles/components/tree-select.scss'
</style>
