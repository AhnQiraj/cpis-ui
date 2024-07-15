// 列处理
export default {
  methods: {
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
      const opt = this.getOption(options, val, column)
      if (!opt) {return val}
      if (key === 'type') {
        return opt[column['typeKey'] || 'type'] || 'primary'
      } else if (key === 'label') {
        return opt[column['labelKey'] || 'label'] || val
      }
      return val
    },
    handleColumnDataConvert(data) {
      if (this.$utils.isEmpty(data)) {
        return []
      }
      return data.split(',')
    },
    handleCheck(id) {
      const index = this.selections.indexOf(id)
      if (index === -1) {
        this.selections.push(id)
      } else {
        this.selections.splice(index, 1)
      }
    }
  }
}
