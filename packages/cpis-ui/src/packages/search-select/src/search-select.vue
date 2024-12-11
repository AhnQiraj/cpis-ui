<template>
  <div
    class="flex flex-row items-center border-solid border-1 border-gray-3 rounded px-2.5 [&:has(.is-focus)]:border-primary-6"
  >
    <span class="whitespace-nowrap text-sm text-gray-6">{{ label }}</span>
    <ELSelect class="border-none" placeholder="adasdas">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </ELSelect>
  </div>
</template>
<script>
import { Select } from 'element-ui'
export default {
  name: 'CpisSearchSelect',
  components: {
    ELSelect: Select
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [
        {
          value: '1',
          label: '选项1'
        },
        {
          value: '2',
          label: '选项2'
        }
      ]
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

