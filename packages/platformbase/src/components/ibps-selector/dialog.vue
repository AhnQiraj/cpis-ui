<template>
  <el-dialog v-if="dialogVisible" ref="dialog" :title="title" :show-close="showClose" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape" :visible.sync="dialogVisible" :width="width" :top="marginTop" lock-scroll append-to-body custom-class="ibps-selector-dialog" class="ibps-selector-dialog__wrapper" @close="handleClose">
    <slot slot="title" name="title" />
    <div :style="{ height: multiple ? '60px' : '40px' }" class="ibps-selector-header">
      <template v-for="(item, index) in selectedItems">
        <el-tag v-if="$utils.isNotEmpty(item)" :key="item + index" closable @close="handleRemove(index, true)">
          {{ item }}
        </el-tag>
      </template>
    </div>
    <div>
      <slot :multiple="multiple" :height="height" :value="value" />
    </div>
    <div v-if="buttonGroup && buttonGroup.length > 0" slot="footer" :class="'el-dialog--' + placement">
      <ibps-toolbar :actions="buttonGroup" :identity="identity" position="buttom" @action-event="handleActionEvent" />
    </div>
  </el-dialog>
</template>
<script>
import IbpsToolbar from '@platform/components/ibps-toolbar/index.vue'
import ActionUtils from '@platform/utils/action'
export default {
  name: 'IbpsSelectorDialog',
  components: {
    IbpsToolbar
  },
  props: {
    visible: Boolean, // 是否可见
    title: {
      // 标题
      type: String,
      default: '选择器'
    },
    marginTop: {
      // Dialog CSS 中的 margin-top 值
      type: String,
      default: '5vh'
    },
    width: {
      // 宽
      type: String,
      default: '60%'
    },
    height: {
      // 高
      type: String,
      default: '400px'
    },
    closeOnClickModal: {
      // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      // 是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: false
    },
    showClose: {
      // 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    beforeClose: {
      // 关闭前的回调，会暂停 Dialog 的关闭
      type: Function
    },
    fullscreen: {
      // 是否为全屏 Dialog
      type: Boolean,
      default: false
    },
    labelKey: {
      // 展示的值
      type: [String, Function],
      default: 'name'
    },
    value: {
      // 值
      type: [Object, Array],
      default() {
        return this.multiple ? [] : {}
      }
    },
    cleanClose: {
      // 按钮清空并关闭
      type: Boolean,
      default: false
    },
    defaultButton: {
      type: Boolean,
      default: true
    },
    buttons: {
      // 按钮组
      type: Array,
      default() {
        return []
      }
    },
    placement: {
      // 按钮位置
      type: String,
      default: 'center'
    },
    confirmButtonText: {
      type: String
    },
    cleanButtonText: {
      type: String
    },
    cancelButtonText: {
      type: String
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    identity: {
      // 标识
      type: String
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  computed: {
    selectedItems() {
      if (this.$utils.isEmpty(this.value)) {
        return []
      }
      if (this.multiple) {
        const items = []
        this.value.forEach(item => {
          items.push(this.handleLabel(item))
        })
        return items
      } else {
        const value = this.$utils.isArray(this.value) ? this.value[0] : this.value
        return [this.handleLabel(value)]
      }
    },
    bodyStyle() {
      return {
        height: this.height,
        overflow: 'hidden'
      }
    },
    buttonGroup() {
      let buttons = []
      if (this.$utils.isEmpty(this.buttons) && this.defaultButton) {
        buttons = buttons.concat([
          { key: 'confirm', label: this.confirmButtonText || '确定', icon: 'ibps-icon-ok', type: 'primary', action: () => this.handleOk() },
          { key: 'clean', label: this.cleanButtonText || '清空', icon: 'ibps-icon-clean', type: 'info', action: () => this.handleClean() },
          { key: 'cancel', label: this.cancelButtonText || '取消', icon: 'ibps-icon-cancel', action: () => this.handleCancel() }
        ])
      } else {
        buttons = this.buttons
      }
      if (this.$utils.isEmpty(buttons)) {
        return []
      }
      return buttons.map(button => {
        const action = button.action
        if (action) {
          button.action = e => action(() => {}, this, e)
        }
        return button
      })
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleLabel(data) {
      const config = this.labelKey
      if (typeof config === 'function') {
        return config(data)
      } else if (typeof config === 'string') {
        return data[config]
      } else if (typeof config === 'undefined') {
        const dataProp = data['name']
        return dataProp === undefined ? '' : dataProp
      }
    },
    // 确定
    handleOk() {
      const data = this.multiple ? this.value.slice(0) : this.value
      if (this.$utils.isEmpty(data)) {
        ActionUtils.warning('请选择记录！')
        return
      }
      this.$emit('input', data)
      this.$emit('action-event', 'confirm', data)
    },
    // 清空
    handleClean() {
      const data = this.multiple ? [] : {}
      if (!this.cleanClose) {
        this.$emit('input', data)
      }
      this.$emit('action-event', 'clean', data)
    },
    // 取消
    handleCancel() {
      this.handleClose()
      this.$emit('action-event', 'cancel')
    },
    // 关闭窗口
    handleClose() {
      this.$emit('close', false)
    },
    /**
     * 删除
     */
    handleRemove(index, bool) {
      let res
      let removeValue
      if (this.multiple) {
        const selected = JSON.parse(JSON.stringify(this.value))
        selected.splice(index, 1)
        res = selected
        removeValue = this.value[index]
      } else {
        res = {}
        removeValue = res
      }
      this.$emit('input', res)
      this.$emit('remove-select', removeValue)
    },
    /**
     * @description 处理按钮的事件
     * @param {*} button
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(button, position, data, index) {
      if (button.emit) {
        this.$emit(button.emit, {
          key: button.key,
          index: index,
          row: data,
          position: position,
          action: button
        })
      }
      button.action()
    }
  }
}
</script>
