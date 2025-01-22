<template>
  <z-dialog-table ref="eqAssetTypeDialogTable" :title="eqAssetTypeDialogProp.title" :key_="eqAssetTypeDialogProp.key" :toolbar-prop="eqAssetTypeDialogProp.toolbarProp" :table-prop="eqAssetTypeDialogProp.tableProp" :tree-prop="eqAssetTypeDialogProp.treeProp" :selection-handle="eqAssetTypeDialogProp.selectionHandle" @toolbar-search="onEqAssetTypeDialogSearch" @ok="onEqAssetTypeDialogTableOk" @on-reset="onReset">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="key">
        <el-input v-model="eqAssetTypeDialogProp.toolbarProp.searchData.key" :placeholder="$t('equipment.message.inAtyNoOrNa')" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.eqType')" prop="eqTypeName">
        <el-input v-model="eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.eqType') })" readonly @focus="eqTypeHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqTypeHandleDialog" />
        </el-input>
        <EqTypeDialogSelect ref="eqTypeDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.eqType') })" :multiple-select="false" :init-param="initParam" :father-method="onEqTypeTableOk" :selected-ids="eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeId" :selected-names="eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeName" />
      </el-form-item>
      <el-form-item :label="$t('equipment.common.manufacturer')" prop="manufacturerName">
        <el-input v-model="eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerName" :placeholder="$t('baseCommon.message.pleaseSelect', { title: $t('equipment.common.manufacturer') })" readonly @focus="eqEqManufacturerHandleDialog">
          <i slot="suffix" class="el-icon-search" @click="eqEqManufacturerHandleDialog" />
        </el-input>
        <eq-manufacturer-dialog-select ref="eqManufacturerDialogRef" :title="$t('baseCommon.buttons.choice', { title: $t('equipment.common.manufacturer') })" :multiple-select="false" :init-param="initParam" :father-method="onEqManufacturerTableOk" :selected-ids="eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerId" :selected-names="eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerName" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import eqManufacturerDialogSelect from './eqManufacturerDialog.vue'
export default {
  name: 'EqAssetTypeDialogSelect',
  components: { eqManufacturerDialogSelect },
  props: {
    // String Number Boolean Array Object Function || validator (value) {}
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
      selectData: {},
      // 弹出属性
      eqAssetTypeDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'assetTypeId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            key: '',
            companyId: '',
            eqTypeId: '',
            eqTypeName: '',
            manufacturerId: '',
            manufacturerName: '',
            isOn: 1 //默认查询状态为启用的区域
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.onEqAssetTypeDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'assetTypeId',
              show: false
            },
            {
              title: this.$t('equipment.model.modelNo'),
              key: 'assetTypeNo'
            },
            {
              title: this.$t('equipment.model.modelName'),
              key: 'assetTypeName'
            },
            {
              title: this.$t('equipment.common.manufacturer'),
              key: 'manufacturerName'
            },
            {
              title: this.$t('equipment.common.eqType'),
              key: 'eqTypeName'
            }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },
  created() {},
  methods: {
    // --------------------弹出框相关----------------------------
    /**
     * 默认搜索事件
     */
    initTableData(params) {
      let par = Object.assign(params, this.initParam)
      return window.apiList['equipment/index'].getEqAssetTypeTable(par)
    },
    /**
     * 查询操作
     */
    onEqAssetTypeDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.eqAssetTypeDialogTable.tableQuery(params)
      } else {
        this.$refs.eqAssetTypeDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    onEqAssetTypeDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.assetTypeName
    },
    /**
     * 弹出表格确定事件
     */
    onEqAssetTypeDialogTableOk(selected) {
      let assetTypeIds = ''
      let assetTypeNames = ''
      for (let index in selected) {
        assetTypeNames += (selected[index]['column']['assetTypeName'] || '') + ','
        assetTypeIds += (selected[index]['column']['assetTypeId'] || '') + ','
      }
      if (assetTypeNames.lastIndexOf(',') !== -1) {
        assetTypeNames = assetTypeNames.substring(0, assetTypeNames.length - 1)
      }
      if (assetTypeIds.lastIndexOf(',') !== -1) {
        assetTypeIds = assetTypeIds.substring(0, assetTypeIds.length - 1)
      }
      this.selectData = {
        ids: assetTypeIds,
        names: assetTypeNames,
        selected: selected
      }
      this.fatherMethod(this.selectData)
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'assetTypeId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ assetTypeId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.eqAssetTypeDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.eqAssetTypeDialogTable.tableQuery(Object.assign(this.eqAssetTypeDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.eqAssetTypeDialogTable.tableQuery(this.eqAssetTypeDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    },
    onReset() {
      this.eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeId = ''
      this.eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerId = ''
    },
    // --------------------弹出框相关----------------------------
    //--------------------生产商弹出框 开始--------------------------//
    // 打开生产商弹出框
    eqEqManufacturerHandleDialog() {
      let that = this
      this.$nextTick(() => {
        that.$refs.eqManufacturerDialogRef.init()
      })
    },
    // 生产商弹出框确定事件
    onEqManufacturerTableOk(selectData) {
      if (selectData) {
        this.eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerId = selectData.ids
        this.eqAssetTypeDialogProp.toolbarProp.searchData.manufacturerName = selectData.names
      }
    },
    //--------------------生产商弹出框 结束--------------------------//
    //--------------------设备类型弹出框 开始--------------------------//
    // 打开上级设备类型弹出框
    eqTypeHandleDialog() {
      this.$nextTick(() => {
        this.$refs.eqTypeDialogRef.init()
      })
    },
    // 上级设备类型弹出框确定事件
    onEqTypeTableOk(selectData) {
      if (selectData) {
        this.eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeId = selectData.ids
        this.eqAssetTypeDialogProp.toolbarProp.searchData.eqTypeName = selectData.names
      }
    }
    //--------------------设备类型弹出框 结束--------------------------//
  }
}
</script>
<style scoped></style>
