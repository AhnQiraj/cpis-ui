<template>
  <el-form v-if="forms" ref="form" :model="params" width="30%" :inline="inline" :label-width="labelWidth ? labelWidth + 'px' : ''" class="ibps-crud-search-form" @keyup.enter.native.stop="handleEnter" @submit.native.prevent>
    <!-- :prop="item.fieldType != 'daterange' ? item.prop : (datePrefix + index)" -->
    <el-form-item v-for="(item, index) in forms" :key="index" :prop="item.modelValue" :rules="item.rules || []" :label-width="item.labelWidth ? item.labelWidth + 'px' : ''" class="search-form-item">
      <template slot="label">
        {{ item.label }}
      </template>
      <!-- 文本框-->
      <el-input v-if="item.fieldType === 'input' || item.fieldType === undefined" v-model="params[item.modelValue]" :size="item.size ? item.size : size" :readonly="item.readonly" :disabled="item.disabled" :placeholder="item.placeholder ? item.placeholder : '请输入'" :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')" :name="item.prop" clearable @keyup.enter.native.stop="handleEnter" />
      <!-- 下拉框-->
      <el-select v-else-if="item.fieldType === 'select'" v-model="params[item.modelValue]" :size="item.size ? item.size : size" :disabled="item.disabled" :placeholder="item.placeholder ? item.placeholder : '请选择'" :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')" clearable @keyup.enter.native.stop="handleEnter">
        <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex + '_local'" :value="typeof option === 'object' ? option[item.valueKey || 'value'] : option" :label="typeof option === 'object' ? option[item.labelKey || 'label'] : option" />
        <el-option v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]" :key="opIndex + '_remote'" :value="typeof op === 'object' ? op[item.valueKey || 'value'] : op" :label="typeof op === 'object' ? op[item.labelKey || 'label'] : op" />
      </el-select>
      <!-- 日期-->
      <el-date-picker v-else-if="item.fieldType === 'date'" v-model="params[item.modelValue]" :placeholder="item.placeholder" :size="item.size ? item.size : size" :disabled="item.disabled" :readonly="item.readonly" :editable="item.editable" :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')" :picker-options="item.pickerOptions || {}" :type="item.dateType || 'date'" @keyup.enter.native.stop="handleEnter" />
      <!-- 日期范围-->
      <el-date-picker v-else-if="item.fieldType === 'daterange'" v-model="params[item.modelValue]" :size="item.size ? item.size : size" :disabled="item.disabled" :readonly="item.readonly" :editable="item.editable" :placeholder="item.placeholder ? item.placeholder : '请选择'" :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '请选择'" :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '请选择'" :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')" :picker-options="item.pickerOptions || {}" type="daterange" @change="date => changeDate(date, item.prop[0], item.prop[1])" @keyup.enter.native.stop="handleEnter" />
      <!-- 自定义slot-->
      <template v-else-if="item.fieldType === 'slot'">
        <slot :name="item.slotName" :item="item" />
      </template>
    </el-form-item>
  </el-form>
</template>
<script>
import { formProps } from './props.js'
import request from '@platform/utils/request'
export default {
  name: 'IbpsSearchForm',
  props: formProps,
  data() {
    const { forms, fuzzy } = this.$props
    const datePrefix = 'daterange-prefix'
    const selectOptionPrefix = 'select-option-prefix'
    const dataObj = {
      selectOptions: {}
    }
    const params = {}
    const nameParams = {}
    const format = {}
    const fuzzyOps = {}
    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.prop
        params[v.prop] = v.value || ''
        if (v.name) {
          nameParams[v.prop] = v.name
        }
        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
        if (v.format) {
          format[v.prop] = v.format
        }
      } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
        v.prop.forEach((vv, j) => {
          params[vv] = vv.value || ''
          if (v.name) {
            nameParams[vv] = v.name[j]
          }
          if (v.format) {
            format[vv] = v.format
          }
          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
        })
      }
      if (v.fieldType === 'daterange') {
        params[datePrefix + i] = ''
        v.modelValue = datePrefix + i
      } else if (v.fieldType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i
        dataObj.selectOptions[dataKey] = []
        if (!v.selectMethod) {
          v.selectMethod = 'get'
        }
        this.getRemoteData({
          fetch: v.selectFetch
            ? v.selectFetch
            : () => {
                const p = v.selectMethod.toLowerCase() === 'get' ? { params: v.selectParams } : v.selectParams
                return request({
                  url: v.selectUrl,
                  method: v.selectMethod,
                  p
                })
              },
          dataKey,
          resultField: v.resultField || 'data',
          resultHandler: v.resultHandler
        })
      }
    })
    return {
      params,
      nameParams,
      datePrefix,
      selectOptionPrefix,
      ...dataObj,
      format,
      fuzzyOps
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    }
  },
  methods: {
    /**
     * 处理回车
     */
    handleEnter() {
      this.$emit('search')
    },
    isArray(value) {
      return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
    },
    getParamFuzzy() {
      return this.fuzzyOps
    },
    /**
     * 获取参数
     */
    getParams(callback) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { params, nameParams, datePrefix, format } = this
          const formattedForm = {}
          Object.keys(params).forEach(v => {
            if (v.indexOf(datePrefix) === -1) {
              const val = format[v] ? format[v](params[v], v) : params[v]
              if (this.$utils.isNotEmpty(val)) {
                let key = v
                if (nameParams[v]) {
                  key = nameParams[v]
                }
                formattedForm[key] = val
              }
            }
          })
          if (callback) {
            callback(null, formattedForm)
          }
        } else {
          if (callback) {
            callback(new Error())
          }
        }
      })
    },
    /**
     *重置表单
     */
    resetSearchForm() {
      this.$refs['form'].resetFields()
    },
    changeDate(date, startDate, endDate) {
      let dates
      if (date === null) {
        this.params[startDate] = ''
        this.params[endDate] = ''
        return
      }
      if (typeof date === 'string') {
        dates = date.split(' - ')
      } else if (date && date.hasOwnProperty('length')) {
        const firstDate = date[0]
        const secondDate = date[1]
        dates = [`${firstDate.getFullYear()}-${('0' + (firstDate.getMonth() + 1)).substr(-2)}-${('0' + firstDate.getDate()).substr(-2)}`, `${secondDate.getFullYear()}-${('0' + (secondDate.getMonth() + 1)).substr(-2)}-${('0' + secondDate.getDate()).substr(-2)}`]
      }
      this.params[startDate] = dates[0]
      this.params[endDate] = dates[1]
    },
    /**
     * 获取的远程数据【下拉框】
     */
    getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
      fetch().then(response => {
        let result = response
        if (typeof response === 'object' && !this.isArray(response)) {
          if (resultField.indexOf('.') !== -1) {
            resultField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[resultField]
          }
        }
        if (!result || !(result instanceof Array)) {
          throw new Error(`The result of key:${resultField} is not Array.`) // 接口返回的字段:${resultField} 不是一个数组
        }
        if (this.resultHandler) {
          this.selectOptions[dataKey] = result.map(this.resultHandler)
        } else {
          this.selectOptions[dataKey] = result
        }
      })
    }
  }
}
</script>
