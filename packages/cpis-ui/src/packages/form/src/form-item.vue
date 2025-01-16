<template>
  <el-form-item
    class="cpis-form-item"
    v-bind="$attrs"
    :style="itemStyle"
    v-on="$listeners"
  >
    <template #label>
      <div
        class="cpis-form-item__label h-full"
        :style="{ width: labelWidth + 'px', height: '100%' }"
      >
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
      type: Number,
      default: 1,
      validator: value => value > 0
    },
    labelWidth: {
      type: Number,
      default: 220
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

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  flex: 1;
  padding-left: 10px;
}
::v-deep .el-form-item__label:before {
  content: unset !important;
}
::v-deep .el-form-item__label {
  height: 100%;
  padding-right: 0px;
}
::v-deep .el-form-item__error {
  position: absolute;
  top: unset;
  bottom: 0;
  left: 0;
}
// 禁用时，输入框背景颜色为透明
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: transparent !important;
}
.cpis-form-item {
  display: flex;
  align-items: center;
  border: 1px solid #ebeef5;
  margin: -1px 0 0 -1px !important;
  background-color: #fff;
  min-height: 32px;
  box-sizing: border-box;

  &__label {
    @apply bg-gray-2 flex items-center justify-end;

    color: var(--el-text-color-regular);
    font-size: 14px;
    padding-right: 12px;
    white-space: nowrap;
    .required-star {
      @apply text-error mr-2;
    }
  }
  &__content {
    position: relative;
    flex: 1;
    min-width: 0;

    ::v-deep {
      .el-input__inner {
        width: 100%;
        border: none;
        padding: 0;
        height: 32px;
        line-height: 32px;
      }

      .el-textarea__inner {
        // scrollbar-width: none;
        // &::-webkit-scrollbar {
        //   display: none;
        // }
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
}
</style>
