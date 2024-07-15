import Vue from 'vue'
// 列处理
export default {
  props: {
    // 背景颜色
    tableRowFunction: {
      type: Function
    }
  },
  computed: {
    columnMap() {
      const columnMap = {}
      this.columns.forEach(column => {
        columnMap[column.prop] = column
      })
      return columnMap
    },
    displayFieldProps() {
      const columns = []
      this.displayFields.forEach(field => {
        columns.push(field.prop)
      })
      return columns
    },
    tableColumns() {
      if (this.displayField && this.$utils.isNotEmpty(this.displayFields)) {
        const columns = []
        for (let i = 0; i < this.displayFields.length; i++) {
          const field = this.displayFields[i]
          const c = this.columnMap[field.prop]
          if (this.$utils.isEmpty(c)) {
            continue
          }
          const column = JSON.parse(JSON.stringify(c))
          if (field.width) {
            column.width = field.width
          }
          columns.push(column)
        }
        return columns
      } else {
        return this.columns
      }
    }
  },
  methods: {
    /**
     * 是否显示字段
     * @param {*} column
     */
    showColumn(column) {
      if (this.displayField && this.$utils.isNotEmpty(this.displayFields)) {
        return this.displayFieldProps.indexOf(column.prop) > -1
      } else {
        return !this.$utils.toBoolean(column.hidden, false)
      }
    },
    /**
     * 获取标签的值
     * @param {*} options
     * @param {*} val
     */
    getOption(options, val, column = {}) {
      return options.find(x => x[column['valueKey'] || 'value'] === val)
    },
    /**
     * 处理列表
     * @param {*} key
     * @param {*} options
     * @param {*} val
     */
    handleColumnOptions(key, options, val, column = {}) {
      const defaultLabel = column.defaultLabel
      const opt = this.getOption(options, val, column)
      if (!opt) {
        return defaultLabel || val
      }
      if (key === 'type') {
        return opt[column['typeKey'] || 'type'] || 'primary'
      } else if (key === 'label') {
        return opt[column['labelKey'] || 'label'] || defaultLabel || val
      }
      return defaultLabel || val
    },
    handleColumnDataConvert(data, separator = ',') {
      if (this.$utils.isEmpty(data)) {
        return []
      }
      return data.split(separator)
    },
    /**
     * 处理字段链接
     */
    handleColumnLink(column, row) {
      if (!column.linkType) {
        return this.$emit('column-link-click', row, column)
      }
      // default、默认是回调
      // open :打开新的页面
      // dialog、打开指定窗口
      // tab 、打开tab
      switch (column.linkType) {
        case 'tab':
          this.$router.push({
            path: column.link
          })
          break
        case 'open':
          this.$util.open(column.link)
          break
        case 'dialog':
          this.$emit('column-link-click', row, column)
          break
        default:
          this.$emit('column-link-click', row, column)
          break
      }
    },
    handleColumnFilter(filter, value) {
      return Vue.filter(filter)(value)
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.tableRowFunction) {
        return this.tableRowFunction({ row, rowIndex })
      }
    }
  }
}
