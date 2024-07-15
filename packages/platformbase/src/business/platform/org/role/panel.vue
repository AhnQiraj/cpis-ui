<template>
  <ibps-crud ref="crud" :height="tableHeight" :data="listData" :toolbars="listConfig.toolbars" :search-form="listConfig.searchForm" :pk-key="pkKey" :columns="listConfig.columns" :row-handle="listConfig.rowHandle" :pagination="pagination" :loading="loading" :selection-type="multiple ? 'checkbox' : 'radio'" @selection-change="handleSelectionChange" @action-event="handleAction" @sort-change="handleSortChange" @pagination-change="handlePaginationChange" />
</template>
<script>
import { queryPageList, queryWithGrade, queryRoleScope } from '@platform/api/platform/org/role'
import { findAllSubsystem } from '@platform/api/platform/auth/subsystem'
import ActionUtils from '@platform/utils/action'
import SelectionMixin from '@platform/components/ibps-selector/mixins/selection'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
export default {
  mixins: [SelectionMixin],
  props: {
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    value: [Object, Array],
    partyTypeId: {
      // 类型节点ID
      type: [String, Number],
      default: ''
    },
    currentOrgId: {
      // 用户组ID
      type: [String, Number],
      default: ''
    },
    script: String,
    isUseScope: {
      // 是否启用范围
      type: Boolean,
      default: false
    },
    isAuth: {
      type: Boolean,
      default: false
    },
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    pkKey: {
      type: String,
      default: 'id' // 主键  如果主键不是pk需要传主键
    },
    orgId: [String, Number]
  },
  data() {
    return {
      radio: '',
      loading: false,
      pagination: {},
      sorts: {},
      listData: [],
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
        ],
        searchForm: {
          labelWidth: 90,
          forms: [
            { prop: 'Q^NAME_^SL', label: '角色名', itemWidth: '200' },
            {
              prop: 'Q^SYSTEM_ID_^SL',
              label: '子系统名称',
              fieldType: 'select',
              valueKey: 'id',
              labelKey: 'name',
              resultField: 'data',
              selectFetch: findAllSubsystem,
              itemWidth: '200'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '角色名' },
          { prop: 'roleAlias', label: '角色别名' },
          { prop: 'subSystemName', label: '子系统名称' }
        ]
      }
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  created() {
    this.loadData()
  },
  beforeDestroy() {
    this.pagination = null
    this.sorts = null
    this.listData = null
    this.listConfig = null
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      if (this.isAuth) {
        queryWithGrade(this.getSearcFormData())
          .then(response => {
            this.loading = false
            ActionUtils.handleListData(this, response.data)
            this.setSelectRow()
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.isUseScope) {
        if (this.partyTypeId === 'script') {
          let dynamicValue = FormUtils.getCalDynamicValue(this.script, this.formData)
          dynamicValue
            .then(response => {
              const data = JSON.parse(response.data)
              ActionUtils.handleListData(this, data.data)
              this.setSelectRow()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          queryRoleScope(this.getSearcFormData())
            .then(response => {
              ActionUtils.handleListData(this, response.data)
              this.setSelectRow()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      } else {
        queryPageList(this.getSearcFormData())
          .then(response => {
            this.loading = false
            ActionUtils.handleListData(this, response.data)
            this.setSelectRow()
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.isAuth) {
        const obj = {
          partyType: 'org',
          partyId: this.orgId
        }
        Object.assign(params, obj)
      }
      if (this.isUseScope) {
        const obj = {}
        obj.type = this.partyTypeId
        if (obj.type === '3') {
          obj.partyId = this.currentOrgId
        }
        obj.type === 'script' ? (obj.script = this.script) : null
        Object.assign(params, obj)
      }
      return ActionUtils.formatParams(params, this.pagination, this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.changePageCoreRecordData()
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    /**
     * 查询
     */
    search() {
      this.loadData()
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
