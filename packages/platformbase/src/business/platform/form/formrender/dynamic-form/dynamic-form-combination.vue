<template>
  <div
    v-loading.lock="loading"
    class="ibps-dynamic-form-combination"
    :style="{width:'100%',height: loading?(height?height:'100px'):height}"
    :element-loading-text="$t('common.loading')"
  >
    <div v-if="loading">&nbsp;</div>
    <template v-else>
      <!-- 详情表单/在线表单 -->
      <template v-if="fieldType==='detailForm' || fieldType==='onlineForm'">
        <combination-formrender
          v-if="$utils.isNotEmpty(formDef)"
          ref="formrender"
          :form-def="formDef"
          :data="formData"
          :params="cascadeDynamicParams"
          :readonly="fieldType==='detailForm'?true:readonlyRights"
          mode="default"
          button-priority="button"
          @close="closeDialog"
          @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
          @cascade-data="handleCascadeData"
        />
        <!-- 流程定义选择器 -->
        <combination-bpm-def-dialog
          v-model="bpmDefValue"
          :visible="bpmDefDialogVisible"
          :form-key="formKey"
          :multiple="false"
          :is-data-template-use="true"
          @close="visible => bpmDefDialogVisible = visible"
          @action-event="handleDialogActionEvent"
        />
      </template>
      <!-- 数据模版 -->
      <template
        v-else-if="fieldType==='dataTemplate'"
      >
        <combination-data-template-render
          ref="dataTemplate"
          :data="dataTemplate"
          :self-adaption="selfAdaption"
          :access-control="accessControl"
          :dynamic-params="cascadeDynamicData"
          :control-height="fieldOptions.height"
          :params="cascadeDynamicParams"
          class="combination-data-template"
          :class="selfAdaption?'' :'combination-height'"
        />
      </template>
    </template>
  </div>
</template>
<script>
// import { valueEquals } from 'element-ui/lib/utils/util'
import Styles from '@platform/business/platform/form/utils/global-style'
import { getBuildDataByKey } from '@platform/api/platform/data/dataTemplate'
import { getFormData, getFormDataByFormKey } from '@platform/api/platform/form/formDef'
import { getDynamicParams, getPkValue } from '@platform/business/platform/form/utils/formCascadeUtil'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import ActionMixin from '@platform/business/platform/form/formrender/button/action'
import CombinationBpmDefDialog from '@platform/business/platform/bpmn/definition/dialog'
import { buildFelds } from '@platform/business/platform/data/templaterender/utils'
import Vue from 'vue'
Vue.component('CombinationDataTemplateRender', () => import('@platform/business/platform/data/templaterender'))
Vue.component('CombinationFormrender', () => import('@platform/business/platform/form/formrender'))
export default {
  components: {
    CombinationBpmDefDialog
  },
  mixins: [ActionMixin],
  inject: ['dynamicForm'],
  props: {
    models: Object, // 所有对象数据
    field: Object, // 字段
    params: Object
  },
  data() {
    return {
      loading: false,
      accessControl: false,
      dataTemplate: {},
      cascadeDynamicData: {},
      cascadeDynamicParams: {},
      height: '',
      formDef: null,
      formData: {},
      version: '',
      boCode: '',
      pkValue: '',
      formModels: {},
      actionName: '',
      actionAttrs: {},
      bpmDefValue: {},
      bpmDefDialogVisible: false
    }
  },
  computed: {
    selfAdaption() {
      return this.$utils.isEmpty(this.height)
    },
    formKey() {
      if (this.$utils.isEmpty(this.fieldOptions)) {return ''}
      return this.fieldOptions.formKey
    },
    formParams() {
      if (this.$utils.isEmpty(this.fieldOptions)) {return {}}
      return this.fieldOptions.params || {}
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    hasPk() {
      return this.fieldOptions.isPk
    },
    fieldType() {
      return this.field.field_type
    },
    readonlyRights() {
      if (this.params.formType === 'detail') {
        return !this.fieldOptions.edit_rights
      }
      return this.params.readonly
    }
  },
  watch: {
    models: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {return}
        this.formModels = JSON.parse(JSON.stringify(val))
        this.initCascadeDynamicData()
      },
      deep: true,
      immediate: true
    },
    // params: {
    //   handler: function(val, oldVal) {
    //     if (this.$utils.isEmpty(val)) return
    //     this.initCascadeDynamicData()
    //   },
    //   deep: true
    // },
    pkValue(val, oldVal) {
      if (val !== oldVal) {
        this.loadFormData()
      }
    }
  },
  created() {
    if (this.$utils.isNotEmpty(this.fieldOptions.height)) {
      this.height = this.fieldOptions.height + 'px'
    } else {
      this.height = undefined
    }
  },
  mounted() {
    this.initCascadeDynamicData(true)
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
    },
    async initCascadeDynamicData(init = false) {
      await this.setCascadeDynamicParams()
      this.cascadeDynamicData = {}
      if (this.fieldType === 'dataTemplate') { // 数据模版
        this.setCascadeDynamicData(FormUtils.getDataTempateDynamicParams(this.fieldOptions.casadeFields, this.formModels))
        this.loadDataTemplate()
      } else { // 在线表单
        this.setCascadeDynamicData(this.formModels)
        this.initLoadFormData()
      }
    },
    setCascadeDynamicData(data) {
      this.cascadeDynamicData = data
    },
    async initLoadFormData() {
      this.loading = true
      if (this.$utils.isEmpty(this.formKey) && this.$utils.isNotEmpty(this.data)) {
        this.loading = false
        return
      }
      try {
        if (this.hasPk) {
          this.pkValue = await getPkValue(this.fieldOptions, this.formModels, this.cascadeDynamicParams)
          if (this.$utils.isEmpty(this.pkValue)) {
            this.loadFormData()
          }
        } else {
          this.loadFormData()
        }
      } catch (error) {
        this.loading = false
      }
    },
    loadFormData() {
      this.formDef = null
      getFormData({
        pk: this.pkValue || '',
        formKey: this.formKey,
        rightsScope: this.rightsScope || 'form'
      }).then(response => {
        // 从后台获取数据
        const data = response.data
        const responses = data.boData ? JSON.parse(data.boData) : {}
        const formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 从后台获取表单定义数据
        let formDef = this.$utils.parseData(data.form) || {}
        formDef = this.filterCloseButton(formDef)
        this.formDef = JSON.parse(JSON.stringify(formDef))
        this.formData = formData
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    filterCloseButton(formDef) {
      if (this.$utils.isEmpty(formDef.attrs)) {
        formDef.attrs = {}
        return formDef
      }
      // 过滤关闭按钮
      if (this.$utils.isNotEmpty(formDef.attrs.buttons)) {
        for (let i = 0; i < formDef.attrs.buttons.length; i++) {
          const item = formDef.attrs.buttons[i]
          if (this.$utils.isNotEmpty(item.alias) && item.alias === 'close') {
            formDef.attrs.buttons.splice(i, 1)
            break
          }
        }
      }
      return formDef
    },
    // 加载数据模板
    loadDataTemplate() {
      this.loading = true
      this.dataTemplate = null
      getBuildDataByKey({
        dataTemplateKey: this.fieldOptions.bind_template_key,
        isFilterForm: false,
        isRightsFilter: true
      }).then(response => {
        // 从后台获取数据
        const data = this.$utils.parseData(response.data)
        if (data && data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
          getFormDataByFormKey({
            formKey: data.attrs.form_key
          }).then(response => {
            const formData = this.$utils.parseData(response.data)
            const datasets = buildFelds(formData.fields, data.datasets)
            data.datasets = datasets
            this.dataTemplate = data
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.dataTemplate = data
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
      this.$utils.isEmpty(this.params.formAttrs) ||
      this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    async setCascadeDynamicParams() {
      const cascadeDynamicParams = await getDynamicParams(this.fieldOptions.params, this.formModels)
      const params = JSON.parse(JSON.stringify(this.params))
      delete params.formKey
      delete params.formType
      delete params.responseDynamic
      delete params.responseFormula
      delete params.responseLinkages
      delete params.responseCascades
      delete params.responseFormOpinionData
      delete params.preview
      delete params.readonly
      delete params.readonlyStyle
      delete params.labelWidth
      delete params.labelSuffix
      delete params.descPosition
      delete params.formAttrs
      delete params.invalidFields
      this.cascadeDynamicParams = Object.assign(cascadeDynamicParams || {}, params)
    },
    /**
     * 级联数据
     */
    handleCascadeData(data) {
      FormUtils.handleCascadeData(data, this.fieldOptions.cascades, this.dynamicForm)
    },
    getForm() {
      if (this.fieldType === 'detailForm' || this.fieldType === 'onlineForm') {
        return this.$refs.formrender
      } else {
        return this.$refs.dataTemplate
      }
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
    /**
     * 回调上个页面
     */
    callbackPage(response, id) {
      if (response && this.$utils.isNotEmpty(id)) {
        if (this.actionAttrs.afterEvent === 'edit') {
          this.pkValue = id
        } else {
          this.pkValue = ''
          this.loadFormData()
        }
      }
      this.$emit('callback', true)
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
    }
  }
}
</script>
<style lang="scss">
@import "@platform/assets/styles/components/dynamic-form-combination";
</style>
