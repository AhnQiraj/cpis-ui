<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    fullscreen
    title="表单打印"
    class="ibps-form-print-template-dialog"
    @opened="getFormData"
    @close="closeDialog"
  >
    <pdf-viewer
      v-if="dialogVisible"
      ref="viewer"
    />
  </el-dialog>
</template>
<script>
import { pdf } from '@platform/api/platform/form/formPrint'
export default {
  components: {
    'pdf-viewer': () => import('@platform/components/ibps-file-viewer/pdf/index.vue')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    pk: [String, Number],
    data: Object
  },
  data() {
    return {
      dialogVisible: this.visible
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
      pdf({
        formPrintTemplateId: this.id,
        pk: this.pk,
        formData: this.$utils.isNotEmpty(this.data) ? JSON.stringify(this.data) : ''
      }).then((response) => {
        let url = window.URL.createObjectURL(new Blob([response.data]))
        url = url + '&.pdf'// pdf.js可能识别不了 加 '&.pdf'解决
        this.$refs.viewer.loadData(url)
      }).catch(() => {
      })
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
  .ibps-form-print-template-dialog{
    .el-dialog__body{
      padding:0;
    }
  }
</style>
