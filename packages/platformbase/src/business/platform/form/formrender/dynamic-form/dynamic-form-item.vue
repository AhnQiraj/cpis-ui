<template>
  <div v-show="!hidden" class="ibps-form-item" :style="getRuleStyle()+getPadding()">
    <!-- 只读类型-->
    <ibps-dynamic-form-other
      v-if="isOtherFieldType"
      ref="formField"
      :models="models"
      :field="field"
      :params="params"
      :value.sync="dataModel"
    />
    <!-- 组合字段类型-->
    <template v-else-if="isCombinationFieldType">
      <div
        class="combination_wrapper"
        :class="fieldOptions.hide_border ?'':'combination_border'"
        :style="{marginBottom: paddingBottom()?'0':'20px'}"
      >
        <div
          v-if="$utils.isNotEmpty(label) && !fieldOptions.hide_label"
          class="combination_name"
          :class="fieldOptions.hide_border_bottom ?'':'combination_border__bottom'"
        >
          <span>{{ label }}</span>
        </div>
        <ibps-dynamic-form-combination
          ref="formField"
          :models="models"
          :field="field"
          :params="params"
        />
      </div>
    </template>
    <template v-else>
      <el-form-item
        ref="formItem"
        :prop="prop"
        :rules="rules"
        :label="fieldType==='table'?null:label"
        :label-width="labelWidth"
        :class="field.field_options.custom_class"
        :style="paddingBottom()?'margin-bottom: 0;!important':''"
      >
        <template v-if="fieldType!=='table' && label" slot="label">
          <span :style="getStyleByName('labelTypeface', 'labelFontSize', 'labelBold', 'labelColor')+getRuleStyle()">{{ label+labelSuffix }}</span>
          <ibps-help v-if="field && field.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(field.desc)" />
        </template>
        <!-- 表单意见-->
        <ibps-dynamic-form-opinion
          v-if="fieldType==='approval_opinion'"
          ref="formField"
          :value.sync="dataModel"
          :field="field"
          :readonly="readonly"
          :readonly-style="readonlyStyle"
          :opinion-data="formOpinionData[fieldName]"
          :params="params"
          @direct-handler-sign="handleDirectHandlerSign"
          v-on="listeners"
        />
        <!--子表-->
        <ibps-dynamic-form-table
          v-else-if="fieldType==='table'"
          ref="formField"
          :value.sync="dataModel"
          :form-data="$utils.isNotEmpty(row)?formData:models"
          :main-code="code"
          :field="field"
          :rights="fieldRights"
          :readonly="readonly"
          :params="params"
          v-on="listeners"
        />
        <!--字段-->
        <ibps-dynamic-form-field
          v-else
          ref="formField"
          :value.sync="dataModel"
          :field="field"
          :form-data="models"
          :readonly="readonly"
          :readonly-style="readonlyStyle"
          :row="row"
          :code="code"
          :params="params"
          v-on="listeners"
        />
        <!-- ######描述属性###### -->
        <div
          v-if="field && field.desc && descPosition==='inline'"
          class="ibps-help-block"
          v-html="$utils.formatText(field.desc )"
        />
      </el-form-item>
    </template>
  </div>
</template>
<script>
import { isEqual } from 'element-ui/lib/utils/util'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import FormOptions from '../../constants/formOptions'
import FormFieldUtil from '../../utils/formFieldUtil'
import { otherFieldTypes, noneModelFieldTypes, combinationFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import Styles from '@platform/business/platform/form/utils/global-style'
export default {
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    models: [Object, Array], // 当前字段数据
    rights: [String, Object], // 字段权限
    formData: [Array, Object], // 表单数据（包含子表）
    field: Object, // 字段
    code: String, // 表名
    mainCode: String, // 主表名
    row: [String, Number], // 子表行数
    params: Object, // 参数
    tableParams: Object// 子表参数
  },
  data() {
    let defaultVal = ''
    if (this.field.field_type === 'table') {
      // 一对多，是数组，一对一是对象
      defaultVal = this.field.field_options.relation === 'one2one' ? {} : []
    } else {
      defaultVal = ''
    }
    return {
      dataModel: this.models[this.field.name] || defaultVal,
      fieldRights: this.rights[this.field.name] || FormOptions.t.PERMISSIONS.EDIT
    }
  },
  computed: {
    fieldOptions() {
      return this.field.field_options || {}
    },
    fieldName() {
      return this.field.name
    },
    prop() {
      if (this.$utils.isNotEmpty(this.row)) {
        if (this.tableParams.relation === 'one2one') {
          return this.code + '.' + this.fieldName
        } else {
          return this.code + '.' + this.row + '.' + this.fieldName
        }
      }
      return this.fieldName
    },
    label() { // 显示的文本
      if (this.fieldType === 'table' || this.field.field_options.hide_label) {return null}
      return this.$utils.isNotEmpty(this.field.field_options.units) &&
        (this.$utils.isEmpty(this.field.field_options.position) || this.field.field_options.position === 'label')
        ? this.field.label + '(' + this.field.field_options.units + ')'
        : this.field.label
    },
    labelSuffix() {
      return this.params.labelSuffix
    },
    labelWidth() { // 字段宽度
      if (this.fieldType === 'table' || this.field.field_options.hide_label) {return '0'}
      return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : this.defaultLabelWidth
    },
    fieldType() { // 字段类型
      return this.field.field_type
    },
    subTableRights() { // 子表权限
      if (this.fieldType === 'table' && this.$utils.isNotEmpty(this.fieldRights) &&
      this.$utils.isPlainObject(this.fieldRights)) {
        return this.fieldRights['rights']
      }
      return false
    },
    // 规则显示，隐藏
    ruleDisplay() {
      return this.field.field_options.rule_display
    },
    hidden() { // 是否隐藏
      const _ruleDisplay = this.ruleDisplay
      if (this.subTableRights) {
        return this.subTableRights === FormOptions.t.PERMISSIONS.HIDE || _ruleDisplay === 'hidden'
      }
      const _hidden = this.fieldRights === FormOptions.t.PERMISSIONS.HIDE || this.fieldType === 'hidden'
      return _hidden || _ruleDisplay === 'hidden'
    },
    readonly() { // 是否只读
      if (this.subTableRights) {
        const rights = this.params.readonly ? true : this.subTableRights === FormOptions.t.PERMISSIONS.READ
        return rights
      }
      return this.readonlyRights ? true : this.fieldRights === FormOptions.t.PERMISSIONS.READ
    },
    required() { // 必填  【只读隐藏，都设置非必填】
      if (this.readonly || this.hidden) {
        return false
      }
      if (this.subTableRights) {
        return this.subTableRights === FormOptions.t.PERMISSIONS.REQUIRED
      }
      return this.fieldRights === FormOptions.t.PERMISSIONS.REQUIRED
    },
    isOtherFieldType() {
      return otherFieldTypes.includes(this.fieldType)
    },
    isCombinationFieldType() {
      return combinationFieldTypes.includes(this.fieldType)
    },
    rules() { // 表单字段规则
      if (this.readonly || this.hidden) {return []}
      return FormUtils.buildFormRules(this.field, this.required, this.models)
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    defaultLabelWidth() {
      if (this.$utils.isNotEmpty(this.row)) {
        return this.tableParams.labelWidth ? this.tableParams.labelWidth : this.params.labelWidth
      } else {
        return this.params.labelWidth
      }
    },
    readonlyRights() {
      return this.params.readonly
    },
    readonlyStyle() {
      return this.params.readonlyStyle
    },
    formula() {
      return this.params.responseFormula
    },
    linkages() {
      return this.params.responseLinkages
    },
    dynamic() {
      return this.params.responseDynamic
    },
    formOpinionData() {
      return this.params.responseFormOpinionData || {}
    },
    listeners() {
      return {
        ...this.$listeners,
        change: (data) => { // 在 Input 值改变时触发
          this.emitEvent('change', data)
        },
        focus: (event) => {this.emitEvent('focus', event)}, // 在 Input 获得焦点时触发
        blur: (event) => {this.emitEvent('blur', event)}, // 在 Input 失去焦点时触发
        // click: (event) => { this.emitEvent('click', event) } // 在 Input 点击时触发
        'change-data': this.handleModels // 数据改变
      }
    },
    mode() {
      return this.field.field_options.mode || 'inner'
    }
  },
  watch: {
    dataModel: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal) || noneModelFieldTypes.includes(this.fieldType)) {
          return
        }
        this.handleModels(this.fieldName, val)
        // if (this.readonlyRights && !fixedFieldTypes.includes(this.fieldType)) {
        //   return
        // }
        // if (this._isMounted) {
        this.runDefaultValue()
        // }
      },
      deep: true,
      immediate: true
    },
    models: {
      handler(val, oldVal) {
        // 多级表单
        //   if (this.$utils.isNotEmpty(this.field.field_options.parentKey) && this.mode !== 'block') return // 多级子表不向上修改
        this.dataModel = val[this.fieldName]
      },
      deep: true,
      immediate: true
    },
    fieldRights: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal)) {
          return
        }
        this.handleFieldRights(this.fieldName, val)
      },
      deep: true,
      immediate: true
    },
    rights: {
      handler(val, oldVal) {
        this.fieldRights = val[this.fieldName]
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.dataModel = null
    this.fieldRights = null
  },
  methods: {
    // 查看是否存在下边距
    paddingBottom() {
      if (this.$utils.isNotEmpty(this.field) &&
        this.$utils.isNotEmpty(this.field.field_options) &&
        this.field.field_options.is_margin) {
        if (this.$utils.isNotEmpty(this.field.field_options.bottom_margin)) {return true}
      } else if (this.$utils.isNotEmpty(this.params) &&
        this.$utils.isNotEmpty(this.params.formAttrs) &&
        this.params.formAttrs.is_margin) {
        if (this.$utils.isNotEmpty(this.params.formAttrs.bottom_margin)) {return true}
      }
      return false
    },
    // 获取边距配置
    getPadding() {
      let _margin = {}
      if (this.$utils.isNotEmpty(this.field) &&
        this.$utils.isNotEmpty(this.field.field_options) &&
        this.field.field_options.is_margin) {
        _margin = {
          top: this.field.field_options.top_margin,
          bottom: this.field.field_options.bottom_margin,
          left: this.field.field_options.left_margin,
          right: this.field.field_options.right_margin
        }
      } else if (this.$utils.isNotEmpty(this.params) &&
        this.$utils.isNotEmpty(this.params.formAttrs) &&
        this.params.formAttrs.is_margin) {
        _margin = {
          top: this.params.formAttrs.top_margin,
          bottom: this.params.formAttrs.bottom_margin,
          left: this.params.formAttrs.left_margin,
          right: this.params.formAttrs.right_margin
        }
      } else {
        return ''
      }
      let _style = ''
      for (const key in _margin) {
        if (_margin.hasOwnProperty(key) && this.$utils.isNotEmpty(_margin[key])) {
          _style += `padding-${key}: ${_margin[key]}px;`
        }
      }
      return _style
    },
    // 获取规则配置中的样式
    getRuleStyle() {
      if (this.$utils.isEmpty(this.field) ||
        this.$utils.isEmpty(this.field.field_options)) {return ''}
      let _style = Styles.getBgColorByName(this.field.field_options, 'rule_background_color')
      _style += Styles.getColorByName(this.field.field_options, 'rule_color')
      return _style
    },
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      if (this.$utils.isEmpty(this.params) ||
        this.$utils.isEmpty(this.params.formAttrs) ||
        this.$utils.isEmpty(this.params.formAttrs.styles)) {return ''}
      return Styles.getStyleByName(this.params.formAttrs.styles, tfName, fsName, bName, cName, aName)
    },
    handleModels(name, val) {
      // 多级表单
      if (this.$utils.isNotEmpty(this.field.field_options.parentKey) && this.mode !== 'block') {return} // 多级子表不向上修改
      if (this.$utils.isEmpty(name) || isEqual(val, this.models[name])) {
        return
      }
      this.$set(this.models, name, val)
      this.$emit('update:models', {
        ...this.models,
        [name]: val
      })
    },
    handleFieldRights(name, val) {
      if (this.$utils.isEmpty(name) || isEqual(val, this.rights[name])) {
        return
      }
      this.$set(this.rights, name, val)
      this.$emit('update:rights', {
        ...this.rights,
        [name]: val
      })
    },
    setFieldData(name, val) {
      this.$utils.requestAnimationFrame(() => {
        this.$emit('update-form-data', name, val)
      }, 10)
    },
    runDefaultValue() {
      this.$utils.requestAnimationFrame(() => {
        // 值改变进行公式计算
        this.runCalFormula()
        // 值改变进行数据联动
        this.runLinkage()
        // 值改变进行动态脚本
        this.runDynamic()
      })
    },
    /**
     * 进行公式计算
     */
    runCalFormula() {
      if (!this.formula) {return}
      const { field, code, mainCode, row } = this
      if (field.field_type === 'table') {
        const columns = field.field_options.columns || []
        const allColumns = FormFieldUtil.getColumns(columns)
        // 主表通过子表计算
        for (let i = 0; i < allColumns.length; i++) {
          const column = allColumns[i]
          this.calFormula(code, column.name, mainCode, row)
        }
      } else {
        this.calFormula(code, field.name, mainCode, row)
      }
    },
    calFormula(code, name, mainCode, row) {
      const key = code + '.' + name
      const formulas = this.formula[key]
      if (!formulas) {return}
      if (mainCode) {
        FormUtils.runSubCalFormula(this, formulas, code, mainCode, row)
      } else {
        FormUtils.runMainCalFormula(this, formulas, code)
      }
    },
    /**
     * 进行联动数据
     */
    runLinkage() {
      if (!this.linkages) {return}
      const { field, code } = this
      if (field.isSub) { // 子表
        const key = code + '.' + field.name
        const linkages = this.linkages ? this.linkages[key] : null
        if (linkages) {
          FormUtils.runLinkage(this, linkages, field, field.row)
        }
      } else {
        field.code = code
        const key = field.code + '.' + field.name
        const linkages = this.linkages ? this.linkages[key] : null
        if (linkages) {
          FormUtils.runLinkage(this, linkages, field)
        }
      }
    },
    /**
     * 进行动态脚本
     */
    runDynamic() {
      if (!this.dynamic) {return}
      const { field, code } = this
      if (field.isSub) { // 子表
        const key = code + '.' + field.name
        const dynamic = this.dynamic ? this.dynamic[key] : null
        if (dynamic) {
          FormUtils.runCalDynamic(this, dynamic, field, field.row)
        }
      } else {
        field.code = code
        const key = field.name
        const dynamic = this.dynamic ? this.dynamic[key] : null
        if (dynamic) {
          FormUtils.runCalDynamic(this, dynamic, field)
        }
      }
    },
    emitEvent(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    handleDirectHandlerSign(val) {
      this.handleModels(this.fieldName + FormOptions.t.DIRECT_HANDLER_SIGN_KEY, val)
    }
  }
}
</script>
<style lang="scss">
.ibps-form-item{
  position: relative;
  .combination_border{
    border: 1px #c8c8c8 solid;
  }
  .combination_wrapper{
    .combination_name{
      font-size: 16px;
      padding: 10px;
    }
    .combination_border__bottom{
      border-bottom: 1px #c8c8c8 solid;
    }
  }
}
</style>
