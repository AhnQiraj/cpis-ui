<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="ibps-dialog-70"
    top="5vh"
    width="80%"
    append-to-body
    @open="openDialog"
    @close="closeDialog"
  >
    <request-restful
      v-if="dialogVisible"
      ref="request"
      :dropdown-fields="combinationFields"
      :value.sync="formData"
      :method="method"
      :readonly="readonly"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import RequestRestful from '@platform/business/platform/form/components/interface/request/restful'
export default {
  components: {
    RequestRestful
  },
  props: {
    method: {
      type: String,
      default: 'POST'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    combinationFields: { // 组合表单字段
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'header/body设置'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.formData = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      const data = JSON.parse(JSON.stringify(this.formData))
      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    openDialog() {
      if (this.$utils.isNotEmpty(this.data)) {
        this.formData = JSON.parse(JSON.stringify(this.data))
      } else {
        this.formData = {}
      }
      if (this.$utils.isEmpty(this.formData)) {
        this.$set(this.formData, 'bodyType', 'json')
      }
    }
  }
}
</script>
