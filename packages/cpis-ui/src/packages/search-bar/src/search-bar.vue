<template>
  <div class="cpis-search-bar flex flex-row gap-2 100vw">
    <div class="cpis-search-bar-items-wrapper flex gap-2" :style="{ 'flex-wrap': isExpanded ? 'wrap' : 'nowrap' }">
      <div
        v-for="(item, index) in _search"
        v-show="isExpanded || index <= 4"
        :key="item.key"
        class="flex flex-row items-center px-2.5"
        :class="{
          'border-solid border-1 border-gray-3 rounded': item.type !== 'checkbox'
        }"
      >
        <div v-if="!!item.label && item.type !== 'checkbox'" class="whitespace-nowrap text-sm text-gray-6">
          {{ item.label }}：
        </div>
        <template v-if="['select', 'multiple-select'].includes(item.type)">
          <CpisSelect
            :class="{ autoWidth: item.type === 'select', 'w-[100px]': item.type === 'multiple-select' }"
            size="small"
            :label="item.label"
            clearable
            :value-key="item.valueKey"
            :label-key="item.labelKey"
            :multiple="item.type === 'multiple-select'"
            :collapse-tags="item.type === 'multiple-select'"
            :placeholder="item.placeholder || '请选择'"
            v-model="params[item.prop]"
            v-on="getComponentListeners(item)"
            v-bind="item.fieldProps"
          >
            <template v-if="item.type === 'select'" slot="prefix">
              {{ getPrefixLabel(item) }}
            </template>
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
            ['daterange', 'date', 'datetime', 'datetimerange', 'month', 'year', 'monthrange'].includes(item.type)
          "
        >
          <CpisDatePicker
            size="small"
            :type="item.type"
            :value-format="
              item.format ||
              {
                date: 'yyyy-MM-dd',
                datetime: 'yyyy-MM-dd HH:mm:ss',
                datetimerange: 'yyyy-MM-dd HH:mm:ss',
                daterange: 'yyyy-MM-dd',
                month: 'yyyy-MM',
                year: 'yyyy',
                monthrange: 'yyyy-MM'
              }[item.type]
            "
            :default-time="item.type === 'datetimerange' ? ['00:00:00', '23:59:59'] : undefined"
            clearable
            :style="{
              width: calculateDateWidth(item.type) + 'px'
            }"
            v-on="getComponentListeners(item)"
            :label="item.label"
            v-model="params[item.prop]"
            v-bind="item.fieldProps"
          />
        </template>
        <template v-else-if="['checkbox'].includes(item.type)">
          <ElCheckbox v-model="params[item.prop]" v-on="getComponentListeners(item)">
            {{ item.label }}
          </ElCheckbox>
        </template>
        <template v-else>
          <CpisInput
            size="small"
            clearable
            :label="item.label"
            :placeholder="item.placeholder || '请输入'"
            v-model="params[item.prop]"
            v-on="getComponentListeners(item)"
            :style="{
              width: calculateWidth(item.placeholder || '请输入')
            }"
            v-bind="item.fieldProps"
          />
        </template>
      </div>
      <div class="cpis-search-bar-actions flex flex-row gap-2">
        <CpisButton type="primary" @click="handleSearch">查询</CpisButton>
        <CpisButton @click="handleSearchReset">重置</CpisButton>
        <CpisButton v-if="search.length > 5" @click="handleExpand">{{ isExpanded ? '收起' : '展开' }}</CpisButton>
      </div>
    </div>
  </div>
</template>

<script>
import CpisInput from '../../input/index'
import CpisSelect from '../../select/index'
import CpisButton from '../../button/index'
import CpisDatePicker from '../../date-picker/index'
import { Option, Checkbox } from 'element-ui'
export default {
  name: 'CpisSearchBar',
  components: {
    CpisInput,
    CpisSelect,
    CpisButton,
    CpisDatePicker,
    ElOption: Option,
    ElCheckbox: Checkbox
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
  computed: {
    _search() {
      return this.search.map(item => ({
        ...item,
        key: Array.isArray(item.prop) ? item.prop.join(',') : item.prop
      }))
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
    getPrefixLabel(item) {
      const value = this.params[item.prop]
      if (!value) {
        return item.placeholder || '请选择'
      }
      const options = this.getEnumOptions(item)
      const finded = options.find(item => item[item.valueKey || 'key'] === value)
      return finded ? finded[item.labelKey || 'name'] : ''
    },
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
        daterange: 210,
        monthrange: 200
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
          Object.entries(this.params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )
      }
      return params
    },
    setParams(key, value) {
      this.$set(this.params, key, value)
    },
    getComponentListeners(item) {
      const listeners = {}
      // 如果item中有events配置，则应用对应的事件处理器
      if (item.fieldEvents) {
        Object.entries(item.fieldEvents).forEach(([event, handler]) => {
          listeners[event] = (...args) => {
            handler(...args, item)
          }
        })
      }
      return listeners
    }
  }
}
</script>
<style lang="scss">
.cpis-search-bar .el-input__inner {
  @apply border-none;
}
/* date 组件的样式，padding-left 原设定过于大 */
.cpis-search-bar .el-date-editor--date > .el-input__inner {
  padding-left: 0px !important;
}
/* datetime 组件的样式，padding-left 原设定过于大 */
.cpis-search-bar .el-date-editor--datetime > .el-input__inner {
  padding-left: 0px !important;
}

.cpis-search-bar .el-input .el-input__inner {
  padding-left: 0px !important;
}
.cpis-search-bar-actions .el-button + .el-button {
  margin-left: 0;
}
</style>

<style>
.autoWidth {
  min-width: 70px;
  text-align: start;
}
.autoWidth .el-select__tags {
  flex-wrap: nowrap;
}
.autoWidth .el-input__prefix {
  text-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  border: 1px solid #ffffff00;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  color: #606266;
  left: 0;
  visibility: hidden;
}
.autoWidth .el-input__inner {
  position: absolute;
}
</style>
