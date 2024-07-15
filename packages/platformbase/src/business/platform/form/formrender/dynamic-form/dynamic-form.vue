<template>
  <div class="dynamic-form-container" :style="getStyle()">
    <div class="dynamic-form" :style="getShadowByName('shadow')+getBgColorByName('styleBgColor')">
      <!-- 页眉 -->
      <div
        v-if="$utils.isNotEmpty(formDef.attrs.styles)
          && $utils.isNotEmpty(formDef.attrs.styles.headerDisplay)
          && formDef.attrs.styles.headerDisplay === 'show'"
        class="ibps-page-header"
      >
        <div
          v-if="formDef.attrs.styles.headerType === 'text'"
          class="page-header-text"
          :style="getStyleByName('headerTypeface', 'headerFontSize', 'headerBold', 'headerColor', 'headerAlignment')
            + getBgColorByName('headerBgColor')"
        >
          {{ formDef.attrs.styles.headerText }}
        </div>
        <div
          v-else-if="formDef.attrs.styles.headerType === 'sola'"
          class="page-header-sola"
          :style="'display: grid;' + getStyleByName('', '', '', '', 'headerLayout')
            + getBgColorByName('headerBgColor')"
        >
          <template v-for="(el, i) in getImageByName('headerPicture')">
            <el-image :key="i" fit="cover" :src="el" style="width:100%;" />
          </template>
        </div>
        <div
          v-else
          class="page-header-carousel"
        >
          <template v-if="$utils.isNotEmpty(formDef.attrs.styles.headerCarousel)">
            <el-carousel indicator-position="outside" trigger="click" height="300px">
              <el-carousel-item v-for="(item,i) in getImageByName('headerCarousel')" :key="i" :style="'text-align:center;'+getBgColorByName('headerBgColor')">
                <el-image fit="contain" style="height: 100%;" :src="item" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </div>
      </div>
      <!--表头-->
      <div v-if="hasHeader" class="form-header">
        <!-- <div v-if="hasHeader" class="title" :class="titlePosition">{{ formDef.name }}</div>
        <div v-if="hasDesc" class="desc" v-html="$utils.formatText(formDef.desc )" /> -->
        <div
          class="title"
          :class="titlePosition"
          :style="getStyleByName('titleTypeface','titleFontSize','titleBold','titleColor','titleAlignment')"
        >{{ formDef.name }}</div>
        <div v-if="hasDesc" ref="desc" class="desc " :class="getContractByName() && isFold? 'desc-details':''" v-html="$utils.formatText( formDef.desc )" />
        <div v-if="hasDesc && getContractByName() && isShow" class="desc-contract">
          <el-button v-if="isFold" type="text" @click="toggleIsFold">展开<i class="ibps-icon-angle-double-down" /></el-button>
          <el-button v-else type="text" @click="toggleIsFold">收起<i class="ibps-icon-angle-double-up" /></el-button>
        </div>
      </div>
      <!--表单-->
      <el-form
        ref="form"
        :model="models"
        :inline="inline"
        :label-suffix="labelSuffix"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :status-icon="statusIcon"
        :size="size"
        :hide-required-asterisk="hideRequiredAsterisk"
        :class="customClass"
        class="dynamic-form_content"
        @submit.native.prevent
      >
        <template v-for="item in formDef.fields">
          <!--嵌套布局-->
          <component
            :is="'ibps-dynamic-form-'+item.field_type"
            v-if="isNestedField(item.field_type)"
            :ref="'formItem'+item.name"
            :key="item.name"
            :models.sync="models"
            :rights.sync="rights"
            :form-data="models"
            :field="item"
            :code="code"
            :params="formParams"
            :cur-active-step.sync="activeStep"
          />
          <!--其他类型-->
          <ibps-dynamic-form-item
            v-else
            :ref="'formItem'+item.name"
            :key="item.name"
            :models.sync="models"
            :rights.sync="rights"
            :form-data="models"
            :field="item"
            :code="code"
            :params="formParams"
          />
        </template>
      </el-form>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { isEqual } from 'element-ui/lib/utils/util'
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import { nestedFieldTypes, needModelFieldTypes, fixedFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import FormOptions from '../../constants/formOptions'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import { getDynamicParams } from '@platform/business/platform/form/utils/formCascadeUtil'
import Styles from '@platform/business/platform/form/utils/global-style'
import DynamicFormItem from './dynamic-form-item'
import DynamicFormField from './dynamic-form-field'
import DynamicFormOther from './dynamic-form-other'
import DynamicFormOpinion from './components/approval-opinion'
import DynamicFormGrid from './dynamic-form-grid'
import DynamicFormTabs from './dynamic-form-tabs'
import DynamicFormSteps from './dynamic-form-steps'
import DynamicFormCollapse from './dynamic-form-collapse'
import DynamicFormFieldset from './dynamic-form-fieldset'
import DynamicFormCard from './dynamic-form-card'
import DynamicFormTable from './dynamic-form-table'
import DynamicFormTableItem from './dynamic-form-table-item'
import DynamicFormTableBlock from './dynamic-form-table-block'
import DynamicFormCombination from './dynamic-form-combination'
// import DynamicFormLayoutTable from '/dynamic-form-layout-table'
Vue.component('IbpsDynamicFormItem', DynamicFormItem)
Vue.component('IbpsDynamicFormField', DynamicFormField)
Vue.component('IbpsDynamicFormOther', DynamicFormOther)
Vue.component('IbpsDynamicFormOpinion', DynamicFormOpinion)
Vue.component('IbpsDynamicFormGrid', DynamicFormGrid)
Vue.component('IbpsDynamicFormTabs', DynamicFormTabs)
Vue.component('IbpsDynamicFormSteps', DynamicFormSteps)
Vue.component('IbpsDynamicFormCollapse', DynamicFormCollapse)
Vue.component('IbpsDynamicFormFieldset', DynamicFormFieldset)
Vue.component('IbpsDynamicFormCard', DynamicFormCard)
Vue.component('IbpsDynamicFormTable', DynamicFormTable)
Vue.component('IbpsDynamicFormTableItem', DynamicFormTableItem)
Vue.component('IbpsDynamicFormTableBlock', DynamicFormTableBlock)
Vue.component('IbpsDynamicFormCombination', DynamicFormCombination)
// Vue.component('ibps-dynamic-form-layout-table', DynamicFormLayoutTable)
export default {
  provide() {
    return {
      dynamicForm: this
    }
  },
  props: {
    formDef: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object
    },
    validateImmediately: { // 是否初始验证
      type: Boolean,
      default: true
    },
    initialization: {
      type: Boolean,
      default: false
    },
    // 上个页面传入扩展参数
    params: Object,
    // 当前激活步骤
    curActiveStep: Number,
    preview: Boolean
  },
  data() {
    return {
      models: {}, // 表单model对象数据
      rights: {}, // 表单权限
      responseDynamic: {}, // 动态脚本
      responseFormula: {}, // 公式
      responseLinkages: {}, // 联动数据
      responseCascades: {}, // 级联数据
      responseVerifys: [], // 表单提交校验
      responseOpinionFields: {}, // 表单的意见字段
      responseFormOpinionData: {}, // 已填写的表单意见
      responseLabelFields: {}, // 表单的文本字段
      invalidFields: {},
      responseParams: {},
      activeStep: 0,
      isFold: true,
      isShow: false
    }
  },
  computed: {
    formAttrs() {
      return this.formDef ? this.formDef.attrs || {} : {}
    },
    hasHeader() {
      return this.formAttrs && !this.formAttrs.hide_name
    },
    hasDesc() {
      return this.formAttrs && !this.formAttrs.hide_desc && this.formDef.desc
    },
    titlePosition() {
      const titlePosition = this.formAttrs.title_position
      return titlePosition === 'center' ? 'ibps-tc' : (titlePosition === 'right' ? 'ibps-tr' : '')
    },
    size() {
      return this.formAttrs.size || (this.$ELEMENT || {}).size
    },
    inline() {
      return this.formAttrs.inline || false
    },
    labelSuffix() {
      return this.formAttrs ? (this.formAttrs.colon ? this.formAttrs.labelSuffix || ':' : '') : ''
    },
    labelWidth() {
      if (this.$utils.isNotEmpty(this.formAttrs.labelWidth) && this.$utils.isNotEmpty(this.formAttrs.labelWidthUnit)) {
        return this.formAttrs.labelWidth + this.formAttrs.labelWidthUnit
      } else {
        return '100px'
      }
    },
    labelPosition() {
      return this.$utils.isNotEmpty(this.formAttrs.labelPosition) ? this.formAttrs.labelPosition : 'right'
    },
    descPosition() {
      return this.$utils.isNotEmpty(this.formAttrs.descPosition) ? this.formAttrs.descPosition || 'inline' : 'inline'
    },
    customClass() {
      return this.$utils.isNotEmpty(this.formAttrs.customClass) ? this.formAttrs.customClass : null
    },
    statusIcon() {
      return this.$utils.isNotEmpty(this.formAttrs.statusIcon) ? this.formAttrs.statusIcon : false
    },
    hideRequiredAsterisk() {
      return this.$utils.toBoolean(this.formAttrs.hideRequiredAsterisk, false)
    },
    code() {
      return this.formDef.code
    },
    readonlyRights() {
      return this.formDef && this.formDef.formType === 'detail' ? true : this.readonly
    },
    readonlyStyle() {
      return this.formAttrs && this.formAttrs.read_style ? this.formAttrs.read_style : 'text'
    },
    hasScript() {
      return this.formAttrs ? this.$utils.isNotEmpty(this.formAttrs.script) : false
    },
    formKey() {
      return this.formDef.key
    },
    formParams() {
      const params = {
        formKey: this.formKey,
        formType: this.formDef.formType,
        responseDynamic: this.responseDynamic,
        responseFormula: this.responseFormula,
        responseLinkages: this.responseLinkages,
        responseCascades: this.responseCascades,
        responseFormOpinionData: this.responseFormOpinionData,
        preview: this.preview,
        readonly: this.readonlyRights,
        readonlyStyle: this.readonlyStyle,
        labelWidth: this.labelWidth,
        labelSuffix: this.labelSuffix,
        descPosition: this.descPosition,
        formAttrs: this.formAttrs,
        invalidFields: this.invalidFields
      }
      return Object.assign(params, this.params, this.responseParams || {})
    },
    isEdit() {
      return this.params ? this.$utils.toBoolean(this.params.isEdit, false) : false
    }
  },
  watch: {
    formDef: {
      handler(val, oldVal) {
        if (isEqual(val, oldVal)) {
          return
        }
        this.initResponseFields()
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(val, oldVal) {
        this.models = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    models: {
      handler(val, oldVal) {
        this.setFieldOptionsByRules()
        // 延迟验证
        setTimeout(() => {
          this.validate(() => {})
        }, 10)
        this.$emit('cascade-data', val)
      },
      deep: true
    },
    initialization(val) {
      if (val && this.hasScript) {
        this.$emit('load-script')
      }
    },
    curActiveStep(val) {
      this.activeStep = val
    },
    activeStep(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('update:cur-active-step', val)
      }
    }
  },
  mounted() {
    // 初始化脚本
    this.$nextTick(() => {
      // 多级表单
      window['$formRef' + this.formDef.key] = this.$refs.form
      if (this.validateImmediately) {
        // 延迟验证
        setTimeout(() => {
          this.validate(() => {})
        }, 10)
      }
    })
    this.isTooLong()
    addResizeListener(this.$el, this.isTooLong)
  },
  beforeDestroy() {
    this.models = null
    this.rights = null
    this.responseDynamic = null
    this.responseFormula = null
    this.responseLinkages = null
    this.responseVerifys = null
    this.responseOpinionFields = null
    this.responseFormOpinionData = null
    this.responseLabelFields = null
    this.invalidFields = null
    removeResizeListener(this.$el, this.isTooLong)
    window['$formRef' + this.formDef.key] = null
    delete window['$formRef' + this.formDef.key]
  },
  methods: {
    // 判断规则是否满足
    judgeFormRules(rules) {
      let flag = true
      if (this.$utils.isEmpty(rules)) {return flag}
      for (let i = 0; i < rules.length; i++) {
        const rule_condition = rules[i].rule_condition
        if (this.$utils.isArray(rules[i].rules)) { // 判断是否为组合规则
          flag = this.judgeFormRules(rules[i].rules)
          if (flag) { // 满足规则设置的一条，再进行判断rule_condition
            if (this.$utils.isEmpty(rule_condition) || rule_condition === 'or') {break}
          } else {
            if (this.$utils.isNotEmpty(rule_condition) && rule_condition === 'and') {break}
          }
          continue
        }
        // 为单独的规则
        const field = rules[i].field
        const operator = rules[i].operator
        // 1.获取字段type、字段name
        const name = field.name
        // 2.判断models[name]是否为空->组合字段与正常字段
        let val = ''
        if (field.field_type === 'combinationField') { // 判断字段是否为组合字段
          if (this.$utils.isNotEmpty(field.field_options) &&
            this.$utils.isNotEmpty(field.field_options.combination)) {
            const arrs = field.field_options.combination.split('$_widget_')
            for (let j = 0; j < arrs.length; j++) {
              if (this.$utils.isEmpty(arrs[j])) {continue}
              const _name = arrs[j].substring(0, arrs[j].lastIndexOf('#'))
              if (this.$utils.isEmpty(_name)) {continue}
              const _val = this.models[_name]
              if (this.$utils.isEmpty(_val)) {continue}
              val += _val
            }
          }
        } else {
          val = this.models[name]
        }
        // 注：当为空时，判断operator是否为not_equal或者not_contains
        //    如果是，则也会满足规则;否，则不满足
        if (this.$utils.isEmpty(val)) {
          if (operator === 'not_equal' || operator === 'not_contains') {flag = true}
          else {flag = false}
          if (flag) { // 满足规则设置的一条，再进行判断rule_condition
            if (this.$utils.isEmpty(rule_condition) || rule_condition === 'or') {break}
          } else {
            if (this.$utils.isNotEmpty(rule_condition) && rule_condition === 'and') {break}
          }
          continue
        }
        // 3.根据type对数据进行类型的改变,根据不同的operator获取是否满足的结果
        const value = rules[i].value
        flag = this.compareByType(val, value, operator, field)
        // 4.判断规则运算符or/and,再根据flag决定是否结束循环
        if (flag) { // 满足规则设置的一条，再进行判断rule_condition
          if (this.$utils.isEmpty(rule_condition) || rule_condition === 'or') {break}
        } else {
          if (this.$utils.isNotEmpty(rule_condition) && rule_condition === 'and') {break}
        }
      }
      return flag
    },
    // 通过类型以及条件操作符对值A和B进行比较
    compareByType(valA, valB, operator, field) {
      const type = field.field_type
      let flag = false
      // 时间
      if (type === 'datePicker' || type === 'currentTime' || type === 'currentDate') {
        // 判断时间格式
        const datefmt = field.field_options.datefmt || 'yyyy-MM-dd'
        const temp = datefmt
          .replace(/y{1,4}/g, '([0-9]{1,4})')
          .replace(/M{1,2}/g, '([0-9]{1,2})')
          .replace(/d{1,2}/g, '([0-9]{1,2})')
          .replace(/H{1,2}/g, '([0-9]{1,2})')
          .replace(/m{1,2}/g, '([0-9]{1,2})')
          .replace(/s{1,2}/g, '([0-9]{1,2})')
          .replace(/S{1,3}/g, '([0-9]{1,3})')
        const reqex = new RegExp('^' + temp + '$')
        if (!reqex.test(valA) || !reqex.test(valB)) {return false}
        const arrsA = reqex.exec(valA)
        const arrsB = reqex.exec(valB)
        for (let i = 1; i < arrsA.length; i++) {
          valA = Number(arrsA[i])
          valB = Number(arrsB[i])
          if (operator === 'equal') {
            flag = valA === valB
            if (!flag) {break}
          } else if (operator === 'not_equal') {
            flag = valA !== valB
            if (flag) {break}
          } else {
            if (operator === 'less') {
              flag = valA < valB
            } else if (operator === 'less_or_equal') {
              flag = valA <= valB
            } else if (operator === 'greater') {
              flag = valA > valB
            } else if (operator === 'greater_or_equal') {
              flag = valA >= valB
            } else {
              flag = false
            }
            if (valA !== valB) {break}
          }
        }
      // 数字
      } else if (type === 'rate' || type === 'slider' || type === 'inputNumber' || type === 'number') {
        if (!this.$utils.isNum(valA) || !this.$utils.isNum(valB)) {return false}
        valA = Number(valA)
        valB = Number(valB)
        if (operator === 'equal') {
          flag = valA === valB
        } else if (operator === 'not_equal') {
          flag = valA !== valB
        } else if (operator === 'less') {
          flag = valA < valB
        } else if (operator === 'less_or_equal') {
          flag = valA <= valB
        } else if (operator === 'greater') {
          flag = valA > valB
        } else if (operator === 'greater_or_equal') {
          flag = valA >= valB
        } else {
          flag = false
        }
      // 存在多选
      } else if (type === 'checkbox' || type === 'select' || type === 'selector' || type === 'currentUser' || type === 'currentOrg') {
        let arrsA, arrsB
        if (/^(\[).{0,}(\])$/.test(valA)) {
          arrsA = JSON.parse(valA)
        } else {
          arrsA = valA.split(',')
        }
        if (/^(\[).{0,}(\])$/.test(valB)) {
          arrsB = JSON.parse(valB)
        } else {
          arrsB = valB.split(',')
        }
        for (let i = 0; i < arrsA.length; i++) {
          if (!this.$utils.isString(arrsA[i])) {arrsA[i] = JSON.stringify(arrsA[i])}
        }
        for (let i = 0; i < arrsB.length; i++) {
          if (!this.$utils.isString(arrsB[i])) {arrsB[i] = JSON.stringify(arrsB[i])}
        }
        if (operator === 'equal') {
          if (arrsA.length !== arrsB.length) {return false}
          for (let i = 0; i < arrsB.length; i++) {
            if (!arrsA.includes(arrsB[i])) {return false}
            flag = true
          }
        } else if (operator === 'not_equal') {
          if (arrsA.length !== arrsB.length) {return true}
          for (let i = 0; i < arrsB.length; i++) {
            if (!arrsA.includes(arrsB[i])) {return true}
            flag = false
          }
        } else if (operator === 'contains') {
          if (arrsA.length < arrsB.length) {return false}
          for (let i = 0; i < arrsB.length; i++) {
            if (!arrsA.includes(arrsB[i])) {return false}
            flag = true
          }
        } else if (operator === 'not_contains') {
          if (arrsA.length === 0) {return true}
          for (let i = 0; i < arrsB.length; i++) {
            if (!arrsA.includes(arrsB[i])) {return true}
            flag = false
          }
        } else {
          flag = false
        }
      // 配置时valB为字符串
      } else {
        if (operator === 'equal') {
          flag = valA === valB
        } else if (operator === 'not_equal') {
          flag = valA !== valB
        } else if (operator === 'contains') {
          flag = valA.includes(valB)
        } else if (operator === 'not_contains') {
          flag = !valA.includes(valB)
        } else {
          flag = false
        }
      }
      return flag
    },
    // 判断表单规则是否满足,满足则根据配置修改控件的fieldOptions（初版只支持主表单的字段）
    setFieldOptionsByRules() {
      // 1.判断是否存在规则
      const _attrs = this.formAttrs
      if (this.$utils.isEmpty(_attrs) || this.$utils.isEmpty(_attrs.formRules)) {return}
      // 2.判断是否存在字段控件
      if (this.$utils.isEmpty(this.formDef.fields)) {return}
      // 3.判断规则是否满足
      let _rule = {}
      const _formRules = JSON.parse(JSON.stringify(_attrs.formRules))
      // 根据优先级进行排序
      _formRules.sort((a, b) => {
        return a.priority - b.priority
      })
      for (let i = 0; i < _formRules.length; i++) {
        // 判断规则内是否存在规则设置，如果没有，则默认满足
        if (this.$utils.isEmpty(_formRules[i].rule) || this.$utils.isEmpty(_formRules[i].rule.rules)) {
          _rule = _formRules[i]
          break
        }
        const flag = this.judgeFormRules(_formRules[i].rule.rules)
        if (flag) { // 满足，取当前规则，并关闭当前循环
          _rule = _formRules[i]
          break
        }
      }
      // 4.根据满足的规则对控件进行配置的修改
      // 4.1.遍历过程中，每个先初始化三个配置项(是否显示，颜色，背景颜色)
      // 4.2.先判断隐藏还是显示
      // 4.3.根据隐藏/显示进行不同的操作
      // 判断是否存在满足的规则
      let rule = {}
      if (this.$utils.isNotEmpty(_rule)) {
        const color_controls = {}
        const bg_controls = {}
        const fields = {}
        if (this.$utils.isNotEmpty(_rule.fields)) {
          _rule.fields.forEach(el => {
            fields[el.name] = el
          })
        }
        if (this.$utils.isNotEmpty(_rule.bg_controls)) {
          _rule.bg_controls.forEach(el => {
            bg_controls[el.name] = el
          })
        }
        if (this.$utils.isNotEmpty(_rule.color_controls)) {
          _rule.color_controls.forEach(el => {
            color_controls[el.name] = el
          })
        }
        rule = {
          display: _rule.display,
          background_color: _rule.background_color,
          color: _rule.color,
          color_controls,
          fields,
          bg_controls
        }
      }
      this.setFieldOptions(rule, this.formDef.fields)
      const _fields = JSON.parse(JSON.stringify(this.formDef.fields))
      this.$set(this.formDef, 'fields', _fields)
    },
    // 对控件进行配置的修改 - rule规则，fields控件
    setFieldOptions(rule, fields) {
      const traverse = (fields) => {
        let _length = 0
        fields.forEach((field) => {
          let _len = 0
          if (nestedFieldTypes.includes(field.field_type)) {
            const childColumns = field.field_options.columns
            childColumns.forEach(child => {
              const _temp = traverse(child.fields)
              if (this.$utils.isNumber(_temp)) {_len += _temp}
            })
          }
          // 改变配置
          delete field.field_options.rule_display
          delete field.field_options.rule_background_color
          delete field.field_options.rule_color
          if (this.$utils.isEmpty(rule)) {return}
          // show向上判断，hidden向下判断
          if (rule.display === 'show') {
            if (this.$utils.isEmpty(rule.fields[field.name]) &&
            (this.$utils.isEmpty(_len) || _len === 0)) {
              this.$set(field.field_options, 'rule_display', 'hidden')
            } else {
              this.$set(field.field_options, 'rule_display', 'show')
              _length++
            }
          } else {
            if (this.$utils.isNotEmpty(rule.fields[field.name])) {
              this.$set(field.field_options, 'rule_display', 'hidden')
              _length++
              return _length
            } else {
              if (this.$utils.isNotEmpty(field.field_options.columns)) {
                const childColumns = field.field_options.columns
                let _num = 0
                childColumns.forEach(child => {
                  if (this.$utils.isNotEmpty(child.fields)) {
                    _num += child.fields.length
                  }
                })
                if (_num !== 0 && _num === _len) {
                  _length++
                  this.$set(field.field_options, 'rule_display', 'hidden')
                  return _length
                }
              }
              this.$set(field.field_options, 'rule_display', 'show')
            }
          }
          if (this.$utils.isNotEmpty(rule.color)) {
            if (this.$utils.isNotEmpty(rule.color_controls[field.name])) {
              this.$set(field.field_options, 'rule_color', rule.color)
            }
          }
          if (this.$utils.isNotEmpty(rule.background_color)) {
            if (this.$utils.isNotEmpty(rule.bg_controls[field.name])) {
              this.$set(field.field_options, 'rule_background_color', rule.background_color)
            }
          }
        })
        return _length
      }
      traverse(fields)
    },
    isTooLong() {
      this.$nextTick(() => {
        const data = this.$refs.desc
        if (this.$utils.isNotEmpty(data) && this.$utils.isNotEmpty(data.scrollHeight)) {
          this.isShow = data.scrollHeight > 80
        } else {
          this.isShow = false
        }
      })
    },
    toggleIsFold() { // 改变标题描述的收缩显示
      this.isFold = !this.isFold
    },
    getContractByName() { // 通过name获取是否收缩标题描述
      let result = false
      const data = this.formDef.attrs.styles
      if (this.$utils.isEmpty(data)) {return result}
      if (this.$utils.isNotEmpty(data.isFold) && data.isFold) {
        result = true
      }
      return result
    },
    getStyleByName(tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
      return Styles.getStyleByName(this.formDef.attrs.styles, tfName, fsName, bName, cName, aName)
    },
    getImageByName(name) { // 通过name获取图片
      return Styles.getImageByName(this.formDef.attrs.styles, name)
    },
    getBgColorByName(name) { // 通过name获取底色
      return Styles.getBgColorByName(this.formDef.attrs.styles, name)
    },
    getShadowByName(name) { // 通过name获取阴影
      return Styles.getShadowByName(this.formDef.attrs.styles, name)
    },
    getStyle() { // 页面背景 + 表单全局-电脑宽度   样式
      return Styles.getStyle(this.formDef.attrs.styles)
    },
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType)
    },
    /**
     * 初始化字段
     */
    async initResponseFields() {
      const fields = this.formDef.fields
      if (!fields) {return}
      await this.generateModles(fields)
      // 初始化运行公式计算
      // 初始化运行动态参数
      await this.initRunCalFormula()
      // 初始化表单意见
      await this.initResponseOpinionData()
      // 初始化表单参数
      await this.initResponseParams()
    },
    /**
     * 生成modles
     */
    async generateModles(fields) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldName = field.name
        const fieldType = field.field_type
        const fieldOptions = field.field_options
        const mode = fieldOptions.mode || 'inner'
        if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
          if (this.$utils.isNotEmpty(fieldOptions) && this.$utils.isNotEmpty(fieldOptions.columns)) {
            // 循环遍历所有字段
            fieldOptions.columns.forEach(item => {
              this.generateModles(item.fields)
            })
          }
        } else if (fieldType === 'table') { // 子表单
          let data = null
          if (mode === 'block' || this.$utils.isEmpty(fieldOptions.parentKey)) { // 不为多级子表或表单模式为块模式则进行数据生成
            if (fieldOptions.relation === 'one2one') {
              data = this.value ? this.value[fieldName] : {}
              if (this.$utils.isEmpty(data)) {
                const defaultValue = await FormUtils.getTableDefaultData(field, { isEdit: this.isEdit })
                this.$set(this.models, fieldName, defaultValue)
              } else {
                this.models[fieldName] = data || {}
              }
            } else {
              data = this.value ? this.value[fieldName] : []
              if (fieldOptions.mode === 'block') {
                if (this.$utils.isEmpty(data)) {
                  this.$set(this.models, fieldName, [])
                  const defaultValue = await FormUtils.getTableDefaultData(field, { isEdit: this.isEdit })
                  this.models[fieldName].push(JSON.parse(JSON.stringify(defaultValue)))
                } else {
                  this.models[fieldName] = data || []
                }
              } else {
                this.models[fieldName] = data || []
              }
            }
            // 初始化表单扩展参数
            this.initFormFieldParameter(field)
          }
        } else if (fieldType === 'approval_opinion') { // 审批意见
          this.models[fieldName] = ''
          this.responseOpinionFields[fieldName] = field
          // ====== 初始化表单权限
          this.initFormApprovalOpinionRights(field)
        } else {
          if (fixedFieldTypes.includes(fieldType)) { // 文本字段
            this.responseLabelFields[fieldName] = field
          }
          // 不是只读字段
          if (needModelFieldTypes.includes(fieldType) || fixedFieldTypes.includes(fieldType)) {
            // 空值默认
            const defaultValueEmpty = this.$utils.toBoolean(fieldOptions.default_value_empty, true)
            if (this.value && Object.keys(this.value).indexOf(fieldName) >= 0) { // 有值
              const data = this.value[fieldName]
              if (this.$utils.isEmpty(data)) {
                if (defaultValueEmpty) {
                  const defaultValue = await FormUtils.getFieldDefaultValue(field, { isEdit: this.isEdit })
                  this.models[fieldName] = defaultValue
                }
              } else {
                this.models[fieldName] = await this.getInitData(field, data)
              }
            } else { // 默认值
              const defaultValue = await FormUtils.getFieldDefaultValue(field, { isEdit: this.isEdit })
              this.models[fieldName] = defaultValue
            }
          }
          // 初始化表单扩展参数
          this.initFormFieldParameter(field)
        }
      }
    },
    async getInitData(field, data) {
      const fieldType = field.field_type
      const copyFlow = this.$utils.toBoolean(this.formParams ? this.formParams.copyFlow : false, false)
      if (fieldType === 'autoNumber' && copyFlow) { // 复制流程初始化数据
        return await FormUtils.getFieldDefaultValue(field, { isEdit: this.isEdit })
      }
      // 日期格式处理
      //  else if (fieldType === 'datePicker') { // 日期格式处理
      //   console.info(data)
      // }
      return data
    },
    /**
     *  初始化表单扩展参数
     */
    initFormFieldParameter(field) {
      // ====== 初始化表单权限
      this.initFormRights(field)
      // ====== 初始化默认值改变
      const types = FormOptions.t.DEFAULE_VALUE_TYPE
      for (const key in types) {
        FormUtils.setResponseValue(key, this[types[key]], field, this.code)
      }
    },
    /**
     * 初始化审批意见权限
     */
    initFormApprovalOpinionRights(field) {
      this.rights[field.name] = FormUtils.getDefaultApprovalOpinionRigths(field, this.params) || this.getPermissions(this.permissions, field) || FormUtils.getDefaultRigths(field)
    },
    /**
     *  初始化表单权限
     */
    initFormRights(field) {
      this.rights[field.name] = this.getPermissions(this.permissions, field) || FormUtils.getDefaultRigths(field)
    },
    // 获取权限
    getPermissions(permissions, field) {
      if (this.$utils.isEmpty(permissions)) {return}
      const fieldType = field.field_type
      const name = field.name
      let rightsValue = null
      const isNonInputField = needModelFieldTypes.includes(fieldType)
      let isSpecial = false
      if (fieldType === 'approval_opinion' && permissions.opinions) { // 意见 特殊处理
        rightsValue = permissions.opinions[name] ? permissions.opinions[name] : null
      } else if (fieldType === 'table' && permissions.tables) { // 子表
        isSpecial = true
        rightsValue = permissions.tables[name] ? permissions.tables[name] : null
      } else if (isNonInputField && permissions.fields) { // 非输入字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      } else { // 字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null
      }
      if (this.readonly && !isNonInputField && !isSpecial) { // 只读权限
        // 修复空权限默认值的bug
        if (this.$utils.isEmpty(rightsValue)) {
          rightsValue = FormUtils.getDefaultRigths(field)
        }
        rightsValue = rightsValue !== FormOptions.t.PERMISSIONS.HIDE ? FormOptions.t.PERMISSIONS.READ : rightsValue
      }
      return rightsValue
    },
    // 初始化运行公式计算,运行动态脚本
    initRunCalFormula() {
      setTimeout(() => {
        // 初始化运行公式计算
        FormUtils.runCalFormula(this, this.responseFormula[FormUtils.NOT_NEED_FIELD], this.formDef.code)
        // 初始化运行动态脚本
        FormUtils.runCalDynamic(this, this.responseDynamic[FormUtils.NOT_NEED_FIELD], this.formDef.code)
      }, 100)
    },
    // 初始化表单意见
    initResponseOpinionData() {
      this.responseFormOpinionData = {}
      const opinionData = this.params ? this.params.formOpinionData || {} : {}
      if (this.$utils.isEmpty(opinionData) || !this.hasFormOpinion()) {
        return
      }
      const hasBindNode = opinionData.hasBindNode
      const formOpinionConfig = opinionData.formOpinionConfig
      if (hasBindNode) { // 1、有流程节点绑定的流程意见
        const nodeData = opinionData.formOpinionNodeData
        for (const key in this.responseOpinionFields) {
          if (this.responseOpinionFields.hasOwnProperty(key)) {
            if (formOpinionConfig[key]) {
              this.responseFormOpinionData[key] = nodeData[key]
            } else {
              this.responseFormOpinionData[key] = opinionData.opinionList
            }
          }
        }
      } else {
        for (const key in this.responseOpinionFields) {
          if (this.responseOpinionFields.hasOwnProperty(key)) {
            this.responseFormOpinionData[key] = opinionData.opinionList
          }
        }
      }
    },
    /**
     * 初始表单参数
     */
    async initResponseParams() {
      const params = this.formAttrs.params
      if (this.$utils.isEmpty(params)) {
        return
      }
      const responseParams = await getDynamicParams(params, this.models)
      this.responseParams = responseParams
    },
    getFormParams() {
      return this.formParams
    },
    getFormParamByKey(key) {
      return this.formParams[key]
    },
    /**
     * 表单提交校验
     */
    formSubmitVerify(callback) {
      let flag = true
      const verifys = this.formAttrs ? this.formAttrs.verifys : []
      if (this.$utils.isEmpty(verifys)) {
        callback(flag)
        return
      }
      const formData = this.getFormData()
      for (let i = 0; i < verifys.length; i++) {
        const verify = verifys[i]
        if (!FormUtils.runFormSubmitVerify(verify.formula, formData, this.formDef.code)) {
          flag = false
          callback(flag, verify.msg)
          return
        }
      }
      flag = true
      callback(flag)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      const data = {}
      // 去除文本,标签等字段,表单意见、直接处理字段字段
      for (let key in this.models) {
        if (this.responseOpinionFields[key] || this.responseLabelFields[key] ||
        key.endsWith('$table_label_' + this.formDef.code) ||
        key.endsWith(FormOptions.t.DIRECT_HANDLER_SIGN_KEY)) {continue}
        data[key] = this.models[key]
      }
      return data
    },
    /**
     * 设置表单字段数据
     */
    setFieldData(name, value) {
      this.models[name] = value
    },
    /**
     * 设置表单权限
     */
    getFormRights(name) {
      return this.rights[name]
    },
    /**
     * 设置表单权限
     */
    setFormRights(name, value) {
      this.rights[name] = value
    },
    /**
     *  是否有审批意见字段
     */
    hasFormOpinion() {
      return this.$utils.isNotEmpty(this.responseOpinionFields)
    },
    /**
     * 获取审批意见数据
     */
    getFormOpinionData() {
      const data = {}
      for (let key in this.models) {
        if (this.responseOpinionFields[key] &&
        (this.$utils.isEmpty(this.rights[key]) ||
        this.rights[key] === FormOptions.t.PERMISSIONS.EDIT ||
        this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED)) {
          data[key] = this.models[key]
        }
      }
      return data
    },
    getDirectHandlerSign() {
      const opinionData = this.getFormOpinionData()
      if (this.$utils.isEmpty(opinionData)) {
        return
      }
      const data = {}
      for (let key in opinionData) {
        data[key] = this.models[key + FormOptions.t.DIRECT_HANDLER_SIGN_KEY]
      }
      return data
    },
    /**
     * 获取审批意见验证
     */
    formOpinionValidate(callback, flag = false) {
      if (this.$utils.isEmpty(this.responseOpinionFields)) {
        callback(true)
        return
      }
      let i = 0
      if (flag) {
        for (const key in this.responseOpinionFields) {
          if (this.$utils.isEmpty(this.models[key]) && (
            this.$utils.isEmpty(this.rights[key]) ||
            this.rights[key] === FormOptions.t.PERMISSIONS.EDIT ||
            this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED)) {
            i++
          }
        }
      } else {
        for (const key in this.responseOpinionFields) {
          if (this.$utils.isEmpty(this.models[key]) && this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED) {
            i++
          }
        }
      }
      if (i > 0) {
        callback(false)
      } else {
        callback(true)
      }
    },
    /**
     * 表单验证
     */
    validate(callback) {
      // 先移除校验再进行校验
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
        this.$refs.form.validate((valid, invalidFields) => {
          this.invalidFields = invalidFields
          if (callback) {callback(valid, invalidFields)}
        })
      } else {
        callback()
      }
    },
    /**
     * 获取表单字段的具体控件组件实例
     */
    getRefsField(fieldName) {
      const refs = this.getRefs(fieldName)
      if (this.$utils.isEmpty(refs) || this.$utils.isEmpty(refs[0]) || this.$utils.isEmpty(refs[0].$refs) || this.$utils.isEmpty(refs[0].$refs['formField'])) {
        return null
      }
      return refs[0].$refs.formField
    },
    /**
     * 获取表单字段组件实例
     */
    getRefs(fieldName) {
      const key = 'formItem' + fieldName
      return this.getDynamicRefs(this.$refs, key)
    },
    getDynamicRefs(formRefs, key) {
      if (this.$utils.isEmpty(formRefs)) {
        return
      }
      for (const refKey in formRefs) {
        const formRef = formRefs[refKey]
        if (refKey === key) {return formRef}
        for (let j = 0; j < formRef.length; j++) {
          const refs = formRef[j]
          const v = this.getDynamicRefs(refs.$refs, key)
          if (v) {
            return v
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "@platform/assets/styles/components/form-generation";
.dynamic-form {
  .dynamic-form_content{
    padding: 20px;
  }
  .el-input{
    width: 100%;
  }
  .el-pagination__editor.el-input {
    width: 50px;
  }
  .el-select{
    width: 100%;
  }
  .el-collapse-item__header.is-active{
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 5px;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly{
     margin-bottom: 0;
  }
//===================border-form====================
    .ibps-border-form {
      border: 1px solid #cfd7e5;
      .el-form-item{
        border-top: 1px solid #cfd7e5;
      }
      .el-form-item__content:before {
        width: 1px;
        background: #cfd7e5;
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom:-20px;
      }
    .el-form-item__content .el-form-item__error {
      left: 5px
    }
    .el-form--label-top .el-form-item__content:before,
    .no-label-form-item .el-form-item__content:before {
      background: transparent
    }
    .el-row+.el-row {
      border-top: 1px solid #cfd7e5
    }
    .el-col+.el-col {
      border-left: 1px solid #cfd7e5
    }
    .el-col {
      overflow: hidden
    }
    .el-form-item__content {
      padding: 5px;
      padding-bottom: 0
    }
    .el-form-item__label {
      padding: 5px
    }
    .el-table{
      .el-form-item{
          border-top: 0;
      }
      .el-form-item__content:before {
        width: 0;
      }
      .el-form-item__content {
        padding: 0;
      }
    }
  }
}
</style>
