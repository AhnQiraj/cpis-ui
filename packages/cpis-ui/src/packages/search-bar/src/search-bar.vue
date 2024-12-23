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
          :placeholder="item.placeholder"
          v-model="params[item.prop]"
          :enum="item.enum"
        />
      </template>
      <template v-else-if="item.type === 'daterange'">
        <CpisDatePicker
          :style="{ width: item.width || '150px' }"
          :key="item.prop"
          :label="item.label"
          :placeholder="item.placeholder"
          v-model="params[item.prop]"
        />
      </template>
      <template v-else>
        <CpisSearchInput
          :style="{ width: item.width || '150px' }"
          :key="item.prop"
          :label="item.label"
          :placeholder="item.placeholder"
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

export default {
  name: 'CpisSearchBar',
  components: {
    CpisSearchInput,
    CpisSearchSelect,
    CpisButton
  },
  props: {
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
      this.$emit('search', this.params)
    },
    handleSearchReset() {
      this.params = {}
      this.$emit('reset')
    }
  }
}
</script>
