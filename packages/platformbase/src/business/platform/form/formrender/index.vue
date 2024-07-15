<template>
  <div style="height:100%; width: 100%;overflow: hidden;" :class="['dynamic-form__' + formKey]">
    <ibps-watermark :disabled="!enableWatermark" :text="watermarkText">
      <!-- 表单按钮--->
      <template v-if="isTop && (hasActions || hasStepButton)">
        <form-toolbar ref="toolbar" :button-position="buttonPosition" :actions="actions" :size="buttonSize" :width="width" :mode="mode" :step-buttons="stepButtons" :step-num="stepNum" :cur-active-step="curActiveStep" @action-event="handleButtonEvent" @step-event="handleStepnEvent" @validate="validate" @callback="callback" @formSubmitVerify="formSubmitVerify" @form-opinion-validate="formOpinionValidate" />
      </template>
      <!--表单-->
      <dynamic-form ref="dynamicForm" v-model="formData" :form-def="formDefData" :permissions="permissions" :readonly="readonly" :params="params" :initialization="initialization" :cur-active-step.sync="curActiveStep" :preview="preview" :style="dynamicFormStyle" class="form-container" @cascade-data="handleCascadeData" />
      <!-- 表单按钮--->
      <template v-if="!isTop && (hasActions || hasStepButton)">
        <form-toolbar ref="toolbar" :button-position="buttonPosition" :actions="actions" :size="buttonSize" :width="width" :mode="mode" :step-buttons="stepButtons" :step-num="stepNum" :cur-active-step="curActiveStep" @action-event="handleButtonEvent" @step-event="handleStepnEvent" @validate="validate" @callback="callback" @formSubmitVerify="formSubmitVerify" @form-opinion-validate="formOpinionValidate" />
      </template>
    </ibps-watermark>
    <component :is="dialogTemplate" v-if="dialogTemplate" ref="dialogTemplate" v-bind="dialogTemplateAtts" />
  </div>
</template>
<script>
import ActionUtils from '@platform/utils/action'
// import JForm from '../utils/JForm'// 自定义脚本
import eventsUtil from '@platform/utils/eventsUtil' // 自定义脚本
import FormToolbar from './toolbar'
import FormButton from './button/formButton'
import DynamicForm from './dynamic-form/dynamic-form'
import IbpsWatermark from '@platform/components/ibps-watermark'
const JFormId = 'JForm'
const sizeMap = {
  default: 42,
  medium: 36,
  small: 32,
  mini: 28
}
export default {
  components: {
    FormToolbar,
    DynamicForm,
    IbpsWatermark
  },
  props: {
    buttonsPosition: {
      // 全局按钮位置
      type: String
    },
    buttonPriority: {
      // 按钮优先级
      type: String,
      default: 'outside'
    },
    formDef: {
      type: Object,
      required: true
    },
    data: {
      type: Object
    },
    /**
     * @description 工具栏
     */
    buttons: {
      type: Array
    },
    /**
     * 是否只读 (流程实例时候控制)
     */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     *  @description 扩展参数 比如流程id等
     *流程相关信息:
     * taskId:任务id
     * instanceId：流程实例
     * defId：定义Id
     * formOpinionData： 流程意见配置及已经审批的意见数据
     */
    params: {
      type: Object
    },
    mode: {
      // 表单模式,default：缺省模式
      type: String
    },
    height: [Number, String],
    width: [Number, String],
    marginTop: {
      type: [Number, String]
    },
    offsetTop: Number,
    offsetBottom: Number,
    preview: {
      // 预览模式
      type: Boolean
    }
  },
  data() {
    const buttonSize = this.$ELEMENT.size
    const buttonHeight = (sizeMap[buttonSize] || 40) + 22
    return {
      loading: false,
      formData: {},
      formDefData: {},
      permissions: null,
      formParams: {},
      initialization: false,
      curActiveStep: 0,
      dialogTemplate: null,
      dialogTemplateAtts: {},
      buttonPosition: '',
      buttonHeight: buttonHeight,
      buttonSize: buttonSize,
      eventsUtil: {}
    }
  },
  computed: {
    formKey() {
      return this.formDefData.key
    },
    hasActions() {
      return this.actions && this.actions.length > 0
    },
    isTop() {
      return this.$utils.isNotEmpty(this.buttonPosition) ? this.buttonPosition.includes('top') : true
    },
    isShowTop() {
      if (this.$utils.isEmpty(this.formDef) || this.$utils.isEmpty(this.formDef.attrs)) {
        return false
      }
      return this.$utils.isNotEmpty(this.formDef.attrs.buttonPosition) && this.formDef.attrs.buttonPosition === 'topDynamic'
    },
    dynamicFormStyle() {
      return this.mode === 'default' || this.mode === 'dialog'
        ? null
        : {
            marginTop: this.isTop ? (this.hasActions ? this.buttonHeight + 'px' : null) : null,
            marginBottom: this.isTop ? null : this.hasActions ? this.buttonHeight + 'px' : null
          }
    },
    dynamicForm() {
      return this.$refs ? this.$refs.dynamicForm : null
    },
    actions() {
      return this.getActions()
    },
    formStep() {
      return this.getFormStep()
    },
    stepButtons() {
      return this.getStepButtons()
    },
    hasStepButton() {
      return this.$utils.isNotEmpty(this.stepButtons)
    },
    stepNum() {
      if (this.$utils.isEmpty(this.formStep)) {
        return 0
      }
      return this.formStep.field_options.columns.length
    },
    finishStep() {
      return this.stepNum - 1 === this.curActiveStep
    },
    enableWatermark() {
      return this.formDefData ? this.formDefData.attrs.watermark || false : false
    },
    watermarkText() {
      return this.enableWatermark ? this.formDefData.attrs.watermarkText || '' : ''
    }
  },
  watch: {
    formDef: {
      handler: function(val, oldVal) {
        if (val && val !== oldVal) {
          this.formDefData = val
          this.initialization = false
          this.initUI()
        }
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        if (val && val !== oldVal) {
          const data = JSON.parse(JSON.stringify(val))
          // 表单数据
          this.formData = data.responses || {}
          // 表单权限
          this.permissions = data.permissions || null
        }
      },
      immediate: true,
      deep: true
    },
    curActiveStep() {
      this.$emit('cur-active-step', this.curActiveStep)
    },
    buttonsPosition: {
      handler: function(val, oldVal) {
        this.buttonPosition = val
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initUI()
  },
  beforeDestroy() {
    this.formData = null
    this.formDefData = null
    this.permissions = null
    this.formParams = null
    this.dialogTemplate = null
    this.dialogTemplateAtts = null
    eventsUtil.cleanEventsByName(this.eventsUtil._eventsUtilsID)
    this.eventsUtil = null
  },
  methods: {
    initUI() {
      if (!this.initialization) {
        // this.initJForm()
        this.initialization = true
        this.initFormStyle()
        if (this.formDef.attrs && this.formDef.attrs.script) {
          this.eventsUtil = eventsUtil._initEvents(this.formDef.attrs.script, 'form_' + this.formDef.key, true)
        }
        this.$nextTick(() => {
          this.$utils.requestAnimationFrame(() => {
            this.loadScript()
          }, 16)
        })
      }
    },
    getActions() {
      if (this.buttonPriority === 'outside' && this.formDef.formType !== 'combination') {
        return this.buildActions(this.buttons)
      } else {
        const buttons = this.getFormDefButtons()
        if (this.$utils.isNotEmpty(buttons)) {
          this.buttonPosition = this.getFormDefButtonPosition() || 'topLeft'
          return this.buildFormDefButtons(buttons)
        } else {
          return this.buildActions(this.buttons)
        }
      }
    },
    buildActions(buttons) {
      const actions = []
      if (this.$utils.isEmpty(buttons)) {
        return actions
      }
      buttons.forEach((btn, i) => {
        const key = btn.getAlias()
        let disabled = false
        let hidden = false
        if (key !== 'close' && this.hasStepButton && !this.finishStep) {
          disabled = true
        }
        let _custom = {}
        if (this.$utils.isNotEmpty(btn.attributes) && this.$utils.isNotEmpty(btn.attributes.custom_url)) {
          _custom = {
            custom_url: btn.attributes.custom_url,
            custom_method: btn.attributes.custom_method,
            custom_setting: btn.attributes.custom_setting
          }
        }
        hidden = this.onLoadActions(key, btn, 'hidden', hidden)
        disabled = this.onLoadActions(key, btn, 'disabled', disabled)
        const button = {
          ..._custom,
          key: key,
          label: btn.getLabel(),
          icon: btn.getIcon(),
          type: btn.getType(),
          disabled: disabled,
          hidden: hidden,
          callback: () => {
            // 前置事件
            this.beforeScript(key, result => {
              if (result) {
                return btn.action.apply(this, [btn])
              }
            })
          }
        }
        actions.push(button)
      })
      return actions
    },
    getFormDefButtons() {
      return this.formDef && this.formDef.attrs ? this.formDef.attrs.buttons : []
    },
    getFormDefButtonPosition() {
      return this.formDef && this.formDef.attrs ? this.formDef.attrs.buttonPosition : ''
    },
    /**
     * 构建表单
     */
    buildFormDefButtons(buttons) {
      if (this.$utils.isEmpty(buttons)) {
        return []
      }
      const btn = new FormButton({
        buttons: buttons,
        params: {}
      })
      return this.buildActions(btn.response_buttons)
    },
    // 加载按钮事件
    onLoadActions: function(key, button, type, defaultVal) {
      // const buttonActionResult = JForm._onLoadActions(this, key, button, type)
      const buttonActionResult = eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, button, type)
      if (typeof buttonActionResult !== 'undefined' && buttonActionResult) {
        return true
      }
      return defaultVal
    },
    handleButtonEvent(button, position, data, index) {
      const action = this.actions.find(action => {
        return button.key === action.key
      })
      if (action) {
        action.callback()
      }
    },
    handleActionEvent(actionKey, args = {}) {
      this.$emit('action-event', actionKey, args)
    },
    /** **步骤条Step 处理 */
    getStepButtons() {
      if (this.$utils.isEmpty(this.formStep)) {
        return []
      }
      if (this.$utils.isNotEmpty(this.formStep.field_options.buttons)) {
        return this.formStep.field_options.buttons
      } else {
        const defaultButtons = [
          {
            key: 'prev',
            icon: 'angle-left',
            label: '上一步'
          },
          {
            key: 'next',
            icon: 'angle-right',
            label: '下一步'
          }
        ]
        return defaultButtons
      }
    },
    getFormStep() {
      const step = {}
      if (this.$utils.isEmpty(this.formDef)) {
        return
      }
      for (let i = 0; i < this.formDef.fields.length; i++) {
        const field = this.formDef.fields[i]
        if (field.field_type === 'steps' && !this.$utils.toBoolean(field.field_options.hide_rights, false)) {
          return field
        }
      }
      return step
    },
    handleStepnEvent(val) {
      this.curActiveStep = val
    },
    callback() {
      this.$emit('callback')
    },
    closeDialog() {
      this.$emit('close')
    },
    getForm() {
      return this.$refs.dynamicForm
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.getForm().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formErrorToast(msg) {
      ActionUtils.saveErrorMessage(msg)
    },
    // 处理表单提交验证
    formSubmitVerify(callback) {
      if (!this.hasScript()) {
        if (callback) {
          this.getForm().formSubmitVerify(callback)
        }
        return
      }
      // JForm._onValidate(this, (result, errorMsg) => {
      eventsUtil._eventCall(this.eventsUtil, 'onValidate', this, (result, errorMsg) => {
        if (!result) {
          return callback(result, errorMsg || '验证不通过,请检查表单')
        }
        this.getForm().formSubmitVerify(callback)
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      return this.getForm().getFormData()
    },
    /**
     * 获取字段数据
     */
    getData(name) {
      const data = this.getFormData()
      return data[name]
    },
    /**
     * 设置字段数据
     */
    setData(name, value) {
      return this.getForm().setFieldData(name, value)
    },
    /**
     * 设置表单权限
     */
    getFormRights(name) {
      return this.getForm().getFormRights(name)
    },
    /**
     * 设置表单权限
     */
    setFormRights(name, value) {
      return this.getForm().setFormRights(name, value)
    },
    hasFormOpinion() {
      return this.getForm().hasFormOpinion()
    },
    /**
     * 表单意见数据
     */
    getFormOpinionData() {
      return this.getForm().getFormOpinionData()
    },
    /**
     * 表单直接审批
     */
    getDirectHandlerSign() {
      return this.getForm().getDirectHandlerSign()
    },
    /**
     * 获取审批意见验证
     */
    formOpinionValidate(calback, flag) {
      this.getForm().formOpinionValidate(calback, flag)
    },
    /**
     * 获取表单字段组件实例
     */
    getRefs(fieldName) {
      return this.getForm().getRefs(fieldName)
    },
    /**
     * 获取表单字段的具体控件组件实例
     */
    getRefsField(fieldName) {
      return this.getForm().getRefsField(fieldName)
    },
    getFormParams() {
      return this.getForm().getFormParams()
    },
    getFormParamByKey(key) {
      return this.getForm().getFormParamByKey(key)
    },
    initFormStyle() {
      if (this.formDef.attrs && this.formDef.attrs.form_style) {
        this.$utils.createStyles(this.formDef.attrs.form_style, 'dynamic-form__' + this.formKey)
      }
    },
    /**
     * 初始化脚本
     */
    initJForm() {
      let script = document.getElementById(JFormId)
      if (script) {
        script.parentNode.removeChild(script)
      }
      if (this.formDef.attrs && this.formDef.attrs.script) {
        const codeScript = this.formDef.attrs.script
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = JFormId
        document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(codeScript))
        } catch (ex) {
          console.error(ex)
          script.text = codeScript
        }
        document.body.appendChild(script)
      }
    },
    // 处理脚本
    hasScript() {
      return this.getForm().hasScript
    },
    // 加载脚本
    loadScript() {
      this.$emit('load', this)
      if (!this.hasScript()) {
        return
      }
      // JForm._onLoad(this, this.getForm)
      eventsUtil._eventCall(this.eventsUtil, 'onLoad', this)
    },
    // 前置脚本
    beforeScript(action, callback) {
      if (!this.hasScript()) {
        if (callback) {
          const flag = true
          callback(flag)
        }
        return
      }
      // JForm._beforeSubmit(this, action, this.getFormData(), callback)
      eventsUtil._eventCall(this.eventsUtil, 'beforeSubmit', this, action, this.getFormData(), callback)
    },
    // 后置脚本
    afterScript(action, params, callback) {
      this.formParams = params
      if (!this.hasScript()) {
        if (callback) {
          const flag = true
          callback(flag)
        }
        return
      }
      // JForm._afterSubmit(this, action, this.getFormData(), callback)
      eventsUtil._eventCall(this.eventsUtil, 'afterSubmit', this, action, this.getFormData(), callback)
    },
    resize() {
      this.$refs.toolbar.updatePosition()
    },
    handleCascadeData(data) {
      this.$emit('cascade-data', data)
    }
  }
}
</script>
<style lang="scss" scoped>
@media print {
  .dynamic-form {
    margin-top: 0 !important;
  }
  .el-dialog__headerbtn {
    display: none !important;
    padding: 0;
    margin: 0;
  }
  .hidden-print {
    padding: 0;
    margin: 0;
  }
}
</style>
