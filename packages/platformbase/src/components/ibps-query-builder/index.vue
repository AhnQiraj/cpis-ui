<template>
  <div class="query-builder form-inline" style="padding: 0 10px">
    <query-builder-group
      :index="0"
      :rules.sync="rules"
      :filters="mergedFilters"
      :display="display"
      :max-depth="maxDepth"
      :depth="depth"
      :labels="labels"
      :conditions="mergedConditions"
      :children-key="childrenKey"
      :condition-key="conditionKey"
      :control-types="buildControlTypes({})"
      :sort="sort"
      type="query-builder-group"
      @errors="handleErrors"
      @child-deletion-requested="remove"
    />
  </div>
</template>
<script>
// refer to:  https://github.com/kongwang/vue-query-builder-plus 的v1.0.2版本[2019-01-16]
// Function refer to:  https://querybuilder.js.org 和 https://dabernathy89.github.io/vue-query-builder/
/**
 *  支持功能
 * ①、变量可配置 如操作符，and or等【完成】
 * ②、支持自定义组件【完成】
 * ③、整理下代码，参数格式类似 querybuilder的代码【部分完成】
 * ④、国际化【完成】
 * 还需要开发功能
 *  ①、可排序 【下一版本支持】
 *
 * */
import I18n from '@platform/utils/i18n'
import Utils from './utils'
import QueryBuilder from './constants'
// import vuedraggable from 'vuedraggable'
import QueryBuilderGroup from './components/query-builder-group.vue'
export default {
  name: 'IbpsQueryBuilder',
  components: {
    // vuedraggable,
    QueryBuilderGroup
  },
  props: {
    display: { // 当filters为空时，可通过该属性判断是否还进行配置
      type: Boolean,
      default: false
    },
    value: Object,
    filters: Array, // 过滤条件
    maxDepth: {
      type: Number
    },
    labels: {
      type: Object,
      default: () => {
        return {
          'addRulue': I18n.t('components.query-builder.buttons.addRule'),
          'addGroup': I18n.t('components.query-builder.buttons.addGroup'),
          'removeRule': I18n.t('components.query-builder.buttons.removeRule'),
          'removeGroup': I18n.t('components.query-builder.buttons.removeGroup')
        }
      }
    },
    conditions: { // 条件类型
      type: [Object, Array],
      default: () => {
        return [{
          value: 'AND',
          label: I18n.t('components.query-builder.conditions.and')
        }, {
          value: 'OR',
          label: I18n.t('components.query-builder.conditions.or')
        }]
      }
    },
    controlTypes: { // 控件类型
      type: [Object, Array]
    },
    sort: { // 排序
      type: Boolean,
      default: false
    },
    childrenKey: { // 儿子key
      type: String,
      default: 'rules'
    },
    conditionKey: {
      type: String,
      default: 'condition'
    }
  },
  data() {
    return {
      depth: 1, // 深度
      rules: {
        condition: 'AND', // 操作符
        rules: []
      },
      errors: {}
    }
  },
  computed: {
    mergedFilters() {
      return this.handleMergedFilters(this.filters)
    },
    mergedConditions() {
      const conditions = []
      Utils.iterateOptions(this.conditions, function(value, label) {
        conditions.push({
          value: value,
          label: label
        })
      })
      return conditions
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.rules = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (typeof this.value !== 'undefined') {
      this.rules = Object.assign(this.rules, this.value)
    }
  },
  beforeDestroy() {
    this.rules = null
    this.errors = null
  },
  methods: {
    handleMergedFilters(filters) {
      if (!filters || filters.length === 0) {
        if (this.display) {return []}
        Utils.error('Config', 'Missing filters list')
      }
      const mergedFilters = []
      filters.forEach((filter) => {
        if (!filter.type) {
          filter.type = 'string'
        } else if (!QueryBuilder.TYPES[filter.type]) {
          Utils.error('Config', 'Invalid type "{0}"', filter.type)
        }
        if (!filter.input) {
          filter.input = QueryBuilder.TYPES[filter.type] === 'number' ? 'number' : 'text'
        } else if (typeof filter.input !== 'function' && QueryBuilder.INPUTS.indexOf(filter.input) === -1) {
          Utils.error('Config', 'Invalid input "{0}"', filter.input)
        }
        if (filter.operators) {
          filter.operators.forEach(function(operator) {
            if (typeof operator !== 'string') {
              Utils.error('Config', 'Filter operators must be global operators types (string)')
            }
          })
        }
        filter.operators = this.buildOperators(filter)
        filter.sources = this.buildSources(filter)
        filter.controlTypes = this.buildControlTypes(filter)
        if (!filter.field) {
          filter.field = filter.id
        }
        if (!filter.label) {
          filter.label = filter.field
        }
        mergedFilters.push(filter)
      })
      return mergedFilters
    },
    /**
     * 构建条件类型
     */
    buildOperators(filter) {
      const result = []
      Object.keys(QueryBuilder.OPERATORS).forEach((item) => {
        const operator = QueryBuilder.OPERATORS[item]
        // filter operators check
        if (filter.operators) {
          if (filter.operators.indexOf(operator.type) === -1) {
            return true
          }
        // type check
        } else if (operator.apply_to.indexOf(QueryBuilder.TYPES[filter.type]) === -1) {
          return true
        }
        result.push(operator)
      })
      // keep sort order defined for the filter
      if (filter.operators) {
        result.sort(function(a, b) {
          return filter.operators.indexOf(a.type) - filter.operators.indexOf(b.type)
        })
      }
      return result.map((res) => {return res.type})
    },
    /**
     * 构建值来源
     */
    buildSources(filter) {
      const result = []
      Object.keys(QueryBuilder.SOURCES).forEach((item) => {
        const source = QueryBuilder.SOURCES[item]
        // filter sources check
        if (filter.sources) {
          if (filter.sources.indexOf(source) === -1) {
            return true
          }
        // type check
        }
        result.push(source)
      })
      // keep sort order defined for the filter
      if (filter.sources) {
        result.sort(function(a, b) {
          return filter.sources.indexOf(a) - filter.sources.indexOf(b)
        })
      }
      return result.map((res) => {return res})
    },
    buildControlTypes(filter) {
      const result = []
      Utils.iterateOptions(filter.controlTypes || this.controlTypes, function(value, label) {
        result.push({
          value: value,
          label: label
        })
      })
      return result
    },
    // 删除规则
    remove() {
      this.rules[this.childrenKey].splice(0, 1)
    },
    // 获取数据
    getData() {
      return this.rules
    },
    handleErrors(errors) {
      this.errors = errors
    },
    hasErrors(error) {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          const err = error[key]
          if (Array.isArray(err)) {
            if (err && err.length > 0) {return true}
          } else {
            return this.hasErrors(err)
          }
        }
      }
      return false
    },
    getErrors() {
      return this.hasErrors(this.errors)
    }
  }
}
</script>
<style lang="scss" >
/*!
 * jQuery QueryBuilder 2.5.2
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */
$theme-name: default !default;
// common
$item-vertical-spacing: 4px !default;
$item-border-radius: 5px !default;
// groups
$group-background-color: rgba(250, 240, 210, .5) !default;
$group-border-color: #DCC896 !default;
$group-border: 1px solid $group-border-color !default;
$group-padding: 10px !default;
// rules
$rule-background-color: rgba(255, 255, 255, .9) !default;
$rule-border-color: #EEE !default;
$rule-border: 1px solid $rule-border-color !default;
$rule-padding: 5px !default;
// scss-lint:disable ColorVariable
$rule-value-separator: 1px solid #DDD !default;
// errors
$error-icon-color: #F00 !default;
$error-border-color: #F99 !default;
$error-background-color: #FDD !default;
// ticks
$ticks-width: 2px !default;
$ticks-color: #CCC !default;
$ticks-position: 5px, 10px !default;
$placeholder-border-color: #BBB;
$placeholder-border: 1px dashed $placeholder-border-color;
// ABSTRACTS
%base-container {
  position: relative;
  margin: $item-vertical-spacing 0;
  border-radius: $item-border-radius;
  padding: $rule-padding;
  border: $rule-border;
  // background: $rule-background-color;
}
%rule-component {
  display: inline-block;
  margin: 0 5px 0 0;
  vertical-align: middle;
}
.query-builder {
  // GROUPS
  .rules-group-container {
    @extend %base-container;
    padding: $group-padding;
    padding-bottom: #{$group-padding - $item-vertical-spacing};
    border: $group-border;
    // background: $group-background-color;
  }
  .rules-group-header {
    margin-bottom: $group-padding;
    .group-conditions {
      .btn.readonly:not(.active),
      input[name$='_cond'] {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        white-space: nowrap;
      }
      .btn.readonly {
        border-radius: 3px;
      }
    }
  }
  .rules-list {
    list-style: none;
    padding: 0 0 0 #{nth($ticks-position, 1) + nth($ticks-position, 2)};
    margin: 0;
  }
  // RULES
  .rule-container {
    @extend %base-container;
    .rule-filter-container,
    .rule-operator-container,
    .rule-source-container,
    .rule-value-container {
      @extend %rule-component;
    }
    .rule-operator-container,
    .rule-source-container{
      width: 150px;
    }
  }
  .rule-value-container {
    border-left: $rule-value-separator;
    padding-left: 5px;
    label {
      margin-bottom: 0;
      font-weight: normal;
      &.block {
        display: block;
      }
    }
    // select,
    // input[type='text'],
    // input[type='number'] {
    //   padding: 1px;
    // }
  }
  // ERRORS
  .error-container {
    @extend %rule-component;
    display: none;
    cursor: help;
    color: $error-icon-color;
  }
  .has-error {
    background-color: $error-background-color;
    border-color: $error-border-color;
    .error-container {
      display: inline-block !important;
    }
  }
  // TICKS
  .rules-list>* {
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: #{-1 * nth($ticks-position, 2)};
      width: nth($ticks-position, 2);
      height: calc(50% + #{$item-vertical-spacing});
      border-color: $ticks-color;
      border-style: solid;
    }
    &::before {
      top: #{-2 * $ticks-width};
      border-width: 0 0 $ticks-width $ticks-width;
    }
    &::after {
      top: 50%;
      border-width: 0 0 0 $ticks-width;
    }
    &:first-child::before {
      top: #{-$group-padding - $ticks-width};
      height: calc(50% + #{$group-padding + $item-vertical-spacing});
    }
    &:last-child::before {
      border-radius: 0 0 0 #{2 * $ticks-width};
    }
    &:last-child::after {
      display: none;
    }
  }
  .pull-right {
    float: right!important;
  }
  .btn-group, .btn-group-vertical {
      position: relative;
      display: inline-block;
      vertical-align: middle;
  }
}
 // sortable
.query-builder {
  .drag-handle {
    @extend %rule-component;
    cursor: move;
    vertical-align: middle;
    margin-left: 5px;
  }
  .dragging-rule {
    position: fixed;
    opacity: .5;
    z-index: 100;
    &::before,
    &::after {
      display: none;
    }
  }
  .rule-placeholder {
    @extend %base-container;
    border: $placeholder-border;
    opacity: .7;
  }
}
</style>
