<template>
  <z-dialog-table ref="otDiaTb" :title="otProp.title" :key_="otProp.key" :toolbar-prop="otProp.toolbarProp" :table-prop="otProp.tableProp" :tree-prop="otProp.treeProp" :selection-handle="otProp.selectionHandle" @toolbar-search="onOtSearch" @ok="onOtOk">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.keyword')" prop="keyword">
        <el-input v-model="otProp.toolbarProp.searchData.keyword" clearable />
      </el-form-item>
      <el-form-item :label="$t('baseCommon.dialog.ticketNum')" prop="otTypeId">
        <el-select v-model="otProp.toolbarProp.searchData.otTypeId" clearable>
          <el-option v-for="(item, index) in otTypeList" :key="index" :value="item.otTypeId" :label="item.otTypeName" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('baseCommon.dialog.skill')" prop="skillId">
        <el-select v-model="otProp.toolbarProp.searchData.skillId" clearable>
          <el-option v-for="(item, index) in skillList" :key="index" :value="item.key" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('baseCommon.dialog.loca')" prop="locaName">
        <el-input v-model="otProp.toolbarProp.searchData.locaName" clearable />
      </el-form-item>
      <el-form-item :label="$t('baseCommon.dialog.manageObj')" prop="manageObjName">
        <el-input v-model="otProp.toolbarProp.searchData.manageObjName" clearable />
      </el-form-item>
      <el-form-item :label="$t('common.field.deptAlias')" prop="operationDeptId">
        <el-select v-model="otProp.toolbarProp.searchData.operationDeptId" clearable>
          <el-option v-for="(item, index) in depts" :key="index" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
export default {
  name: 'OperaTicketDialogSelect',
  props: {
    multipleSelect: { type: Boolean, default: false },
    initParam: { type: Object, default: null },
    selectedIds: { type: String },
    selectedNames: { type: String }
  },
  data() {
    return {
      otTypeList: [],
      depts: [],
      skillList: [],
      otProp: {
        title: this.$t('baseCommon.dialog.opt'),
        selectionHandle: this.otSelection,
        key: 'otId',
        toolbarProp: {
          searchData: {
            // 搜索数据
            keyword: '',
            otTypeId: '',
            skillId: '',
            manageObjName: '',
            locaName: '',
            operationDeptId: '',
            notNullOtNo: 'yes'
          }
        },
        tableProp: {
          // 表格属性
          // mustShow: true,
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.getData, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('baseCommon.dialog.optNo'), key: 'otNo', width: 200 },
            {
              title: this.$t('baseCommon.dialog.ticketNum'),
              key: 'otTypeId',
              width: 120,
              formatter: (row, column, cellValue, index) => {
                if (this.otTypeList.length > 0) {
                  return cellValue ? this.otTypeList.find(item => item.otTypeId === cellValue).otTypeName : cellValue
                }
                return cellValue
              }
            },
            { title: this.$t('baseCommon.dialog.operateTask'), key: 'opContent' },
            { title: this.$t('baseCommon.dialog.loca'), key: 'locaName', width: 200 },
            { title: this.$t('baseCommon.dialog.skill'), key: 'skillName', width: 120 },
            { title: this.$t('baseCommon.dialog.manageObj'), key: 'manageObjName', width: 120 },
            { title: this.$t('common.field.deptAlias'), key: 'operationDeptName', width: 120 }
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
    this.depts = this.$store.state.ibps.user.info.stationList
    let par = { typeKey: 'zybm' }
    window.apiList['common/index'].getDictByTypeKey(par).then(ret => {
      this.skillList = ret.data
    })
    window.apiList['tickets/index'].otTypeList().then(ret => {
      this.otTypeList = ret.data
    })
  },
  methods: {
    init(operationDeptId) {
      this.selectOt(operationDeptId)
    },
    selectOt(operationDeptId) {
      if (operationDeptId != '' && operationDeptId != null && operationDeptId != undefined) {
        this.otProp.toolbarProp.searchData.operationDeptId = operationDeptId
        // this.initParam = { deptId: operationDeptId }
      }
      let selected = {
        key: 'otId',
        data: []
      }
      if (this.selectedIds != undefined && this.selectedNames != undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            otId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.otDiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.otDiaTb.tableQuery() //this.initParam
        }, 600)
      })
    },
    /**
     * 查询接口
     * todombb 这个地方的引用比较奇怪,在替换新API时可能有问题.没有深入测试,可能不通.后续处理
     */
    getData(parmas) {
      parmas.operationDeptId = this.otProp.toolbarProp.searchData.operationDeptId
      parmas.keyword = this.otProp.toolbarProp.searchData.keyword
      parmas.otTypeId = this.otProp.toolbarProp.searchData.otTypeId
      parmas.skillId = this.otProp.toolbarProp.searchData.skillId
      parmas.manageObjName = this.otProp.toolbarProp.searchData.manageObjName
      parmas.locaName = this.otProp.toolbarProp.searchData.locaName
      parmas.notNullOtNo = this.otProp.toolbarProp.searchData.notNullOtNo
      return new Promise((resolve, reject) => {
        window.apiList['tickets/index'].otPage(parmas).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 点击查询
     */
    onOtSearch(params) {
      // 加载列表数据
      // const pa = {
      //   deptId: params.operationDeptId
      // }
      this.$refs.otDiaTb.tableQuery()
    },
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
    otSelection(selection) {
      // 标准工单
      return selection.workContent
    },
    /**
     * 弹出表格确定事件
     */
    onOtOk(seleted) {
      this.$emit('onDTableOk', seleted)
    }
  }
}
</script>
