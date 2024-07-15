<template>
  <z-dialog-table ref="EqManufacturerDialogTable" :title="eqManufacturerDialogProp.title" :key_="eqManufacturerDialogProp.key" :toolbar-prop="eqManufacturerDialogProp.toolbarProp" :table-prop="eqManufacturerDialogProp.tableProp" :tree-prop="eqManufacturerDialogProp.treeProp" :selection-handle="eqManufacturerDialogProp.selectionHandle" @toolbar-search="onEqManufacturerDialogSearch" @ok="onEqManufacturerDialogTableOk">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="key">
        <el-input v-model="eqManufacturerDialogProp.toolbarProp.searchData.key" :placeholder="$t('equipment.message.inManufNoOrNa')" />
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'EqManufacturerDialogSelect',
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
      eqManufacturerDialogProp: {
        title: this.title,
        selectionHandle: this.selectionHandle,
        key: 'manufacturerId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            key: '',
            companyId: '',
            isOn: 'Y'
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.initTableData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.EqManufacturerDialogPaginationHandle, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            {
              title: this.$t('common.field.primaryKey'),
              key: 'manufacturerId',
              show: false
            },
            {
              title: this.$t('equipment.manufacturer.manufNo'),
              key: 'manufacturerNo',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.manufacturer.manufName'),
              key: 'manufacturerName',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.contacts'),
              key: 'contactPerson',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.mobilePhone'),
              key: 'mobilePhone',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.email'),
              key: 'email',
              showOverflowTooltip: true
            },
            {
              title: this.$t('equipment.common.postCode'),
              key: 'postCode',
              showOverflowTooltip: true
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
      return window.apiList['equipment/index'].getEqManufacturerTable(par)
    },
    /**
     * 查询操作
     */
    onEqManufacturerDialogSearch(params) {
      // 加载列表数据
      if (this.initParam == null) {
        this.$refs.EqManufacturerDialogTable.tableQuery(params)
      } else {
        this.$refs.EqManufacturerDialogTable.tableQuery(Object.assign(params, this.initParam))
      }
    },
    /**
     * 返回分页条件
     */
    EqManufacturerDialogPaginationHandle(pagination) {
      return { requestPage: pagination }
    },
    /**
     * 处理勾选数据展示
     */
    selectionHandle(selection) {
      return selection.manufacturerName
    },
    /**
     * 弹出表格确定事件
     */
    onEqManufacturerDialogTableOk(selected) {
      let manufacturerIds = ''
      let manufacturerNames = ''
      for (let index in selected) {
        manufacturerNames += (selected[index]['column']['manufacturerName'] || '') + ','
        manufacturerIds += (selected[index]['column']['manufacturerId'] || '') + ','
      }
      if (manufacturerNames.lastIndexOf(',') !== -1) {
        manufacturerNames = manufacturerNames.substring(0, manufacturerNames.length - 1)
      }
      if (manufacturerIds.lastIndexOf(',') !== -1) {
        manufacturerIds = manufacturerIds.substring(0, manufacturerIds.length - 1)
      }
      this.selectData = {
        ids: manufacturerIds,
        names: manufacturerNames,
        selected: selected
      }
      this.fatherMethod(this.selectData)
    },
    /**
     * 初始化打开
     */
    init(val) {
      let selected = {
        key: 'manufacturerId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({ manufacturerId: this.selectedIds.split(',')[i], text: this.selectedNames.split(',')[i] })
        }
      }
      this.$refs.EqManufacturerDialogTable.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.initParam != null) {
            this.$refs.EqManufacturerDialogTable.tableQuery(Object.assign(this.eqManufacturerDialogProp.toolbarProp.searchData, this.initParam))
          } else {
            this.$refs.EqManufacturerDialogTable.tableQuery(this.eqManufacturerDialogProp.toolbarProp.searchData)
          }
        }, 600)
      })
    }
    // --------------------弹出框相关----------------------------
  }
}
</script>
<style scoped></style>
