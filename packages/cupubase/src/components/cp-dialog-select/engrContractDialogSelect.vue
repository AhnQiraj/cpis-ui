<template>
  <!-- 合同选择器 -->
  <z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @on-reset="reset" @ok="onStdWOOk">
    <template slot="searchBar">
      <el-form-item label="关键字">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" :placeholder="$t('common.field.pleaseEnter', { title: '' })"></el-input>
      </el-form-item>
      <el-form-item label="合同类别">
        <el-select v-model="stdWOProp.toolbarProp.searchData.conType" :placeholder="$t('common.field.pleaseSelect', { title: '' })" clearable>
          <el-option v-for="(item, index) of conTypeList" :key="index" :value="item.key" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'EngrContractDialogSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    initParam: {
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
      conTypeList: [],
      stdWOProp: {
        title: '选择合同',
        selectionHandle: this.stdWOSelection,
        key: 'conId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            searchKey: '',
            conType: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: window.apiList['engineering/index'].getContractPage, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: '合同编号',
              key: 'conNo',
              showOverflowTooltip: true
            },
            {
              title: '合同名称',
              key: 'conName',
              showOverflowTooltip: true
            },
            {
              title: '合同类别',
              key: 'conType',
              width: 120,
              formatter: (row, column, cellValue) => {
                let val = cellValue
                this.conTypeList.forEach(item => {
                  if (item.key == cellValue) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: '供应商',
              key: 'suppName',
              showOverflowTooltip: true
            },
            {
              title: '签订日期',
              key: 'conDate',
              width: 150
            },
            {
              title: '合同总价(万元)',
              key: 'taxSum',
              width: 150
            },
            {
              title: '税率',
              key: 'rate',
              width: 150
            },
            {
              title: '交货日期',
              key: 'deliveryDate',
              width: 150
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },
  mounted() {
    let param = { typeKey: 'cghtlx' }
    window.apiList['common/index'].getDictByTypeKey(param).then(ret => {
      this.conTypeList = ret.data
    })
  },
  methods: {
    selectStdWO() {
      let selected = {
        key: 'conId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            conId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = Object.assign({}, this.initParam)
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },
    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = ''
      this.stdWOProp.toolbarProp.searchData.conType = ''
    },
    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        conType: params.conType
      }
      this.$refs.stdWODiaTb.tableQuery(pa)
    },
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { current: pagination.pageNo, size: pagination.limit }
    },
    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      console.log('selection', selection)
      return selection.conName
    },
    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      this.$emit('onDTableOk', seleted)
    },
    init() {
      this.selectStdWO()
    }
  }
}
</script>
