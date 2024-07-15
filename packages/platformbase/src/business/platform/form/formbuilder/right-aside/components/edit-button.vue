<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="form-button-dialog"
    top="5vh"
    width="60%"
    append-to-body
    @close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" size="mini" @submit.native.prevent>
      <!-- <el-form-item v-if="formType==='combination' && formData[typeKey]" label="按钮类型">
        <el-input :value="buttonTypeLabel" readonly />
      </el-form-item> -->
      <el-form-item label="按钮名称" prop="name">
        <el-input v-model="formData.label" placeholder="按钮名称" />
      </el-form-item>
      <el-form-item v-if="allowMultiple( formData[typeKey])" required label="按钮编码" prop="code">
        <el-input v-model="formData.code" placeholder="按钮编码" />
      </el-form-item>
      <el-form-item v-if="formType==='sub'" label="按钮位置">
        <el-radio-group v-model="formData.position">
          <el-radio-button
            v-for="item in positionType"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="按钮颜色">
        <el-select v-model="formData.style" placeholder="按钮颜色" style="width:100%">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="按钮图标">
        <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
      </el-form-item>
      <!--子表功能按钮-->
      <template v-if="formType==='sub'">
        <el-form-item>
          <template slot="label">
            详情页隐藏<ibps-help content="表单只读是否隐藏该按钮" />
          </template>
          <el-switch
            v-model="formData.enabledDetail"
            :active-value="'Y'"
            :inactive-value="'N'"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
        <el-form-item
          v-if="formData[typeKey] === 'edit' || formData[typeKey] === 'detail' || formData[typeKey] === 'custom'"
          label="是否开启级联"
        >
          <el-switch
            v-model="formData.enabledCascade"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.enabledCascade"
          label="级联设置"
        >
          <el-button type="primary" plain style="width:100%;" @click="handleCascade">级联设置</el-button>
        </el-form-item>
        <!-- 导出导入额外设置 -->
        <!-- 导入 -->
        <el-form-item v-if="formData[typeKey] ==='import'">
          <template slot="label">
            是否导入新增数据<ibps-help content="导出后，Excel新增的数据是否导入进来" />
          </template>
          <el-switch
            v-model="formData.additionalData"
            :active-value="'Y'"
            :inactive-value="'N'"
            active-text="导入"
            inactive-text="不导入"
          />
        </el-form-item>
        <!-- 导出 -->
        <el-form-item v-if="formData[typeKey] ==='export'">
          <template slot="label">
            是否导出隐藏域<ibps-help content="设置子表的隐藏域字段是否导出" />
          </template>
          <el-switch
            v-model="formData.exportHiddenField"
            :active-value="'Y'"
            :inactive-value="'N'"
            active-text="导出"
            inactive-text="不导出"
          />
        </el-form-item>
        <el-form-item v-if="formData.type==='export'&&formData.exportHiddenField==='Y'">
          <el-checkbox-group
            v-model="needExportHiddenFields"
            @change="changeExportFields"
          >
            <el-checkbox v-for="field in exportHiddenFields" :key="field.id" :disabled="field.disabled" :label="!field.field_name?field.name:field.field_name">{{ field.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 自定义对话框 -->
        <el-form-item v-if="formData[typeKey] === 'add' || formData[typeKey] === 'custom'" label="启用自定义对话框">
          <el-switch
            v-model="formData.enabledCustom"
            :active-value="'Y'"
            :inactive-value="'N'"
            active-text="启用"
            inactive-text="禁用"
            @change="changeEnabledCustom"
          />
        </el-form-item>
        <template v-if="formData.enabledCustom==='Y'">
          <el-form-item label="自定义对话框配置">
            <ibps-data-template-selector2
              v-model="formData.dialog"
              type="dialog"
              placeholder="请选择自定义对话框"
              @change="changeDataTemplateSelector"
            />
          </el-form-item>
          <el-form-item label="是否多选">
            <el-switch
              v-model="isMultiple"
            />
          </el-form-item>
          <el-form-item label="设置动态参数">
            <el-button style="width:100%;" type="primary" :disabled="disabledDynamicConditions" size="mini" @click="settingCondition()">设置动态参数</el-button>
          </el-form-item>
          <el-form-item label="设置联动数据">
            <el-button style="width:100%;" type="primary" size="mini" :disabled="disabledResultColumns" @click="settingLinkData()">设置联动数据</el-button>
          </el-form-item>
        </template>
      </template>
      <!--==子表功能按钮end-->
      <el-form-item v-if="formData && formData[typeKey] === 'sefStartFlow'" prop="deflow">
        <label slot="label">
          绑定流程
        </label>
        <bpm-def-selector
          v-model="formData.deflow"
          value-key="defKey"
          :form-key="formKey"
          :is-data-template-use="true"
        />
      </el-form-item>
      <template v-if="formData[typeKey] === 'save' || formData[typeKey]=== 'sefStartFlow' ">
        <el-form-item>
          <template slot="label">{{ formData[typeKey] === 'save'?'保存':'启动流程' }}后续动作</template>
          <el-radio-group v-model="formData.afterEvent">
            <el-radio-button
              label="add"
            >继续新增</el-radio-button>
            <el-radio-button
              label="edit"
            >编辑</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>
      <!-- 组合表单按钮配置 -->
      <template
        v-if="isShow"
      >
        <el-form-item label="接口地址" prop="custom_url">
          <el-input v-model="formData.custom_url" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="请求方法">
          <el-select v-model="formData.custom_method" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in requestMethod"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="header/body设置">
          <el-button type="primary" size="mini" @click="settingHeadersAndBody()">设置</el-button>
        </el-form-item>
      </template>
      <template v-if="formType==='combination'">
        <el-form-item label="按钮描述">
          <el-input v-model="formData.custom_desc" placeholder="请输入" />
        </el-form-item>
      </template>
    </el-form>
    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="custom.link_condition"
      :fields="formSubFields"
      @callback="setCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />
    <!--数据模版-联动数据配置-->
    <data-template-linkdata
      :visible="dataTemplateLinkDataVisible"
      :columns="resultColumns"
      :data="custom.link_linkage"
      :fields="formFields"
      @callback="setLinkData"
      @close="visible => dataTemplateLinkDataVisible = visible"
    />
    <!-- 级联配置 -->
    <cascade-configuration
      :visible="cascadeVisible"
      :data="formData.cascade_configuration"
      :bo-fields="boFields"
      @callback="setCascadeConfiguration"
      @close="visible => cascadeVisible = visible"
    />
    <!-- Header/Body设置 -->
    <request-setting
      :visible="buttonVisible"
      :data="formData.custom_setting"
      :method="formData.custom_method"
      :combination-fields="combinationFields"
      @callback="setButtonSetting"
      @close="visible => buttonVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { hasPermission as hasSubTablePermission } from '@platform/business/platform/form/constants/tableButtonTypes'
import ActionUtils from '@platform/utils/action'
import { validateRequired, validateKey } from '@platform/utils/validate'
import { colorOptions } from '@platform/business/platform/form/constants/fieldOptions'
import DataTemplateMixin from '../mixins/data-template'
import IbpsDataTemplateSelector2 from '@platform/business/platform/data/dataTemplate/selector2'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'
import FormFieldUtil from '@platform/business/platform/form/utils/formFieldUtil'
import CascadeConfiguration from '../components/cascade-configuration'
import BUTTON_TYPES from '@platform/business/platform/form/constants/formButtonTypes'
import RequestSetting from '@platform/business/platform/form/components/interface/dialog'
import BpmDefSelector from '@platform/business/platform/bpmn/definition/selector'
export default {
  components: {
    IbpsDataTemplateSelector2,
    DataTemplateCondition,
    DataTemplateLinkdata,
    CascadeConfiguration,
    RequestSetting,
    BpmDefSelector
  },
  mixins: [DataTemplateMixin],
  props: {
    combinationFields: { // 组合表单字段
      type: Array
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '设置按钮'
    },
    data: {
      type: Object,
      default: () => {}
    },
    formType: { // 功能类型,sub，form
      type: String,
      default: 'sub'
    },
    typeKey: {
      type: String,
      default: 'type'
    },
    fields: {
      type: Array
    },
    columns: {
      type: Array
    },
    boFields: Array, // 当前子表BO字段
    fieldItem: {
      type: Object
    },
    formKey: {
      type: String
    },
    buttonCodes: {
      type: Array
    }
  },
  data() {
    return {
      dialogVisible: false,
      cascadeVisible: false,
      buttonVisible: false,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {},
      rules: {
        code: null,
        custom_url: null
      },
      exportHiddenFields: [],
      needExportHiddenFields: [],
      fieldsOptions: [],
      colorOptions,
      multiple: this.formData ? this.formData.multiple || true : true,
      requestMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  },
  computed: {
    isShow() {
      return this.formType === 'combination' &&
          (this.formData[this.typeKey] === 'save' || this.formData[this.typeKey] === 'saveAndContinue' || this.formData[this.typeKey] === 'custom')
    },
    buttonTypeLabel() {
      const data = BUTTON_TYPES[this.formData[this.typeKey]]
      if (this.$utils.isNotEmpty(data)) {return data.label}
      return ''
    },
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const type = this.formData[this.typeKey] || ''
      if (this.formType === 'sub') {
        if (hasSubTablePermission(type, 'toolbar')) {
          positionType.push({
            value: 'toolbar',
            label: '仅顶部'
          })
        }
        if (hasSubTablePermission(type, 'manage')) {
          positionType.push({
            value: 'manage',
            label: '仅管理'
          })
        }
        if (hasSubTablePermission(type, 'bottom')) {
          positionType.push({
            value: 'bottom',
            label: '仅底部'
          })
        }
      }
      return positionType
    },
    custom() {
      return this.formData.custom || {}
    },
    isMultiple: {
      get() {
        return this.$utils.toBoolean(this.multiple, true)
      },
      set(val) {
        this.formData.multiple = this.multiple = val
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    },
    columns: {
      handler: function(val, oldVal) {
        if (this.$utils.isNotEmpty(val)) {
          this.exportHiddenFields = []
          const identification = this.fieldItem.field_options.identification
          val.forEach(e => {
            if (e.field_type === 'hidden') {
              // 标识必选
              e.disabled = e.field_name === identification
              this.exportHiddenFields.push(e)
            }
          })
        }
      },
      immediate: true,
      deep: true
    },
    data: {
      handler(val) {
        this.formData = val
        if (this.formData[this.typeKey] === 'import' && this.$utils.isEmpty(val.additionalData)) {
          this.$set(this.formData, 'additionalData', 'Y')
        }
        if (this.formData[this.typeKey] === 'export') {
          if (this.$utils.isEmpty(val.exportHiddenField)) {
            const needExportHiddenFields = []
            this.exportHiddenFields.forEach(e => {
              if (e.field_name) {
                needExportHiddenFields.push(e.field_name)
              } else {
                needExportHiddenFields.push(e.name)
              }
            })
            this.$set(this.formData, 'exportHiddenField', 'Y')
            this.$set(this.formData, 'needExportHiddenFields', needExportHiddenFields)
          } else {
            this.needExportHiddenFields = val.needExportHiddenFields || []
          }
        }
        if (this.allowMultiple(this.formData[this.typeKey])) {
          let codes = this.buttonCodes || []
          codes = codes.filter(item => {
            return this.$utils.isNotEmpty(item)
          })
          this.rules['code'] = [
            { required: true, message: this.$t('validate.required') },
            { validator: validateRequired, message: this.$t('validate.required') },
            { validator: validateKey },
            { validator: (rule, value, callback) => {
              if (codes.indexOf(value) > -1) {
                callback(new Error('重复的按钮编码值,请重新输入'))
                return
              }
              callback()
            } }
          ]
          this.formValidate()
        } else {
          this.rules['code'] = null
        }
        if (this.isShow) {
          this.rules['custom_url'] = [
            { required: true, message: this.$t('validate.required') },
            { validator: validateRequired, message: this.$t('validate.required') }
          ]
          this.formValidate()
        } else {
          this.rules['custom_url'] = null
        }
      },
      deep: true,
      immediate: true
    },
    multiple: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.formData.multiple)) {
          this.isMultiple = this.formData.multiple = true
        } else {
          if (val !== oldVal) {
            this.isMultiple = this.formData.multiple = val
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.formData = null
    this.rules = null
    this.exportHiddenFields = null
    this.needExportHiddenFields = null
    this.fieldsOptions = null
  },
  methods: {
    allowMultiple(type) {
      return type === 'custom' || type === 'sefStartFlow' || type === 'customDetail'
    },
    settingHeadersAndBody() {
      this.buttonVisible = true
    },
    setButtonSetting(data) {
      this.$set(this.formData, 'custom_setting', data)
    },
    changeEnabledCustom() {
      this.multiple = true
    },
    changeExportFields(val) {
      this.formData.needExportHiddenFields = val
    },
    handleCascade() {
      this.cascadeVisible = true
    },
    setCascadeConfiguration(data) {
      if (this.$utils.isEmpty(data)) {return}
      this.formData.cascade_configuration = JSON.parse(JSON.stringify(data))
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    callbackData() {
      const data = JSON.parse(JSON.stringify(this.formData))
      this.$emit('callback', data)
    },
    handleConfirm() {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.formData))
          this.$emit('callback', data)
          this.closeDialog()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    settingCondition() {
      if (this.$utils.isEmpty(this.formData.dialog)) {
        ActionUtils.warning('请先设置自定义对话框')
        return
      }
      if (this.$utils.isEmpty(this.dynamicConditions)) {
        ActionUtils.warning('未设置过滤条件')
        return
      }
      // 构建表单字段
      this.setFormFields(true)
      this.dataTemplateConditionVisible = true
    },
    settingLinkData() {
      if (this.$utils.isEmpty(this.formData.dialog)) {
        ActionUtils.warning('请先设置自定义对话框')
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtils.warning('请设置返回字段')
        return
      }
      if (this.$utils.isEmpty(this.columns)) {
        ActionUtils.warning('请设置子表字段')
        return
      }
      // 构建子表单字段
      this.formFields = []
      this.buildFormFields(this.columns)
      this.dataTemplateLinkDataVisible = true
    },
    setCondition(data) {
      this.formData.custom.link_condition = data
    },
    setLinkData(data) {
      this.formData.custom.link_linkage = data
    },
    changeDataTemplateSelector(data, val, oldVal) {
      this.changeDataSource(val, 'customDialog')
    },
    buildFormFields() {
      this.formFields = FormFieldUtil.getFormField(this.columns, true, this.code, this.fieldItem ? this.fieldItem.id : '')
    }
  }
}
</script>
