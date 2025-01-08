<template>
  <div
    class="flex flex-row items-center border-solid border-1 border-gray-3 rounded px-2.5 [&:has(.is-focus)]:border-primary-6 bg-white"
  >
    <span v-if="!!label" class="whitespace-nowrap text-sm text-gray-6"
      >{{ label }}：</span
    >
    <ElDatePicker
      :value="value"
      @input="$emit('input', $event)"
      class="border-none"
      :type="type"
      :placeholder="placeholder"
      :format="format"
      :value-format="valueFormat"
      :picker-options="pickerOptions"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :size="size"
      :clearable="clearable"
      :disabled="disabled"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { DatePicker } from 'element-ui'

export default {
  name: 'CpisSearchDate',
  components: {
    ElDatePicker: DatePicker
  },
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'date',
      validator: function (value) {
        return [
          'year',
          'month',
          'date',
          'dates',
          'week',
          'datetime',
          'datetimerange',
          'daterange',
          'monthrange'
        ].includes(value)
      }
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    rangeSeparator: {
      type: String,
      default: '至'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    },
    size: {
      type: String,
      default: 'small',
      validator: function (value) {
        return ['large', 'small', 'mini'].includes(value)
      }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pickerOptions: {
      type: Object,
      default: () => ({
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__inner {
  border: none;
  height: 30px !important;
}
::v-deep .el-range-separator {
  line-height: 24px;
}
::v-deep .el-icon-date {
  order: 1;
}
::v-deep .el-range-editor.el-input__inner {
  padding: 4px 4px;
}
</style>
