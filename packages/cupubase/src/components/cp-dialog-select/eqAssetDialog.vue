<template>
  <z-dialog-table ref="assetDialogTable" :title="assetDialogProp.title" :key_="assetDialogProp.key" :toolbar-prop="assetDialogProp.toolbarProp" :table-prop="assetDialogProp.tableProp" :tree-prop="assetDialogProp.treeProp" :selection-handle="assetDialogProp.selectionHandle" @toolbar-search="onAssetDialogSearch" @on-reset="onReset" @ok="onAssetDialogTableOk" @tree-click="treeClickNodeHandle">
    <template slot="searchBar">
      <el-form-item :label="$t('equipment.common.assetNo')" prop="assetNo">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.assetNo" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.assetNo') })" clearable />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.assetName')" prop="assetName">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.assetName" :placeholder="$t('baseCommon.message.pleaseEnter', { title: $t('equipment.common.assetName') })" clearable />
      </el-form-item>
      <el-form-item :label="$t('equipment.asset.assetStatus')" prop="isOn">
        <el-select v-model="assetDialogProp.toolbarProp.searchData.isOnArr" multiple :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.asset.assetStatus') })" filterable clearable>
          <el-option v-for="(item, index) in assetStatusList" :key="index" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('equipment.common.assetType')" prop="assetTypeName">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.assetTypeName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.assetType') })" @focus="eqAssetTypeHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqAssetTypeHandleDialog" />
        </el-input>
        <eq-asset-type-dialog-select ref="eqAssetTypeDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.assetType') })" :multiple-select="false" :init-param="initParam" :father-method="onEqAssetTypeTableOk" :selected-ids="assetDialogProp.toolbarProp.searchData.assetTypeId" :selected-names="assetDialogProp.toolbarProp.searchData.assetTypeName" />
      </el-form-item>
      <el-form-item :label="$t('equipment.asset.operaDate')" prop="operateTime">
        <el-date-picker v-model="operateTime" type="daterange" :range-separator="$t('baseCommon.other.to')" :start-placeholder="$t('baseCommon.time.startDate')" :end-placeholder="$t('baseCommon.time.endDate')" value-format="yyyy-MM-dd" @change="handleOperateTime" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.manufacturer')" prop="manufacturerName">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.manufacturerName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.manufacturer') })" @focus="eqEqManufacturerHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqEqManufacturerHandleDialog" />
        </el-input>
        <eq-manufacturer-dialog-select ref="eqManufacturerDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.manufacturer') })" :multiple-select="false" :init-param="initParam" :father-method="onEqManufacturerTableOk" :selected-ids="assetDialogProp.toolbarProp.searchData.manufacturerId" :selected-names="assetDialogProp.toolbarProp.searchData.manufacturerName" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.eqType')" prop="eqTypeName">
        <el-input v-model="assetDialogProp.toolbarProp.searchData.eqTypeName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.eqType') })" @focus="eqTypeHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqTypeHandleDialog" />
        </el-input>
        <EqTypeDialogSelect ref="eqTypeDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.eqType') })" :multiple-select="false" :init-param="initParam" :father-method="onEqTypeTableOk" :selected-ids="assetDialogProp.toolbarProp.searchData.eqTypeId" :selected-names="assetDialogProp.toolbarProp.searchData.eqTypeName" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import eqManufacturerDialogSelect from './eqManufacturerDialog.vue'
import eqAssetTypeDialogSelect from './eqAssetTypeDialog.vue'
export default {
  name: 'EqAssetDialogSelect',
  components: { eqManufacturerDialogSelect, eqAssetTypeDialogSelect },
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
      assetStatusList: [], //设备资产状态列表
      operateTime: [],
      selectData: {},
      // 弹出属性
      assetDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'assetId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            assetNo: '',
            assetName: '',
            eqTypeId: '',
            eqTypeName: '',
            isOnArr: [],
            companyId: '',
            pathLocaId: '',
            operationDateBegin: '',
            operationDateEnd: '',
            manufacturerId: '',
            manufacturerName: '',
            assetTypeId: '',
            assetTypeName: ''
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onAssetDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'assetId',
              show: false
            },
            {
              title: this.$t('equipment.common.assetNo'),
              key: 'assetNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.assetName'),
              key: 'assetName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.locaNo'),
              width: 160,
              key: 'locaNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.assetType'),
              key: 'assetTypeName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.manufacturer'),
              key: 'manufacturerName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.asset.operaDate'),
              key: 'operationDate',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.asset.assetStatus'),
              key: 'isOn',
              formatter: (row, column, cellValue, index) => {
                //获得资产状态名称
                let obj = this.assetStatusList.find(item => {
                  return item.key === row.isOn
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
    // 设备资产状态
    window.apiList['common/index'].getDictByTypeKey({ typeKey: 'sbzczt' }).then(res => {
      if (res.state === 200) {
        this.assetStatusList = res.data
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
      return window.apiList['equipment/index'].getEqAssetTable(par)
    },
    /**
     * 查询操作
     */
    onAssetDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.assetDialogTable.tableQuery(params)
      } else {
        this.$refs.assetDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onAssetDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.assetName
    },
    onReset() {
      this.assetDialogProp.toolbarProp.searchData.pathLocaId = ''
      this.assetDialogProp.toolbarProp.searchData.eqTypeId = ''
      this.assetDialogProp.toolbarProp.searchData.eqTypeName = ''
      this.assetDialogProp.toolbarProp.searchData.isOnArr = []
      this.operateTime = []
      this.assetDialogProp.toolbarProp.searchData.operationDateBegin = null
      this.assetDialogProp.toolbarProp.searchData.operationDateEnd = null
      this.assetDialogProp.toolbarProp.searchData.manufacturerId = ''
      this.assetDialogProp.toolbarProp.searchData.manufacturerName = ''
      this.assetDialogProp.toolbarProp.searchData.assetTypeId = ''
      this.assetDialogProp.toolbarProp.searchData.assetTypeName = ''
    },
    /**
     * 弹出表格确定事件
     */
    onAssetDialogTableOk(selected) {
      let assetIds = ''
      let assetNos = ''
      let assetNames = ''
      for (let index in selected) {
        assetNames += (selected[index]['column']['assetName'] || '') + ','
        assetNos += (selected[index]['column']['assetNo'] || '') + ','
        assetIds += (selected[index]['column']['assetId'] || '') + ','
      }
      if (assetNames.lastIndexOf(',') !== -1) {
        assetNames = assetNames.substring(0, assetNames.length - 1)
      }
      if (assetNos.lastIndexOf(',') !== -1) {
        assetNos = assetNos.substring(0, assetNos.length - 1)
      }
      if (assetIds.lastIndexOf(',') !== -1) {
        assetIds = assetIds.substring(0, assetIds.length - 1)
      }
      this.selectData = {
        ids: assetIds,
        nos: assetNos,
        names: assetNames,
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
        key: 'assetId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ assetId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.assetDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.assetDialogTable.tableQuery(Object.assign(this.assetDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.assetDialogTable.tableQuery(this.assetDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    },
    /**
     * 获得开始时间和结束时间
     */
    handleOperateTime(val) {
      if (val) {
        this.assetDialogProp.toolbarProp.searchData.operationDateBegin = val[0]
        this.assetDialogProp.toolbarProp.searchData.operationDateEnd = val[1]
      } else {
        this.assetDialogProp.toolbarProp.searchData.operationDateBegin = null
        this.assetDialogProp.toolbarProp.searchData.operationDateEnd = null
      }
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
      this.assetDialogProp.toolbarProp.searchData.pathLocaId = node.key // 节点值作为查询条件
      this.onAssetDialogSearch(this.assetDialogProp.toolbarProp.searchData)
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
          //this.assetDialogProp.treeProp.nativeProp = { 'default-expanded-keys': exapandKeys }
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
        this.assetDialogProp.toolbarProp.searchData.eqTypeId = selectData.ids
        this.assetDialogProp.toolbarProp.searchData.eqTypeName = selectData.names
      }
    },
    // --------------------设备类型弹出框 结束----------------------------
    //--------------------资产型号弹出框开始----------------------------//
    // 打开资产型号弹出框
    eqAssetTypeHandleDialog() {
      this.$nextTick(() => {
        this.$refs.eqAssetTypeDialogRef.init()
      })
    },
    // 资产型号弹出框确定事件
    onEqAssetTypeTableOk(selectData) {
      if (selectData) {
        this.assetDialogProp.toolbarProp.searchData.assetTypeId = selectData.ids
        this.assetDialogProp.toolbarProp.searchData.assetTypeName = selectData.names
      }
    },
    //--------------------资产型号弹出框结束----------------------------//
    //--------------------生产商弹出框 开始--------------------------//
    // 打开生产商弹出框
    eqEqManufacturerHandleDialog() {
      this.$nextTick(() => {
        this.$refs.eqManufacturerDialogRef.init()
      })
    },
    // 生产商弹出框确定事件
    onEqManufacturerTableOk(selectData) {
      if (selectData) {
        this.assetDialogProp.toolbarProp.searchData.manufacturerId = selectData.ids
        this.assetDialogProp.toolbarProp.searchData.manufacturerName = selectData.names
      }
    }
    //--------------------生产商弹出框 结束--------------------------//
  }
}
</script>
<style scoped></style>
