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
      <!--排序-->
      <div v-if="hasSort" class="drag-handle">
        <i class="el-icon-sort" />
      </div>
      <!--规则过滤字段-->
      <div class="rule-filter-container">
        <el-select v-model="selectedFilter" @change="changeFilter">
          <el-option
            v-for="item in filters"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </div>
      <!--规则操作符-->
      <div class="rule-operator-container">
        <el-select v-model="rulesData.operator" @change="changeOperator">
          <el-option
            v-for="operator in selectedFilterObj.operators"
            :key="operator"
            :value="operator"
            :label="$t('components.query-builder.operators.'+operator)"
          />
        </el-select>
      </div>
      <!--规则值来源-->
      <div v-if="hasRuleValue" class="rule-source-container">
        <el-select v-model="rulesData.source" @change="changeSource">
          <el-option
            v-for="item in selectedFilterObj.sources"
            :key="item"
            :value="item"
            :label="$t('components.query-builder.sources.'+item)"
          />
        </el-select>
      </div>
      <!--规则值-->
      <!--规则值 - 固定值-->
      <div v-if="hasRuleValue" class="rule-value-container">
        <template v-if="rulesData.source === 'fixed'">
          <!---一个规则值-->
          <template v-if="nbInputs === 1 ">
            <el-input v-if="selectedFilterObj.input === 'text'" v-model="rulesData.value" v-bind="selectedFilterObj.attrs" type="text" clearable />
            <el-input-number v-else-if="selectedFilterObj.input === 'number'" v-model="rulesData.value" v-bind="selectedFilterObj.attrs" />
            <el-date-picker
              v-else-if="dateTypes.includes(selectedFilterObj.input)"
              v-model="rulesData.value"
              :editable="false"
              :type="selectedFilterObj.input"
              v-bind="selectedFilterObj.attrs"
              :format="$utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:''"
              :value-format="$utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'yyyy-MM-dd HH:mm:ss'"
            />
            <el-time-picker
              v-else-if="selectedFilterObj.input === 'time'"
              v-model="rulesData.value"
              :editable="false"
              v-bind="selectedFilterObj.attrs"
              :picker-options="{
                format: $utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'HH:mm:ss'
              }"
              :value-format="$utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'HH:mm:ss'"
            />
            <el-radio-group v-else-if="selectedFilterObj.input === 'radio'" v-model="rulesData.value">
              <el-radio v-for="option in iterateOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-else-if="selectedFilterObj.input === 'checkbox'" v-model="rulesData.value" v-bind="selectedFilterObj.attrs">
              <el-checkbox v-for="option in iterateOptions" :key="option" :label="option" :value="option" v-bind="selectedFilterObj.attrs" />
            </el-checkbox-group>
            <el-select v-else-if="selectedFilterObj.input === 'select'" v-model="rulesData.value" v-bind="selectedFilterObj.attrs">
              <el-option v-for="option in iterateOptions" :key="option.value" :value="option.value" :label="option.label" v-bind="selectedFilterObj.attrs" />
            </el-select>
            <template v-else>
              <component :is="selectedFilterObj.component" v-bind="selectedFilterObj.attrs" v-model="rulesData.value" />
            </template>
          </template>
          <!--多个规则值-->
          <template v-else-if="nbInputs > 1 ">
            <template v-if="selectedFilterObj.input === 'number' ">
              <ibps-number-range v-model="rulesData.value" style="width:200px;" />
            </template>
            <template v-if="selectedFilterObj.input === 'date' || selectedFilterObj.input === 'datetime'|| selectedFilterObj.input === 'time'">
              <el-date-picker v-model="rulesData.value" :editable="false" :type="selectedFilterObj.input+(nbInputs > 1 ? 'range' : '')" v-bind="selectedFilterObj.attrs" value-format="timestamp" style="width:200px;" />
            </template>
            <template v-else>
              <component :is="selectedFilterObj.component" v-bind="selectedFilterObj.attrs" v-model="rulesData.value" />
            </template>
          </template>
        </template>
        <!--规则值 - 脚本-->
        <template v-if="rulesData.source === 'script'">
          <el-input
            v-model="rulesData.value"
            :autosize="{ minRows: 2, maxRows: 6}"
            type="textarea"
            clearable
          />
        </template>
        <!--规则值 - 动态值-->
        <template v-if="rulesData.source === 'dynamic'">
          <el-select v-model="rulesData.value" placeholder="请选择类型">
            <el-option
              v-for="(item,i) in selectedFilterObj.controlTypes"
              :key="i"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <!-- <el-button icon="ibps-icon-cogs"  /> -->
        </template>
      </div>
      <div class="btn-group pull-right rule-actions">
        <el-button type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Utils from '../utils'
import QueryBuilder from '../constants'
import IbpsNumberRange from '@platform/components/ibps-number-range'
import Ids from 'ids'
export default {
  name: 'QueryBuilderRule',
  components: {
    IbpsNumberRange
  },
  props: {
    rules: Object,
    index: [String, Number],
    filters: Array,
    depth: Number,
    labels: Object,
    conditions: Array,
    sort: Boolean
  },
  data() {
    return {
      rulesData: this.rules,
      selectedFilterObj: this.filters[0],
      selectedFilter: this.rules.id || this.filters[0].id,
      errors: [],
      dateTypes: ['year', 'month', 'date', 'datetime'],
      id: ''
    }
  },
  computed: {
    hasRuleValue() {
      return QueryBuilder.OPERATORS[this.rulesData.operator].nb_inputs > 0
    },
    nbInputs() {
      return QueryBuilder.OPERATORS[this.rulesData.operator].nb_inputs
    },
    iterateOptions() {
      if (typeof this.selectedFilterObj.values === 'undefined') {
        return []
      }
      const cleanValues = []
      Utils.iterateOptions(this.selectedFilterObj.values, function(value, label, optgroup) {
        cleanValues.push({
          value: value,
          label: label,
          optgroup: optgroup || null
        })
      })
      return cleanValues
    },
    hasError() {
      return this.errors.length > 0
    },
    hasSort() {
      return this.sort
    }
  },
  watch: {
    rules(val, oldVal) {
      if (val !== oldVal) {
        this.rulesData = val
        if (this.$utils.isNotEmpty(val.id)) {
          this.selectedFilter = val.id
          this.filters.forEach((rule) => {
            if (rule.id === this.selectedFilter) {
              this.selectedFilterObj = rule
              return false
            }
          })
        }
      }
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
    // Set a default value for these types if one isn't provided already
    this.initValue()
    this.validateValue(this.rulesData)
    this.initRules()
    this.id = new Ids([32, 36, 1]).next()
  },
  beforeDestroy() {
    this.rulesData = null
    this.selectedFilterObj = null
    this.errors = null
  },
  methods: {
    initRules() {
      const selectedFilterCopy = JSON.parse(JSON.stringify(this.selectedFilter))
      const splitIndex = selectedFilterCopy.indexOf('-')
      if (splitIndex > -1) {
        this.selectedFilter = selectedFilterCopy.substring(0, splitIndex)
      } else {
        this.filters.forEach((rule) => {
          if (rule.id === this.selectedFilter) {
            this.selectedFilterObj = rule
            return false
          }
        })
      }
    },
    // 删除规则
    remove() {
      this.$emit('child-deletion-requested', this.index, this.id)
    },
    // 改变过滤规则的条件
    changeFilter() {
      this.rulesData.value = null
      this.filters.forEach((filter) => {
        if (filter.id === this.selectedFilter) {
          this.selectedFilterObj = filter
          this.rulesData.id = this.selectedFilter
          // 默认值修改 TODO:
          this.rulesData.field = filter.field
          this.rulesData.label = filter.label
          this.rulesData.type = filter.type || 'string'
          this.rulesData.input = filter.input
          this.initValue()
        }
      })
      this.rulesData.operator = this.selectedFilterObj.operators[0]
    },
    changeOperator(val) {
      this.rulesData.source = 'fixed'
      this.rulesData.value = null
    },
    // 改变规则的来源
    changeSource() {
      if (this.rulesData.source === 'dynamic') {
        this.rulesData.value = this.selectedFilterObj.controlTypes[0].value
      } else {
        this.rulesData.value = null
      }
    },
    /**
     * 初始化值
     */
    initValue() {
      this.rulesData.type = this.selectedFilterObj.type
      if (this.rulesData.value === null) {
        this.rulesData.value = null
        if (this.selectedFilterObj.input === 'checkbox') {
          this.rulesData.value = []
        } else if (this.selectedFilterObj.input === 'select' || this.selectedFilterObj.input === 'radio'
        ) {
          this.rulesData.value = this.selectedFilterObj.values[0].value
        } else if (this.selectedFilterObj.input === 'time' ||
          this.selectedFilterObj.input === 'date' ||
          this.selectedFilterObj.input === 'datetime'
        ) {
          this.rulesData.value = this.nbInputs > 1 ? [] : null
        } else if (this.selectedFilterObj.input === 'number') {
          this.rulesData.value = this.nbInputs > 1 ? [] : null
        }
      }
    },
    validateValue(rule) {
      if (rule && this.$utils.isEmpty(rule.value) && this.nbInputs > 0) {
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
