import { cloneDeep, debounce, snakeCase, get, set } from 'lodash'
import { on, off } from 'element-ui/lib/utils/dom'
export default {
  props: {
    /**
     * @description 表格数据
     */
    data: {
      type: Array,
      required: true
    },
    height: {
      type: [Number, String]
    },
    defaultSortType: {
      type: [String, Function],
      default: 'underline'
    },
    // 高度自适应
    selfAdaption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /**
       * @description 表格内部数据
       */
      ibpsData: [],
      /**
       *  @description 搜索框是否显示
       */
      showToolbar: true,
      /**
       * @description 表格的高度
       */
      tableHeight: null,
      /**
       * @description 工具栏的高度
       */
      toolbarBoxHeight: 0,
      /**
       * @description 选中的列
       */
      $selections: null,
      /**
       * @description 选中的选项
       */
      selectionRadio: '',
      /**
       * @description 表格是否添加row-key属性
       */
      showRowKey: true
    }
  },
  computed: {
    ibpsDataLength() {
      return this.ibpsData.length
    },
    thatSocpe() {
      return this
    }
  },
  watch: {
    data() {
      this.handleDataChange()
    },
    ibpsData: {
      handler(val) {
        this.$emit('ibps-data-change', val)
      },
      deep: true
    },
    height: {
      handler(val, oldVal) {
        this.handleTableHeight()
      }
    }
  },
  mounted() {
    this.toolbarBoxHeight = this.$refs.toolbarBox ? this.$refs.toolbarBox.offsetHeight : 0
    this.handleDataChange()
    this.handleTableHeight()
    on(document.body, 'resize', this.handleResize)
  },
  beforeDestroy() {
    off(document.body, 'resize', this.handleResize)
    this.ibpsData = null
  },
  methods: {
    /**
     * @description lodash.get
     */
    _get: get,
    /**
     * @description lodash.set
     */
    _set: set,
    /**
     * @description 同步外部表格数据到ibpsData内部
     */
    handleDataChange() {
      if (this.ibpsData !== this.data) {
        this.ibpsData = cloneDeep(this.data)
        // 判断过滤
        if (!this.showRowKey) {
          this.dataRepetitionTips()
          return
        }
        const _data = []
        let _key = this.pkKey
        if (this.$utils.isNotEmpty(this.unique)) {
          _key = this.unique
        }
        if (this.$utils.isNotEmpty(_key) && this.$utils.isNotEmpty(this.ibpsData)) {
          for (let i = 0; i < this.ibpsData.length; i++) {
            const _temp = this.ibpsData[i]
            if (this.$utils.isEmpty(_temp[_key]) || _data.includes(_temp[_key])) {
              this.dataRepetitionTips()
              this.showRowKey = false
              return
            } else {
              _data.push(_temp[_key])
            }
          }
        }
      }
    },
    /**
     * 数据通过唯一值数据重复触发提示
     */
    dataRepetitionTips() {
      const msg = "数据唯一值重复，影响表格渲染，请保证设置的'主键'字段值是唯一的。"
      if (this.$utils.isEmpty(this.unique)) {
        return
      }
      this.$message({
        message: msg,
        type: 'warning'
      })
    },
    /**
     * @description 排序状态
     */
    handleSortChange(params) {
      const { column, prop, order } = params
      let sortBy = column ? column.sortBy : null
      if (!sortBy && prop) {
        // 格式化默认排序字段
        if (typeof this.defaultSortType === 'function') {
          sortBy = this.sortType(params)
        } else {
          if (this.defaultSortType === 'underline') {
            const reg = /^[A-Z0-9_]*$/ // 处理离线表字段是否已经是符合数据库查询属性格式
            if (!reg.test(prop)) {
              const r = /^[a-z0-9_]*$/
              const rs = /_/
              sortBy = r.test(prop) ? (rs.test(prop) ? prop.toUpperCase() : prop.toUpperCase() + '_') : snakeCase(prop).toUpperCase() + '_'
            } else {
              sortBy = prop
            }
          } else {
            sortBy = prop
          }
        }
      }
      this.$emit('sort-change', { column, sortBy, order })
    },
    /**
     * @description 更新行数据
     * @param {Number} index 表格数据索引
     * @param {Object} row 更新的表格行数据
     */
    updateRow(index, row) {
      this.$set(this.ibpsData, index, row)
    },
    /**
     * @description 添加行数据
     * @param {Object} row 添加的表格行数据
     */
    addRow(row) {
      this.$set(this.ibpsData, this.ibpsData.length, row)
    },
    /**
     * @description 删除行
     * @param {Object} index 被删除行索引
     */
    removeRow(index) {
      this.$delete(this.ibpsData, index)
    },
    handleResize() {
      this.handleTableHeight()
    },
    doLayout() {
      if (this.$refs.elTable) {
        this.$refs.elTable.doLayout()
      }
    },
    handleTableHeight(showToolbar) {
      if (this.height) {
        this.tableHeight = this.height
      } else if (this.$refs.ibpsCrud) {
        this.tableHeight = this.$refs.ibpsCrud.clientHeight
      }
      if (this.$refs.ibpsCrudHeader) {
        this.tableHeight -= this.$refs.ibpsCrudHeader.clientHeight
      }
      if (this.$refs.ibpsCrudFooter) {
        this.tableHeight -= this.$refs.ibpsCrudFooter.clientHeight
      }
      if (!this.tableHeight || this.tableHeight <= 0) {
        // 页面加载完成后设置高度
        debounce(this.handleTableHeight, 100)()
      } else {
        if (showToolbar) {
          if (this.showToolbar) {
            this.tableHeight -= this.toolbarBoxHeight
          } else {
            this.tableHeight += this.toolbarBoxHeight
          }
        }
      }
      if (this.$refs.elTable) {
        this.$refs.elTable.doLayout()
      }
    }
  }
}
