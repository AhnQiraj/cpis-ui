<template>
  <div class="form-inline form-rule-setting" style="padding: 0 10px">
    <setting-builder-group
      :index="0"
      :rules.sync="rules"
      :fields="fields"
      :max-depth="maxDepth"
      :depth="depth"
      :labels="labels"
      :conditions="mergedConditions"
      :children-key="childrenKey"
      :condition-key="conditionKey"
      :sort="sort"
      type="setting-builder-group"
      @errors="handleErrors"
      @child-deletion-requested="remove"
    />
  </div>
</template>
<script>
import I18n from '@platform/utils/i18n'
import Utils from './utils'
import SettingBuilderGroup from './components/setting-builder-group.vue'
export default {
  name: 'IbpsRuleSetting',
  components: {
    SettingBuilderGroup
  },
  props: {
    fields: {
      type: Array
    },
    value: Object,
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
          value: 'and',
          label: '且'
        }, {
          value: 'or',
          label: '或'
        }]
      }
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
      default: 'type'
    }
  },
  data() {
    return {
      depth: 1, // 深度
      rules: {
        type: 'group', // 类型：组合规则group
        rules: []
      },
      errors: {}
    }
  },
  computed: {
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
// pixel
$pixel: 5px, 10px, 20px, 40px, 80px, 120px, 720px !default;
$placeholder-border-color: #BBB;
$placeholder-border: 1px dashed $placeholder-border-color;
// ABSTRACTS
%base-container {
  position: relative;
  margin: $item-vertical-spacing 0;
  border-radius: $item-border-radius;
  padding: $rule-padding;
  border: $rule-border;
  margin-bottom: #{nth($pixel, 3)};
  min-width: #{nth($pixel, 7)};
  // background: $rule-background-color;
}
%rule-component {
  display: inline-block;
  margin: 0 5px 0 0;
  vertical-align: middle;
}
.form-rule-setting {
  & > .rules-group-container{
    border: 0!important;
    padding: 0!important;
  }
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
    padding: 0 #{nth($pixel, 6)} 0 0 ;
    margin: 0;
    .right_condition{
      position: absolute;
      width: #{nth($pixel, 6)};
      // height: 64px;
      right: #{'-'+nth($pixel, 6)};
      top: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      .operator_border{
        position: absolute;
        width: 50%;
        height: 100%;
        left: 0px;
        top: 0px;
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: $rule-border-color;
        border-left: 0px;
        border-radius: 5px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        box-shadow: none;
      }
    }
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
    min-width: 200px;
    max-width: 540px;
    .rule-value-container_group {
      max-height: 160px;
      overflow-y: auto;
    }
    label {
      margin-bottom: 0;
      font-weight: normal;
      &.block {
        display: block;
      }
    }
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
.form-rule-setting{
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
