<template>
  <div>
    <z-dialog-table ref="dangerDialogTable" :title="dangerDialogProp.title" :key_="dangerDialogProp.key" :toolbar-prop="dangerDialogProp.toolbarProp" :table-prop="dangerDialogProp.tableProp" :tree-prop="dangerDialogProp.treeProp" :selection-handle="dangerDialogProp.selectionHandle" @toolbar-search="onDangerDialogSearch" @on-reset="onReset" @ok="onDangerDialogTableOk" @tree-click="treeClickNodeHandle">
      <template slot="searchBar">
        <el-form-item :label="$t('ticket.dangerPointExe.riskPoint')" prop="risk">
          <el-input v-model="dangerDialogProp.toolbarProp.searchData.risk" :placeholder="$t('baseCommon.message.pleaseEnter', { title: '' })" clearable />
        </el-form-item>
        <el-form-item :label="$t('ticket.dangerPointExe.riskLevel')" prop="riskLevelNo">
          <el-select v-model="dangerDialogProp.toolbarProp.searchData.riskLevelNo" :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })" filterable clearable>
            <el-option v-for="item in riskLevelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.field.state')" prop="status">
          <el-select v-model="dangerDialogProp.toolbarProp.searchData.status" clearable :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </z-dialog-table>
  </div>
</template>
<script>
export default {
  name: 'DangerSourceSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    initParam: {
      // 初始化查询条件
      type: Object,
      default: null
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    }
  },
  data() {
    return {
      riskLevelList: [],
      stateList: [
        { value: 1, label: this.$t('common.field.start') },
        { value: 0, label: this.$t('common.field.stop') }
      ],
      // 弹出属性
      dangerDialogProp: {
        title: '危险点预控措施',
        selectionHandle: this.selectionHandle,
        key: 'riskControlId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            treeId: '',
            riskLevelNo: '',
            status: '',
            risk: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onDangerDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'riskControlId',
              show: false
            },
            {
              title: this.$t('ticket.dangerPointExe.riskPoint'),
              key: 'risk',
              showOverflowTooltip: true
            },
            {
              title: this.$t('ticket.dangerPointExe.accidentCause'),
              key: 'accidentCause',
              showOverflowTooltip: true
            },
            {
              title: this.$t('ticket.dangerPointExe.controlMeasure'),
              key: 'controlMeasure',
              showOverflowTooltip: true
            },
            {
              title: this.$t('ticket.dangerPointExe.riskLevel'),
              width: 80,
              key: 'riskLevelNo',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                let obj = this.riskLevelList.find(item => {
                  return item.value === cellValue
                })
                return obj != undefined ? obj.label : ''
              }
            },
            {
              title: this.$t('common.field.state'),
              width: 80,
              key: 'status',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                let obj = this.stateList.find(item => {
                  return item.value === cellValue
                })
                return obj != undefined ? obj.label : ''
              }
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('ticket.dangerPointExe.hazard'),
          nodeKey: 'id',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.loadNodeTreeData,
          lazyLoad: false, // 使用懒加载
          propMapping: {
            // 根据返回值的映射
            label: 'label',
            children: 'children'
          }
        }
      }
    }
  },
  created() {
    window.apiList['safety/index'].getRaRiskLevel().then(res => {
      res.data.map(item => {
        this.riskLevelList.push({
          label: item.levelName,
          value: item.riskLevelNo
        })
      })
    })
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['safety/index'].raRiskControlPage(par)
    },
    /**
     * 查询操作
     */
    onDangerDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.dangerDialogTable.tableQuery(params)
      } else {
        this.$refs.dangerDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onDangerDialogPaginationHandle(pagination) {
      return {
        requestPage: pagination
      }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.risk
    },
    onReset() {
      this.dangerDialogProp.toolbarProp.searchData.treeId = 'Y'
      this.dangerDialogProp.toolbarProp.searchData.risk = ''
      this.dangerDialogProp.toolbarProp.searchData.riskLevelNo = ''
      this.dangerDialogProp.toolbarProp.searchData.status = ''
    },
    /**
     * 弹出表格确定事件
     */
    onDangerDialogTableOk(selected) {
      this.$emit('onDTableOk', selected);
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'riskControlId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({riskControlId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i]})
        }
      }
      this.$refs.dangerDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.dangerDialogTable.tableQuery(Object.assign(this.dangerDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.dangerDialogTable.tableQuery(this.dangerDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    },
    // --------------------弹出框相关----------------------------
    // --------------------树节点相关----------------------------
    /**
     * 树节点点击事件处理
     * 返回 对象，用于表单查询条件
     * 返回 null 不进行查询，可自定义一些处理
     */
    treeClickNodeHandle(node) {
      this.dangerDialogProp.toolbarProp.searchData.isRa = node.isRa
      this.dangerDialogProp.toolbarProp.searchData.treeId = node.id
      this.onDangerDialogSearch(this.dangerDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      window.apiList['safety/index'].raHazardsTree().then(res => {
        resolve(res.data.children)
        loadDone()
      })
    },
    // --------------------树节点相关结束----------------------------
  }
}
</script>
<style scoped>
.modelTreeTable .modelSearchTopLeft {
  width: calc(100% - 0px) !important;
}

.modelBody {
  height: 436px;
}

.modelBody .modelHead {
  margin-top: 0px;
  margin-bottom: 11px;
}

.modelTreeTable ::v-deep .el-table th.el-table__cell > .cell {
  white-space: pre !important;
}

.modelTreeTable ::v-deep .el-table .el-table__header .cell {
  line-height: 20px !important;
}

.modelTreeTable ::v-deep .el-table--small td,
.modelBody .modelTableRow .el-table--small th {
  padding: 4px 0 !important;
}

.modelTreeTable ::v-deep .last {
  border-right: 1px solid #e6e6e6 !important;
}

.modelTreeTable ::v-deep .el-table--small th.el-table__cell {
  padding: 0 !important;
}

.modelTreeTable ::v-deep .el-table .el-table__header .cell {
  line-height: 25px !important;
}

.modelBody .modelTableRow ::v-deep .el-table col[name='gutter'] {
  display: table-column !important;
}

.modelBody .modelTableRow ::v-deep .el-table th.gutter {
  display: table-cell !important;
}

.modelBody ::v-deep .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
