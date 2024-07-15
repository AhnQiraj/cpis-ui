<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="flow-diagram-dialog" append-to-body :title="$t('common.buttons.flowImage')" top="2vh" width="80%" @open="getFormData" @close="closeDialog">
    <flow-diagram v-if="dialogVisible" ref="flowDiagram" v-bind="$props" />
  </el-dialog>
</template>
<script>
import FlowDiagram from "./index"
export default {
  name: "FlowDiagramDialog",
  components: {
    FlowDiagram
  },
  props: {
    visible: Boolean,
    defId: String,
    taskId: String,
    instId: String,
    bizKey: String,
    toolbar: {
      type: Boolean,
      default: true
    },
    height: Number,
    width: Number,
    autoHeight: Boolean,
    id: {
      type: String,
      default: function () {
        // 随机个id避免一个页面多个流程图
        return "ibps-flow-diagram" + Date.parse(new Date()) / 1000
      }
    }
  },
  data() {
    return {
      dialogVisible: false
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
  methods: {
    getFormData() {
      this.$nextTick(() => {
        this.$refs.flowDiagram.getFormData()
      })
    },
    closeDialog() {
      this.$emit("close", false)
    }
  }
}
</script>
<style lang="scss">
.flow-diagram-dialog {
  .el-dialog__body {
    padding: 0;
    height: calc(100vh - 100px) !important;
  }
}
</style>
<style scoped lang="scss">
::v-deep .el-dialog__body {
  overflow: hidden !important;
}
</style>
