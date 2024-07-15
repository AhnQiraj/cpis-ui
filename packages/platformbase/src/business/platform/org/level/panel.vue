<template>
  <ibps-crud ref="crud" :height="tableHeight" :data="listData" :toolbars="listConfig.toolbars" :search-form="listConfig.searchForm" :pk-key="pkKey" :columns="listConfig.columns" :pagination="pagination" :loading="loading" :selection-type="multiple ? 'checkbox' : 'radio'" @selection-change="handleSelectionChange" @action-event="handleAction" @sort-change="handleSortChange" @pagination-change="handlePaginationChange" />
</template>
<script>
import { queryPageList } from '@platform/api/platform/org/level'
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
    levelType: String
  },
  data() {
    return {
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [{ key: 'search' }],
        // 查询条件
        searchForm: {
          labelWidth: 100,
          forms: [
            { prop: 'Q^NAME_^SL', label: '等级名称' },
            { prop: 'Q^GROUP_ALIAS_^SL', label: '等级值' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '等级名称' },
          // { prop: 'type', label: '等级类型' },
          { prop: 'level', label: '等级值' },
          { prop: 'createTime', label: '创建时间' }
        ]
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  created() {
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
     * 加载数据
     */
    loadListData() {
      this.loading = true
      queryPageList(this.getFormatParams())
        .then(response => {
          this.loading = false
          ActionUtils.handleListData(this, response.data)
          this.setSelectRow()
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.levelType)) {
        Object.assign(params, { 'Q^TYPE_^S': this.levelType })
      }
      return ActionUtils.formatParams(params, this.pagination, this.sorts)
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
        case 'search': // 查询
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
