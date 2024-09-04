<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="editor-dialog"
    append-to-body
    :title="title"
    @close="closeDialog"
  >
    <ibps-editor-file v-if="dialogVisible" :disabled="false" :min-height="610" :max-height="610" :data="data" :watermark="watermark" @change="changeData"></ibps-editor-file>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog('confirm')">{{ $t('baseCommon.buttons.confirm') }}</el-button>
      <el-button @click="closeDialog">{{ $t('baseCommon.buttons.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'IbpsEditorFileDialog',
  components: {
    // 异步加载组件
    IbpsEditorFile: () => import('./index.vue')
  },
  props: {
    title: {
      type: String,
      default: '编辑'
    },
    data: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    watermark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      returnData: ''
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {
    changeData(data) {
      this.returnData = data
    },
    closeDialog(type) {
      if (type === 'confirm') {
        this.$emit('confirm', this.returnData)
      }
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .editor-dialog {
    width: calc(100% - 230px) !important;
    min-width: 100px !important;
    height: 750px !important;
  }
</style>
