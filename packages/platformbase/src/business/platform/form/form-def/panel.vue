<template>
  <div>
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="hasPagination?null:listConfig.toolbars"
      :search-form="searchForm"
      :pk-key="pkKey"
      :columns="columns"
      :pagination="hasPagination?null:pagination"
      :loading="loading"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
  </div>
</template>
<script>
import { queryPageList, findFormJsonByBo, findFormByBoFormType } from '@platform/api/platform/form/formDef'
import ActionUtils from '@platform/utils/action'
import SelectionMixin from '@platform/components/ibps-selector/mixins/selection'
export default {
  mixins: [SelectionMixin],
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    boCode: String,
    dataType: {
      type: String
    },
    dataRange: { // 数据范围
      type: Array
    },
    formType: { // 表单类型
      type: String
    }
  },
  data() {
    return {
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 100,
          forms: [
            { prop: 'Q^name_^SL', label: '名称', itemWidth: '200' },
            { prop: 'Q^key_^SL', label: '编码', itemWidth: '200' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'key', label: '编码' }
        ]
      },
      pagination: {},
      sorts: {},
      formTypeOptions: [
        { value: 'form', label: '在线表单', type: 'primary' },
        { value: 'detail', label: '详情表单', type: 'success' },
        { value: 'combination', label: '组合表单', type: 'warning' }
      ]
    }
  },
  computed: {
    columns() { // 表格的列
      const columns = JSON.parse(JSON.stringify(this.listConfig.columns))
      if (this.dataType === 'bo' || this.dataType === 'dataRange') {
        const cloumn = { prop: 'formType', label: '表单类型', tags: this.formTypeOptions }
        columns.push(cloumn)
      }
      return columns
    },
    searchForm() {
      if (this.hasPagination) {return null}
      const searchForm = JSON.parse(JSON.stringify(this.listConfig.searchForm))
      if (this.dataRange) {
        const formTypeOptions = this.formTypeOptions.filter((item) => {
          return this.dataRange.includes(item.value)
        })
        searchForm.forms.push({ prop: 'Q^form_type_^S', label: '表单类型', itemWidth: '150', fieldType: 'select', options: formTypeOptions })
      }
      return searchForm
    },
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    },
    hasPagination() {
      return this.dataType === 'bo' || this.$utils.isNotEmpty(this.boCode)
    }
  },
  mounted() {
    this.loadListData()
  },
  beforeDestroy() {
    this.listData = null
    this.listConfig = null
    this.pagination = null
    this.sorts = null
  },
  methods: {
    /**
     * 加载数据(bo+表单类型)
     */
    loadListDataByBoAndFormType() {
      this.loading = true
      const params = {
        boCode: this.boCode,
        formType: this.formType
      }
      findFormByBoFormType(params).then(response => {
        this.loading = false
        this.listData = response.data
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 加载数据
     */
    loadListDataByBo() {
      this.loading = true
      findFormJsonByBo({ boCode: this.boCode }).then(response => {
        this.loading = false
        this.listData = response.data
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 加载数据
     */
    loadListDataByPage() {
      this.loading = true
      queryPageList(this.getFormatParams()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    loadListData() {
      if (this.dataType === 'bo') {
        this.loadListDataByBo()
      } else if (this.dataType === 'boAndFormType') {
        this.loadListDataByBoAndFormType()
      } else {
        this.loadListDataByPage()
      }
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.formType) {
        params[ 'Q^FORM_TYPE_^S'] = this.formType
      }
      if (this.dataRange) {
        const parameters = []
        const value = this.dataRange.join(',')
        parameters.push({
          key: 'Q^FORM_TYPE_^SIN',
          value: value
        })
        const queryColumns = {
          relation: 'AND', // 组合条件类型
          parameters: parameters // 拼接的字段集合
        }
        params['dataRange'] = queryColumns
      }
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.changePageCoreRecordData()
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadListData()
    },
    /**
     * 查询
     */
    search() {
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        default:
          break
      }
    }
  }
}
</script>
