<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="动态脚本"
    class="form-script-dialog"
    top="0"
    width="80%"
    append-to-body
    @close="closeDialog"
  >
    <div>xxx</div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  mmethods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
