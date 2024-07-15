<template>
  <el-dialog :visible.sync="dialogVisible" :width="width" class="approval-history-dialog" append-to-body :title="$t('common.buttons.approvalHistory')" top="5vh" @open="getFormData" @close="closeDialog">
    <approval-history v-if="dialogVisible" ref="approvalHistory" v-bind="$props" />
  </el-dialog>
</template>
<script>
import ApprovalHistory from './index'
export default {
  components: {
    ApprovalHistory
  },
  props: {
    visible: Boolean,
    taskId: String,
    instId: String,
    nodeId: String,
    bizKey: String,
    type: {
      type: String,
      default: 'default'
    },
    width: {
      type: String,
      default: '80%'
    }
  },
  data() {
    return {
      dialogVisible: false,
      active: -1,
      opinions: []
    }
  },
  watch: {
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.opinions = null
  },
  methods: {
    getFormData() {
      this.$nextTick(() => {
        if (this.type === 'node') {
          this.$refs.approvalHistory.getNodeFormData()
        } else {
          this.$refs.approvalHistory.getFormData()
        }
      })
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
.approval-history-dialog {
  .el-dialog__body {
    height: calc(90vh - 110px) !important;
  }
  .el-card__body {
    padding-top: 5px;
  }
}
</style>
