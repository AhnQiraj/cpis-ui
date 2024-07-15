import { hasRowActionsPermission } from '@platform/mixins/permission' // 权限判断指令
export default {
  props: {
    /**
     * @description 管理列
     */
    rowHandle: {
      type: Object,
      default: null
    }
  },
  computed: {
    rowHandleDisplayButtonNumber() {
      if (!this.rowHandle) {
        return 2
      }
      return this.rowHandle.buttonNumber || 2
    },
    rowHandleDisplay() {
      return this.rowHandle.effect === 'display'
    },
    rowHandleShowIcon() {
      return this.$utils.toBoolean(this.rowHandle.showIcon, true)
    },
    rowHandleActions() {
      if (!this.rowHandle || !this.rowHandle.actions) {
        return []
      }
      return this.rowHandle.actions
    },
    rowHandleDefaultWidth() {
      if (this.rowHandleDisplay) {
        return this.rowHandleDisplayButtonNumber * (this.rowHandleShowIcon ? 70 : 50) + 50
      } else {
        return this.$i18n.locale === 'en' ? 75 : 50
      }
    }
  },
  methods: {
    getRowActions(row, data) {
      if (!this.rowHandleActions) {
        return []
      }
      const rowActions = []
      for (let i = 0; i < this.rowHandleActions.length; i++) {
        if (this.handleActionHidden(this.rowHandleActions[i].hidden, row, data)) {
          rowActions.push(this.rowHandleActions[i])
        }
      }
      return rowActions
    },
    getRowHandleActions(row, data) {
      const actions = this.getRowActions(row, data)
      return actions.length >= this.rowHandleDisplayButtonNumber ? actions.slice(0, this.rowHandleDisplayButtonNumber) : actions
    },
    getRowHandleMoreActions(row, data) {
      const actions = this.getRowActions(row, data)
      return actions.length >= this.rowHandleDisplayButtonNumber ? actions.slice(this.rowHandleDisplayButtonNumber, actions.length) : null
    },
    hasRowHandleMoreActions(row, data) {
      const rowActions = this.getRowHandleMoreActions(row, data)
      if (!rowActions) {
        return false
      }
      return rowActions.length > 0
    },
    /**
     * 是否有按钮
     * @param {*} row  行的数据
     * @param {*} data
     */
    hasRowHandleActions(row, data) {
      const rowActions = this.getRowActions(row, data)
      if (this.$utils.isEmpty(rowActions)) {
        return false
      }
      return hasRowActionsPermission(rowActions, this.identity)
    },
    /**
     * 处理按钮隐藏，显示
     */
    handleActionHidden(hidden = false, row, data) {
      let isHidden = !hidden
      if (typeof hidden === 'boolean') {
        isHidden = !hidden
      } else if (typeof hidden === 'function') {
        isHidden = !hidden.call(this, row, data)
      }
      return isHidden
    }
  }
}
