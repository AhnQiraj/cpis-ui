<template>
  <z-dialog-table ref="sysRoleDiaTb" :father-method="fatherMethod" :title="sysRoleProp.title"  :toolbar-prop="sysRoleProp.toolbarProp" :table-prop="sysRoleProp.tableProp" :tree-prop="sysRoleProp.treeProp" :selection-handle="sysRoleProp.selectionHandle" @toolbar-search="onSysRoleSearch" @ok="onSysRoleOk"  @onDialogClose="onDialogClose">
  </z-dialog-table>
</template>
<script>
export default {
  name: 'SysRoleDialogSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: true
    },
    fatherMethod: {
      // 父组件传过来的方法 fatherMethod
      type: Function,
      required: false,
      default: function () {}
    },
    conStr: {
      type: String,
      default: ''
    },
    // 已选择,格式:"id,id,id..."
    selectedIds: {
      type: String,
      default: ''
    },
    // 已选择,格式:"name,name,name..."
    selectedNames: {
      type: String,
      default: ''
    },
    // 已选择,格式:"id|name,id|name,id|name..."
    selectedStrs: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sysRoleProp: {
        title: "角色选择",
        selectionHandle: this.sysRoleSelection,
        key: 'SysRoleId',
        toolbarProp: {
          // 搜索数据
          searchData: {
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: true, // 是否可多选
          dataSource: window.apiList['org/role'].queryPageListWithOrg, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('supervision.tspRole.sysRoleName'), key: 'name' },
            { title: this.$t('supervision.tspRole.sysRoleAlias'), key: 'roleAlias' },
            { title: this.$t('supervision.tspRole.subSystemName'), key: 'subSystemName' },
            { title: this.$t('supervision.tspRole.companyName'), key: 'companyName' }
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
    let that = this
  },
  methods: {
    onSysRoleSearch(params) {},
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return {
        current: pagination.pageNo,
        size: pagination.limit
      }
    },
    /**
     * 处理勾选数据展示
     */
    sysRoleSelection(selection) {
      if (selection) {
        return selection.name
      }
      return ''
    },
    /**
     * 弹出表格确定事件
     */
    onSysRoleOk(seleted) {
      this.$emit('onDTableOk', seleted)
    },
    onDialogClose(data) {
      this.$emit('onDialogClose', data)
      this.$refs.sysRoleDiaTb.close()
    },
    init() {
      // eslint-disable-next-line vue/valid-next-tick
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.sysRoleDiaTb.tableQuery({})
        })
      }, 500)
      // 加载弹出框列表数据
      let selected = {
        key: 'id',
        data: []
      }
      this.$refs.sysRoleDiaTb.open(selected)
    }
  }
}
</script>
