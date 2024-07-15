<template>
  <div>
    <ibps-selector
      v-bind="$props"
      :items="items"
      @click="handleSelectorClick"
      @remove="handleSelectorRemove"
    />
    <!-- 选择器 -->
    <form-def-selector-dialog
      :visible="selectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      :data-type="dataType"
      :bo-code="boCode"
      :form-type="formType"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { get, getFormKey } from '@platform/api/platform/form/formDef'
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import FormDefSelectorDialog from './dialog'
export default {
  components: {
    FormDefSelectorDialog
  },
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [String, Number, Array]
    },
    isSave: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'bpm'
    },
    // 存储类型 ,
    // ①、id:只存储id 字符串，
    // ②、json： json字符串,
    // ③、 array：存储数组数据(完整数据，包含key和value)。
    // ④、 bind：绑定ID，需要回调和返回
    store: {
      type: String,
      default: 'id',
      validator: function(value) {
        return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    storeSeparator: { // 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    placeholder: { // 输入框占位文本
      type: String,
      default: '请选择表单'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    temporaryData: [Object, String],
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    boCode: {
      type: String
    },
    toolbar: {
      type: Array
    },
    flowKey: String,
    nodeId: String,
    parentFlowKey: String,
    dataTemplateKey: String,
    isInst: Boolean,
    init: Boolean,
    dataType: { // 数据类型 bo  或者其他
      type: String
    },
    formType: { // 表单类型
      type: String
    }
  },
  data() {
    return {
      showOperate: false,
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      cacheData: {},
      bindIdValue: '',
      rightsVisible: false,
      permission: {}
    }
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) {return []}
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data[this.labelKey]
        })
      } else {
        return [this.selectorValue[this.labelKey]]
      }
    },
    key() {
      if (this.$utils.isEmpty(this.selectorValue)) {return []}
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data['key']
        })
      } else {
        return [this.selectorValue['key']]
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.initData()
        if (!isEqual(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      },
      immediate: true
    },
    rightsData(val) {
      this.permission = val
    }
  },
  beforeDestroy() {
    this.selectorValue = null
    this.cacheData = null
    this.permission = null
  },
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      const data = this.getArrayValue(this.value)
      this.selectorValue = this.multiple ? [] : {}
      if (this.$utils.isEmpty(data)) {
        return
      }
      data.forEach(v => {
        if (this.cacheData[v]) {
          this.setSelectorValue(v)
        } else {
          this.getDataInfo(v)
        }
      })
    },
    setCacheData() {
      if (this.$utils.isEmpty(this.selectorValue)) {return}
      const data = this.multiple ? this.selectorValue : [this.selectorValue]
      data.forEach(v => {
        this.cacheData[v[this.valueKey]] = v
      })
    },
    setSelectorValue(v) {
      if (this.multiple) {
        this.selectorValue.push(this.cacheData[v])
      } else {
        this.selectorValue = JSON.parse(JSON.stringify(this.cacheData[v]))
      }
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value, bindId) {
      if (this.$utils.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') { // json
        try {
          const data = this.$utils.parseData(value)
          return data.map((d) => {
            return d[this.valueKey]
          })
        } catch (error) {
          console.error(error)
          return []
        }
      } else if (this.store === 'id') { // id
        return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
      } else if (this.store === 'bind') { // 绑定id
        if (this.$utils.isEmpty(bindId)) {
          return []
        }
        return bindId.split(this.storeSeparator)
      } else { // array
        return value.map((d) => {
          return d[this.valueKey]
        })
      }
    },
    getStoreValue(value) {
      const res = []
      if (this.store === 'json') { // json
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        if (this.multiple) {
          value.forEach(v => {
            const o = {}
            o[this.valueKey] = v[this.valueKey]
            o[this.labelKey] = v[this.labelKey]
            res.push(o)
          })
          return JSON.stringify(res)
        } else {
          const o = {}
          o[this.valueKey] = value[this.valueKey]
          o[this.labelKey] = value[this.labelKey]
          return JSON.stringify(o)
        }
      } else if (this.store === 'id') { // id
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        if (this.multiple) {
          value.forEach(v => {
            res.push(v[this.valueKey])
          })
        } else {
          res.push(value[this.valueKey])
        }
        return res.join(this.storeSeparator)
      } else if (this.store === 'bind') { // 绑定id
        const res = []
        const bindIdValue = []
        value.forEach(v => {
          bindIdValue.push(v[this.valueKey])
          res.push(v[this.labelKey])
        })
        this.bindIdValue = bindIdValue.join(this.storeSeparator)
        return res.join(this.storeSeparator)
      } else { // 数组 array
        return value || []
      }
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(key) {
      if (this.valueKey === 'id') {
        get({
          formDefId: key
        }).then(response => {
          const data = response.data
          this.cacheData[data[this.valueKey]] = data
          this.setSelectorValue(data[this.valueKey])
        }).catch(() => {
        })
      } else {
        getFormKey({
          formKey: key
        }).then(response => {
          const data = response.data
          this.cacheData[data[this.valueKey]] = data
          this.setSelectorValue(data[this.valueKey])
        }).catch(() => {
        })
      }
    },
    // ===================事件处理=========
    handleSelectorClick(rechoose = false) {
      if (this.disabled) {return}
      if (this.dataType === 'bo' && this.$utils.isEmpty(this.boCode)) {
        // 未选择业务对象不能选择表单
        this.$message.closeAll()
        this.$message({
          message: '请选择业务对象',
          type: 'warning'
        })
        this.selectorVisible = false
        return
      }
      this.selectorVisible = true
      this.initData()
    },
    handleSelectorRemove(index) {
      if (this.multiple) {
        this.selectorValue.splice(index, 1)
      } else {
        this.selectorValue = {}
      }
      this.handleInput()
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.selectorVisible = false
          this.selectorValue = data
          this.setCacheData() // 设置缓存数据
          this.handleInput()
          break
      }
    },
    handleInput() {
      this.$emit('input', this.getStoreValue(this.selectorValue))
      this.$emit('change', this.selectorValue)
    },
    handleToolbarActionEvent(key) {
      switch (key) {
        case 'rechoose':// 重选
          this.handleSelectorClick(true)
          break
        case 'remove':// 删除
          this.selectorValue = this.multiple ? [] : {}
          this.handleInput()
          break
        default:
          break
      }
      this.$emit('action-event', key)
    }
  }
}
</script>
