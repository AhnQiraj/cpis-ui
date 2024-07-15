export default {
  data() {
    return {
      selectionAll: this.multiple ? [] : {}, // 所有选中的数据包含跨页数据
      selection: this.multiple ? [] : {}, // 当前页选中的数据
      paging: false // 是否正在分页
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectionAll = val
      },
      immediate: true,
      deep: true
    },
    selectionAll: {
      handler(val, oldVal) {
        this.$emit('selected', val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.selectionAll = null
    this.selection = null
  },
  methods: {
    handleSelectionChange(selection) {
      this.selection = selection
      setTimeout(() => {
        this.changePageCoreRecordData()
      }, 10)
    },
    /**
     * 记忆选择核心方法
     */
    changePageCoreRecordData() {
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.$utils.isEmpty(this.selectionAll)) {
        this.selectionAll = JSON.parse(JSON.stringify(this.selection))
        return
      }
      // 标识当前行的唯一键的名称
      const { listData } = this
      // 总选择里面的key集合
      const selectAllIds = this.getSelectAllIds()
      let selectionAll = []
      if (this.multiple) {
        selectionAll = [].concat(this.selectionAll)
      } else {
        selectionAll.push(this.selectionAll)
      }
      // 获取当前页选中的id
      const selectIds = []
      if (this.multiple) {
        this.selection.forEach(row => {
          const pkValue = this.getPkValue(row)
          selectIds.push(pkValue)
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(pkValue) < 0) {
            selectionAll.push(row)
          }
        })
      } else {
        if (this.$utils.isNotEmpty(this.selection)) {
          const pkValue = this.getPkValue(this.selection)
          selectIds.push(pkValue)
          if (selectAllIds.indexOf(pkValue) < 0) {
            selectionAll = []
            selectionAll.push(this.selection)
          }
        } else {
          if (this.$utils.isNotEmpty(this.selectionAll)) {
            const pkValue = this.getPkValue(this.selectionAll)
            selectIds.push(pkValue)
          }
        }
      }
      const noSelectIds = []
      // 得到当前页没有选中的id
      listData.forEach(row => {
        const pkValue = this.getPkValue(row)
        if (selectIds.indexOf(pkValue) < 0) {
          noSelectIds.push(pkValue)
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < selectionAll.length; i++) {
            const pkValue = this.getPkValue(selectionAll[i])
            if (pkValue === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              selectionAll.splice(i, 1)
              break
            }
          }
        }
      })
      if (this.multiple) {
        this.selectionAll = selectionAll
      } else {
        this.selectionAll = selectionAll[0]
      }
    },
    setSelectRow() {
      setTimeout(() => {
        this.setRowSelect()
      }, 10)
    },
    /**
     *  设置选中的方法
     */
    setRowSelect() {
      const tableEl = this.$refs['crud']
      if (!tableEl) {
        return
      }
      // 先清空
      tableEl.clearSelection()
      if (this.$utils.isEmpty(this.selectionAll)) {
        if (!this.multiple) {
          this.selection = {}
        }
        return
      }
      const { listData } = this
      const selectAllIds = this.getSelectAllIds()
      for (let i = 0; i < listData.length; i++) {
        const row = listData[i]
        const pkValue = this.getPkValue(row)
        if (selectAllIds.indexOf(pkValue) >= 0) {
          if (this.multiple) {
            tableEl.toggleSelectionRow(row, true)
          } else {
            tableEl.setSelectionRadio(row)
          }
        }
      }
    },
    /**
     * 获取选择的ID
     */
    getSelectAllIds() {
      const selectAllIds = []
      if (this.multiple) {
        this.selectionAll.forEach(row => {
          const pkValue = this.getPkValue(row)
          selectAllIds.push(pkValue)
        })
      } else {
        const pkValue = this.getPkValue(this.selectionAll)
        selectAllIds.push(pkValue)
      }
      return selectAllIds
    },
    /**
     * 根据key获取对象的值
     * 用于解决key值大小写不同的问题
     * @param {Object} data 需要从中获取值的对象
     * @param {Object} defaultValue 默认值
     */
    getPkValue(data, defaultValue = '') {
      const pkKey = this.pkKey || 'id'
      // 创建一个忽略大小写的正则对象
      const regx = new RegExp(`^${pkKey}$`, 'gi')
      // 循环正则匹配
      for (const key in data) {
        // 匹配成功返回值
        if (regx.test(key)) {
          return data[key]
        }
      }
      return defaultValue
    }
  }
}
