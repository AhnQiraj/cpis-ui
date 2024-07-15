<template>
  <el-dialog
    ref="dialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-renderer-dialog"
    :width="width"
    :top="top"
    :title="title"
    :custom-class="customClass"
    :class="{
      'form-renderer-dialog__dialog': mode==='dialog'
    }"
    append-to-body
    @open="loadFormData"
    @close="closeDialog"
  >
    <template v-if="dialogVisible">
      <ibps-formrender
        v-if="formDefData"
        ref="formrender"
        :form-def="formDefData"
        :data="formData"
        :width="width"
        :preview="preview"
        :buttons="buttons"
        buttons-position="center"
        mode="dialog"
        @close="closeDialog"
        @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
        @load="handleLoad"
      />
    </template>
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import Vue from 'vue'
import FormButton from './button/formButton'
Vue.component('IbpsFormrender', () => import('@platform/business/platform/form/formrender/index.vue'))
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    customClass: {
      type: String
    },
    width: {
      type: String,
      default: '80%'
    },
    top: {
      type: String,
      default: '0'
    },
    formDef: { // 表单定义
      type: Object
    },
    data: { // 表单数据
      type: Object
    },
    mode: { // 表单模式
      type: String
    },
    preview: { // 预览模式
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formDefData: null,
      formData: {},
      formOpinionData: {},
      buttons: null,
      toolbars: [
        { alias: 'save',
          label: '确定',
          icon: 'ok'
        },
        { alias: 'close',
          label: '取消',
          icon: 'cancel'
        }
      ]
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
    this.formDefData = null
    this.formData = null
    this.formOpinionData = null
    this.buttons = null
    this.toolbars = null
    this.stepButtons = null
  },
  methods: {
    emitEventHandler(key) {
      switch (key) {
        case 'save':
          this.handleConfirm(key)
          break
        case 'close' :
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm(key) {
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          this.formSubmitVerify((result, errorMsg) => {
            if (!result) {
              this.$message.closeAll()
              return this.$message.warning(errorMsg)
            }
            this.$emit('action-event', key, this.getFormData())
          })
        } else {
          this.formErrorToast()
        }
      })
    },
    getForm() {
      return this.$refs.formrender
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.getForm().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formErrorToast() {
      ActionUtils.saveErrorMessage()
    },
    // 处理表单提交验证
    formSubmitVerify(callback) {
      this.getForm().formSubmitVerify(callback)
    },
    handleLoad() {
      this.$emit('loading')
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      return this.getForm().getFormData()
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDefData = null
      this.formData = null
      this.$emit('close', false)
    },
    loadFormData() {
      this.formDefData = JSON.parse(JSON.stringify(this.formDef))
      this.formData = JSON.parse(JSON.stringify(this.data))
      // 功能按钮
      this.buttons = this.getButtons(JSON.parse(JSON.stringify(this.toolbars)), {})
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
  .form-renderer-dialog{
    .el-dialog__body {
      height: 100%;
      padding: 10px 0 5px 0;
    }
    .el-dialog__headerbtn{
      z-index: 9999;
    }
    &.form-renderer-dialog__dialog{
       .el-dialog__body {
        height: 100%;
        padding: 0px;
      }
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
