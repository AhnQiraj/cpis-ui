<template>
  <el-form-item
    v-if="!hidden"
    :prop="prop"
    :rules="rules"
    :label="mode === 'block'?label:null"
    :label-width="mode === 'block'?fieldLabelWidth:'0px'"
    class="ibps-table-item"
  >
    <!-- :class="{'dynamic-form-table-item__readonly':readonly}" -->
    <!--子表嵌套-->
    <ibps-dynamic-form-table
      v-if="field.field_type==='table'"
      :value.sync="dataModel"
      :field="field"
      :row="row"
      :rights="fieldRights"
      :readonly="$utils.isEmpty(disabled)?readonly:disabled"
      :params="params"
      :table-params="tableParams"
      v-on="listeners"
    />
    <ibps-dynamic-form-field
      v-else
      :value.sync="dataModel"
      :field="field"
      :form-data="formData"
      :row="row"
      :code="code"
      :main-code="mainCode"
      :readonly="$utils.isEmpty(disabled)?readonly:disabled"
      :readonly-style="readonlyStyle"
      :params="params"
      :table-params="tableParams"
      v-on="listeners"
    />
    <div
      v-if="field && field.desc && descPosition==='inline'"
      class="ibps-help-block"
      v-html="$utils.formatText(field.desc )"
    />
  </el-form-item>
</template>
<script>
import { isEqual } from 'element-ui/lib/utils/util'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import FormOptions from '../../constants/formOptions'
import { noneModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
export default {
  props: {
    models: [Object, Array], // 字段数据
    rights: [String, Object], // 字段权限
    formData: [Array, Object], // 表单数据（包含子表）
    defaultValue: Object, // 默认值
    field: Object, // 字段
    mainCode: String, // 主表名
    code: String, // 表名
    row: [String, Number], // 子表行数
    mode: { // 子表模式
      type: String,
      default: 'inner'
    },
    params: Object, // 参数
    tableParams: Object, // 子表参数
    parentCode: String, // 为多级子表时，该表的父表表名
    parentRow: [String, Number] // 为多级子表时，该表的父表行数
  },
  data() {
    let defaultVal = ''
    if (this.field.field_type === 'table') {
      // 一对多，是数组，一对一是对象
      defaultVal = []
    } else {
      defaultVal = ''
    }
    return {
      dataModel: this.models[this.field.name] || defaultVal,
      fieldRights: this.rights[this.field.name] || FormOptions.t.PERMISSIONS.EDIT,
      disabled: ''
    }
  },
  computed: {
    fieldName() {
      return this.field.name
    },
    prop() {
      if (this.$utils.isNotEmpty(this.parentCode) && this.mode !== 'block') {return this.parentCode + '.' + this.parentRow + '.' + this.code + '.' + this.row + '.' + this.field.name}
      return this.code + '.' + this.row + '.' + this.field.name
    },
    label() { // 显示的文本
      return this.$utils.isNotEmpty(this.field.field_options.units) ? this.field.label + '(' + this.field.field_options.units + ')' : this.field.label
    },
    labelWidth() { // 字段宽度
      if (this.field.field_type === 'table') {return '0'}
      return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : this.defaultLabelWidth
    },
    hidden() { // 是否隐藏
      return this.fieldRights === FormOptions.t.PERMISSIONS.HIDE || this.field.field_type === 'hidden'
    },
    readonly() { // 是否只读
      // 弹窗就是只读模式
      return this.mode === 'dialog' ? true : this.readonlyRights ? true : this.fieldRights === FormOptions.t.PERMISSIONS.READ
    },
    required() { // 必填  【只读隐藏，都设置非必填】
      return (this.readonly || this.hidden) ? false : (this.fieldRights === FormOptions.t.PERMISSIONS.REQUIRED)
    },
    rules() {
      if (this.readonly || this.hidden) {return []}
      return FormUtils.buildFormRules(this.field, this.required, this.formData)
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    },
    defaultLabelWidth() {
      return this.params.labelWidth
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
    }
  },
  watch: {
    dataModel: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal) || noneModelFieldTypes.includes(this.field.field_type)) {
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
        this.dataModel = val[this.field.name]
      },
      deep: true
    },
    fieldRights: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal)) {
          return
        }
        this.handleFieldRights(this.field.name, val)
      },
      deep: true,
      immediate: true
    },
    rights: {
      handler(val, oldVal) {
        this.fieldRights = val[this.field.name]
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
    setDisabled(set = false) {
      this.disabled = set
    },
    handleModels(name, val) {
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
      }, 16)
    },
    runDefaultValue() {
      this.$utils.requestAnimationFrame(() => {
        // 值改变进行公式计算
        this.runCalFormula()
        // 值改变进行数据联动
        this.runLinkage()
        // 值改变进行动态脚本
        this.runDynamic()
      }, 16)
    },
    /**
     * 进行公式计算
     */
    runCalFormula() {
      if (!this.formula) {return}
      const { field, code, mainCode, row } = this
      const key = code + '.' + field.name
      const formulas = this.formula ? this.formula[key] : null
      if (formulas) {
        FormUtils.runSubCalFormula(this, formulas, code, mainCode, row, this.parentCode, this.parentRow)
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .ibps-table-item{
    margin-bottom:0
  }
</style>
