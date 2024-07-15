<template>
  <div
    v-loading.fullscreen.lock="dialogLoading"
    :element-loading-text="$t('common.loading')"
    style="height: 100%; width: 100%;"
  >
    <ibps-link-formrender
      v-if="formDef"
      ref="formrender"
      :form-def="formDef"
      :buttons="buttons"
      :data="formData"
      :readonly="readonly"
      :mode="mode"
      :width="width"
      :margin-top="marginTop"
      :params="dynamicParams"
      button-priority="button"
      @close="closeDialog"
      @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
    />
    <!-- 流程定义选择器 -->
    <bpm-def-dialog
      v-model="bpmDefValue"
      :visible="bpmDefDialogVisible"
      :form-key="formKey"
      :multiple="false"
      :is-data-template-use="true"
      @close="visible => bpmDefDialogVisible = visible"
      @action-event="handleDialogActionEvent"
    />
  </div>
</template>
<script>
import { getFormData } from '@platform/api/platform/form/formDef'
import ActionMixin from '@platform/business/platform/form/formrender/button/action'
import Vue from 'vue'
Vue.component('IbpsLinkFormrender', () => import('@platform/business/platform/form/formrender/index.vue'))
import FormButton from '@platform/business/platform/form/formrender/preview/formButton'
import BpmDefDialog from '@platform/business/platform/bpmn/definition/dialog'
export default {
  components: {
    BpmDefDialog
  },
  mixins: [ActionMixin],
  props: {
    data: { // 表单数据
      type: Object
    },
    config: {
      type: Object
    },
    defaultData: { // 默认数据
      type: Object
    },
    pkValue: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    mode: { // 表单模式,default：缺省模式
      type: String
    },
    width: [Number, String],
    marginTop: [Number, String],
    dynamicParams: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      formPreviewDialogVisible: false,
      dialogLoading: true,
      formDef: null,
      formData: {},
      buttons: null,
      toolbars: [],
      actions: [
        { key: 'confirm', label: '确定' }
      ],
      bpmDefValue: {},
      bpmDefDialogVisible: false
    }
  },
  computed: {
    formKey() {
      if (this.$utils.isEmpty(this.config)) {return ''}
      return this.config.formKey
    },
    params() {
      if (this.$utils.isEmpty(this.config)) {return {}}
      return this.config.params || {}
    }
  },
  watch: {
    config: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {return}
        this.loadFormData()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.formDef = null
    this.formData = null
    this.buttons = null
    this.toolbars = null
    this.actions = null
  },
  methods: {
    getForm() {
      return this.$refs.formrender
    },
    formErrorToast() {
      return this.getForm().formErrorToast()
    },
    getFormData() {
      // 表单数据
      return this.getForm().getFormData()
    },
    validate(callback) {
      this.getForm().validate(callback)
    },
    formSubmitVerify(callback) {
      this.getForm().formSubmitVerify(callback)
    },
    afterScript(actionKey, params, callback) {
      this.getForm().afterScript(actionKey, params, callback)
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.buttons = null
      this.$emit('close', false)
    },
    loadFormData() {
      this.dialogLoading = true
      if (this.$utils.isEmpty(this.formKey) && this.$utils.isNotEmpty(this.data)) {
        return
      }
      getFormData({
        pk: this.pkValue || '',
        formKey: this.formKey,
        rightsScope: this.rightsScope || 'form'
      }).then(response => {
        // 从后台获取数据
        const data = response.data
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        } else {
          responses = data.boData ? JSON.parse(data.boData) : {}
        }
        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(data.form) || {}
        // this.readonly = this.formDef ? this.formDef.formType === 'detail' : false
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version
        // 功能按钮
        this.buttons = this.getButtons(this.toolbars, {})
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) {return null}
      const btn = new FormButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    /**
     * 回调上个页面
     */
    callbackPage() {
      this.closeDialog()
      this.$emit('callback', true)
    }
  }
}
</script>
<style lang="scss" >
  .form-renderer-link-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0 0 5px 0;
    }
    .el-dialog__headerbtn{
      z-index: 9999;
    }
    @media print {
      .el-dialog__headerbtn {
        display: none !important
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
  }
</style>
