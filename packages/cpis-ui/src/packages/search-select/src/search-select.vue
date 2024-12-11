<template>
  <div
    class="flex flex-row items-center border-solid border-1 border-gray-3 rounded px-2.5 [&:has(.is-focus)]:border-primary-6"
  >
    <span class="whitespace-nowrap text-sm text-gray-6">{{ label }}：</span>
    <ELSelect
      :value="value"
      @input="$emit('input', $event)"
      class="border-none"
      :placeholder="placeholder"
    >
      <ELOption
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </ELOption>
    </ELSelect>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui'
export default {
  name: 'CpisSearchSelect',
  components: {
    ELSelect: Select,
    ELOption: Option
  },
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    label: {
      type: String,
      default: ''
    },
    valueEnum: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    options() {
      return Object.entries(this.valueEnum).map(([value, label]) => ({
        value,
        label
      }))
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__inner {
  border: none;
  height: 30px !important;
}
::v-deep .el-input__icon {
  line-height: 30px !important;
}
</style>
