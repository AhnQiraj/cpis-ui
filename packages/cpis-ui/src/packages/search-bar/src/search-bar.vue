<template>
  <div class="cpis-search-bar flex flex-row gap-2 100vw">
    <div
      class="cpis-search-bar-items-wrapper flex gap-2"
      :style="{ 'flex-wrap': isExpanded ? 'wrap' : 'nowrap' }"
    >
      <div
        v-for="(item, index) in search"
        v-show="isExpanded || index <= 4"
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
            ['daterange', 'date', 'datetime', 'datetimerange'].includes(
              item.type
            )
          "
        >
          <CpisDatePicker
            size="small"
            :key="item.prop"
            :type="item.type"
            :value-format="
              item.format ||
              {
                date: 'yyyy-MM-dd',
                datetime: 'yyyy-MM-dd HH:mm:ss',
                datetimerange: 'yyyy-MM-dd HH:mm:ss',
                daterange: 'yyyy-MM-dd'
              }[item.type]
            "
            :default-time="
              item.type === 'datetimerange'
                ? ['00:00:00', '23:59:59']
                : undefined
            "
            clearable
            :style="{
              width: calculateDateWidth(item.type) + 'px'
            }"
            :label="item.label"
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
      <div class="cpis-search-bar-actions flex flex-row gap-2">
        <CpisButton type="primary" @click="handleSearch">查询</CpisButton>
        <CpisButton @click="handleSearchReset">重置</CpisButton>
        <CpisButton v-if="search.length > 5" @click="handleExpand">{{
          isExpanded ? '收起' : '展开'
        }}</CpisButton>
      </div>
    </div>
  </div>
</template>

<script>
import CpisInput from '../../input/index'
import CpisSelect from '../../select/index'
import CpisButton from '../../button/index'
import CpisDatePicker from '../../date-picker/index'
import { Option } from 'element-ui'
export default {
  name: 'CpisSearchBar',
  components: {
    CpisInput,
    CpisSelect,
    CpisButton,
    CpisDatePicker,
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
      params: {},
      isExpanded: false
    }
  },
  mounted() {
    let params = {}
    this.search.map(item => {
      if (item.defaultValue) {
        params[item.prop] = item.defaultValue
      }
    })
    this.params = { ...params }
  },
  methods: {
    handleSearch() {
      try {
        if (!this.search || this.search.length === 0) {
          console.warn('[CpisSearchBar] No search items configured')
          return
        }
        this.$emit('search', this.getParams())
      } catch (error) {
        console.error('[CpisSearchBar] Error during search:', error)
      }
    },
    handleSearchReset() {
      this.params = {}
      this.$emit('reset')
    },
    handleExpand() {
      this.isExpanded = !this.isExpanded
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
    },
    calculateDateWidth(type) {
      const widht = {
        date: 100,
        datetime: 150,
        datetimerange: 350,
        daterange: 250
      }
      return widht[type] || 100
    },
    getParams() {
      let params = {}
      if (this.paramaterMode === 'structured') {
        params = []
        for (const [key, value] of Object.entries(this.params)) {
          // Skip empty values
          if (value === undefined || value === null || value === '') {
            continue
          }
          if (Array.isArray(value) && key.includes(',')) {
            const [startKey, endKey] = key.split(',')
            params.push(
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
            params.push({
              key: key,
              value: value
            })
          }
        }
      } else {
        // Filter out empty values for flat mode
        params = Object.fromEntries(
          Object.entries(this.params).filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ''
          )
        )
      }
      return params
    }
  }
}
</script>
<style scoped>
::v-deep .el-input__inner {
  @apply border-none;
}
/* date 组件的样式，padding-left 原设定过于大 */
::v-deep .el-date-editor--date > .el-input__inner {
  padding-left: 0px !important;
}
/* datetime 组件的样式，padding-left 原设定过于大 */
::v-deep .el-date-editor--datetime > .el-input__inner {
  padding-left: 0px !important;
}

::v-deep .el-input .el-input__inner {
  padding-left: 0px !important;
}
</style>
