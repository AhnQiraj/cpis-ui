<template>
  <div v-loading="loading" :element-loading-text="$t('common.loading')">
    <el-timeline v-if="opinions && opinions.length > 0">
      <template v-if="hasApproval">
        <el-timeline-item v-for="(item, index) in opinions" :key="index" :type="item.status === 'pending' ? 'success' : 'danger'" :hide-timestamp="true" placement="top" size="large" class="approval-history-timeline-item">
          <div slot="dot" style="left: -15px">
            <el-avatar v-if="$utils.isNotEmpty(item.userImg) && getQualfieds(item.qualfieds).length === 1" class="approval-history-photo">
              <img :src="getImage(item.userImg)" />
            </el-avatar>
            <el-avatar v-else-if="getQualfieds(item.qualfieds).length > 1" class="ibps-icon-users" />
            <el-avatar v-else icon="el-icon-user-solid" class="approval-history-disPhoto" />
          </div>
          <p class="el-timeline-item__timestamp is-top">{{ item.createTime | formatRelativeTime }}&nbsp;&nbsp;({{ item.createTime | dateFormat }})</p>
          <el-card>
            <div slot="header" class="ibps-clearfix">
              <span style="font-weight: bold">{{ item.taskName }}</span>
              <div class="ibps-fr">
                {{ $t('baseCommon.component.approvalState') }}:<el-tag style="border: 0" :style="{ color: item.nodeColor }"> {{ item.statusName }}</el-tag>
              </div>
            </div>
            <p />
            <div v-if="item.status !== 'pending'" class="ibps-clearfix">
              {{ $t('baseCommon.other.approvalOpinion') }}: {{ item.opinion || $t('baseCommon.other.notHave') }}
              <el-link v-if="item.batch" class="ibps-fr" type="primary" @click="handleMore(item.batch, item.taskName)">{{ $t('common.buttons.more') }}</el-link>
            </div>
            <el-link v-if="item.status === 'pending' && item.batch" class="ibps-fr" type="primary" @click="handleMore(item.batch, item.taskName)">{{ $t('common.buttons.more') }}</el-link>
            <p />
            <div class="footer ibps-clearfix">
              <span v-if="item.batch">
                <span v-if="item.qualifiedExecutor && item.status == 'pending'"> {{ $t('baseCommon.other.executor') }}: {{ getName(item.qualifiedExecutor) }} </span>
                <span v-else-if="item.qualifiedExecutor && item.status != 'pending'"> {{ $t('baseCommon.other.executor') }}: {{ getName(item.qualifiedExecutor) }} </span>
                <span v-else> {{ $t('baseCommon.other.notSetExecutor') }} </span>
              </span>
              <span v-else>
                <span v-if="item.auditor">
                  {{ $t('baseCommon.other.executor') }}:{{ item.auditorName}}
                  <template v-if="item.interpose === 1"><span class="red">
                    ({{ $t('baseCommon.other.interoApproval') }})</span>
                  </template>
                </span>
                <span v-else-if="item.qualifiedExecutor"> {{ $t('baseCommon.other.treatExecutor') }}: {{ getName(item.qualifiedExecutor) }} </span>
                <span v-else> {{ $t('baseCommon.other.notSetExecutor') }} </span>
              </span>
              <div v-if="$utils.isNotEmpty(item.completeTime)" class="ibps-fr">
                {{ $t('baseCommon.time.approvalTime') }}:<el-tag type="warning"> {{ item.completeTime | dateFormat }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </template>
      <!--未有审批意见--->
      <template v-else>
        <el-timeline-item v-for="(item, index) in opinions" :key="index" :type="item.status === 'pending' ? 'success' : 'danger'" :hide-timestamp="true" placement="top" size="large">
          <el-card>
            <div class="footer ibps-clearfix">
              <p />
              <div>
                <span v-if="item.name">
                  <el-tooltip :content="$t('baseCommon.message.tentativeUser')" placement="bottom">
                    <abbr title> {{ $t('baseCommon.other.tentativeCandi') }}</abbr> </el-tooltip
                  >:<el-tag :type="item.type | filterUserType">{{ item.name }}</el-tag>
                </span>
                <span v-else> {{ $t('baseCommon.other.notSetExecutor') }} </span>
              </div>
              <p />
              <div>
                {{ $t('baseCommon.component.approvalState') }}:<el-tag style="border: 0" type="info">{{ $t('baseCommon.component.notExecTask') }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </template>
    </el-timeline>
    <el-alert v-else :closable="false" :title="$t('baseCommon.component.noApprovalHistory')" type="warning" show-icon style="height: 50px" />
    <!--流程历史-->
    <approval-history-sign :visible="approvalHistorySignVisible" :title="signTitle" :batch="signBatch" @close="visible => (approvalHistorySignVisible = visible)" />
    <!--流程历史-->
    <approval-history-call-sub :visible="approvalHistoryCallSubVisible" :title="callSubTitle" :node-id="callSubNodeId" @close="visible => (approvalHistoryCallSubVisible = visible)" />
  </div>
</template>
<script>
import { getFile } from '@platform/utils/avatar'
import { remoteRequest } from '@platform/utils/remote'
import ApprovalHistorySign from './sign'
import ApprovalHistoryCallSub from './call-sub'
export default {
  components: {
    ApprovalHistorySign,
    ApprovalHistoryCallSub
  },
  filters: {
    filterUserType(value) {
      const statusMap = {
        user: '',
        org: 'success',
        position: 'warning',
        role: 'info'
      }
      return statusMap[value]
    }
  },
  props: {
    taskId: String,
    instId: String,
    nodeId: String,
    bizKey: String,
    batch: String
  },
  data() {
    return {
      loading: false,
      active: -1,
      opinions: [],
      hasApproval: true,
      approvalHistorySignVisible: false,
      signBatch: '',
      signTitle: '',
      approvalHistoryCallSubVisible: false,
      callSubNodeId: '',
      callSubTitle: ''
    }
  },
  beforeDestroy() {
    this.opinions = null
  },
  methods: {
    getImage(photo) {
      return getFile(photo)
    },
    getQualfieds(str) {
      return this.$utils.parseData(str) || []
    },
    getFormData() {
      this.loading = true
      const params = {
        bizKey: this.bizKey,
        taskId: this.taskId,
        instId: this.instId
      }
      if (this.$utils.isEmpty(this.instId)) {
        params.ignoreInstIdNull = true
      }
      remoteRequest('IbpsFlowHistory', params, () => {
        return this.getRemoteTransFunc(params)
      })
        .then(response => {
          this.loading = false
          if (response.state === 103) {
            this.$emit('error', true)
            return
          }
          this.hasApproval = true
          this.opinions = response.data
          this.setActive()
        })
        .catch(() => {
          this.$emit('error', true)
          this.loading = false
        })
    },
    getRemoteTransFunc(params) {
      return new Promise((resolve, reject) => {
        window.apiList['bpmn/bpmInst']
          .flowHistory(params)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 会签审批历史
     */
    getSignFormData() {
      this.loading = true
      window.apiList['bpmn/bpmInst']
        .flowHistorySign({
          batch: this.batch
        })
        .then(response => {
          this.loading = false
          this.hasApproval = true
          this.opinions = response.data
          this.setActive()
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 子流程审批历史
     */
    getCallSubFormData() {
      this.loading = true
      window.apiList['bpmn/bpmInst']
        .flowHistoryCallSub({
          instId: this.instId,
          nodeId: this.nodeId
        })
        .then(response => {
          this.loading = false
          this.hasApproval = true
          this.opinions = response.data
          this.setActive()
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 节点数据
     */
    getNodeFormData() {
      this.loading = true
      window.apiList['bpmn/bpmTask']
        .getNodeApproval({
          taskId: this.taskId,
          instId: this.instId,
          nodeId: this.nodeId,
          bizKey: this.bizKey
        })
        .then(response => {
          this.loading = false
          const data = response.data
          if (!data.data) {
            return
          }
          this.hasApproval = data.hasApproval
          this.opinions = data.data || []
          this.setActive()
        })
        .catch(() => {
          this.loading = false
        })
    },
    getName(executors) {
      if (!executors) {
        return ''
      }
      const name = []
      for (let i = 0; i < executors.length; i++) {
        name.push(executors[i].executor)
      }
      return name.join(' ')
    },
    getStatusType({ status }, index) {
      return 'status-' + status
    },
    setActive() {
      if (this.$utils.isEmpty(this.opinions)) {
        return
      }
      this.opinions.forEach((o, i) => {
        if (o.status === 'pending') {
          if (this.active < 0) {
            this.active = i
          }
        }
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleMore(batch, taskName) {
      this.signBatch = batch
      this.signTitle = taskName
      this.approvalHistorySignVisible = true
    }
  }
}
</script>
<style lang="scss">
.approval-history {
  .el-card__body {
    padding-top: 5px;
  }
}
.approval-history-timeline-item {
  .el-timeline-item__dot {
    left: -15px;
    top: -10px;
  }
}
</style>
