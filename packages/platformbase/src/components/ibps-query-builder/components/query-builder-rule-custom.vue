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
        <el-input v-model="rulesData.id" type="text" clearable @change="changeId" />
      </div>
      <!--规则类型-->
      <div class="rule-operator-container">
        <el-select v-model="rulesData.type" @change="changeTypes">
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :value="item.key"
            :label="item.label"
          />
        </el-select>
      </div>
      <!--规则操作符-->
      <div class="rule-operator-container">
        <el-select v-model="rulesData.operator" @change="changeOperator">
          <el-option
            v-for="operator in operators"
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
            v-for="item in sources"
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
            <el-input v-if="rulesData.type === 'string'" v-model="rulesData.value" type="text" v-bind="selectedFilterObj.attrs" clearable />
            <el-input-number v-else-if="rulesData.type === 'number'" v-model="rulesData.value" v-bind="selectedFilterObj.attrs" />
            <el-date-picker
              v-else-if="dateTypes.includes(rulesData.type)"
              v-model="rulesData.value"
              :editable="false"
              v-bind="selectedFilterObj.attrs"
              :type="rulesData.type"
              :format="rulesData.type === 'date' ?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
              value-format="timestamp"
            />
            <el-time-picker
              v-else-if="rulesData.type === 'time'"
              v-model="rulesData.value"
              :editable="false"
              v-bind="selectedFilterObj.attrs"
              value-format="HH:mm:ss"
            />
            <el-switch
              v-else-if="rulesData.type === 'boolean'"
              v-model="rulesData.value"
            />
            <template v-else>
              <component :is="selectedFilterObj.component" v-bind="selectedFilterObj.attrs" v-model="rulesData.value" />
            </template>
          </template>
          <!--多个规则值-->
          <template v-else-if="nbInputs > 1 ">
            <template v-if="rulesData.type === 'number' ">
              <ibps-number-range v-model="rulesData.value" style="width:200px;" />
            </template>
            <template v-else-if="rulesData.type === 'date' || rulesData.type === 'datetime'">
              <el-date-picker v-model="rulesData.value" :editable="false" :type="rulesData.type+'range'" v-bind="selectedFilterObj.attrs" value-format="timestamp" style="width:200px;" />
            </template>
            <template v-else-if="rulesData.type === 'time'">
              <el-time-picker
                v-model="rulesData.value"
                is-range
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
                style="width:200px;"
                v-bind="selectedFilterObj.attrs"
              />
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
              v-for="(item,i) in controlTypes"
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
import QueryBuilder from '../constants'
import IbpsNumberRange from '@platform/components/ibps-number-range'
import Ids from 'ids'
export default {
  name: 'QueryBuilderRuleCustom',
  components: {
    IbpsNumberRange
  },
  props: {
    controlTypes: { // 控件类型
      type: Array,
      default: () => []
    },
    display: { // 当filters为空时，可通过该属性判断是否还进行配置
      type: Boolean,
      default: false
    },
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
      selectedFilterObj: {},
      selectedFilter: this.rules.id || '',
      errors: [],
      dateTypes: ['year', 'month', 'date', 'datetime'],
      id: '',
      typeOptions: [{
        key: 'string',
        label: '字符串'
      }, {
        key: 'number',
        label: '数字'
      }, {
        key: 'date',
        label: '日期'
      }, {
        key: 'datetime',
        label: '日期时间'
      }, {
        key: 'time',
        label: '时间'
      }, {
        key: 'boolean',
        label: '布尔值'
      }],
      sources: {},
      operators: []
    }
  },
  computed: {
    hasRuleValue() {
      return QueryBuilder.OPERATORS[this.rulesData.operator].nb_inputs > 0
    },
    nbInputs() {
      return QueryBuilder.OPERATORS[this.rulesData.operator].nb_inputs
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
    this.buildSources()
    if (this.$utils.isNotEmpty(this.rules)) {
      this.init()
    }
    this.validateValue(this.rulesData)
    this.id = new Ids([32, 36, 1]).next()
  },
  beforeDestroy() {
    this.rulesData = null
    this.selectedFilterObj = null
    this.errors = null
  },
  methods: {
    // 删除规则
    remove() {
      this.$emit('child-deletion-requested', this.index, this.id)
    },
    /**
     * 构建值来源
     */
    buildSources() {
      const result = []
      Object.keys(QueryBuilder.SOURCES).forEach((item) => {
        const source = QueryBuilder.SOURCES[item]
        result.push(source)
      })
      this.sources = result.map((res) => {return res})
    },
    /**
     * 构建条件类型
     */
    buildOperators(val) {
      const result = []
      Object.keys(QueryBuilder.OPERATORS).forEach((item) => {
        const operator = QueryBuilder.OPERATORS[item]
        if (operator.apply_to.indexOf(QueryBuilder.TYPES[val]) === -1) {
          return true
        }
        result.push(operator)
      })
      return result.map((res) => {return res.type})
    },
    init() {
      if (this.$utils.isEmpty(this.rules)) {return}
      if (this.rulesData !== this.rules) {
        this.rulesData = this.rules
      }
      const _data = this.buildOperators(this.rulesData.type)
      this.operators = _data
      if (this.$utils.isEmpty(this.rulesData.operator)) {
        this.$set(this.rulesData, 'operator', _data[0])
      }
      if (this.$utils.isEmpty(this.rulesData.source)) {
        this.$set(this.rulesData, 'source', this.sources[0])
      }
      this.initValue()
    },
    changeId(val) {
      this.$set(this.rulesData, 'field', val)
      this.$set(this.rulesData, 'label', val)
    },
    // 选择不同类型后
    changeTypes(val) {
      const _data = this.buildOperators(val)
      this.operators = _data
      this.$set(this.rulesData, 'operator', _data[0])
      this.changeOperator(_data[0])
    },
    changeOperator(val) {
      this.$set(this.rulesData, 'source', this.sources[0])
      this.$set(this.rulesData, 'value', null)
      this.initValue()
    },
    // 改变规则的来源
    changeSource() {
      if (this.rulesData.source === 'dynamic') {
        // this.rulesData.value = this.controlTypes[0].value
        this.$set(this.rulesData, 'value', this.controlTypes[0].value)
      } else {
        this.rulesData.value = null
      }
    },
    /**
     * 初始化值
     */
    initValue() {
      if (this.$utils.isNotEmpty(this.rulesData) && this.$utils.isNull(this.rulesData.value)) {
        let _val = null
        if (this.rulesData.type === 'date' || this.rulesData.type === 'datetime') {
          _val = this.nbInputs > 1 ? [] : null
        } else if (this.rulesData.type === 'number') {
          _val = this.nbInputs > 1 ? [] : null
        }
        this.$set(this.rulesData, 'value', _val)
      }
      if (this.$utils.isNotEmpty(this.rulesData) && this.rulesData.value !== this.rulesData.id) {
        this.$set(this.rulesData, 'label', this.rulesData.id)
      }
    },
    validateValue(rule) {
      if (rule && (this.$utils.isEmpty(rule.value) || this.$utils.isEmpty(rule.id)) && this.nbInputs > 0) {
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
