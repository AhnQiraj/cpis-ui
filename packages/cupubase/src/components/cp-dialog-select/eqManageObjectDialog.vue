<template>
  <z-dialog-table ref="manageObjectDialogTable" :title="manageObjectDialogProp.title" :key_="manageObjectDialogProp.key" :toolbar-prop="manageObjectDialogProp.toolbarProp" :table-prop="manageObjectDialogProp.tableProp" :tree-prop="manageObjectDialogProp.treeProp" :selection-handle="manageObjectDialogProp.selectionHandle" @toolbar-search="onManageObjectDialogSearch" @on-reset="onReset" @ok="onManageObjectDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="key">
        <el-input v-model="manageObjectDialogProp.toolbarProp.searchData.key" :placeholder="$t('equipment.message.inObjNoOrNa')" />
      </el-form-item>
      <el-form-item :label="$t('equipment.manObj.objCategory')" prop="objectType">
        <el-select v-model="manageObjectDialogProp.toolbarProp.searchData.objectType" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.manObj.objCategory') })" filterable clearable>
          <el-option v-for="(item, index) in objectTypeList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
export default {
  name: 'EqManageObjectDialogSelect',
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
      objectTypeList: [], //定义数组存储管理对象类别列表
      selectData: {},
      // 弹出属性
      manageObjectDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'manageObjId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            key: '',
            manageObjNo: '',
            manageObjName: '',
            objectType: '',
            isOn: 1,
            companyId: '',
            pathManageObjectId: '',
            path: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onEqManageObjectDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'manageObjId',
              show: false
            },
            {
              title: this.$t('equipment.manObj.manObjNo'),
              key: 'manageObjNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.manObj.manObjName'),
              key: 'manageObjName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.manObj.pManObj'),
              key: 'parentManageObjName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.manObj.objCategory'),
              key: 'objectType',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                let obj = this.objectTypeList.find(item => {
                  return item.key == cellValue
                })
                return obj != undefined ? obj.name : ''
              }
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('equipment.common.manObj'),
          nodeKey: 'key',
          clickNodeHandle: this.treeClickNodeHandle, // 树点击节点处理
          multipleSelect: false,
          treeData: this.loadNodeTreeData,
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
    //获得对象类别列表
    window.apiList['common/index'].getDictByTypeKey({ typeKey: 'gldxlx' }).then(res => {
      if (res.state === 200) {
        this.objectTypeList = res.data
      }
    })
  },
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].eqManageObjectPage(par)
    },
    /**
     * 查询操作
     */
    onManageObjectDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.manageObjectDialogTable.tableQuery(params)
      } else {
        this.$refs.manageObjectDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onEqManageObjectDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.manageObjName
    },
    onReset() {
      this.manageObjectDialogProp.toolbarProp.searchData.isOn = 1
      this.manageObjectDialogProp.toolbarProp.searchData.path = ''
      this.manageObjectDialogProp.toolbarProp.searchData.pathManageObjectId = ''
    },
    /**
     * 弹出表格确定事件
     */
    onManageObjectDialogTableOk(selected) {
      let manageObjIds = ''
      let manageObjNames = ''
      for (let index in selected) {
        manageObjNames += (selected[index]['column']['manageObjName'] || '') + ','
        manageObjIds += (selected[index]['column']['manageObjId'] || '') + ','
      }
      if (manageObjNames.lastIndexOf(',') !== -1) {
        manageObjNames = manageObjNames.substring(0, manageObjNames.length - 1)
      }
      if (manageObjIds.lastIndexOf(',') !== -1) {
        manageObjIds = manageObjIds.substring(0, manageObjIds.length - 1)
      }
      this.selectData = {
        ids: manageObjIds,
        names: manageObjNames,
        selected: selected
      }
      // this.$emit('onDTableOk', selected);
      this.fatherMethod(this.selectData)
      // this.$refs.dialogTable.close();
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'manageObjId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ manageObjId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.manageObjectDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.manageObjectDialogTable.tableQuery(Object.assign(this.manageObjectDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.manageObjectDialogTable.tableQuery(this.manageObjectDialogProp.toolbarProp.searchData)
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
      this.manageObjectDialogProp.toolbarProp.searchData.path = node.data.path // 节点值作为查询条件
      this.manageObjectDialogProp.toolbarProp.searchData.pathManageObjectId = node.key
      this.onManageObjectDialogSearch(this.manageObjectDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        window.apiList['equipment/index'].eqManageObjectTopTree('').then(res => {
          loadDone()
          let arr = res.data
          let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            exapandKeys[i] = res.data[i].key
          }
          // 默认展开第一个大节点下的树
          this.manageObjectDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        let id = node.data.key
        window.apiList['equipment/index'].eqManageObjectSubTree(id).then(res => {
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
