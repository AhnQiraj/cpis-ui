<template>
  <div v-loading="loading" :element-loading-text="$t('common.loading')">
    <el-timeline v-if="opinions && opinions.length > 0">
      <el-timeline-item v-for="(item, index) in opinions" :key="index" :type="item.status === 'pending' ? 'success' : 'danger'" :hide-timestamp="true" placement="top" size="large" class="approval-history-timeline-item">
        <div slot="dot" style="left: -15px">
          <el-avatar v-if="$utils.isNotEmpty(item.userImg)" class="approval-history-photo">
            <img :src="getImage(item.userImg)" />
          </el-avatar>
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
                <template v-if="item.interpose === 1">
                  <span class="red">({{ $t('baseCommon.other.interoApproval') }})</span>
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
    </el-timeline>
    <el-alert v-else :closable="false" :title="$t('baseCommon.component.noApprovalHistory')" type="warning" show-icon style="height: 50px" />
  </div>
</template>
<script>
import { getFile } from '@platform/utils/avatar'
export default {
  props: {
    taskId: String,
    instId: String,
    nodeId: String,
    batch: String
  },
  data() {
    return {
      loading: false,
      active: -1,
      opinions: [],
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
    getFormData() {
      this.loading = true
      window.apiList['bpmn/bpmInst']
        .flowHistory({
          taskId: this.taskId,
          instId: this.instId
        })
        .then(response => {
          this.loading = false
          this.opinions = response.data
          this.setActive()
        })
        .catch(() => {
          this.loading = false
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
          this.opinions = response.data
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
