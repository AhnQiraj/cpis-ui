<template>
  <div class="cpis-search-bar flex flex-row gap-2">
    <div
      v-for="(item, index) in search"
      :key="item.prop"
      class="flex flex-row items-center gap-2 border-solid border-1 border-gray-3 rounded px-2.5"
    >
      <div v-if="!!item.label" class="whitespace-nowrap text-sm text-gray-6">
        {{ item.label }}：
      </div>
      <template v-if="['select', 'multiple-select'].includes(item.type)">
        <CpisSelect
          size="small"
          :key="item.prop"
          :label="item.label"
          clearable
          :value-key="item.valueKey"
          :label-key="item.labelKey"
          :multiple="item.type === 'multiple-select'"
          :collapse-tags="item.type === 'multiple-select'"
          :placeholder="item.placeholder || '请选择'"
          v-model="params[item.prop]"
          :style="{
            width: calculateWidth(
              item.placeholder || '请选择',
              item.type === 'multiple-select' ? 100 : 0
            )
          }"
        >
          <el-option
            v-for="option in getEnumOptions(item)"
            :key="option[item.valueKey || 'key']"
            :label="option[item.labelKey || 'name']"
            :value="option[item.valueKey || 'key']"
          />
        </CpisSelect>
      </template>
      <template
        v-else-if="
          ['daterange', 'date', 'datetime', 'datetimerange'].includes(item.type)
        "
      >
        <CpisDatePicker
          size="small"
          :key="item.prop"
          :type="item.type"
          clearable
          :label="item.label"
          style="width: 200px"
          v-model="params[item.prop]"
        />
      </template>
      <template v-else>
        <CpisInput
          size="small"
          clearable
          :key="item.prop"
          :label="item.label"
          :placeholder="item.placeholder || '请输入'"
          v-model="params[item.prop]"
          :style="{
            width: calculateWidth(item.placeholder || '请输入')
          }"
        />
      </template>
    </div>
    <CpisButton type="primary" @click="handleSearch">查询</CpisButton>
    <CpisButton @click="handleSearchReset">重置</CpisButton>
  </div>
</template>

<script>
import CpisInput from '../../input/index'
import CpisSelect from '../../select/index'
import CpisButton from '../../button/index'
import CpisDatePicker from '../../date-picker/index'
import { FormItem, Form, Option } from 'element-ui'

export default {
  name: 'CpisSearchBar',
  components: {
    CpisInput,
    CpisSelect,
    CpisButton,
    CpisDatePicker,
    ElFormItem: FormItem,
    ElForm: Form,
    ElOption: Option
  },
  props: {
    paramaterMode: {
      type: String,
      default: 'flat',
      validator: function (value) {
        return ['flat', 'structured'].indexOf(value) !== -1
      },
      default: 'flat',
      comments: 'flat扁平化参数模式， structured结构化参数模式'
    },
    search: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      params: {}
    }
  },
  methods: {
    handleSearch() {
      try {
        if (!this.search || this.search.length === 0) {
          console.warn('[CpisSearchBar] No search items configured')
          return
        }
        if (this.paramaterMode === 'structured') {
          const parameters = []
          for (const [key, value] of Object.entries(this.params)) {
            // Skip empty values
            if (value === undefined || value === null || value === '') {
              continue
            }
            if (Array.isArray(value) && key.includes(',')) {
              const [startKey, endKey] = key.split(',')
              parameters.push(
                {
                  key: startKey,
                  value: value[0]
                },
                {
                  key: endKey,
                  value: value[1]
                }
              )
            } else {
              parameters.push({
                key: key,
                value: value
              })
            }
          }
          this.$emit('search', parameters)
        } else {
          // Filter out empty values for flat mode
          const filteredParams = Object.fromEntries(
            Object.entries(this.params).filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== ''
            )
          )
          this.$emit('search', filteredParams)
        }
      } catch (error) {
        console.error('[CpisSearchBar] Error during search:', error)
      }
    },
    handleSearchReset() {
      this.params = {}
      this.$emit('reset')
    },
    calculateWidth(placeholder, additionalWidth = 0) {
      // 假设每个中文字符宽度为14px，英文字符为7px
      const baseWidth = 32 // 基础padding和border宽度

      const placeholderWidth = placeholder.split('').reduce((acc, char) => {
        return acc + (/[\u4e00-\u9fa5]/.test(char) ? 14 : 7)
      }, 0)

      return `${Math.max(baseWidth + placeholderWidth + additionalWidth, 60)}px`
    },
    getEnumOptions(item) {
      return typeof item.enum === 'function' ? item.enum() : item.enum
    }
  }
}
</script>
<style scoped>
::v-deep .el-input__inner {
  @apply border-none;
}
</style>
