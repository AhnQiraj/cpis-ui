<template>
  <div
    class="flex flex-row items-center border-solid border-1 border-gray-3 rounded px-2.5 [&:has(.is-focus)]:border-primary-6"
  >
    <span v-if="!!label" class="whitespace-nowrap text-sm text-gray-6"
      >{{ label }}：</span
    >
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
    enum: {
      type: [Array, Function],
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'key'
    },
    labelKey: {
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      options: []
    }
  },
  async mounted() {
    if (typeof this.enum === 'function') {
      const enumData = await this.enum()
      this.options = enumData.map(item => ({
        value: item[this.valueKey],
        label: item[this.labelKey]
      }))
    } else if (Array.isArray(this.enum)) {
      this.options = this.enum.map(item => ({
        value: item[this.valueKey],
        label: item[this.labelKey]
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
