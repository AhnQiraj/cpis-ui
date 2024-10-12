<!--用户选择框-->
<template>
  <z-dialog-table ref="dialogTable" :father-method="fatherMethod" :title="dialogProp.title" :toolbar-prop="dialogProp.toolbarProp" :table-prop="dialogProp.tableProp" :tree-prop="dialogProp.treeProp" :selection-handle="dialogProp.selectionHandle" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onDialogTableOk" @onDialogClose="onDialogClose">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.name')" prop="name_">
        <el-input v-model="dialogProp.toolbarProp.searchData.name_" clearable />
      </el-form-item>
      <el-form-item :label="$t('common.field.dept')" prop="org_name_">
        <el-input v-model="dialogProp.toolbarProp.searchData.org_name_" clearable />
      </el-form-item>
      <el-form-item :label="$t('common.field.jobNumber')" prop="account_">
        <el-input v-model="dialogProp.toolbarProp.searchData.account_" clearable />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import * as orgHttp from '@cupu/utils/index'
export default {
  name: 'UserDialogSelect',
  props: {
    title: {
      type: String,
      default() {
        return this.$t('baseCommon.component.userSelect')
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
            org_name_: '',
            account_: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: window.apiList['org/employee'].queryUserList, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            //{ title: "人员账号", key: "account", width: "180" },
            { title: this.$t('common.field.userAccount'), key: 'account', width: '180' },
            //{ title: "姓名", key: "name", width: "180" },
            { title: this.$t('common.field.name'), key: 'name', width: '180' },
            //{ title: "部门", key: "orgName" },
            { title: this.$t('common.field.dept'), key: 'orgName' },
            { title: '', key: 'groupID', show: false }
          ]
        },
        // 树控件属性
        treeProp: {
          //title: "组织机构",
          title: this.$t('common.field.organization'),
          nodeKey: 'id',
          nativeProp: { 'default-expanded-keys': [orgHttp.getLoginInfo(this).company.companyId] }, //默认展开第一个节点
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.dialogloadTreeData,
          lazyLoad: true,
          propMapping: {
            // 根据返回值的映射
            label: 'name',
            children: 'son'
          }
        }
      }
    }
  },
  methods: {
    /**
     * 初始化打开
     */
    init(val) {
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
                  key: 'Q^GROUP_ID_^S',
                  value: this.conStr
                }
              ]
            })
          } else {
            this.$refs.dialogTable.tableQuery()
          }
          //this.$refs.dialogTable.selectedVal = val
        }, 500)
      })
      let selected = {
        key: 'id',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            id: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      if (this.selectedStrs != undefined) {
        let size = this.selectedStrs.split(',').length
        for (let i = 0; i < size; i++) {
          let selectedStr = this.selectedStrs.split(',')[i]
          if (selectedStr.indexOf('|') > -1) {
            selected.data.push({
              id: selectedStr.split('|')[0],
              text: selectedStr.split('|')[1]
            })
          }
        }
      }
      this.$refs.dialogTable.open(selected)
    },
    /**
     * 查询操作
     */
    onSearch(params) {
      if (params.org_name_) {
        params.org_name_ = params.org_name_.trim()
      }
      // 加载列表数据
      let searchObj = {
        parameters: [
          { key: 'Q^GROUP_ID_^S', value: params.ID_ },
          { key: 'Q^ORG_NAME_^SL', value: params.org_name_ },
          { key: 'Q^NAME_^SL', value: params.name_ },
          { key: 'Q^ACCOUNT_^SL', value: params.account_ }
        ]
      }
      if (this.conStr !== null && this.conStr !== '') {
        searchObj = {
          parameters: [
            { key: 'Q^GROUP_ID_^S', value: this.conStr },
            { key: 'Q^ORG_NAME_^SL', value: params.org_name_ },
            { key: 'Q^NAME_^SL', value: params.name_ },
            { key: 'Q^ACCOUNT_^SL', value: params.account_ }
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
      this.selectData = {}
      this.Names = ''
      this.Ids = ''
      this.orgIds = ''
      this.orgNames = ''
      for (let index in seleted) {
        this.Names += seleted[index].column.name + ','
        this.Ids += seleted[index].column.id + ','
        this.orgIds += seleted[index].column.groupID + ','
        this.orgNames += seleted[index].column.orgName + ','
      }
      if (this.Names.lastIndexOf(',') !== -1) {
        this.selectData.names = this.Names.substring(0, this.Names.length - 1)
        this.selectData.ids = this.Ids.substring(0, this.Ids.length - 1)
        this.selectData.orgIds = this.orgIds.substring(0, this.orgIds.length - 1)
        this.selectData.orgNames = this.orgNames.substring(0, this.orgNames.length - 1)
      }
      this.fatherMethod(this.selectData)
      this.$refs.dialogTable.close()
      this.$emit('onDTableOk', seleted)
    },
    onDialogClose(data) {
      this.$emit('onDialogClose', data)
    },
    /**
     * 树节点点击事件处理
     * 返回 对象，用于表单查询条件
     * 返回 null 不进行查询，可自定义一些处理
     */
    onTreeClick(node) {
      //this.$refs.dialogTable.tableQuery({ parameters: [{ key: 'orgId', value: node.ID_ }] });
      let params = {
        ID_: node.id
      }
      //传过来条件清空  暂定
      this.conStr = ''
      this.onSearch(params)
    },
    /**
     * 加载树组件数据 (非懒加载)
     */
    dialogloadTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        resolve([
          {
            id: orgHttp.getLoginInfo(this).company.companyId,
            name: orgHttp.getLoginInfo(this).company.companyName
          }
        ])
        loadDone()
      } else {
        const _param = {
          parameters: [
            {
              key: 'orgId',
              value: node.data.id
            },
            {
              key: 'depth',
              value: node.level + 1
            }
          ]
        }
        window.apiList['common/index'].findEntityAllByCond(_param).then(res => {
          resolve(res.data.dataResult)
          loadDone()
        })
      }
    }
    // --------------------树节点相关结束----------------------------
  }
}
</script>
<style scoped>
::v-deep .dialog-container {
  overflow: hidden;
}
</style>
