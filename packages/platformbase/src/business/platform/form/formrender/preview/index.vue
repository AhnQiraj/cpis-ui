<template>
  <el-dialog
    ref="dialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-renderer-preview-dialog"
    fullscreen
    append-to-body
    @opened="getFormData"
    @close="closeDialog"
  >
    <div
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
    >
      <formrender
        v-if="dialogVisible && formDef"
        ref="formrender"
        :form-def="formDef"
        :buttons="buttons"
        :data="formData"
        :readonly="readonly"
        preview
        @close="closeDialog"
        @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
        @load="handLoaing"
      />
    </div>
    <!--预览的数据-->
    <el-dialog
      :visible.sync="formPreviewDialogVisible"
      title="表单的数据"
      width="30%"
      top="5vh"
      custom-class="ibps-dialog-80"
      append-to-body
    >
      <template v-if="$utils.isNotEmpty(formOpinionPreviewData)"> 表单数据：</template>
      <ibps-highlight>{{ formPreviewData }}</ibps-highlight>
      <template v-if="$utils.isNotEmpty(formOpinionPreviewData)">
        审批意见数据：
        <ibps-highlight>{{ formOpinionPreviewData }}</ibps-highlight>
      </template>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="actions"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getFormData } from '@platform/api/platform/form/formDef'
import Formrender from '../index'
import FormButton from './formButton'
export default {
  components: {
    Formrender
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formKey: { // 表单定义Key
      type: String
    },
    data: { // 表单定义
      type: Object
    },
    defaultData: { // 默认数据
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formPreviewDialogVisible: false,
      dialogLoading: true,
      formDef: null,
      readonly: false,
      formData: {},
      buttons: null,
      toolbars: [
        {
          key: 'close',
          label: '关闭'
        }, {
          key: 'preview',
          label: '预览数据',
          icon: 'el-icon-view'
        }
      ],
      formPreviewData: {},
      formOpinionPreviewData: {},
      actions: [
        { key: 'confirm', label: '确定' }
      ]
    }
  },
  computed: {
    formDefKey() {
      return this.formKey
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
  beforeDestroy() {
    this.formDef = null
    this.formData = null
    this.buttons = null
    this.toolbars = null
    this.formPreviewData = null
    this.formOpinionPreviewData = null
    this.actions = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.formPreviewDialogVisible = false
          break
        default:
          break
      }
    },
    emitEventHandler(actionKey) {
      switch (actionKey) {
        case 'close':
          this.closeDialog()
          this.$refs.formrender.afterScript(actionKey, {}, () => {
          })
          break
        case 'preview':
          // 表单验证
          this.$refs.formrender.validate(valid => {
            if (valid) {
              // 表单提交校验事件
              this.$refs.formrender.formSubmitVerify((result, errorMsg) => {
                if (!result) {
                  this.$message.closeAll()
                  return this.$message.warning(errorMsg)
                }
                this.formPreviewDialogVisible = true
                this.formPreviewData = this.$refs.formrender.getFormData()
                this.formOpinionPreviewData = this.$refs.formrender.getFormOpinionData()
                // 后置事件
                this.$refs.formrender.afterScript(actionKey, {}, () => { })
              })
            } else {
              this.$refs.formrender.formErrorToast()
            }
          })
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.buttons = null
      this.$emit('close', false)
    },
    getFormData() {
      this.dialogLoading = true
      if (this.$utils.isEmpty(this.formDefKey) && this.$utils.isNotEmpty(this.data)) {
        setTimeout(() => {
          this.formDef = JSON.parse(JSON.stringify(this.data))
          this.readonly = this.formDef ? this.formDef.formType === 'detail' : false
          // 功能按钮
          this.buttons = this.getButtons(this.toolbars, {})
        }, 500)
        return
      }
      getFormData({
        formKey: this.formDefKey,
        rightsScope: 'form'
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
        this.readonly = this.formDef ? this.formDef.formType === 'detail' : false
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version
        // 功能按钮
        this.buttons = this.getButtons(this.toolbars, {})
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    handLoaing() {
      setTimeout(() => {
        this.dialogLoading = false
      }, 100)
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) {return null}
      const btn = new FormButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    }
  }
}
</script>
<style lang="scss" >
  .form-renderer-preview-dialog{
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
