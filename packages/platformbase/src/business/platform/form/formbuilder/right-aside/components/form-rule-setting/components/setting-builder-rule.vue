<template>
  <div
    :class="{
      'has-error':hasError
    }"
    class="rule-container"
  >
    <div class="rule-header">
      <!--错误提示-->
      <div v-if="hasError" class="error-container">
        <el-tooltip :content="hasError?errors[0].message:''">
          <i class="ibps-icon-warning" />
        </el-tooltip>
      </div>
      <!--规则过滤字段-->
      <div class="rule-filter-container">
        <el-select v-model="rulesData.field" value-key="name" @change="changeField">
          <el-option
            v-for="item in fields"
            :key="item.name"
            :label="item.label"
            :value="item"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </div>
      <template v-if="$utils.isNotEmpty(rulesData.field)">
        <!--规则操作符-->
        <div class="rule-operator-container">
          <el-select v-model="rulesData.operator">
            <el-option
              v-for="operator in operatorsOptions"
              :key="operator"
              :value="operator"
              :label="$t('components.query-builder.operators.'+operator)"
            />
          </el-select>
        </div>
        <!--规则值-->
        <!--规则值 - 固定值-->
        <div class="rule-value-container">
          <!-- 单行文本、 多行文本 -->
          <template v-if="rulesData.field.field_type==='text'||rulesData.field.field_type==='textarea'">
            <el-input
              v-model="rulesData.value"
              :type="rulesData.field.field_type"
              :autosize="autosize"
              :rows="fieldOptions.rows||3"
              :clearable="clearable"
            />
          </template>
          <!-- 数字 -->
          <template v-else-if="rulesData.field.field_type==='number'">
            <ibps-number
              v-model="rulesData.value"
              :clearable="clearable"
              :precision="fieldOptions.decimal_places"
              :decimal-scale="fieldOptions.decimal_scale"
              :keep-decimals="fieldOptions.keep_decimals"
              :number-format="fieldOptions.number_format"
              :is-rounding="fieldOptions.is_rounding"
              :currency="fieldOptions.currency"
              :thousands="fieldOptions.thousands"
              :step="fieldOptions.step"
              :controls="fieldOptions.controls"
              :position="fieldOptions.position"
            />
          </template>
          <!-- 计数器 -->
          <template v-else-if="rulesData.field.field_type === 'inputNumber'">
            <el-input-number
              v-model="numberDataModel"
              :max="fieldOptions.max"
              :min="fieldOptions.min"
              :step="fieldOptions.step"
              :precision="fieldOptions.precision"
              :controls="fieldOptions.controls"
              :controls-position="fieldOptions.controls_position"
              :placeholder="fieldOptions.placeholder"
            />
          </template>
          <!-- 单项选择 -->
          <div v-else-if="rulesData.field.field_type==='radio'" class="rule-value-container_group">
            <el-radio-group
              v-model="rulesData.value"
            >
              <component
                :is="fieldOptions.button?'el-radio-button':'el-radio'"
                v-for="o in dataOptions"
                :key="o.val"
                :label="o.val"
                :border="fieldOptions.border"
                :style="{
                  display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
                class="ibps-pt-5"
              >
                <span>{{ o.label }}</span>
              </component>
            </el-radio-group>
          </div>
          <!-- 多选项选择 -->
          <div v-else-if="rulesData.field.field_type==='checkbox'" class="rule-value-container_group">
            <el-checkbox-group
              v-model="checkboxDataModel"
            >
              <component
                :is="fieldOptions.button?'el-checkbox-button':'el-checkbox'"
                v-for="o in dataOptions"
                :key="o.val"
                :label="o.val"
                :border="fieldOptions.border"
                :style="{display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
              >
                <span>{{ o.label }}</span>
              </component>
            </el-checkbox-group>
          </div>
          <!-- 下拉框 -->
          <template v-else-if="rulesData.field.field_type==='select'">
            <el-select
              v-model="selectDataModel"
              :multiple="multipleSelect"
              :clearable="clearable"
            >
              <el-option
                v-for="o in dataOptions"
                :key="o.val"
                :label="o.label"
                :value="o.val"
              />
            </el-select>
          </template>
          <!-- 开关 -->
          <template v-else-if="rulesData.field.field_type==='switch'">
            <el-checkbox
              v-if="fieldOptions.appearance==='checkbox'"
              v-model="rulesData.value"
              :disabled="readonly"
            />
            <el-switch
              v-else
              v-model="rulesData.value"
              :active-value="fieldOptions.active_value"
              :inactive-value="fieldOptions.inactive_value"
              :active-text="showText?fieldOptions.active_text:''"
              :inactive-text="showText?fieldOptions.inactive_text:''"
              :active-color="fieldOptions.active_color"
              :inactive-color="fieldOptions.inactive_color"
            />
          </template>
          <!-- 滑块 -->
          <template v-else-if="rulesData.field.field_type==='slider'">
            <div style="width:99%;padding-left: 15px;">
              <el-slider
                v-model="numberDataModel"
                :show-input="fieldOptions.show_input"
                :show-tooltip="fieldOptions.show_tooltip"
                :max="fieldOptions.max"
                :min="fieldOptions.min"
                :step="fieldOptions.step"
              />
            </div>
          </template>
          <!-- 评分 -->
          <template v-else-if="rulesData.field.field_type==='rate'">
            <el-rate
              v-model="numberDataModel"
              :max="fieldOptions.max"
              :allow-half="fieldOptions.allow_half"
              :show-text="fieldOptions.show_text"
              :show-score="fieldOptions.show_score"
              class="ibps-pt-10"
            />
          </template>
          <!-- 日期控件 -->
          <template v-else-if="rulesData.field.field_type==='datePicker'||rulesData.field.field_type==='currentTime'||rulesData.field.field_type==='currentDate'">
            <el-date-picker
              v-if="datePckerType ==='datePicker'"
              v-model="rulesData.value"
              :type="dateType"
              :value-format="datefmt"
              :format="datefmt"
              :clearable="clearable"
            />
            <el-time-picker
              v-else-if="datePckerType ==='timePicker'"
              v-model="rulesData.value"
              :value-format="datefmt"
              :format="datefmt"
              :clearable="clearable"
            />
          </template>
          <!-- 选择器-->
          <ibps-user-selector
            v-else-if="fieldType==='selector' || fieldType==='currentUser' || fieldType==='currentOrg' "
            v-model="rulesData.value"
            :type="fieldOptions.selector_type"
            :filter="fieldOptions.filter"
            :multiple="multiple"
            :store="fieldOptions.store||'id'"
            :value-key="fieldOptions.store==='bind'?'name':'id'"
            :is-value-come-init="selectorAction==='confirm'"
            @action="buttonKey => selectorAction = buttonKey"
          />
          <!-- 其他 -->
          <template v-else>
            <el-input
              v-model="rulesData.value"
              :clearable="clearable"
            />
          </template>
        </div>
      </template>
      <div class="btn-group pull-right rule-actions">
        <el-button type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicFormField from '@platform/business/platform/form/formrender/dynamic-form/dynamic-form-field'
import DateFormatUtil from '@platform/business/platform/form/utils/dateFormatUtil'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import IbpsNumber from '@platform/components/ibps-number'
import IbpsUserSelector from '@platform/business/platform/org/selector'
import Ids from 'ids'
export default {
  name: 'SettingBuilderRule',
  components: {
    'IbpsDynamicFormField': DynamicFormField,
    IbpsNumber,
    IbpsUserSelector
  },
  props: {
    fields: {
      type: Array
    },
    rules: Object,
    index: [String, Number],
    depth: Number,
    labels: Object
  },
  data() {
    return {
      selectorAction: '',
      dataTemplate: {},
      rulesData: this.rules,
      errors: [],
      operators: {
        string: ['equal', 'not_equal', 'contains', 'not_contains'],
        number: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal'],
        date: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal'],
        boolean: ['equal', 'not_equal']
      },
      operatorsOptions: [],
      id: ''
    }
  },
  computed: {
    // 获取规则操作符
    getOperators() {
      const type = this.fieldType
      if (this.$utils.isEmpty(type)) {return []}
      let name = 'string'
      if (type === 'datePicker' || type === 'currentTime' || type === 'currentDate') {
        name = 'date'
      } else if (type === 'rate' || type === 'slider' || type === 'inputNumber' || type === 'number') {
        name = 'number'
      } else if (type === 'switch') {
        name = 'boolean'
      }
      return this.operators[name]
    },
    /**
     * 是否多选
     */
    multiple() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'], true)
    },
    // 自适应内容高度
    autosize() {
      let autosize = this.fieldOptions.autosize
      if (this.fieldOptions.autosize && (this.fieldOptions.min_rows || this.fieldOptions.max_rows)) {
        const rows = {}
        rows.minRows = this.fieldOptions.min_rows ? this.fieldOptions.min_rows : null
        rows.maxRows = this.fieldOptions.max_rows ? this.fieldOptions.max_rows : null
        autosize = rows
      }
      return autosize
    },
    // 日期格式
    datefmt() {
      if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
        if (this.fieldType === 'currentDate') {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        } else if (this.fieldType === 'currentTime') {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['time']
        } else {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        }
      } else {
        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
      }
    },
    /**
     * 日期格式处理
     */
    dateDealFmt() {
      return DateFormatUtil.dealFmt(this.datefmt)
    },
    // 日期控件类型
    datePckerType() {
      return this.dateDealFmt.datePckerType
    },
    dateType() {
      // year/month/date/week/ datetime/datetimerange/daterange
      // 根据自定义日期格式的配置
      return this.dateDealFmt.dateType || 'datetime'
    },
    showText() {
      return this.$utils.toBoolean(this.fieldOptions.show_text, true)
    },
    /**
     * 是否多选
     */
    multipleSelect() {
      return this.$utils.toBoolean(this.fieldOptions['multiple'], false)
    },
    selectDataModel: {
      get() {
        if (this.multipleSelect) {
          if (Array.isArray(this.rulesData.value)) {
            return this.rulesData.value
          }
          return this.rulesData.value ? this.rulesData.value.split(',') : []
        } else {
          return this.rulesData.value
        }
      },
      set(value) {
        this.rulesData.value = this.multipleSelect ? value.join(',') : value
      }
    },
    checkboxDataModel: {
      get() {
        if (Array.isArray(this.rulesData.value)) {
          return this.rulesData.value
        }
        return this.rulesData.value ? this.rulesData.value.split(',') : []
      },
      set(value) {
        this.rulesData.value = value.join(',')
      }
    },
    numberDataModel: {
      get() {
        if (!this.$utils.isNum(this.rulesData.value)) {return}
        return Number(this.rulesData.value)
      },
      set(value) {
        this.rulesData.value = value
      }
    },
    fieldType() {
      if (this.$utils.isEmpty(this.rulesData) || this.$utils.isEmpty(this.rulesData.field)) {return ''}
      return this.rulesData.field.field_type
    },
    isValueSource() {
      return ((this.fieldType === 'radio' || this.fieldType === 'checkbox' || this.fieldType === 'select') &&
              this.fieldOptions['datasource'] === 'valuesource')
    },
    /**
     * 单选、多选、下拉等选项
     */
    dataOptions() {
      return this.fieldOptions['options'] || []
    },
    /**
     * switch选项
     */
    switchOptions() {
      return FormUtils.getSwitchOptions(this.fieldOptions)
    },
    /**
     * 可清空
     */
    clearable() {
      return this.$utils.toBoolean(this.fieldOptions['clearable'], true)
    },
    fieldOptions() {
      if (this.$utils.isEmpty(this.rulesData) || this.$utils.isEmpty(this.rulesData.field)) {return {}}
      return this.rulesData.field.field_options || {}
    },
    hasError() {
      return this.errors.length > 0
    }
  },
  watch: {
    rules(val) {
      this.rulesData = val
    },
    rulesData: {
      handler(val) {
        this.validateValue(val)
        this.$emit('update:rules', val)
      },
      deep: true
    },
    errors: {
      handler(val, oldVal) {
        this.$emit('errors', val, this.id)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.validateValue(this.rulesData)
    this.operatorsOptions = this.getOperators
    if (this.$utils.isEmpty(this.rulesData) || this.$utils.isNotEmpty(this.rulesData.operator)) {return}
    if (this.$utils.isNotEmpty(this.operatorsOptions)) {
      this.rulesData.operator = this.operatorsOptions[0]
    }
    this.id = new Ids([32, 36, 1]).next()
  },
  beforeDestroy() {
    this.rulesData = null
    this.errors = null
    this.dataTemplate = null
    this.operators = null
    this.operatorsOptions = null
  },
  methods: {
    // 删除规则
    remove: function() {
      this.$emit('child-deletion-requested', this.index, this.id)
    },
    // 改变过滤规则的条件
    changeField: function() {
      this.rulesData.value = null
      // 改变条件
      this.operatorsOptions = this.getOperators
      if (this.$utils.isEmpty(this.operatorsOptions)) {
        this.rulesData.operator = null
      } else {
        this.rulesData.operator = this.operatorsOptions[0]
      }
    },
    validateValue(rule) {
      if (rule && this.$utils.isEmpty(rule.value)) {
        this.errors.push({
          message: '必填'
        })
      } else {
        this.errors = []
      }
    }
  }
}
</script>
<style lang="scss">
  .rule-tootip-content{
    width: 200px;
  }
  .rule-tootip-popper{
    border: 1px solid #C0C4CC!important;
  }
  .popper__arrow{
    border-bottom-color: #C0C4CC!important;
  }
  .rule-tooltip-icon{
    position: absolute;
    bottom: 8px;
    color: #409EFF;
  }
</style>
