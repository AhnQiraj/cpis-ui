<template>
  <el-form-item class="cpis-form-item" v-bind="$attrs" :style="itemStyle" v-on="$listeners">
    <template #label v-if="label">
      <div class="cpis-form-item__label h-full" :style="{ width: labelWidth + 'px', height: '100%' }">
        <span v-if="isRequired" class="required-star">*</span>
        {{ label }}
      </div>
    </template>

    <div class="cpis-form-item__content flex-1">
      <slot></slot>
    </div>
  </el-form-item>
</template>

<script>
import { FormItem } from 'element-ui'

export default {
  name: 'CpisFormItem',
  componentName: 'ElFormItem',
  components: {
    ElFormItem: FormItem
  },
  inject: {
    formSection: {
      default: () => ({})
    },
    form: {
      default: () => ({})
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    span: {
      type: [Number, String],
      default: 1
    },
    labelWidth: {
      type: Number,
      default: 150
    }
  },
  computed: {
    prop() {
      return this.$attrs.prop
    },
    fieldRules() {
      const selfRules = this.$attrs.rules
      if (selfRules) return Array.isArray(selfRules) ? selfRules : [selfRules]

      const formRules = this.form.rules
      if (!formRules || !this.prop) return []

      const propRules = formRules[this.prop]
      return Array.isArray(propRules) ? propRules : [propRules]
    },
    isRequired() {
      if (!this.fieldRules || !this.fieldRules.length) return false

      return this.fieldRules.some(rule => {
        if (typeof rule === 'object') {
          return rule.required === true
        }
        return false
      })
    },
    itemStyle() {
      const totalColumns = this.formSection.columns || 3
      const span = Math.min(this.span, totalColumns)
      return {
        gridColumn: `span ${span}`
      }
    }
  }
}
</script>
<style lang="scss">
.cpis-form-item {
  @apply flex items-center border border-gray-3 border-solid;
  margin: -1px 0 0 -1px !important;
  background-color: #fff;
  min-height: 42px;
  box-sizing: border-box;
  & .el-form-item__label {
    height: 100%;
    padding-right: 0px;
  }
  & .el-form-item__error {
    position: absolute;
    top: unset;
    bottom: 0;
    left: 0;
  }
  // 处理disabled的颜色
  & .el-input.is-disabled .el-input__inner,
  & .el-textarea.is-disabled .el-textarea__inner,
  & .el-radio__input.is-disabled + span.el-radio__label {
    background-color: transparent;
    @apply text-gray-5;
  }
  & .el-form-item__content {
    flex: 1;
    padding-left: 10px;
  }
  .el-form-item__label:before {
    content: unset !important;
  }
  &__label {
    @apply bg-gray-2 flex items-center justify-end border-r border-r-gray-3 border-r-solid text-sm pr-3 whitespace-nowrap;

    .required-star {
      @apply text-error mr-2;
    }
  }
  &__content {
    position: relative;
    flex: 1;
    min-width: 0;

    .el-input .el-input__inner {
      width: 100%;
      border: none;
      padding: 0;
    }

    .el-range-editor.el-input__inner {
      width: 100%;
      border: none;
      padding: 0;
    }

    .el-textarea__inner {
      border: none;
      padding: 0;
    }

    .el-select {
      width: 100%;
    }

    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
