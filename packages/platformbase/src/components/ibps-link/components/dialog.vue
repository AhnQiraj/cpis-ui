<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="marginTop+'px'"
    :width="dialogWidth"
    class="ibps-link-dialog"
    :class="{
      ['ibps-link-dialog__'+type] :true,
      'ibps-link-dialog__notitle':$utils.isEmpty(title),
      'ibps-dialog-90': isShowDialog
    }"
    append-to-body
    :fullscreen="components.fullscreen||false"
    @open="getFormData"
    @close="closeDialog"
  >
    <template slot="title">
      <div>{{ title }}&nbsp;</div>
    </template>
    <div
      v-if="dialogVisible"
      :style="type === 'form' || type === 'detail'?{height:'100%',width: '100%'} :{'height': bodyHeight ,'width':bodyWidth}"
    >
      <ibps-link-form
        v-if="type === 'form' || type === 'detail'"
        :config="config"
        :default-data="defaultData"
        :dynamic-params="dynamicParams"
        :pk-value="pkValue"
        :readonly="type === 'detail'"
        :mode="components.fullscreen?null:'dialog'"
        :width="components.fullscreen?'100%':dialogWidth"
        @callback="callbackPage"
        @close="closeDialog"
      />
      <!--- :mode="!components.fullscreen?'dialog':null"-->
      <ibps-link-data-template
        v-else-if="type === 'dataTemplate'"
        :config="config"
        :dynamic-data="dynamicData"
        :dynamic-params="dynamicParams"
        :fullscreen="components.fullscreen"
        :height="bodyHeight"
        :title-height="$utils.isEmpty(title)?0:50"
        @callback="callbackPage"
        @close="closeDialog"
      />
      <iframe
        v-else
        :src="components.url"
        height="100%"
        width="100%"
        frameborder="0"
      />
    </div>
  </el-dialog>
</template>
<script>
import IbpsLinkForm from '@platform/components/ibps-link/components/form'
import IbpsLinkDataTemplate from '@platform/components/ibps-link/components/data-template'
export default {
  components: {
    IbpsLinkForm,
    IbpsLinkDataTemplate
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    components: {
      type: Object,
      default: () => {}
    },
    config: Object,
    dynamicData: {
      type: [Object, String]
    },
    dynamicParams: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      templateType: '',
      template: '',
      defaultData: {},
      pkValue: ''
    }
  },
  computed: {
    isShowDialog() {
      if (this.type === 'fixed' && !this.components.fullscreen) {
        return false
      }
      return !this.components.fullscreen
    },
    type() {
      if (this.$utils.isEmpty(this.config)) {return ''}
      return this.config.type || ''
    },
    dataType() {
      if (this.$utils.isEmpty(this.config)) {return 'add'}
      return this.config.dataType || 'add'
    },
    title() {
      return this.components ? this.components.title || '' : ''
    },
    dialogWidth() {
      const width = parseInt(this.components ? this.components.dialogWidth || this.components.width || '80' : '80')
      return width > 100 ? width + 'px' : width + '%'
    },
    bodyWidth() {
      const width = parseInt(this.components.bodyWidth || this.components.width || '100')
      return width > 100 ? width + 'px' : width + '%'
    },
    bodyHeight() {
      const height = parseInt(this.components.bodyHeight || this.components.height || '100')
      if (this.type === 'fixed') {
        const isTitle = this.$utils.isEmpty(this.title) ? 0 : 50
        return this.components.fullscreen ? window.innerHeight - isTitle + 'px' : height > 100 ? height + 'px' : height + '%'
      } else if (this.type === 'dataTemplate') {
        return height > 100 ? height - 52 + 'px' : height + '%'
      } else {
        return height > 100 ? height + 'px' : height + '%'
      }
    },
    marginTop() {
      return this.components ? this.components.dialogTop || 50 : 50
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
      if ((this.type === 'form' && this.dataType === 'add')) {
        this.defaultData = this.dynamicData || {}
      } else {
        this.pkValue = this.$utils.isNotEmpty(this.dynamicData) ? this.dynamicData : null
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 回调上个页面
     */
    callbackPage() {
      this.$emit('callback', true)
    }
  }
}
</script>
<style lang="scss">
  .ibps-link-dialog{
    overflow:auto !important;
    .el-dialog__body {
      padding: 0;
    }
    &.ibps-link-dialog__form{
       .el-dialog__body {
          overflow: auto;
          height: 100%;
          padding: 0px;
      }
    }
    &.ibps-link-dialog__dataTemplate{
        .el-dialog__body {
          overflow: hidden;
          height: 100% !important;
          padding-left: 5px;
          padding-right: 5px;
          padding-bottom: 5px;
        }
        .el-dialog__headerbtn{
          z-index: 9999;
        }
    }
    &.ibps-link-dialog__notitle{
      .el-dialog__header{
        border-bottom:0;
        padding: 0;
      }
      .el-dialog__headerbtn{
        z-index: 9999;
      }
    }
  }
</style>
