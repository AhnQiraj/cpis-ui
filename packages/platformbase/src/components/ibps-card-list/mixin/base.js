export default {
  props: {
    /**
     *  尺寸
     */
    size: {
      type: String
    },
    /**
     * @description 工具栏
     */
    toolbars: {
      type: Array
    },
    /**
     * @description 查询表单
     */
    searchForm: {
      type: Object
    },
    /**
     *  @description 表格标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * @description 主键
     */
    pkKey: {
      type: String
    },
    /**
     * @description 表头数据
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * @description 表格加载
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 表格加载配置
     */
    loadingOptions: {
      type: Object,
      default: null
    },
    /**
     * @description 表格配置
     */
    options: {
      type: Object,
      default: () => {
        return {
          border: true,
          stripe: true
        }
      }
    },
    /**
     * @description 索引
     */
    indexRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 多选
     */
    selectionRow: {
      type: [Object, Boolean],
      default: true
    },
    /**
     * @description 类型
     * [可选值] radio/checkbox
     */
    selectionType: {
      type: String,
      default: 'checkbox'
    },
    createText: {
      type: String
    },
    /**
     * @description 标识
     * 标识这个列表
     */
    identity: {
      type: String
    }
  },
  methods: {
    /**
     * @description 处理按钮的事件 【包含增删改查】
     * @param {*} buttonKey
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(action, position, data, index, instance) {
      if (instance && instance.$el && instance.$el.disabled) {
        return
      }
      if (action.emit) {
        this.$emit(action.emit, {
          key: action.key,
          index: index,
          row: data,
          position: position,
          action: action,
          instance: instance })
      }
      const buttonKey = action.key
      let selection = null// 选中数据
      if (position === 'toolbar') { // 工具栏
        selection = this.getSelectedIds()
      } else { // 管理列
        selection = data[this.pkKey || 'id']
      }
      this.$emit('action-event', buttonKey, position, selection, data, instance)
    },
    /**
     * @description 获取选中的值
     */
    getSelectedIds() {
      if (this.selections === null || this.selections === undefined) {
        return
      }
      return this.selections
    }
  }
}
