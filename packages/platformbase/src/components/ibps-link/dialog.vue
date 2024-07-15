<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="dialogTop||'0vh'"
    :width="dialogWidth||'50%'"
    class="ibps-dialog-70"
    append-to-body
    :fullscreen="components.fullscreen||false"
    @open="getFormData"
    @close="closeDialog"
  >
    <div
      v-if="components.customBody"
      :style="{'height':bodyHeight||'100px','width':bodyWidth||'100px'}"
      v-html="$utils.formatText(components.customBody)"
    />
    <iframe
      v-else
      :src="components.url"
      :height="components.bodyHeight||'100%'"
      :width="components.bodyWidth||'100%'"
      frameborder="0"
      scrolling="no"
    />
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    id: String,
    toolbars: {
      type: Array,
      default: () => [
        { key: 'save' },
        { key: 'cancel' }
      ]
    },
    components: Object,
    dialogHeight: String,
    dialogWidth: String,
    dialogTop: String,
    bodyHeight: String,
    bodyWidth: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      templateType: '',
      title: this.components.title || '弹窗信息',
      template: ''
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
  methods: {
    getFormData() {
      // console.log(this.components)
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {},
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    }
  }
}
</script>
