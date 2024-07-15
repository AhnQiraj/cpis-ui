<template>
  <div class="container">
    <el-dialog :visible.sync="dialogVisible" custom-class="evaluateHisDialog" width="80%" :title="$t('baseCommon.component.dangerHistory')" :close-on-click-modal="false">
      <el-row class="modelTableRow" style="height: calc(100% - 50px); margin-bottom: 10px">
        <el-table ref="table" v-loading="tableLoading" border :height="'100%'" :data="tableData" tooltip-effect="light">
          <el-table-column :label="$t('baseCommon.other.serialNumber')" type="index" width="50" align="center" />
          <el-table-column prop="risk" :label="$t('ticket.dangerPointExe.riskPoint')" min-width="105" align="left" />
          <el-table-column prop="hazard" :label="$t('ticket.dangerPointExe.hazard')" min-width="105" align="left" />
          <el-table-column prop="controlMeasure" show-overflow-tooltip :label="$t('ticket.dangerPointExe.controlMeasure')" min-width="120" align="left" />
          <el-table-column :label="$t('ticket.dangerPointExe.riskAssessment')" align="center">
            <el-table-column prop="lValue" :label="$t('ticket.dangerPointExe.lValue')" width="70" align="left" />
            <el-table-column prop="csValue" :label="$t('ticket.dangerPointExe.csValue')" width="70" align="left" />
            <el-table-column prop="eValue" :label="$t('ticket.dangerPointExe.eValue')" width="70" align="left" />
            <el-table-column prop="riskDegree" :label="$t('ticket.dangerPointExe.riskDegree')" width="70" align="left" />
            <el-table-column prop="riskDegreeDesc" :label="$t('ticket.dangerPointExe.riskDegreeDesc')" width="80" align="left" label-class-name="last" />
          </el-table-column>
          <el-table-column prop="addMeasure" show-overflow-tooltip :label="$t('ticket.dangerPointExe.addMeasure')" min-width="120" align="left" />
          <el-table-column prop="riskLevelNo" :label="$t('ticket.dangerPointExe.riskLevel')" width="100" align="left">
            <template slot-scope="scope">
              {{ riskLevelNoMap[scope.row.riskLevelNo] }}
            </template>
          </el-table-column>
          <el-table-column prop="evaluateTime" show-overflow-tooltip :label="$t('ticket.dangerPointExe.evaluateTime')" min-width="120" align="left" />
          <el-table-column prop="evaluatorName" :label="$t('ticket.dangerPointExe.evaluatorName')" width="70" align="left" />
        </el-table>
      </el-row>
      <el-row class="modelPageRow">
        <el-pagination :current-page="pageObj.current" :page-sizes="[10, 20, 30, 50, 100]" :page-size="pageObj.size" layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'RaEvaluationRule',
  components: {},
  props: {},
  data() {
    return {
      pageObj: {
        current: 1,
        size: 20,
        total: 0
      },
      riskControlId: '',
      tableData: [],
      dialogVisible: false,
      riskLevelNoMap: {}
    }
  },
  mounted() {
    window.apiList['safety/index'].getRaRiskLevel().then(res => {
      res.data.map(item => {
        this.riskLevelNoMap[item.riskLevelNo] = item.levelName
      })
    })
  },
  methods: {
    init(parm) {
      this.riskControlId = parm
      this.initTable(1)
      this.dialogVisible = true
    },
    getQueryObj() {
      // 整合参数
      let queryObj = {
        riskControlId: this.riskControlId,
        current: this.pageObj.current,
        size: this.pageObj.size,
        total: this.pageObj.total,
        eStatus: 1
      }
      return queryObj
      // 以下调用查询方法
    },
    initTable(val) {
      // 当带查询条件时或改变分页大小，传val值，使其获取第一页的值
      this.tableLoading = true
      if (val) {
        this.pageObj.current = val
      }
      let queryObj = this.getQueryObj() // 查询入参以待使用;
      window.apiList['safety/index'].raHazardEvaluationList(queryObj).then(res => {
        this.tableData = res?.data?.records ?? []
        this.pageObj = {
          current: res?.data?.current ?? 1,
          size: res?.data?.size ?? 20,
          total: res?.data?.total ?? 0
        }
        this.tableLoading = false
      })
    },
    // 分页功能开始
    handleSizeChange(size) {
      this.pageObj.size = size
      this.initTable(1)
    },
    handleCurrentChange(current) {
      this.pageObj.current = current
      this.initTable()
    }
    // 分页功能结束
  }
}
</script>
<style scoped></style>
