<!--岗位选择框-->
<template>
  <z-dialog-table ref="dialogTable" :father-method="fatherMethod" :title="dialogProp.title" :toolbar-prop="dialogProp.toolbarProp" :table-prop="dialogProp.tableProp" :tree-prop="dialogProp.treeProp" :selection-handle="dialogProp.selectionHandle" @toolbar-search="onSearch" @ok="onDialogTableOk" @onDialogClose="onDialogClose">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.positionName')" prop="name_">
        <el-input v-model="dialogProp.toolbarProp.searchData.name_" clearable :placeholder="$t('baseCommon.message.pleaseEnter', { title: '' })" />
      </el-form-item>
      <el-form-item :label="$t('common.field.positionAlias')" prop="pos_alias_">
        <el-input v-model="dialogProp.toolbarProp.searchData.pos_alias_" clearable :placeholder="$t('baseCommon.message.pleaseEnter', { title: '' })" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'PositionDialogSelect',
  props: {
    title: {
      type: String,
      default() {
        return this.$t('baseCommon.component.positonSelect')
      }
    },
    fatherMethod: {
      // 父组件传过来的方法 fatherMethod
      type: Function,
      required: false,
      default: function () {}
    },
    multipleSelect: {
      type: Boolean,
      default: true
    },
    conStr: {
      type: String,
      default: ''
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
      selectData: {},
      // 弹出属性
      dialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'id',
        toolbarProp: {
          // 搜索数据
          searchData: {
            name_: '',
            pos_alias_: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: window.apiList['org/position'].queryPageList, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('common.field.positionName'), key: 'name' },
            { title: this.$t('common.field.positionAlias'), key: 'posAlias' }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },
  methods: {
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'id',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ id: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      if (val !== '' && val != null) {
        this.conStr = val
      }
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.conStr !== null && this.conStr.length > 0) {
            this.$refs.dialogTable.tableQuery({
              parameters: [
                {
                  key: 'Q^ORG_ID_^SL',
                  value: this.conStr
                }
              ]
            })
          } else {
            this.$refs.dialogTable.tableQuery()
          }
        }, 500)
      })
      this.$refs.dialogTable.open(selected)
    },
    /**
     * 查询操作
     */
    onSearch(params) {
      // 加载列表数据
      let searchObj = {
        parameters: [
          { key: 'Q^NAME_^SL', value: params.name_ },
          { key: 'Q^POS_ALIAS_^SL', value: params.pos_alias_ },
          { key: 'Q^ORG_ID_^SL', value: params.org_id_ }
        ]
      }
      if (this.conStr !== null && this.conStr !== '') {
        searchObj = {
          parameters: [
            { key: 'Q^NAME_^SL', value: params.name_ },
            { key: 'Q^POS_ALIAS_^SL', value: params.pos_alias_ },
            { key: 'Q^ORG_ID_^SL', value: this.conStr }
          ]
        }
      }
      this.$refs.dialogTable.tableQuery(searchObj)
    },
    /**
     * 返回分页条件
     */
    dialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.name
    },
    /**
     * 弹出表格确定事件
     */
    onDialogTableOk(seleted) {
      this.$refs.dialogTable.close()
      this.$emit('onDTableOk', seleted)
    },
    onDialogClose(data) {
      this.$emit('onDialogClose', data)
    }
  }
}
</script>
<style scoped>
::v-deep .dialog-container {
  overflow: hidden;
}
</style>
