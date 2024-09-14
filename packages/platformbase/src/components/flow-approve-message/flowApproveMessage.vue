<!--流程审核信息-->
<template>
  <div class="flowHistoryMain">
    <div class="title"><span>{{ $t('baseCommon.flow.checkTitle') }}</span><el-link type="primary" :underline="false" style="float: right; margin-right: 8px" @click="viewFlowchart">{{ $t('common.buttons.viewFlowchart') }}</el-link></div>
    <el-row>
      <el-table ref="table" border :data="tableData" tooltip-effect="dark" class="tableStyleA" :row-class-name="tableRowClassName">
        <el-table-column prop="taskName" :label="$t('baseCommon.flow.taskName')" min-width="100" align="center" />
        <el-table-column prop="auditorName" :label="$t('baseCommon.flow.auditorName')" show-overflow-tooltip min-width="80" align="center" />
        <el-table-column prop="createTime" :label="$t('baseCommon.flow.createTime')" min-width="120" align="center" />
        <el-table-column prop="completeTime" :label="$t('baseCommon.flow.completeTime')" min-width="120" align="center" />
        <el-table-column :label="$t('baseCommon.flow.opinion')" min-width="200" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="dark">
              <div slot="content">{{ scope.row.opinion }}</div>
              <span>{{ scope.row.opinion }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--流程图-->
    <flow-diagram-dialog :visible="flowDiagramVisible" :biz-key="id" @close="visible => (flowDiagramVisible = visible)" />
  </div>
</template>
<script>
export default {
  name: 'FlowApproveMessage',
  props: {
    id: {
      type: String,
      default: ''
    },
    defKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      flowDiagramVisible: false
    }
  },
  watch: {
    id(newName, oldName) {
      if (this.id) {
        this.getTableData()
      }
    }
  },
  created() {
    if (this.id) {
      this.getTableData()
    }
  },
  methods: {
    /**
     * 加载基础数据
     * @author mbb
     */
    getTableData() {
      window.apiList['bpmn/bpmInst'].flowHistory({ bizKey: this.id, defKey: this.defKey, ignoreInstIdNull: true }).then(res => {
        this.tableData = res.data && res.data.length > 0 ? res.data : []
        // 删除最后一条pending状态
        if (this.tableData && this.tableData.length > 0) {
          // if (this.tableData[this.tableData.length - 1].status == 'pending') {
          //   this.tableData.splice(this.tableData.length - 1, 1)
          // }
          this.tableData.forEach(item => {
            if (this.$utils.isEmpty(item.auditorName)) {
              if (item.qualifiedExecutor != null && item.qualifiedExecutor.length > 0) {
                item.auditorName = item.qualifiedExecutor
                    .map(user => {
                      return user.executor
                    })
                    .join(',')
              }
            }
          })
          this.tableData.sort((a,b) => a.createTime > b.createTime ? -1 : 1)
        }
      })
    },
    // 表格斑马纹!
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return ''
      } else {
        return 'dark-row'
      }
    },
    viewFlowchart() {
      this.flowDiagramVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.flowHistoryMain {
  width: calc(100% - 10px);
  min-height: calc(100% - 20px);
  margin: 10px 0;
  height: inherit;
  background: #fff;
  overflow: hidden;
}
.tableStyleA {
  width: 100%;
  /* height: 200px; */
  min-height: 100px;
  overflow-y: auto !important;
}
::v-deep .el-table {
  .el-table__cell {
    &.is-center {
      .cell {
        &.el-tooltip {
          justify-content: center !important;
          text-align: center !important;
        }
      }
    }
  }
}
</style>
