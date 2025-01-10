<template>
  <div class="search-bar flex gap-2">
    <template v-for="(item, index) in search">
      <template v-if="item.type === 'select'">
        <CpisSearchSelect
          :style="{ width: item.width || '150px' }"
          :key="item.prop"
          :label="item.label"
          :value-key="item.valueKey"
          :label-key="item.labelKey"
          :placeholder="item.placeholder || '请选择'"
          v-model="params[item.prop]"
          :enum="item.enum"
        />
      </template>
      <template v-else-if="item.type === 'daterange'">
        <CpisDatePicker
          :style="{ width: '250px' }"
          :key="item.prop"
          type="daterange"
          :clearable="false"
          :label="item.label"
          :placeholder="item.placeholder || '请选择'"
          v-model="params[item.prop]"
        />
      </template>
      <template v-else-if="item.type === 'date'">
        <CpisDatePicker
          :style="{ width: item.width || '260px' }"
          :key="item.prop"
          type="date"
          :clearable="false"
          :label="item.label"
          :placeholder="item.placeholder || '请选择'"
          v-model="params[item.prop]"
        />
      </template>
      <template v-else>
        <CpisSearchInput
          :style="{ width: item.width || '150px' }"
          :key="item.prop"
          :label="item.label"
          :placeholder="item.placeholder || '请输入'"
          v-model="params[item.prop]"
        />
      </template>
    </template>
    <CpisButton type="primary" @click="handleSearch">查询</CpisButton>
    <CpisButton @click="handleSearchReset">重置</CpisButton>
  </div>
</template>

<script>
import CpisSearchInput from '../../search-input/index'
import CpisSearchSelect from '../../search-select/index'
import CpisButton from '../../button/index'
import CpisDatePicker from '../../search-date/index'

export default {
  name: 'CpisSearchBar',
  components: {
    CpisSearchInput,
    CpisSearchSelect,
    CpisButton,
    CpisDatePicker
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
    }
  }
}
</script>
