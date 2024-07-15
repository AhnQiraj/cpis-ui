<template>
  <div class="modelTreeTable">
    <el-row class="mainTreeTable" :gutter="10">
      <el-col v-if="showTree != 1" :class="[showTree == 1 ? '' : showTree == 2 ? 'showTreeLeft' : 'showTreeMoreLeft']" style="min-width: 280px">
        <modelTreeBar ref="treeBar" :hazard-type="zyhdType" @changeTree="showLeftTree" @handleNodeClick="changTree" />
      </el-col>
      <el-col v-else class="hiddenTreeLeft">
        <i class="el-icon-d-arrow-right modelIconStyle" @click="showLeftTree(1)" />
      </el-col>
      <el-col :class="[showTree == 1 ? 'hiddenTreeRight' : showTree == 2 ? 'showTreeRight' : 'showTreeMoreRight']">
        <el-row class="modelBody">
          <el-row class="modelHead">
            <el-form ref="searchObj" :model="searchObj" :inline="true" label-width="100px">
              <el-row>
                <div class="modelSearchTopLeft overWidth">
                  <el-form-item :label="$t('ticket.dangerPointExe.riskPoint')" prop="risk">
                    <el-input v-model="searchObj.risk" :placeholder="$t('baseCommon.message.pleaseEnter', { title: '' })" clearable />
                  </el-form-item>
                  <el-form-item :label="$t('ticket.dangerPointExe.riskLevel')" prop="riskLevelNo">
                    <el-select v-model="searchObj.riskLevelNo" :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })" filterable clearable>
                      <el-option v-for="item in riskLevelNos" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('common.field.state')" prop="status">
                    <el-select v-model="searchObj.status" clearable :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })">
                      <el-option key="0" :label="$t('common.field.start')" value="0"></el-option>
                      <el-option key="1" :label="$t('common.field.stop')" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initTable(1)">{{ $t('common.buttons.search') }}</el-button>
                    <el-button icon="el-icon-refresh" style="font-size: 14px" @click="resetForm">{{ $t('common.buttons.reset') }}</el-button>
                  </el-form-item>
                </div>
              </el-row>
            </el-form>
          </el-row>
          <el-row class="modelTableRow">
            <el-table ref="table" v-loading="tableLoading" border :height="'100%'" :data="tableData" tooltip-effect="light" @selection-change="changeTable">
              <el-table-column type="selection" fixed width="40" align="center" />
              <el-table-column :label="$t('baseCommon.other.serialNumber')" fixed type="index" width="50" align="center" />
              <el-table-column prop="risk" fixed :label="labelFn(0)" min-width="105" align="left">
                <template slot-scope="scope">
                  <el-link type="primary" @click="goOperate(scope.row)"> {{ scope.row.risk }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="accidentCause" show-overflow-tooltip :label="labelFn(1)" min-width="180" />
              <el-table-column prop="controlMeasure" show-overflow-tooltip :label="$t('ticket.dangerPointExe.controlMeasure')" min-width="120" align="left" />
              <el-table-column prop="riskLevelNo" :label="$t('ticket.dangerPointExe.riskLevel')" width="100" align="left">
                <template slot-scope="scope">
                  {{ riskLevelNoMap[scope.row.riskLevelNo] }}
                </template>
              </el-table-column>
              <el-table-column prop="status" width="60" :label="$t('common.field.state')" align="left">
                <template slot-scope="scope">
                  {{ scope.row.status === 0 ? $t('common.field.start') : $t('common.field.stop') }}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row class="modelPageRow">
            <el-pagination :current-page="pageObj.current" :page-sizes="[10, 20, 30, 50, 100]" :page-size="pageObj.size" layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </el-row>
        </el-row>
      </el-col>
    </el-row>
    <evaluateHisDialog ref="evaluateHisDialog"></evaluateHisDialog>
  </div>
</template>
<script>
import evaluateHisDialog from './evaluateHisDialog'
import modelTreeBar from './modelTreeBar'
import * as utils from '@cupu/utils/index'
export default {
  name: 'DangerRiskSelect',
  components: {
    modelTreeBar,
    evaluateHisDialog
  },
  props: {
    select: { type: Array },
    from: { type: Number }
  },
  data() {
    return {
      department: '',
      hazardType: 'qt',
      qt: [this.$t('ticket.dangerPointExe.riskPoint'), this.$t('ticket.dangerPointExe.accidentCause'), this.$t('ticket.dangerPointExe.possibleConsequence')],
      sbss: [this.$t('ticket.dangerPointExe.checkProject'), this.$t('ticket.dangerPointExe.standard'), this.$t('ticket.dangerPointExe.nonComplianceSituation')],
      zyhd: [this.$t('ticket.dangerPointExe.jobStep'), this.$t('ticket.dangerPointExe.riskSourceOrPotentialEvent'), this.$t('ticket.dangerPointExe.possibleAccidentTypesAndConsequences')],
      zyhdType: 'zyhd',
      riskLevelNos: [],
      riskLevelNoMap: {},
      tableLoading: false,
      // 表格三要素头部搜索栏；表格；分页
      searchObj: {
        treeId: '',
        riskLevelNo: '',
        status: '',
        risk: ''
      },
      tableData: [],
      pageObj: {
        current: 1,
        size: 20,
        total: 0
      },
      choosedList: [], // 选择的行
      showTree: 2 // 1-隐藏；2-展示；3-展示更宽
    }
  },
  watch: {},
  created() {
    window.apiList['safety/index'].getRaRiskLevel().then(res => {
      res.data.map(item => {
        this.riskLevelNos.push({
          label: item.levelName,
          value: item.riskLevelNo
        })
        this.riskLevelNoMap[item.riskLevelNo] = item.levelName
      })
    })
  },
  mounted() {
    let userInfo = utils.getLoginInfo()
    if (userInfo.org.levelID === '743056808754544640') {
      this.department = userInfo.org.id
    }
    //this.initTable()
  },
  methods: {
    handleClick(row) {
      this.$refs.evaluateHisDialog.init(row.riskControlId)
    },
    labelFn(index) {
      if (this.hazardType === 'qt') {
        return this.qt[index]
      }
      if (this.hazardType === 'sbss') {
        return this.sbss[index]
      }
      if (this.hazardType === 'zyhd') {
        return this.zyhd[index]
      }
    },
    //新增
    add() {
      if (!this.searchObj.isRa) {
        this.$message.warning(this.$t('baseCommon.message.pleaseSelectDanger'))
        return
      }
      this.$addMainRouter({
        name: 'processManage-safetyRaRiskControlAdd',
        query: {
          add: 1,
          hazardId: this.searchObj.treeId
        }
      })
    },
    edit() {
      this.$addMainRouter({
        name: 'processManage-safetyRaRiskControlModify',
        query: {
          edit: 1,
          riskControlId: this.choosedList[0].riskControlId,
          hazardId: this.choosedList[0].hazardId
        }
      })
    },
    // 弹窗/修改/详情
    goOperate(row) {
      this.$addMainRouter({
        name: 'processManage-safetyRaRiskControlBrowse',
        query: {
          isView: 1,
          riskControlId: row.riskControlId,
          hazardId: row.hazardId
        }
      })
    },
    // 删除
    deleteRow() {
      this.$confirm(this.$t('baseCommon.message.isDelData'), this.$t('common.field.tips'), {
        confirmButtonText: this.$t('common.buttons.confirm'),
        cancelButtonText: this.$t('common.buttons.cancel'),
        type: 'warning'
      }).then(() => {
        window.apiList['safety/index'].deleteRaRiskControlById(this.choosedList[0].riskControlId).then(res => {
          if (res.code === 0) {
            this.$message.success(this.$t('baseCommon.message.removeSuccess'))
            this.initTable(1)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 更改树数据
    changTree(data) {
      if (data.hazardType) {
        this.hazardType = data.hazardType
      } else {
        this.hazardType = 'qt'
      }
      this.searchObj.isRa = data.isRa
      this.searchObj.treeId = data.id
      this.initTable(1)
    },
    // 是否展示树 // 1-隐藏；2-展示；3-展示更宽
    showLeftTree(type) {
      if (type === 1) {
        this.$set(this, 'showTree', 2)
      } else if (type === 2) {
        // 展示更多树区域的时候
        if (this.showTree === 2) {
          this.$set(this, 'showTree', 1)
        } else {
          this.$set(this, 'showTree', 2)
        }
      } else if (type === 3) {
        this.$set(this, 'showTree', 3)
      }
    },
    // 重置表单,此方法需要prop与属性值对应的才会重置，树id不会也不该重置
    resetForm() {
      this.searchObj.riskLevelNo = ''
      this.searchObj.status = ''
      this.searchObj.risk = ''
    },
    // 提交时间一定要转为string
    getQueryObj() {
      // 整合参数
      let queryObj = {
        department: this.$refs.treeBar.department,
        status: this.searchObj.status,
        isRa: this.searchObj.isRa,
        riskLevelNo: this.searchObj.riskLevelNo,
        risk: this.searchObj.risk,
        treeId: this.searchObj.treeId, // 树形结构传的值
        current: this.pageObj.current,
        size: this.pageObj.size,
        total: this.pageObj.total,
        hazardType: 'zyhd'
      }
      return queryObj
      // 以下调用查询方法
    },
    // 搜索栏结束
    // 表格开始
    // 数据初始化
    initTable(val) {
      // 当带查询条件时或改变分页大小，传val值，使其获取第一页的值
      this.tableLoading = true
      if (val) {
        this.pageObj.current = val
      }
      let queryObj = this.getQueryObj() // 查询入参以待使用;
      window.apiList['safety/index'].raRiskControlPage(queryObj).then(res => {
        this.tableData = res?.data?.records ?? []
        this.pageObj = {
          current: res?.data?.current ?? 1,
          size: res?.data?.size ?? 20,
          total: res?.data?.total ?? 0
        }
        this.tableLoading = false
      })
    },
    // 选择列赋值
    changeTable(data) {
      this.choosedList = data && data.length > 0 ? JSON.parse(JSON.stringify(data)) : []
      this.$emit('selectList', this.choosedList)
    },
    // 表格结束
    // 分页功能开始
    handleSizeChange(size) {
      this.pageObj.size = size
      this.initTable(1)
    },
    handleCurrentChange(current) {
      this.pageObj.current = current
      this.initTable()
    }
  }
}
</script>
<style scoped>
.modelTreeTable .modelSearchTopLeft {
  width: calc(100% - 0px) !important;
}
.modelBody {
  height: 436px;
}
.modelBody .modelHead {
  margin-top: 0px;
  margin-bottom: 11px;
}
.modelTreeTable ::v-deep .el-table th.el-table__cell > .cell {
  white-space: pre !important;
}
.modelTreeTable ::v-deep .el-table .el-table__header .cell {
  line-height: 20px !important;
}
.modelTreeTable ::v-deep .el-table--small td,
.modelBody .modelTableRow .el-table--small th {
  padding: 4px 0 !important;
}
.modelTreeTable ::v-deep .last {
  border-right: 1px solid #e6e6e6 !important;
}
.modelTreeTable ::v-deep .el-table--small th.el-table__cell {
  padding: 0 !important;
}
.modelTreeTable ::v-deep .el-table .el-table__header .cell {
  line-height: 25px !important;
}
.modelBody .modelTableRow ::v-deep .el-table col[name='gutter'] {
  display: table-column !important;
}
.modelBody .modelTableRow ::v-deep .el-table th.gutter {
  display: table-cell !important;
}
.modelBody ::v-deep .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
