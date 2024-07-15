<template>
  <ibps-layout ref="layout" style="width: 99%">
    <div v-if="showTree" slot="west" :style="{ width: width + 'px' }" class="ibps-employee-selector-tree">
      <div ref="searchForm" class="ibps-tree-search-form">
        <el-select v-model="partyType" :disabled="currentOrgIdValue === '' ? false : $store.getters.isSuper ? false : !isUseScope" placeholder="请选择" @change="changePartyType">
          <el-option v-for="option in partyTypeOptions" :key="option.value" :value="option.value" :label="option.label" />
        </el-select>
        <!-- <el-checkbox v-model="inclueChild" :disabled="partyType==='role'||partyType==='group'" style="margin:5px 0 0 5px;">包含子项</el-checkbox> -->
        <!-- 重置 -->
      </div>
      <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
        <ibps-toolbar :actions="toolbars" type="icon" @action-event="handleTreeAction" />
      </div>
      <div :style="{ height: tableHeight - 105 + 'px' }">
        <el-scrollbar style="height: 100%; width: 100%" wrap-class="ibps-tree-wrapper ibps-scrollbar-wrapper">
          <el-tree v-if="!isUseScope || !hiddenTree" ref="elTree" v-loading="loadingTree" :data="treeData" :expand-on-click-node="false" :props="{ children: 'children', label: 'name', isLeaf: 'leaf' }" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="defaultExpandAll" :load="lazyTree ? (partyType === 'org' && partyTypeId === '3' ? loadOrgTreeNode3 : partyType === 'position' ? (partyTypeId === '3' ? loadPosTreeNode3 : loadPosTreeNode) : loadOrgTreeNode) : null" :lazy="lazyTree" node-key="id" pid-key="parentId" highlight-current @node-click="handleNodeClick" />
        </el-scrollbar>
      </div>
    </div>
    <ibps-crud ref="crud" :height="tableHeight" :data="listData" :toolbars="listConfig.toolbars" :search-form="listConfig.searchForm" :pk-key="pkKey" :columns="listConfig.columns" :pagination="pagination" :loading="loading" :selection-type="multiple ? 'checkbox' : 'radio'" @selection-change="handleSelectionChange" @action-event="handleAction" @sort-change="handleSortChange" @pagination-change="handlePaginationChange" />
    <more-search :title="title" :visible="dialogFormVisible" class-name="org-panel-more-search-dialog" @callback="search" @close="visible => (dialogFormVisible = visible)" @action-event="handleMoreSearchAction" />
  </ibps-layout>
</template>
<script>
import { partyTypeOptions, statusOptions, genderOptions } from './constants'
import selectorScope from './mixins/selectorScope'
import panelTree from './mixins/panelTree'
import { query } from '@platform/api/platform/org/user'
import { queryWoutOrg, queryPageList, queryWithOrg4Position } from '@platform/api/platform/org/employee'
import ActionUtils from '@platform/utils/action'
import TreeUtils from '@platform/utils/tree'
import MoreSearch from './more-search'
import SelectionMixin from '@platform/components/ibps-selector/mixins/selection'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
export default {
  components: {
    MoreSearch
  },
  mixins: [SelectionMixin, selectorScope, panelTree],
  props: {
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    value: [Object, Array],
    multiple: Boolean,
    seetingSearchPartyType: String, // 设置查询用户类型
    height: {
      type: String,
      default: '400px'
    },
    partyTypeId: {
      // 类型节点ID
      type: [String, Number],
      default: ''
    },
    pkKey: {
      type: String,
      default: 'id'
    },
    partyTypeScope: String,
    currentOrgId: {
      // 当前用户组ID
      type: [String, Number],
      default: ''
    },
    // 外部用户id，上下级使用
    externalUseId: [String, Number],
    script: String,
    customPartyTypeOptions: {
      type: [Object, Array],
      default: () => {}
    },
    showTree: {
      // 是否显示左树
      type: Boolean,
      default: true
    },
    isSuperInitTree: {
      // 是否为超管初始化树类型数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      width: 200,
      dialogFormVisible: false, // 弹窗
      editId: '',
      title: '更多查询条件',
      partyTypeOptions: this.$utils.isNotEmpty(this.customPartyTypeOptions) ? this.customPartyTypeOptions : partyTypeOptions,
      statusOptions: statusOptions,
      genderOptions: genderOptions,
      partyType: this.$utils.isNotEmpty(this.customPartyTypeOptions) ? this.customPartyTypeOptions[0].value : 'org',
      // inclueChild: true,
      partyId: '',
      treeDatas: [],
      // 树配置
      loadingTree: false,
      treeData: [],
      toolbars: [
        {
          key: 'refresh'
        },
        {
          key: 'expand'
        },
        {
          key: 'compress'
        }
      ],
      // 列表配置
      loading: false,
      listData: [],
      loazTreeData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
          // { key: 'moreSearch' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 50,
          forms: [
            { prop: 'Q^FULL_NAME_^SL', label: '姓名', itemWidth: '200' },
            { prop: 'Q^ACCOUNT_^SL', label: '账号', itemWidth: '200' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名', width: 150 },
          { prop: 'account', label: '账号', width: 150 }
        ]
      },
      pagination: {},
      sorts: {},
      moreSearchParams: {},
      lazyTree: true,
      defaultExpandedKeys: ['0'],
      defaultExpandAll: false,
      lazyOrgTree: true,
      partyTypeIdValue: '',
      currentOrgIdValue: '',
      scriptValue: '',
      scriptExecuteTime: false, // 脚本函数是否只执行一次
      hiddenTree: false, // 由于树形懒加载load函数的变换，需要重现渲染tree，load才能生效
      responseDynamic: {} // 动态脚本,
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h)
    },
    changeParams() {
      const { partyTypeId, currentOrgId, isUseScope, script, partyTypeScope } = this
      return {
        partyTypeId,
        currentOrgId,
        isUseScope,
        script,
        partyTypeScope
      }
    }
  },
  watch: {
    options: {
      handler: function (val) {
        this.extraOptions = val || {}
      },
      immediate: true,
      deep: true
    },
    showTree: {
      handler: function (val, oldVal) {
        this.lazyTree = this.partyType === 'org'
        if (val === false) {
          this.listConfig.searchForm.forms = [
            { prop: 'Q^STATUS_^S', label: '状态', itemWidth: '200', fieldType: 'select', options: statusOptions },
            { prop: 'Q^NAME_^SL', label: '姓名', itemWidth: '200' }
          ]
          this.listConfig.columns = [
            { prop: 'name', label: '姓名' },
            { prop: 'account', label: '账号' },
            { prop: 'gender', label: '性别', tags: genderOptions },
            { prop: 'status', label: '状态', tags: statusOptions },
            { prop: 'createTime', label: '创建时间' }
          ]
        } else {
          this.listConfig.searchForm.forms = [
            { prop: 'Q^NAME_^SL', label: '姓名', itemWidth: '200' },
            { prop: 'Q^ACCOUNT_^SL', label: '账号', itemWidth: '200' }
          ]
          this.listConfig.columns = [
            { prop: 'name', label: '姓名' },
            { prop: 'account', label: '账号' }
          ]
        }
      },
      immediate: true
    },
    changeParams: {
      handler: function (newval, oldval) {
        this.partyTypeIdValue = newval.partyTypeId
        this.currentOrgIdValue = newval.currentOrgId
        this.scriptValue = newval.script
        // 普通模式与选择器范围模式切换调用
        let initDesignatedAType // 机构和岗位懒加载时的特殊处理参数【类型为3时的切换】
        if (oldval === undefined) {
          initDesignatedAType = false
        } else {
          if ((newval.partyTypeScope === 'org' || newval.partyTypeScope === 'position') && newval.partyTypeId === '3') {
            initDesignatedAType = false
          } else {
            initDesignatedAType = true
          }
        }
        newval.isUseScope ? this.loadTreeData(true, initDesignatedAType) : null
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.showTree) {
      if (this.isUseScope) {
        return
      }
      this.loadTreeData(true)
    } else {
      this.loadListData()
    }
  },
  beforeDestroy() {
    this.partyTypeOptions = null
    this.statusOptions = null
    this.genderOptions = null
    this.treeDatas = null
    this.treeData = null
    this.toolbars = null
    this.listData = null
    this.loazTreeData = null
    this.listConfig = null
    this.pagination = null
    this.sorts = null
    this.moreSearchParams = null
    this.defaultExpandedKeys = null
  },
  methods: {
    /**
     * 加载数据
     */
    loadListData() {
      let type = this.partyType
      this.loading = true
      if (this.showTree) {
        if (this.$utils.isNotEmpty(this.partyId) || this.isUseScope) {
          type = this.partyType
        } else if (this.currentOrgIdValue && this.currentOrgIdValue !== '') {
          type = 'org'
        }
        query(type, this.getFormatParams())
          .then(response => {
            this.loading = false
            ActionUtils.handleListData(this, response.data)
            this.setSelectRow()
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.seetingSearchPartyType === 'position') {
        queryWithOrg4Position(this.getFormatParams())
          .then(response => {
            this.loading = false
            ActionUtils.handleListData(this, response.data)
            this.setSelectRow()
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.$utils.isNotEmpty(this.currentOrgIdValue)) {
        queryWoutOrg(this.getFormatParams())
          .then(response => {
            this.loading = false
            ActionUtils.handleListData(this, response.data)
            this.setSelectRow()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        queryPageList(this.getFormatParams())
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
    getScriptData(scriptValue, once = false) {
      if (this.scriptExecuteTime) {
        return
      }
      let dynamicValue = FormUtils.getCalDynamicValue(scriptValue, this.formData)
      dynamicValue.then(response => {
        const data = JSON.parse(response.data)
        this.treeData = TreeUtils.transformToTreeFormat(data.data)
        this.setTree(this.partyType === 'org', this.treeData)
        this.scriptExecuteTime = once
      })
    },
    /**
     * 获取查询条件格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      const key = this.partyType === 'org' ? 'orgId' : this.partyType === 'position' ? 'positionId' : this.partyType === 'role' ? 'roleId' : this.partyType === 'group' ? 'groupId' : ''
      if (this.showTree) {
        if (this.$utils.isNotEmpty(this.partyId) || this.currentOrgIdValue !== '') {
          if (this.partyId !== 0 && this.partyId !== '0') {
            params[key] = this.partyId === '' ? this.currentOrgIdValue : this.partyId
          }
        } else {
          params[key] = this.partyTypeId === '1' || (this.partyTypeId === '5' && this.extraOptions.userid === '1') ? '' : this.partyTypeId
        }
      }
      if (this.partyTypeId === '5') {
        params['type'] = this.partyTypeId
      }
      if (this.seetingSearchPartyType === 'position') {
        params['positionId'] = this.partyTypeId
      }
      if (this.moreSearchParams) {
        Object.assign(params, this.moreSearchParams)
      }
      // if (this.$utils.isNotEmpty(this.currentOrgId)) {
      //   params['orgId'] = this.partyId || this.currentOrgId
      // }
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
        case 'moreSearch': // 更多
          this.handleMoreSearch()
          break
        default:
          break
      }
    },
    /**
     * 处理按钮事件
     */
    handleMoreSearchAction(data) {
      ActionUtils.setFirstPagination(this.pagination)
      this.moreSearchParams = data
      this.loadListData()
    },
    /**
     * 处理更多
     */
    handleMoreSearch() {
      this.dialogFormVisible = true
    },
    changePartyType(value) {
      this.loadingTree = true
      if (this.isUseScope) {
        this.hiddenTree = true
      }
      this.partyType = value
      const ref = this.$refs.elTree
      const { loadPosTreeNode, loadPosTreeNode3, loadOrgTreeNode3, loadOrgTreeNode } = this
      ref.store.load = value === 'position' ? (this.partyTypeId === '3' ? loadPosTreeNode3 : loadPosTreeNode) : value === 'org' ? (this.partyTypeId === '3' ? loadOrgTreeNode3 : loadOrgTreeNode) : null
      // 选择器范围模式函数回调
      this.moreSearchParams = {}
      // 普通模式与选择器范围模式切换调用
      !this.isUseScope ? this.loadTreeData() : null
      this.scriptExecuteTime = false // 初始化脚本类型时的函数调用
      this.$emit('change-party-type', value)
    },
    getChildrenIds(data, list) {
      list.push(data.id)
      const children = data.children
      if (this.$utils.isNotEmpty(children)) {
        for (let i = 0; i < children.length; i++) {
          const element = children[i]
          this.getChildrenIds(element, list)
        }
      }
      return list
    }
  }
}
</script>
<style lang="scss">
$border-color: #e5e6e7;
.org-panel-more-search-dialog {
  .el-dialog__body {
    height: calc(40vh - 120px) !important;
  }
}
.ibps-employee-selector-tree {
  .ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 30px;
    padding: 5px;
  }
  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
}
</style>
