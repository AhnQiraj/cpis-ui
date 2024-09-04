<template>
  <z-dialog-table ref="stdWODiaTb" :title="stdWOProp.title" :key_="stdWOProp.key" :toolbar-prop="stdWOProp.toolbarProp" :table-prop="stdWOProp.tableProp" :tree-prop="stdWOProp.treeProp" :selection-handle="stdWOProp.selectionHandle" @toolbar-search="onStdWOSearch" @ok="onStdWOOk">
    <template slot="searchBar">
      <el-form-item :label="$t('common.field.deptAlias')">
        <el-select v-model="stdWOProp.toolbarProp.searchData.operationDeptId" placeholder="请选择" clearable>
          <el-option v-for="(item, index) in depts" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作票类型">
        <vxe-select v-model="stdWOProp.toolbarProp.searchData.wtTypeId" placeholder="请选择" clearable>
          <vxe-option v-for="(woOrderType, index) in wtTypes" :key="index" :value="woOrderType.value" :label="woOrderType.label" />
        </vxe-select>
      </el-form-item>
    </template>
  </z-dialog-table>
</template>
<script>
import { getLoginInfo } from '@cupu/utils/index'
export default {
  name: 'WorkTicketDialogSelect',
  props: {
    multipleSelect: {
      type: Boolean,
      default: false
    },
    /**
     * 初始化条件
     * :initParam="{woTypeNo:'ta_pw'}"
     * 只查询定期工单
     */
    initParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedIds: {
      type: String
    },
    selectedNames: {
      type: String
    },
    siteId: {
      type: String
    }
  },
  data() {
    return {
      wtTypes: [],
      depts: [],
      wtTypeObj: {},
      userInfo: {},
      stdWOProp: {
        title: '工作票主票',
        selectionHandle: this.stdWOSelection,
        key: 'wtId',
        toolbarProp: {
          // 搜索数据
          searchData: {
            wtTypeId: '',
            operationDeptId: '',
            isOn: 1
          }
        },
        // 表格属性
        tableProp: {
          multipleSelect: this.multipleSelect, // 是否可多选
          dataSource: this.wtWorkTicketPage, // 表格分页查询接口， Promise 对象
          paginationHandle: this.busiPagination, // 分页条件处理 返回分页查询条件
          columns: [
            // 显示列
            { title: this.$t('common.field.deptAlias'), key: 'operationDeptName' },
            { title: '工作票号', key: 'wtNo' },
            { title: '工作票类型', key: 'wtTypeId', formatter: (row, column) => this.wtTypeObj[row[column.key]] },
            { title: '工作内容', key: 'workContent' },
            { title: '设备位置', key: 'locaName' }
          ]
        },
        // 树控件属性
        treeProp: {
          show: false
        }
      }
    }
  },
  created() {
    // 获得当前人的信息
    this.userInfo = getLoginInfo()
  },
  async mounted() {
    await this.queryWtType()
    this.depts = this.userInfo.stationList
  },
  methods: {
    /**
     * 初始化
     * initParam:可以传初始化条件,被融合进去,用于第一次查询
     * @author mbb
     */
    init(initParam) {
      if (initParam) {
        this.initParam = Object.assign(this.initParam, initParam)
      }
      this.selectStdWO()
    },
    /**
     * 查询主票
     * @author mbb
     */
    selectStdWO() {
      if (this.siteId) {
        this.stdWOProp.toolbarProp.searchData.operationDeptId = this.siteId
        this.initParam.operationDeptId = this.siteId
      }
      let selected = { key: 'wtId', data: [] }
      if (this.selectedIds !== undefined && this.selectedNames !== undefined) {
        let size = this.selectedIds.split(',').length
        for (let i = 0; i < size; i++) {
          selected.data.push({
            wtId: this.selectedIds.split(',')[i],
            text: this.selectedNames.split(',')[i]
          })
        }
      }
      this.$refs.stdWODiaTb.open(selected)
      // 加载弹出框列表数据
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.stdWODiaTb.tableQuery(this.initParam)
        }, 600)
      })
    },
    /**
     * 查询数据
     * @author mbb
     */
    wtWorkTicketPage(parmas) {
      parmas = Object.assign(parmas, this.initParam)
      // parmas.notNullWtNo = 'yes'
      return new Promise((resolve, reject) => {
        window.apiList['tickets/index'].wtPageAll(parmas).then(response => {
          resolve(response)
        })
      })
    },
    onStdWOSearch(params) {
      // 加载列表数据
      const pa = {
        operationDeptId: params.operationDeptId,
        wtTypeId: params.wtTypeId
      }
      this.$refs.stdWODiaTb.tableQuery(pa)
    },
    /**
     * 返回分页条件
     */
    busiPagination(pagination) {
      return { current: pagination.pageNo, size: pagination.limit }
    },
    /**
     * 处理勾选数据展示
     */
    stdWOSelection(selection) {
      // 标准工单
      return selection.wtNo
    },
    /**
     * 弹出表格确定事件
     */
    onStdWOOk(seleted) {
      this.$emit('onDTableOk', seleted)
    },
    /**
     * 查询工作票类型
     * @author mbb
     */
    async queryWtType() {
      let _this = this
      let res = await window.apiList['tickets/index'].wtTypeList()
      let arr = res?.data || []
      let list = arr.filter(item => item.isMain == 1 && item.isOn == 1)
      // 过滤出有效的主票类型
      list.forEach(o => {
        _this.wtTypes.push({
          value: o.wtTypeId,
          label: o.wtTypeName
        })
        _this.wtTypeObj[o.wtTypeId] = o.wtTypeName
      })
    }
  }
}
</script>
