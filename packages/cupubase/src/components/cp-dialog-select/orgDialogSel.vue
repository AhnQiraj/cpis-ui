<!--组织选择框-->
<template>
  <z-dialog-table ref="dialogTable" :father-method="fatherMethod" :title="dialogProp.title" :toolbar-prop="dialogProp.toolbarProp" :table-prop="dialogProp.tableProp" :tree-prop="dialogProp.treeProp" :selection-handle="dialogProp.selectionHandle" @toolbar-search="onSearch" @tree-click="onTreeClick" @ok="onDialogTableOk" @onDialogClose="onDialogClose">
  </z-dialog-table>
</template>
<script>
import * as orgHttp from '@cupu/utils/index'
export default {
  name: 'OrgDialogSelect',
  props: {
    title: {
      type: String,
      default() {
        return this.$t('baseCommon.other.orgSelect')
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
            userName: '',
            deptName: '',
            userNum: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.getEntityList, // 表格分页查询接口， Promise 对象
          paginationHandle: this.dialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('baseCommon.other.org'), key: 'name' }
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
      },
      params: [],
      response: []
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
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.dialogTable.tableQuery({
            parameters: [
              /*{
                "key": "Q^DEPTH_^SL",
                "value": 1
              },*/
              {
                "key": "Q^PARTY_TYPE_^SL",
                "value": "org"
              }
            ]
          })
        }, 500)
      })
      // 加载弹出框列表数据
      let selected = {
        key: 'id',
        data: []
      }
      this.$refs.dialogTable.open(selected)
    },
    /**
     * 查询操作
     */
    onSearch(params) {
      // 加载列表数据
      let searchObj = {
        parameters: [
          {
            "key": "Q^PARENT_ID_^SL",
            "value": params.deptId
          },
          {
            "key": "Q^PARTY_TYPE_^SL",
            "value": "org"
          }
        ]
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
      if (selection) {
        return selection.name
      }
      return ''
    },
    /**
     * 弹出表格确定事件
     */
    onDialogTableOk(seleted) {
      this.fatherMethod(seleted)
      this.$emit('onDTableOk', seleted)
      this.$refs.dialogTable.close()
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
        deptId: node.id
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
            },
            {
              key: 'levelType',
              value: 'org'
            },
            {
              key: 'levelLevel',
              value: '3'
            }
          ]
        }
        window.apiList['common/index'].findEntityAllByCond(_param).then(res => {
          resolve(res.data.dataResult)
          loadDone()
        })
      }
    },
    getEntityList(parmas) {
      this.parmas = Object.assign(parmas, this.dialogProp.toolbarProp.searchData)
      return new Promise((resolve, reject) => {
        window.apiList['org/entity'].getEntity(this.parmas).then(response => {
          this.response = response
          if (this.response.data != null && this.response.data.dataResult.length > 0) {
            let parametersParent = [
              {
                "key": "Q^ID_^L",
                "value": this.response.data.dataResult[0].parentId
              },
              {
                "key": "Q^PARTY_TYPE_^SL",
                "value": "org"
              }
            ]
            this.parmas.parameters = parametersParent
            window.apiList['org/entity'].getEntity(this.parmas).then(resp => {
              if (resp.data != null && resp.data.dataResult.length > 0) {
                let res = resp.data.dataResult
                res.push.apply(res, this.response.data.dataResult);
                this.response.data.dataResult = res
              }
              resolve(this.response)
            })
          } else {
            resolve(this.response)
          }
        })
      })
    }
  }
  // --------------------树节点相关结束----------------------------
}
</script>
<style scoped>
::v-deep .dialog-container {
  overflow: hidden;
}
</style>
