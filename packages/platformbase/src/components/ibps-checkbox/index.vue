<template>
  <el-checkbox-group v-model="checkboxValue" :disabled="disabled" @change="onChange">
    <el-checkbox v-for="option in options" :key="option[valueKey]" :label="option[valueKey]">{{ option[labelKey] }}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  name: 'IbpsCheckbox',
  props: {
    value: [String, Array],
    // 存储类型 ：
    // ①、string:存储指定分割的字符串，
    // ②、array：数组存储
    store: {
      type: String,
      default: 'string',
      validator: function (value) {
        return ['string', 'array'].indexOf(value) !== -1
      }
    },
    storeSeparator: {
      // 存储值分割符,对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    options: Array,
    labelKey: {
      // 选项的展示的值
      type: String,
      default: 'label'
    },
    valueKey: {
      // 选项的值
      type: String,
      default: 'value'
    },
    disabled: {
      // 禁用
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkboxValue: {
      get() {
        if (this.$utils.isEmpty(this.value)) {
          return []
        }
        return this.store === 'string' ? this.value.split(this.storeSeparator) : this.value
      },
      set(value) {
        this.$emit('input', this.store === 'string' ? value.join(this.storeSeparator) : value)
      }
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>
