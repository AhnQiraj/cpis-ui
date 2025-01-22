<template>
  <z-dialog-table ref="eqTypeDialogTable" :title="eqTypeDialogProp.title" :key_="eqTypeDialogProp.key" :toolbar-prop="eqTypeDialogProp.toolbarProp" :table-prop="eqTypeDialogProp.tableProp" :tree-prop="eqTypeDialogProp.treeProp" :selection-handle="eqTypeDialogProp.selectionHandle" @toolbar-search="onEqTypeDialogSearch" @on-reset="onReset" @ok="onEqTypeDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="key">
        <el-input v-model="eqTypeDialogProp.toolbarProp.searchData.key" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.message.inTyNoOrNa') })" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
export default {
  name: 'EqTypeDialogSelect',
  props: {
    title: {
      type: String,
      default: ''
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
      userInfo: {}, // 当前登录人信息
      selectData: {},
      // 弹出属性
      eqTypeDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'eqTypeId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            key: '',
            isOn: 1,
            companyId: '',
            pathEqTypeId: '',
            path: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onEqTypeDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'eqTypeId',
              show: false
            },
            {
              title: this.$t('equipment.type.typeNo'),
              key: 'eqTypeNo'
            },
            {
              title: this.$t('equipment.type.typeName'),
              key: 'eqTypeName'
            },
            {
              title: this.$t('equipment.type.pType'),
              key: 'parentEqTypeName'
            },
            {
              title: this.$t('common.field.memo'),
              key: 'memo',
              showOverflowTooltip: true
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('equipment.common.eqType'),
          nodeKey: 'key',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.loadNodeTreeData,
          nativeProp: {
            // 'default-expanded-keys': ["775492674567274496"]
          },
          lazyLoad: true, // 使用懒加载
          propMapping: {
            // 根据返回值的映射
            label: 'title',
            isLeaf: 'isLeaf'
            // children: 'son'
          },
          selectData: [] // 存储选中树的数据
        }
      }
    }
  },
  created() {
    // 获得当前人的信息
    this.userInfo = getLoginInfo()
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].eqTypePage(par)
    },
    /**
     * 查询操作
     */
    onEqTypeDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.eqTypeDialogTable.tableQuery(params)
      } else {
        this.$refs.eqTypeDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onEqTypeDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.eqTypeName
    },
    onReset() {
      this.eqTypeDialogProp.toolbarProp.searchData.path = ''
      this.eqTypeDialogProp.toolbarProp.searchData.pathEqTypeId = ''
    },
    /**
     * 弹出表格确定事件
     */
    onEqTypeDialogTableOk(selected) {
      let eqTypeIds = ''
      let eqTypeNames = ''
      for (let index in selected) {
        eqTypeNames += (selected[index]['column']['eqTypeName'] || '') + ','
        eqTypeIds += (selected[index]['column']['eqTypeId'] || '') + ','
      }
      if (eqTypeNames.lastIndexOf(',') !== -1) {
        eqTypeNames = eqTypeNames.substring(0, eqTypeNames.length - 1)
      }
      if (eqTypeIds.lastIndexOf(',') !== -1) {
        eqTypeIds = eqTypeIds.substring(0, eqTypeIds.length - 1)
      }
      this.selectData = {
        ids: eqTypeIds,
        names: eqTypeNames,
        selected: selected
      }
      this.fatherMethod(this.selectData)
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'eqTypeId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ eqTypeId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.eqTypeDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.eqTypeDialogTable.tableQuery(Object.assign(this.eqTypeDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.eqTypeDialogTable.tableQuery(this.eqTypeDialogProp.toolbarProp.searchData)
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
      // 查询列表
      // 表格加载数据初始化
      this.eqTypeDialogProp.toolbarProp.searchData.path = node.data.path // 节点值作为查询条件
      this.eqTypeDialogProp.toolbarProp.searchData.pathEqTypeId = node.key
      this.onEqTypeDialogSearch(this.eqTypeDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        window.apiList['equipment/index'].eqTypeTopTree('').then(res => {
          loadDone()
          let arr = res.data
          let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            exapandKeys[i] = res.data[i].key
          }
          // 默认展开第一个大节点下的树
          this.eqTypeDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        let id = node.data.key
        window.apiList['equipment/index'].eqTypeSubTree(id).then(res => {
          let arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
          }
          resolve(arr)
          loadDone()
        })
      }
    }
    // --------------------树节点相关结束----------------------------
  }
}
</script>
<style scoped></style>
