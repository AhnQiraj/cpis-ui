<template>
  <div
    :class="{
      'has-error':hasError
    }"
    class="rule-container"
  >
    <div v-if="rulesData.ruleType === '1'" class="rule-header">
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
            :label="operatorLabel(operator)"
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
            :label="item ==='user'?'用户':item === 'org'?'组织':$t('components.query-builder.sources.'+item)"
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
              :value-format="$utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'timestamp'"
            />
            <el-time-picker
              v-else-if="selectedFilterObj.input === 'time'"
              v-model="rulesData.value"
              :editable="false"
              v-bind="selectedFilterObj.attrs"
              :picker-options="{
                format: $utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'HH:mm:ss'
              }"
              :value-format="$utils.isNotEmpty(selectedFilterObj.format)?selectedFilterObj.format:'timestamp'"
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
        <!--规则值 - 用户-->
        <template v-if="rulesData.source === 'user'">
          <el-select v-model="rulesData.valType" placeholder="请选择" @change="initSelectorValue">
            <el-option
              v-for="(item,i) in selectedFilterObj.userTypes"
              :key="i"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </template>
        <!--规则值 - 组织-->
        <template v-if="rulesData.source === 'org'">
          <el-select v-model="rulesData.valType" placeholder="请选择" @change="initSelectorValue">
            <el-option
              v-for="(item,i) in selectedFilterObj.orgTypes"
              :key="i"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </template>
      </div>
      <!--规则值 - 组织/用户-输入框+选择按钮-->
      <template v-if="rulesData.source === 'org' || rulesData.source === 'user' && $utils.isNotEmpty(rulesData.valType)">
        <div class="rule-value-container">
          <ibps-user-selector
            v-model="selectorName"
            :type="rulesData.source"
            :multiple="true"
            :store="store||'id'"
            value-key="name"
            label-key="name"
            :is-value-come-init="selectorAction==='confirm'"
            @action="buttonKey => selectorAction = buttonKey"
            @change-link-data="handleSeletorLinkageData"
            v-on="$listeners"
          />
        </div>
      </template>
      <el-tooltip effect="light" placement="bottom" popper-class="rule-tootip-popper">
        <div slot="content" class="rule-tootip-content" v-html="content" />
        <i class="el-icon-warning rule-tooltip-icon" />
      </el-tooltip>
      <div class="btn-group pull-right rule-actions">
        <el-button type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
    </div>
    <div v-else class="rule-header">
      <div class="rule-value-container">
        <el-input readonly :value="rulesData.conDesc" type="text" />
      </div>
      <div class="btn-group pull-right rule-actions">
        <el-button type="primary" icon="el-icon-edit" @click="editScript">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
      <script-dialog
        :visible="scriptDialogVisible"
        :user-type="scriptType"
        :data="scriptData"
        :title="scriptTypeTitle"
        @close="() => scriptDialogVisible = false"
        @callback="handleData"
      />
    </div>
  </div>
</template>
<script>
import Utils from '../utils'
import QueryBuilder from '../constants'
import IbpsNumberRange from '@platform/components/ibps-number-range'
import IbpsUserSelector from '@platform/business/platform/org/selector'
import ScriptDialog from '@platform/business/platform/bpmn/setting/bpmn-setting/components/user-setting/user-dialog'
import Ids from 'ids'
export default {
  name: 'SettingBuilderRule',
  components: {
    IbpsNumberRange,
    IbpsUserSelector,
    ScriptDialog
  },
  filters: {
    filterKey(val) {
      if (!val) {
        return 'id'
      }
      if (val === 'orgKey') {
        return 'alias'
      } else if (val === 'account') {
        return 'account'
      } else {
        return 'id'
      }
    }
  },
  props: {
    rules: Object,
    index: [String, Number],
    filters: Array,
    depth: Number,
    labels: Object,
    conditions: Array,
    sort: Boolean,
    formData: Object,
    scriptType: {
      type: String,
      default: 'hrScript'
    },
    scriptTypeTitle: {
      type: String,
      default: '脚本'
    }
  },
  data() {
    return {
      rulesData: this.rules,
      selectedFilterObj: this.filters[0],
      selectedFilter: this.rules.id || this.filters[0].id,
      errors: [],
      isScript: false,
      showTooltip: false,
      content: `如果选择人员变量，则为人员变量所在的组，如果选择组变量，则为该组。<br/>
                规则值：<br/>
                1)固定值：对应表单存储的数据。<br/>
                2)用户：用户选择account时，表单管理字段存储格式显示为“绑定标识”，绑定值为帐号(account)。用户选择userId时，表单管理字段存储格式为仅存ID。<br/>
                3)组织：组织选择orgKey时，表单管理字段存储格式显示为“绑定标识”，绑定值为别名(alias)。组织选择orgId时，表单管理字段存储格式为仅存ID。`,
      scriptDialogVisible: false,
      scriptData: {},
      // valueKey: 'id',
      dateTypes: ['year', 'month', 'date', 'datetime'],
      store: 'bind',
      selectorAction: '',
      selectorName: this.rules.valueText,
      separator: ',',
      id: ''
    }
  },
  computed: {
    hasRuleValue() {
      return this.nbInputs > 0
    },
    nbInputs() {
      if (this.$utils.isEmpty(QueryBuilder.OPERATORS[this.rulesData.operator])) {return 1}
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
    rules(val) {
      this.rulesData = val
      if (this.$utils.isEmpty(val)) {
        this.selectorName = ''
        return
      }
      if (this.$utils.isNotEmpty(val.id)) {
        this.selectedFilter = val.id
        this.filters.forEach((rule) => {
          if (rule.id === this.selectedFilter) {
            this.selectedFilterObj = rule
            return false
          }
        })
      }
      this.selectorName = val.valueText
    },
    'rulesData.value': {
      handler(val) {
        if (this.rulesData.source === 'fixed') {
          this.rulesData.valueText = val
        }
      },
      deep: true
    },
    rulesData: {
      handler(val) {
        if (val.ruleType === '1') {
          this.validateValue(val)
        }
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
    this.id = new Ids([32, 36, 1]).next()
    if (this.rules.ruleType === '2') {return}
    // Set a default value for these types if one isn't provided already
    if (this.$utils.isEmpty(this.rulesData)) {
      this.initValue()
    }
    this.validateValue(this.rulesData)
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
  beforeDestroy() {
    this.rulesData = null
    this.selectedFilterObj = null
    this.errors = null
    this.scriptData = null
  },
  methods: {
    // 规则操作符显示
    operatorLabel(operator) {
      return QueryBuilder.operatorLabel(operator)
    },
    // 修改脚本
    editScript() {
      const _data = JSON.parse(JSON.stringify(this.rulesData))
      this.scriptData = {
        description: _data.conDesc,
        script: _data.script
      }
      this.scriptDialogVisible = true
    },
    handleData(data) {
      const _data = JSON.parse(JSON.stringify(data))
      this.rulesData.conDesc = _data.description
      this.rulesData.script = _data.script
    },
    // 格式化保存数据
    setDataTemplate(data, name, itemName, splicing) {
      const temp = data.map(item => {
        if (this.$utils.isNotEmpty(item[itemName])) {
          return item[itemName]
        } else {
          return this.getValByName(item.name)
        }
      }).join(splicing)
      this.rulesData[name] = temp
    },
    getValByName(val) {
      if (this.$utils.isEmpty(this.rulesData.valueText) || this.$utils.isEmpty(this.rulesData.value) || this.$utils.isEmpty(val)) {return null}
      const arr = this.rulesData.valueText.split(this.separator)
      const index = arr.indexOf(val)
      if (index === -1) {return null}
      const vals = this.rulesData.value.split(this.separator)
      if (vals.length <= index) {return null}
      return vals[index]
    },
    // 选择器存储格式-绑定标识
    handleSeletorLinkageData(value, data, type) {
      const _data = JSON.parse(JSON.stringify(data))
      if (this.rulesData.valType === 'orgKey') {
        this.setDataTemplate(_data, 'value', 'alias', this.separator)
      } else if (this.rulesData.valType === 'orgId') {
        this.setDataTemplate(_data, 'value', 'id', this.separator)
      } else {
        this.setDataTemplate(_data, 'value', this.rulesData.valType, this.separator)
      }
      this.setDataTemplate(_data, 'valueText', 'name', this.separator)
    },
    // 选项改变初始化值
    initSelectorValue() {
      this.$forceUpdate()
      this.rulesData.value = null
      this.rulesData.valueText = null
      this.selectorName = null
    },
    // 删除规则
    remove: function() {
      this.$emit('child-deletion-requested', this.index, this.id)
    },
    // 改变过滤规则的条件
    changeFilter: function() {
      this.rulesData.value = null
      this.filters.forEach((filter) => {
        if (filter.id === this.selectedFilter) {
          this.selectedFilterObj = filter
          this.rulesData.id = this.selectedFilter
          // this.rulesData.field = filter.field
          this.rulesData.label = filter.label
          this.rulesData.type = filter.type || 'varchar'
          this.rulesData.input = filter.input
          this.rulesData.key = filter.key
          this.rulesData.name = filter.name
          this.rulesData.tableName = filter.tableName
          this.rulesData.attrType = filter.attrType
          this.initSelectorValue()
          this.initValue()
          this.initValType()
        }
      })
      this.rulesData.operator = this.selectedFilterObj.operators[0]
    },
    changeOperator(val) {
      if (QueryBuilder.OPERATORS[val].nb_inputs === 0) {
        this.rulesData.source = 'fixed'
        this.rulesData.value = null
      }
    },
    // 改变规则的来源
    changeSource: function() {
      if (this.rulesData.source === 'dynamic') {
        this.rulesData.value = this.selectedFilterObj.controlTypes[0].value
      } else {
        this.rulesData.value = null
        this.initSelectorValue()
        this.initValType()
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
    initValType() {
      if (this.rulesData.source === 'user') {
        if (this.$utils.isNotEmpty(this.selectedFilterObj.userTypes) && this.selectedFilterObj.userTypes.length > 0) {
          this.rulesData.valType = this.selectedFilterObj.userTypes[0].value
        } else {
          this.rulesData.valType = ''
        }
      } else if (this.rulesData.source === 'org') {
        if (this.$utils.isNotEmpty(this.selectedFilterObj.orgTypes) && this.selectedFilterObj.orgTypes.length > 0) {
          this.rulesData.valType = this.selectedFilterObj.orgTypes[0].value
        } else {
          this.rulesData.valType = ''
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
