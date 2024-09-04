<template>
  <z-dialog-table ref="locationDialogTable" :title="locationDialogProp.title" :key_="locationDialogProp.key" :toolbar-prop="locationDialogProp.toolbarProp" :table-prop="locationDialogProp.tableProp" :tree-prop="locationDialogProp.treeProp" :selection-handle="locationDialogProp.selectionHandle" @toolbar-search="onLocationDialogSearch" @on-reset="onReset" @ok="onLocationDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('equipment.common.locaNo')" prop="locaNo">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.locaNo" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.locaNo') })" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.locaName')" prop="locaName">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.locaName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.locaName') })" />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox id="isSub" size="medium" style="font-size: 14px; margin-left: 5px; float: right" @change="subChange">{{ $t('equipment.common.onlyShowCurLoca') }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('equipment.common.mainDept')" prop="maintainDeptNo">
        <template>
          <ibps-org-selector v-model="locationDialogProp.toolbarProp.searchData.maintainDeptNo" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.mainDept') })" :multiple="false" />
        </template>
      </el-form-item>
      <!-- <el-form-item :label="$t('equipment.common.manObj')" prop="manageObjName">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.manageObjName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.manObj') })" @focus="manageObjectHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="manageObjectHandleDialog" />
        </el-input>
        <manage-object-dialog-select ref="manageObjectDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.manObj') })" :multiple-select="false" :init-param="initParam" :father-method="onManageObjectTableOk" :selected-ids="locationDialogProp.toolbarProp.searchData.manageObjId" :selected-names="locationDialogProp.toolbarProp.searchData.manageObjName" />
      </el-form-item> -->
      <el-form-item :label="$t('equipment.common.eqType')" prop="eqTypeName">
        <el-input v-model="locationDialogProp.toolbarProp.searchData.eqTypeName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.eqType') })" @focus="eqTypeHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqTypeHandleDialog" />
        </el-input>
        <eq-type-dialog-select ref="eqTypeDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.eqType') })" :multiple-select="false" :init-param="initParam" :father-method="onEqTypeTableOk" :selected-ids="locationDialogProp.toolbarProp.searchData.eqTypeId" :selected-names="locationDialogProp.toolbarProp.searchData.eqTypeName" />
      </el-form-item>
      <el-form-item :label="$t('baseCommon.other.skillNo')" prop="skillNo">
        <el-select v-model="locationDialogProp.toolbarProp.searchData.skillNo" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('baseCommon.other.skillNo') })" filterable clearable>
          <el-option v-for="(item, index) in skillList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
// import ManageObjectDialogSelect from './eqManageObjectDialog.vue'
import EqTypeDialogSelect from './eqTypeDialog.vue'
export default {
  name: 'EqLocationDialogSelect',
  components: {
    // ManageObjectDialogSelect,
    EqTypeDialogSelect
  },
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
      orgList: [], //所有部门列表
      locaAttrList: [], //位置属性列表
      skillList: [], //专业列表
      selectData: {},
      // 弹出属性
      locationDialogProp: {
        title: this.$t('baseCommon.component.locaSelect'),
        selectionHandle: this.selectionHandle,
        key: 'locaId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            locaId: '', //用于仅显示自己
            locaNo: '',
            locaName: '',
            maintainDeptNo: '',
            manageObjId: '',
            manageObjName: '',
            eqTypeId: '',
            eqTypeName: '',
            isOn: 'Y',
            companyId: '',
            path: '',
            pathLocaId: '',
            skillNo: '',
            dataAuth: process.env.VUE_APP_EQLOCATION_DIALOG_DATAAUTH
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onLocationDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'locaId',
              show: false
            },
            {
              title: this.$t('equipment.common.locaNo'),
              key: 'locaNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.locaName'),
              key: 'locaName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.loca.pLoca'),
              key: 'parentLocaName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.mainDept'),
              width: 110,
              key: 'maintainDeptName',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                if (this.$utils.isNotEmpty(cellValue)) {
                  return cellValue
                } else {
                  //获得检修班组名称
                  let obj = this.orgList.find(item => {
                    return item.id === row.maintainDeptNo
                  })
                  return obj != undefined ? obj.name : ''
                }
              }
            },
            {
              title: this.$t('equipment.common.eqType'),
              width: 80,
              key: 'eqTypeName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.locaAttr'),
              width: 80,
              key: 'locationAttrId',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                //获得位置属性名称
                let obj = this.locaAttrList.find(item => {
                  return item.locationAttrId === cellValue
                })
                return obj != undefined ? obj.locationAttrName : ''
              }
            },
            {
              title: this.$t('baseCommon.other.skillNo'),
              width: 80,
              key: 'skillNo',
              showOverflowTooltip: true,
              formatter: (row, column, cellValue, index) => {
                //获得专业名称
                let obj = this.skillList.find(item => {
                  return item.key === cellValue
                })
                return obj != undefined ? obj.name : ''
              }
            }
          ]
        },
        // 树控件属性
        treeProp: {
          title: this.$t('equipment.common.loca'),
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
      },
      showCur: false
    }
  },
  created() {
    // 获得当前人的信息
    this.userInfo = getLoginInfo()
    //获得所有组织列表
    window.apiList['org/org'].findAll().then(res => {
      if (res.state === 200) {
        this.orgList = res.data
      }
    })
    // 专业
    window.apiList['common/index'].getDictByTypeKey({ typeKey: 'zybm' }).then(res => {
      if (res.state === 200) {
        this.skillList = res.data
      }
    })
    // 设备位置属性
    window.apiList['equipment/index'].eqLocationAttrList({}).then(res => {
      if (res.code === 0) {
        this.locaAttrList = res.data
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
      return window.apiList['equipment/index'].eqLocationPage(par)
    },
    /**
     * 查询操作
     */
    onLocationDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.locationDialogTable.tableQuery(params)
      } else {
        this.$refs.locationDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onLocationDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.locaName
    },
    onReset() {
      this.locationDialogProp.toolbarProp.searchData.isOn = 'Y'
      this.locationDialogProp.toolbarProp.searchData.path = ''
      this.locationDialogProp.toolbarProp.searchData.pathLocaId = ''
      this.locationDialogProp.toolbarProp.searchData.locaId = ''
      this.locationDialogProp.toolbarProp.searchData.eqTypeId = ''
      this.locationDialogProp.toolbarProp.searchData.manageObjId = ''
    },
    //仅显示自己
    subChange(value) {
      this.showCur = value
    },
    /**
     * 弹出表格确定事件
     */
    onLocationDialogTableOk(selected) {
      let locaIds = ''
      let locaNos = ''
      let locaNames = ''
      for (let index in selected) {
        locaNames += (selected[index]['column']['locaName'] || '') + ','
        locaNos += (selected[index]['column']['locaNo'] || '') + ','
        locaIds += (selected[index]['column']['locaId'] || '') + ','
      }
      if (locaNames.lastIndexOf(',') !== -1) {
        locaNames = locaNames.substring(0, locaNames.length - 1)
      }
      if (locaNos.lastIndexOf(',') !== -1) {
        locaNos = locaNos.substring(0, locaNos.length - 1)
      }
      if (locaIds.lastIndexOf(',') !== -1) {
        locaIds = locaIds.substring(0, locaIds.length - 1)
      }
      this.selectData = {
        ids: locaIds,
        nos: locaNos,
        names: locaNames,
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
        key: 'locaId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ locaId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.locationDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.locationDialogTable.tableQuery(Object.assign(this.locationDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.locationDialogTable.tableQuery(this.locationDialogProp.toolbarProp.searchData)
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
      if (this.showCur) {
        this.locationDialogProp.toolbarProp.searchData.locaId = node.key
        this.locationDialogProp.toolbarProp.searchData.path = ''
        this.locationDialogProp.toolbarProp.searchData.pathLocaId = ''
      } else {
        this.locationDialogProp.toolbarProp.searchData.locaId = ''
        this.locationDialogProp.toolbarProp.searchData.pathLocaId = node.key //节点值作为查询条件
        this.locationDialogProp.toolbarProp.searchData.path = node.data.path
      }
      this.onLocationDialogSearch(this.locationDialogProp.toolbarProp.searchData)
    },
    // 加载树组件数据(懒加载)
    loadNodeTreeData(node, resolve, loadDone) {
      if (node.level === 0) {
        // 初次加载一个根节点
        window.apiList['equipment/index'].eqLocationTopTree('').then(res => {
          loadDone()
          let arr = res.data
          //let exapandKeys = []
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
            //exapandKeys[i] = res.data[i].key
          }
          // 默认展开第一个大节点下的树
          //this.locationDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
          return resolve(arr)
        })
      }
      if (node.level != 0) {
        let id = node.data.key
        window.apiList['equipment/index'].eqLocationSubTree(id).then(res => {
          let arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            arr[i].isLeaf = res.data[i].data.isLeaf
          }
          resolve(arr)
          loadDone()
        })
      }
    },
    // --------------------树节点相关结束----------------------------
    // --------------------管理对象弹出框 开始----------------------------
    // 打开上级管理对象弹出框
    manageObjectHandleDialog() {
      this.$nextTick(() => {
        this.$refs.manageObjectDialogRef.init()
      })
    },
    // 上级管理对象弹出框确定事件
    onManageObjectTableOk(selectData) {
      if (selectData) {
        this.locationDialogProp.toolbarProp.searchData.manageObjId = selectData.ids
        this.locationDialogProp.toolbarProp.searchData.manageObjName = selectData.names
      }
    },
    // --------------------管理对象弹出框 结束----------------------------
    // --------------------设备类型弹出框 开始----------------------------
    //打开设备类型弹出框
    eqTypeHandleDialog() {
      this.$nextTick(() => {
        this.$refs.eqTypeDialogRef.init()
      })
    },
    //设备类型弹出框确定事件
    onEqTypeTableOk(selectData) {
      if (selectData) {
        this.locationDialogProp.toolbarProp.searchData.eqTypeId = selectData.ids
        this.locationDialogProp.toolbarProp.searchData.eqTypeName = selectData.names
      }
    }
    // --------------------设备类型弹出框 结束----------------------------
  }
}
</script>
<style scoped></style>
