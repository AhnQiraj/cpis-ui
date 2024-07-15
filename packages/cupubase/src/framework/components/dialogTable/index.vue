<template>
  <!-- 弹出框 -->
  <el-dialog v-el-drag-dialog :title="title" :append-to-body="true" :modal-append-to-body="modal" close-on-click-modal :visible.sync="visible" width="80%" @close="onClose">
    <div class="dialog-container">
      <div :class="[insideTableProp.showChoosed ? 'dialog-comb' : 'dialog-combTwo']">
        <z-comb ref="combDialog" :toolbar-prop="insideToolbarProp" :key_="key_" :table-prop="insideTableProp" :tree-prop="insideTreeProp" @toolbar-search="onToolbarSearch" @table-selection-change="onDialogTableSelectionChange" @table-selection-one="onDialogTableSelectionOne" @table-selection-all="onDialogTableSelectionAll" @table-page="onPageChange" @table-pagesize="onPagesizeChange" @table-loadDone="onTableLoadDone" @on-reset="OnRest" @tree-click="onTreeClick">
          <!-- 搜索条件 -->
          <template slot="searchBar">
            <slot name="searchBar" />
          </template>
        </z-comb>
      </div>
      <div v-if="insideTableProp.multipleSelect || insideTableProp.mustShow" class="selected">
        <div class="selected-header">
          <span>{{ $t('common.field.selectedAreaDoubleClickDelete') }}</span>
        </div>
        <div class="selected-list">
          <div v-for="(item, index) in tableSeleted" :key="index" @dblclick="onCancelSelection(item, index)">
            <span>{{ item.showValue }}</span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onDialogOk">{{ $t('common.buttons.confirm') }}</el-button>
      <el-button @click="closeDialog">{{ $t('common.buttons.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from '../../directive/el-drag-dialog'
export default {
  name: 'DialogTable',
  directives: { elDragDialog },
  props: {
    title: { type: String, default: '' },
    key_: { type: String, default: 'id' },
    selectionHandle: { type: Function, default: null },
    toolbarProp: {
      type: Object,
      default() {}
    },
    tableProp: {
      type: Object,
      default() {}
    },
    treeProp: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      selectedVal: [], // 已经选择的数据
      visible: false,
      modal: true,
      // 工具栏属性
      insideToolbarProp: Object.assign(
        {
          // 搜索数据
          searchData: [],
          updateEnable: false,
          addEnable: false,
          deleteEnable: false
        },
        this.toolbarProp
      ),
      // 表格属性
      insideTableProp: Object.assign(
        {
          mustShow: false, // 一定要展示右侧已选栏
          showChoosed: false, // 是否展示右侧已选栏
          multipleSelect: true, // 是否可多选
          dataSource: null, // 表格分页查询接口， Promise 对象
          searchBeforeHandle: null, // 搜索前事件，可增加或删除搜索属性
          columns: []
        },
        this.tableProp
      ),
      // 树控件属性
      insideTreeProp: Object.assign({}, this.treeProp),
      tablePageSeleted: [], // 组件选择的
      currentPageIndex: 1,
      defaultTableWidth: '',
      selectTableData: null,
      virtualSelected: [],
      pageDataAll: [], // 本页的所有数据(已选为选都有)
      check: {
        flag: true,
        msg: ''
      }
    }
  },
  // 计算属性
  computed: {
    tableSeleted() {
      return [...this.tablePageSeleted, ...this.virtualSelected]
    }
  },
  methods: {
    /**
     * 初始化数据用于回显
     * @author mbb
     */
    initData(columns) {
      const { selectionHandle, tablePageSeleted, key_, insideTableProp } = this
      if (!insideTableProp.multipleSelect) {
        this.virtualSelected = []
        tablePageSeleted.splice(0, 1)
      }
      for (const col of columns) {
        const showValue = selectionHandle(col.column)
        const keyValue = col.column[key_]
        const index = tablePageSeleted.findIndex(r => r.keyValue === keyValue)
        if (index === -1) {
          tablePageSeleted.push({
            keyValue,
            column: col.column,
            showValue
          })
        }
      }
    },
    open(selected) {
      this.cleanSelect()
      this.visible = true
      if (selected != undefined) {
        this.selectTableData = selected
      }
    },
    /**
     * 重置搜索框
     */
    resetFields() {
      this.$refs.combDialog.resetFields()
    },
    close() {
      /**
       * author: yong.fang
       * time: 2022-06-17
       * des: 点击确定或取消按钮后，清空本次选择的记录，以便于下次进来不默认选中本次的记录
       */
      this.$refs.combDialog.$refs.table.getD2CrudTable().setCurrentRow(null)
      this.visible = false
      this.params = {}
    },
    onClose() {
      this.resetFields()
    },
    /**
     * 清空选择
     */
    cleanSelect() {
      this.tablePageSeleted = []
      this.currentPageIndex = 1
    },
    /**
     * 搜索事件
     */
    onToolbarSearch(searchData) {
      this.$emit('toolbar-search', searchData)
    },
    /**
     * 表格查询
     */
    tableQuery(params = {}) {
      // this.cleanSelect()
      this.$refs.combDialog.tableQuery(params)
    },
    /**
     * 单选:操作单项
     */
    onDialogTableSelectionChange(rows) {
      const { selectionHandle, key_ } = this
      if (rows.length !== 1) {
        return
      }
      let row = rows[0]
      this.virtualSelected = []
      this.tablePageSeleted = []
      const keyValue = row[key_]
      const showValue = selectionHandle(row.column)
      this.tablePageSeleted.push({
        keyValue,
        column: row.column,
        showValue
      })
    },
    /**
     * 多选:操作单项
     * @author mbb
     */
    onDialogTableSelectionOne(columns, row) {
      const { selectionHandle, tablePageSeleted, key_, insideTableProp } = this
      if (!insideTableProp.multipleSelect) {
        this.virtualSelected = []
        tablePageSeleted.splice(0, 1)
      }
      if (!row || !row[key_]) {
        return
      }
      const keyValue = row[key_]
      const index = tablePageSeleted.findIndex(r => r.keyValue === keyValue)
      // 不存在,则新增
      if (index === -1) {
        const showValue = selectionHandle(row)
        tablePageSeleted.push({
          keyValue,
          column: row,
          showValue
        })
      } else {
        // 存在,则删除
        tablePageSeleted.splice(index, 1)
      }
    },
    /**
     * 多选:操作全部
     * @author mbb
     */
    onDialogTableSelectionAll(columns) {
      const { selectionHandle, tablePageSeleted, key_, insideTableProp } = this
      if (!insideTableProp.multipleSelect) {
        this.virtualSelected = []
        tablePageSeleted.splice(0, 1)
      }
      // 清空
      if (columns.length === 0) {
        for (let row of this.pageDataAll) {
          const keyValue = row[key_]
          const index = tablePageSeleted.findIndex(r => r.keyValue === keyValue)
          // 存在,则删除
          if (index !== -1) {
            tablePageSeleted.splice(index, 1)
          }
        }
      } else {
        // 全加
        for (let row of this.pageDataAll) {
          const keyValue = row[key_]
          const index = tablePageSeleted.findIndex(r => r.keyValue === keyValue)
          // 不存在,则增加
          if (index === -1) {
            const showValue = selectionHandle(row)
            tablePageSeleted.push({
              keyValue,
              column: row,
              showValue
            })
          }
        }
      }
    },
    /**
     *
     */
    setTableSelect() {
      const { tablePageSeleted, key_ } = this
      const tabledata = this.$refs.combDialog.getTableData()
      const selectIndex = []
      for (const tps of tablePageSeleted) {
        const tabledataIndex = tabledata.findIndex(r => r[key_] === tps.keyValue)
        if (tabledataIndex >= 0) {
          selectIndex.push(tabledataIndex)
        }
      }
      if (selectIndex.length === 0) {
        return
      }
      // this.$refs.combDialog.toggleSelectionWithIndex(selectIndex)
      /**
       * author: yong.fang
       * time: 2022-06-17
       * des: 以下代码是回显数据， 一个是多选，一个是单选，解决了单选无法回显的问题
       */
      const { insideTableProp } = this
      if (!insideTableProp.multipleSelect) {
        this.$refs.combDialog.toggleNewSelectionWithIndex(selectIndex)
      } else {
        this.$refs.combDialog.toggleSelectionWithIndex(selectIndex)
      }
    },
    /**
     * 删除
     */
    onCancelSelection(item, index) {
      let { tablePageSeleted, key_, virtualSelected, selectTableData } = this
      if (item.isVirtual) {
        virtualSelected.splice(index, 1)
        selectTableData.data.splice(index, 1)
      } else {
        const tabledata = this.$refs.combDialog.getTableData()
        const tabledataIndex = tabledata.findIndex(r => r[key_] === item.keyValue)
        tablePageSeleted.splice(index, 1)
        if (tabledataIndex >= 0) {
          this.$refs.combDialog.toggleSelectionWithIndex([tabledataIndex])
        }
      }
    },
    /**
     * 检查table数据是否有选中
     */
    checkTableDataBind() {
      const { selectTableData } = this
      if (selectTableData == null) {
        return
      }
      const tabledata = this.$refs.combDialog.getTableData()
      if (tabledata) {
        const key = selectTableData.key
        const selecteds = []
        const virtualSelected = []
        let virtualSelectedIndex = 0
        for (let i = selectTableData.data.length - 1, stdIndex = 0; i >= 0; i--, stdIndex++) {
          const sData = selectTableData.data[i]
          const tabledataIndex = tabledata.findIndex(r => r[key] === sData[key])
          if (tabledataIndex === -1) {
            if (sData.text) {
              let columObj = {
                id: sData[key],
                name: sData.text
              }
              virtualSelected.push({
                virtualIndex: virtualSelectedIndex,
                selectTableDataIndex: stdIndex,
                isVirtual: true,
                column: columObj,
                showValue: sData.text
              })
              virtualSelectedIndex++
            }
            continue
          }
          const column = this.$refs.combDialog.getColumnsByIndex(tabledataIndex)
          selecteds.push({
            column,
            index: tabledataIndex
          })
          selectTableData.data.splice(i, 1)
        }
        this.virtualSelected = virtualSelected
        // 数组反转
        if (selecteds.length > 0) {
          selecteds.reverse()
          this.initData(selecteds)
        }
      }
    },
    /**
     * 弹出框点击确认
     */
    onDialogOk() {
      if (!this.check.flag) {
        this.$message.warning(this.check.msg)
        return
      }
      this.$emit('ok', this.tableSeleted)
      this.close()
    },
    closeDialog() {
      this.$emit("onDialogClose", "flag")
      this.close()
    },
    // 分页事件
    onPageChange(pagination) {
      this.currentPageIndex = pagination.currentPage
    },
    onPagesizeChange(pagesize) {
      // this.cleanSelect()
    },
    // 初始化加载该方法，页面首先执行该方法
    onTableLoadDone(res, data) {
      this.pageDataAll = data
      this.$nextTick(() => {
        this.checkTableDataBind()
        this.setTableSelect() // 回显示数据
        this.defaultTableWidth = this.$refs.combDialog.getTableWidth()
      })
    },
    // 点击
    onTreeClick(node) {
      this.$emit('tree-click', node)
    },
    // 重置
    OnRest() {
      this.$emit('on-reset')
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-container {
  display: flex;
  height: 600px;
  width: 100%;
  .dialog-comb {
    max-width: calc(100% - 200px);
    width: calc(100% - 200px);
  }
  .dialog-combTwo {
    max-width: 100%;
    width: 100%;
  }
  .selected {
    min-width: 200px;
    .selected-header {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 40px;
      background-color: rgb(245, 245, 245);
    }
    .selected-list {
      width: 100%;
      div {
        padding: 0 5px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-left: 1px solid rgb(245, 245, 245);
        border-right: 1px solid rgb(245, 245, 245);
        border-bottom: 1px solid rgb(245, 245, 245);
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
}
</style>
