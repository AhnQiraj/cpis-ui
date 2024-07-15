<!--备品备件选择框-->
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="70%" :modal="true" :show-close="true" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="true" @close="handleDialogClose">
      <div slot="title">
        <span>{{ title }}</span>
      </div>
      <div class="wrap form-wrap">
        <el-table :data="tableData" @selection-change="handleItemsSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column type="index" :label="$t('baseCommon.other.serialNumber')" width="60" />
          <el-table-column prop="sparepartNo" :label="$t('baseCommon.component.sparepartNo')" width="150" />
          <el-table-column prop="sparepartName" :label="$t('baseCommon.component.sparepartName')" />
          <el-table-column prop="specification" :label="$t('baseCommon.component.specification')" width="200" />
          <el-table-column prop="manufacturerName" :label="$t('baseCommon.component.manufacturerName')" width="200" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSparepartOk()">{{ $t('baseCommon.buttons.confirm') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('baseCommon.buttons.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'SparePartsDialogSelect',
    props: {
      multipleSelect: {
        type: Boolean,
        default: true
      },
      initParam: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        idsList: [],
        eqAssetId: '',
        dialogVisible: false,
        title: this.$t('baseCommon.component.sparePartsSelect'),
        tableData: [],
        choseData: []
      }
    },
    methods: {
      initTableData() {
        this.tableData = []
        if (this.idsList != null && this.idsList.length > 0) {
          window.apiList['equipment/index'].queryEqAssetByLocalIds(this.idsList).then(res => {
            if (res.data) {
              res.data.forEach(item => {
                this.tableData = this.tableData.concat(item.eqAssetSparepartList)
              })
              if (this.tableData.length > 0) {
                const map = new Map()
                this.tableData = this.tableData.filter(key => !map.has(key.sparepartNo) && map.set(key.sparepartNo, 1)) // 这里对sparepartNo属性进行去重
              }
            }
          })
        }
      },
      /**
       * 初始化方法
       */
      init(idsList) {
        this.idsList = idsList
        this.initTableData()
        this.dialogVisible = true
      },
      /**
       * 弹出表格确定事件
       */
      onSparepartOk() {
        this.$emit('onSparepartOk', this.choseData)
        this.handleDialogClose()
      },
      handleItemsSelectionChange(data) {
        this.choseData = data
      },
      handleDialogClose() {
        this.dialogVisible = false
      }
    }
  }
</script>
<style scoped>
  .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-right: 1px solid #e5e6e7;
  }
</style>
