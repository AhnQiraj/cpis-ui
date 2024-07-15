import Utils from '@platform/utils/util'
// 判断是否存在动态参数
let result = false
/**
 * 生成[表单管理]代码模版
 * @param {*} formDef
 */
export function generateFormCode(formDef, showDialog = false) {
  let data = {}
  // 判断是否为弹窗显示
  let _show = false
  if (Utils.isNotEmpty(formDef)) {
    data = formDef
    if (Utils.isNotEmpty(formDef.attrs)) {
      _show = formDef.attrs.generateCodeDialog || false
    }
  }
  const template =
`<template>
${_show ? `
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-generate-form"
    fullscreen
    destroy-on-close
    @open="openDialogFormData"
    @close="closeDialogWrapper"
  >` : ''}
  <ibps-container type="full" class="generate-dynamic-form page">
    <ibps-form-formrender
      v-if="formDef"
      ref="formrender"
      :form-def="formDef"
      :data="formData"
      mode="dialog"
      :params="formParams"
      :readonly="readonly"
      @load="loadFormrender"
      @cur-active-step="(val)=>curActiveStep=val"
    />
    <div slot="footer" class="el-dialog--center">
      <el-button
        v-for="button in stepButtons"
        :key="button.key"
        :size="button.size||$ELEMENT.size"
        :icon="'ibps-icon-'+button.icon"
        :autofocus="false"
        :disabled="disabledStepButton(button.key)"
        :loading="stepLoading"
        @click="()=>{ handleStepButtonEvent(button)}"
      >{{ button.label }}
      </el-button>
      <span class="ibps-pr-10">&nbsp;</span>
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </ibps-container>
  ${_show ? `
  </el-dialog>` : ''}
</template>
<script>
import ActionUtils from '@platform/utils/action'
export default {
  components: {
    'ibps-form-formrender': () => import('@platform/business/platform/form/formrender/index.vue')
  },
  props: {${_show ? `
    visible: {
      type: Boolean,
      default: true
    },` : ''}
    formParams: Object,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {${_show ? `
      dialogVisible: false,` : ''}
      formDef: ${JSON.stringify(data)},
      formData: {
        // 表单数据
        responses: {},
        // 表单权限
        permissions: {}
      },
      toolbars: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ],
      stepButtons: [],
      curActiveStep: 0,
      stepNum: 3,
      stepLoading: false
    }
  },${_show ? `
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },` : ''}
  methods: {${_show ? `
    // 关闭当前窗口
    closeDialogWrapper() {
      this.dialogVisible = false
      this.$emit('close', false)
    },
    openDialogFormData() {
      console.info('弹窗打开触发的事件')
    },` : ''}
    formErrorToast() {
      ActionUtils.saveErrorMessage()
    },
    // 处理表单提交验证
    formSubmitVerify(callback) {
      this.getForm().formSubmitVerify(callback)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      return this.getForm().getFormData()
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.getForm().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    getForm() {
      return this.$refs.formrender
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm(key)
          break
        case 'cancel' :
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleStepButtonEvent(button) {
      this.getForm().handleStepButtonEvent(button)
    },
    disabledStepButton(key) {
      if (key === 'prev') {
        return this.curActiveStep === 0
      } else {
        return this.stepNum - 1 === this.curActiveStep
      }
    },
    loadFormrender(form) {
      const stepButtons = form.stepButtons
      if (this.$utils.isEmpty(stepButtons)) { return }
      this.stepButtons = stepButtons
      this.stepNum = form.stepNum
    },
    emitEventHandler(actionKey, args) {
      this.$emit('action-event', actionKey, args)
    },
    callback(data) {
      this.$emit('callback', data)
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss">
.generate-dynamic-form{
  .ibps-container-full__body{
    padding: 0!important;
  }
}
${_show ? `
.ibps-generate-form{
  .el-dialog__header{
    padding: 0;
    border-bottom:0;
  }
  .el-dialog__body {
    height: 100%;
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
}` : ''}
</style>
`
  return template
}
/**
 * 数据模版管理-生成代码-默认
 * @param {数据模版管理的配置数据} data
 */
function defaultDataModuleCode(data) {
  if (Utils.isEmpty(data)) {return ''}
  const dataTemplate = data.dataTemplate || {}
  const dynamicParams = data.dynamicParams || {}
  const conditions = data.conditions || {}
  const formData = data.formData || {}
  const template = `<template>
  <!--默认-->
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-generate"
    fullscreen
    @close="closeDialog"
  >
    <ibps-data-template-render
      ref="dataTemplate"
      :data="dataTemplate"
      :template-form-data="templateFormData"
      :dynamic-params="dynamicParams"
      multiple
      @close="closeDialog"
    />
  </el-dialog>
</template>
<script>
import Vue from 'vue'
Vue.component('IbpsDataTemplateRender', () => import('@platform/business/platform/data/templaterender/index.vue'))

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object
    }
  },
  computed: {
    title() {
      return this.dataTemplate.name || ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      dynamicParams: ${JSON.stringify(dynamicParams)},
      dataTemplate: ${JSON.stringify(dataTemplate)},
      conditions: ${JSON.stringify(conditions)},
      templateFormData: ${JSON.stringify(formData)}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.dynamicParams = null
    this.dataTemplate = null
    this.conditions = null
    this.templateFormData = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
      this.closeEmit()
    },
    closeEmit(){
      this.$emit('close', false)
    },
    getFormData() {
    }
  }
}
</script>
<style lang="scss" >
  .data-template-generate{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__headerbtn{
      z-index: 9999;
    }
    @media print {
      .el-dialog__headerbtn {
        display: none !important;
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
    .hidden-print{
      .ibps-toolbar .tools{
        padding-right: 40px !important;
      }
    }
  }
</style>
  `
  return template
}
/**
 * 数据模版管理-生成代码-对话框
 * @param {数据模版管理的配置数据} data
 */
function dialogDataModuleCode(data) {
  if (Utils.isEmpty(data)) {return ''}
  const dataTemplate = data.dataTemplate || {}
  const dynamicParams = data.dynamicParams || {}
  const conditions = data.conditions || {}
  const formData = data.formData || {}
  const labelKey = data.labelKey || ''
  const multiple = data.multiple || true
  const dialogs = dataTemplate.dialogs
  const width = parseInt(dialogs.attrs ? dialogs.attrs.width || '80' : '80')
  const height = parseInt(dialogs.attrs ? (dialogs.attrs.height || '80') : '80')
  const dataWidth = width <= 100 ? `${width}%` : `${width}px`
  const dataHeight = height <= 100 ? `${height}%` : `${height}px`
  const h = height <= 100 ? document.body.clientHeight : height
  const vh = height === 100 ? 0 : (document.body.clientHeight / 100 * 7)
  const dialogHeight = h - 130 - (multiple ? 60 : 40) - vh
  const template = `
<template>
  <!--自定义对话框-->
  <div>
    <ibps-selector-dialog
      :visible="dialogVisible"
      :value="selectedValue"
      :title="title"
      :width="width"
      :height="height"
      :margin-top="marginTop"
      :multiple="multiple"
      :label-key="labelKey"
      :default-button="false"
      :buttons="actions"
      class="data-template-generate-dialog"
      @input="handleSelectChange"
      @remove-select="setSelectRow"
      @close="closeDialog"
    >
      <template #default>
        <ibps-data-template-render
          v-if="dialogVisible"
          ref="dataTemplate"
          :template-form-data="templateFormData"
          :value="selectedValue"
          :data="dataTemplate"
          :dynamic-params="dynamicParams"
          :multiple="multiple"
          :height="dialogHeight"
          @close="closeDialog"
          @selected="handleSelectChange"
        />
      </template>
    </ibps-selector-dialog>
    ${result ? htmlCode() : ''}
  </div>
</template>
<script>
import { buildLabelTitle } from '@platform/business/platform/data/templaterender/utils'
import eventsUtil from '@platform/utils/eventsUtil'// 自定义脚本
import ButtonsConstants from '@platform/business/platform/data/constants/buttons'

import Vue from 'vue'
Vue.component('IbpsDataTemplateRender', () => import('@platform/business/platform/data/templaterender/index.vue'))

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      labelKey: '${labelKey}',
      dialogHeight: ${dialogHeight},
      multiple: ${multiple},
      width: '${dataWidth}',
      height: '${dataHeight}',
      dynamicParams: ${JSON.stringify(dynamicParams)},
      conditions: ${JSON.stringify(conditions)},
      ${result ? dataCode(conditions) + ',' : ''}
      dialogVisible: false,
      selectedValue: ${multiple ? '[]' : '{}'},
      dataTemplate: ${JSON.stringify(dataTemplate)},
      initialization: false,
      templateFormData: ${JSON.stringify(formData)},
      eventsUtil: {}
    }
  },
  computed: {
    title(){
      if(this.$utils.isEmpty(this.dataTemplate)) return ''
      return this.dataTemplate.name || ''
    },
    marginTop() {
      if (this.height === '100%' || this.height === 100) {
        return '0'
      } else {
        return '5vh'
      }
    },
    actions() {
      return this.getActions()
    },
    toolbars(){
      if(this.$utils.isEmpty(this.dataTemplate) || this.$utils.isEmpty(this.dataTemplate.dialogs) || this.$utils.isEmpty(this.dataTemplate.dialogs.buttons)) return []
      return this.handleToolbars(this.dataTemplate.dialogs.buttons.dialog_buttons)
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        ${result ? 'this.dynamicParamsDialogVisible = val' : 'this.dialogVisible = val'}
      },
      immediate: true
    },
    value(val) {
      this.selectedValue = val
    },
    selectedValue: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('update:value', val)
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    eventsUtil.cleanEventsByName(this.eventsUtil._eventsUtilsID)
    this.eventsUtil = null
    this.selectedValue = null
    this.dataTemplate = null
    this.dynamicParams = null
    this.conditions = null
    this.templateFormData = null${result ? `
    this.toolbarsParams = null
    this.formData = null` : ''}
  },
  methods: {
    ${result ? methodsCode() + ',' : ''}
    handleToolbars(buttons) {
      const toolbars = []
      buttons.forEach(button => {
        const buttonType = button.button_type
        const defaultButton = ButtonsConstants[buttonType] || {}
        toolbars.push({
          key: buttonType,
          label: button.label || defaultButton.label,
          type: button.style || defaultButton.type,
          icon: 'ibps-icon-' + (button.icon || defaultButton.icon),
          action: () => {
            if (buttonType === 'ok') {
              if (this.$utils.isEmpty(this.selectedValue)) {
                this.$message.closeAll()
                this.$message.warning('请选择记录！')
                return
              }
            } else if (buttonType === 'clean' || buttonType === 'cleanClose') {
              this.clearSelection()
            }
            this.handleActionEvent(buttonType)
          }
        })
      })
      return toolbars
    },
    handleActionEvent(key) {
      if (key === 'clean' || key === 'cleanClose') {
        this.selectedValue = this.multiple ? [] : {}
        this.setSelectRow()
      }
      this.handleTemplaterenderActionEvent(key, JSON.parse(JSON.stringify(this.selectedValue)))
    },
    handleTemplaterenderActionEvent(key, data) {
      // todo:
      console.info(key, data)
      switch (key) {
        case 'cancel':
          this.dialogVisible = false
          this.selectedValue = this.multiple ? [] : {}
          break
        case 'clean':
          break
        case 'cleanClose':
          this.dialogVisible = false
          break
        default:
          this.selectedValue = data
          break
      }
    },
    getActions() {
      if (this.$utils.isEmpty(this.toolbars)) {
        return []
      }
      const actions = []
      this.toolbars.forEach((btn, i) => {
        const key = btn.key
        let disabled = false
        let hidden = false

        hidden = this.onLoadActions(key, btn, 'hidden', hidden)
        disabled = this.onLoadActions(key, btn, 'disabled', disabled)
        const button = {
          key: key,
          label: btn.label,
          icon: btn.icon,
          type: btn.type,
          disabled: disabled,
          hidden: hidden,
          action: () => {
            // 前置事件
            this.beforeScript(key, (result) => {
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
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
      ${result ? `
      if(!this.dynamicParamsDialogVisible){
        this.closeEmit()
      }` : 'this.closeEmit()'}
    },
    closeEmit(){
      this.$emit('close', false)
      this.$emit('update:value', {})
    },
    getFormData() {
      this.initUI()
    },
    setSelectRow() {
      this.$refs['dataTemplate'].setSelectRow()
    },
    handleSelectChange(val, dataTemplate) {
      if (this.dataTemplate.type !== 'dialog' && !this.dataTemplate.templates[0].result_columns) {
        this.$message({
          message: '请检查是否设置返回字段！',
          type: 'warning'
        })
        return
      } else if (dataTemplate) {
        if (!dataTemplate.templates[0].result_columns) {
          this.$message({
            message: '请检查是否设置返回字段！',
            type: 'warning'
          })
          return
        } else {
          this.labelKey = buildLabelTitle(dataTemplate)
        }
      }
      this.selectedValue = val
    },
    clearSelection() {
      this.$refs['dataTemplate'].clearSelection()
    },
    initUI() {
      this.initialization = false
      this.initialization = true
    },
    // 处理脚本
    hasScript() {
      return true
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      if (this.data && this.data.dialogs && this.data.dialogs.attrs && this.data.dialogs.attrs.script) {
        this.eventsUtil = eventsUtil._initEvents(this.data.dialogs.attrs.script, 'dialog_' + this.data.key, true)
      }
      eventsUtil._eventCall(this.eventsUtil, 'onLoad', this)
    },
    // 前置脚本
    beforeScript(action, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      eventsUtil._eventCall(this.eventsUtil, 'beforeSubmit', this, action, callback)
    },
    // 后置脚本
    afterScript(action, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      eventsUtil._eventCall(this.eventsUtil, 'afterSubmit', this, action, callback)
    },
    // 加载按钮事件
    onLoadActions: function(key, button, type, defaultVal) {
      const buttonActionResult = eventsUtil._eventCall(this.eventsUtil, 'onLoadActions', this, key, button, type)
      if (typeof (buttonActionResult) !== 'undefined' && buttonActionResult) {
        return true
      }
      return defaultVal
    }

  }
}
</script>
<style lang="scss">
.data-template-generate-dialog{
  .el-dialog__body{
    height:  calc(80vh - 110px) !important;
  }
  .el-dialog__body> div:nth-of-type(2){
    position:relative
  }
  .hidden-print{
    .ibps-toolbar .tools{
      padding-right: 40px !important;
    }
  }
}
</style>

  `
  return template
}
/**
 * 数据模版管理-生成代码-值来源
 * @param {数据模版管理的配置数据} data
 */
function valueSourceDataModuleCode(data) {
  if (Utils.isEmpty(data)) {return ''}
  const dataTemplate = data.dataTemplate || {}
  const dynamicParams = data.dynamicParams || {}
  const conditions = data.conditions || {}
  let template = ''
  template = `
<template>
  <div>
    <!--值来源-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="data-template-generate-value-source-dialog"
      @open="getFormData"
      @close="closeDialog"
    >
      <el-alert type="warning" :closable="false"> 实际是会返回数据到表单下拉：</el-alert>

      <ibps-highlight>{{ dataResult }}</ibps-highlight>
      <ibps-pagination
        :pagination="pagination"
        @pagination-change="handlePaginationChange"
      />
    </el-dialog>
  </div>
</template>
<script>
import { queryDataTable } from '@platform/api/platform/data/dataTemplate'
import ActionUtils from '@platform/utils/action'
import IbpsPagination from '@platform/components/ibps-pagination'

export default {
  components: {
    IbpsPagination
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataTemplate: ${JSON.stringify(dataTemplate)},
      dynamicParams: ${JSON.stringify(dynamicParams)},
      conditions: ${JSON.stringify(conditions)},
      template: {},
      dataResult: [],
      filterConditionKey: '',
      treeData: [],
      defaultPagination: {
        page: 1,
        limit: 20,
        totalCount: 0
      },
      pagination: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    title() {
      return this.dataTemplate.name || '值来源'
    },
    pkKey() {
      return this.dataTemplate.unique || 'id_'
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  created() {
    this.pagination = JSON.parse(JSON.stringify(this.defaultPagination))
  },
  beforeDestroy() {
    this.dataTemplate = null
    this.template = null
    this.dataResult = null
    this.treeData = null
    this.defaultPagination = null
    this.pagination = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
      this.closeEmit()
    },
    closeEmit(){
      this.$emit('close', false)
    },
    getFormData() {
      const templates = this.dataTemplate.templates || []
      this.template = templates[0] || {}
      this.loadData()
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryDataTable(this.getFormatParams()).then(response => {
        this.loading = false
        const data = response.data
        this.dataResult = data.dataResult || []
        this.pagination = data.pageResult || {}
      }).catch(() => {
        this.loading = false
      })
    },
    handlePaginationChange({ page, limit }) {
      this.pagination.page = page
      this.pagination.limit = limit
      this.loadData()
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams, this.pagination)
    }
  }
}
</script>
<style lang="scss" >
  .data-template-generate-value-source-dialog{
    .el-dialog__body {
      height:  calc(70vh - 110px) !important;
    }
  }
</style>
`
  return template
}
/**
 * 生成[数据模块管理]代码模版
 * @param {*} formDef
 */
export function generateDataModuleCode(formDef, showDialog = false) {
  let data = {}
  let template = ''
  if (Utils.isEmpty(formDef) || Utils.isEmpty(formDef.dataTemplate)) {return template}
  result = false
  data = formDef
  if (Utils.isNotEmpty(data.conditions)) {
    result = true
  }
  if (data.dataTemplate.type === 'default') {
    template = defaultDataModuleCode(data)
  } else if (data.dataTemplate.type === 'dialog') {
    template = dialogDataModuleCode(data)
  } else if (data.dataTemplate.type === 'valueSource') {
    template = valueSourceDataModuleCode(data)
  }
  return template
}
/**
 * Html代码
 */
function htmlCode() {
  return `<el-dialog
    :visible.sync="dynamicParamsDialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-config-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @open="getParamsFormData"
    @close="closeParamsDialog"
  >
    <el-table :data="formData" border stripe>
      <el-table-column label="参数名称" prop="label" />
      <el-table-column label="参数值" prop="value">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" />
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbarsParams"
        @action-event="handleDynamicParams"
      />
    </div>

  </el-dialog>`
}
/**
 * JS中data的数据
 */
function dataCode(conditions) {
  const formData = []
  for (const key in conditions) {
    const condition = conditions[key]
    formData.push({
      name: condition.field,
      label: condition.label,
      value: ''
    })
  }
  return `dynamicParamsDialogVisible: false,
  toolbarsParams: [
    { key: 'confirm' },
    { key: 'confirmClose', label: '确认并关闭', type: 'danger' },
    { key: 'cancel' }
  ],
  formData: ${JSON.stringify(formData)}`
}
/**
 * JS中methods的数据
 */
function methodsCode() {
  return `
  handleDynamicParams({ key }) {
    switch (key) {
      case 'confirm':
        this.handleConfirm()
        break
      case 'confirmClose':
        this.handleConfirm(true)
        break
      case 'cancel':
        this.closeParamsDialog()
        break
      default:
        break
    }
  },
  closeParamsDialog() {
    this.dynamicParamsDialogVisible = false
    this.closeEmit()
  },
  handleConfirm(close = false) {
    const data = {}
    for (let i = 0; i < this.formData.length; i++) {
      const d = this.formData[i]
      data[d.name] = d.value
    }
    this.dynamicParams = data
    this.dialogVisible = true
    if (close) {
      this.dynamicParamsDialogVisible = false
    }
  },
  getParamsFormData() {
    this.formData = []
    for (const key in this.conditions) {
      const condition = this.conditions[key]
      this.formData.push({
        name: condition.field,
        label: condition.label,
        value: ''
      })
    }
  }`
}
