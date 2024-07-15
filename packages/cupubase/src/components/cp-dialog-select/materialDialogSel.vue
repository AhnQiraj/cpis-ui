<template>
  <z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @tree-click="onTreeClick" @toolbar-search="onStdWOSearch" @on-reset="reset" @ok="onStdWOOk">
    <template slot="searchBar">
      <el-form-item :label="$t('material.material')">
        <el-input v-model="stdWOProp.toolbarProp.searchData.searchKey" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('material.material') })" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'MaterialDialogSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    /**
     * 初始化条件
     * :initParam="{woTypeNo:'ta_pw'}"
     * 只查询定期工单
     */
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
      stdWOProp: {
        title: this.$t('material.materialBasicData'),
        baseUnitList: [],
        selectionHandle: this.stdWOSelection,
        key: 'itemId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            isOn: '10',
            searchKey: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          // dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          dataSource: window.apiList['material/index'].materialList, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('material.itemNo'),
              key: 'itemNo'
            },
            {
              title: this.$t('material.itemName'),
              key: 'itemName'
            },
            {
              title: this.$t('material.modelNo'),
              key: 'modelNo'
            },
            {
              title: this.$t('material.techParam'),
              key: 'techParam'
            },
            {
              title: this.$t('material.stockQuantity'),
              key: 'stockNum'
            },
            {
              title: this.$t('material.referPruce'),
              key: 'stockPrice'
            },
            {
              title: this.$t('material.baseUnit'),
              key: 'baseUnit',
              formatter: (row, col, val) => {
                this.baseUnitList.forEach(item => {
                  if (item.key == val) {
                    val = item.name
                    return false
                  }
                })
                return val
              }
            },
            {
              title: this.$t('material.itemType'),
              key: 'icName'
            },
            {
              title: this.$t('material.itemGroup'),
              key: 'igName'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('material.itemType'),
          nodeKey: 'icId',
          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: false,
          propMapping: {
            // 根据返回值的映射
            label: 'icName',
            children: 'children'
          }
        }
      }
    }
  },
  mounted() {
    this.getDictByTypeKey()
  },
  methods: {
    /**
     * 默认搜索事件
     */
    // initTableData(params) {
    //   let par = Object.assign(params, this.initParam)
    //   return window.apiList['material/index'].materialList(par)
    // },
    reset() {
      this.stdWOProp.toolbarProp.searchData.searchKey = ''
    },
    getDictByTypeKey() {
      let param = { typeKey: 'jldw' }
      window.apiList['common/index'].getDictByTypeKey(param).then(ret => {
        this.baseUnitList = ret.data
      })
    },
    dialogloadTreeData(node, resolve, loadDone) {
      window.apiList['material/index'].materialClassifyTree().then(res => {
        resolve(res.data.children)
        loadDone()
      })
    },
    onTreeClick(node) {
      const pa = Object.assign(
        {
          isOn: '10',
          icId: node.icId
        },
        this.initParam
      )
      this.$refs.stdWODiaTb.tableQuery(pa)
    },
    selectStdWO() {
      let selected = {
        key: 'itemId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            stdWoId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          const pa = Object.assign(
            {
              isOn: '10'
            },
            this.initParam
          )
          this.$refs.stdWODiaTb.tableQuery(pa)
        }, 600)
      })
    },
    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        searchKey: params.searchKey,
        isOn: '10'
      }
      this.$refs.stdWODiaTb.tableQuery(pa)
    },
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { pageNo: pagination.pageNo, limit: pagination.limit }
    },
    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      // 标准工单
      return selection.itemName
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
<style scoped></style>
