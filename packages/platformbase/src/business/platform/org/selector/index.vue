<template>
  <ibps-selector :items="items" :multiple="multiple" :placeholder="placeholder" :readonly="readonly" :readonly-text="readonlyText" :disabled="disabled" :disabled-icon="disabledIcon" :show-placeholder="showPlaceholder" @click="handleSelectorClick" @remove="handleSelectorRemove">
    <org-compose-selector-dialog ref="composeSelectorDialog" :visible="selectorVisible" :form-data="formData" :type="type" :value="selectorValue" :value-key="valueKey" :label-key="labelKeyEven" :filter="filter" :multiple="multiple" @close="visible => (selectorVisible = visible)" @action-event="handleSelectorActionEvent" />
  </ibps-selector>
</template>
<script>
import { transfer as transferEmployee, get as getEmployee } from '@platform/api/platform/org/employee'
import { transfer as transferOrg, get as getOrg } from '@platform/api/platform/org/org'
import { transfer as transferPosition, get as getPosition } from '@platform/api/platform/org/position'
import { transfer as transferRole, get as getRole } from '@platform/api/platform/org/role'
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import { remoteRequest, remoteTransRequest } from '@platform/utils/remote'
import IbpsSelector from '@platform/components/ibps-selector/selector'
import OrgComposeSelectorDialog from './dialog'
import { TRANSFER_DATA } from '@platform/constant'
export default {
  components: {
    IbpsSelector,
    OrgComposeSelectorDialog
  },
  mixins: [emitter],
  provide() {
    return {
      store: this.store
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    type: {
      type: String,
      default: 'employee'
    },
    value: {
      type: [String, Number, Array, Object]
    },
    // 存储类型 ：
    // ①、id:只存储id 字符串，
    // ②、json： json字符串,
    // ③、 array：存储数组数据(完整数据，包含key和value)。
    // ④、 bind：绑定ID，需要回调和返回
    store: {
      type: String,
      default: 'id',
      validator: function (value) {
        return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
      }
    },
    storeSeparator: {
      // 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    placeholder: {
      // 输入框占位文本
      type: String,
      default: '请选择'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    disabled: {
      // 禁用
      type: Boolean,
      default: false
    },
    disabledIcon: {
      // 禁用有图标
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Array,
      default: () => []
    },
    isValueComeInit: {
      // 回填判断
      type: Boolean,
      default: false
    },
    readonlyText: {
      type: String,
      default: 'original'
    },
    showPlaceholder: {
      // 是否显示占位符
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectorVisible: false,
      selectorValue: this.multiple ? [] : {},
      cacheData: {},
      bindIdValue: ''
    }
  },
  computed: {
    items() {
      if (this.$utils.isEmpty(this.selectorValue)) {
        return []
      }
      if (!this.isValueComeInit && this.store === 'bind') {
        if (this.multiple) {
          return this.selectorValue.map(data => {
            return data || ''
          })
        } else {
          return [this.selectorValue || '']
        }
      } else {
        if (this.multiple) {
          return this.selectorValue.map(data => {
            return data[this.labelKey] || null
          })
        } else {
          return [this.selectorValue[0][this.labelKey]] || []
        }
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
    }
  },
  beforeDestroy() {
    this.cacheData = null
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
        if (!this.isValueComeInit && this.store === 'bind') {
          if (this.multiple) {
            this.selectorValue.push(v)
          } else {
            this.selectorValue = typeof v === 'string' ? v : JSON.parse(v)
          }
        } else {
          if (this.cacheData[v]) {
            this.setSelectorValue(v)
          } else {
            this.getDataInfo(v)
          }
        }
      })
    },
    labelKeyEven(data) {
      if (typeof data === 'string') {
        return data
      } else if (typeof data === 'object') {
        return data[this.labelKey]
      }
    },
    setCacheData() {
      if (this.$utils.isEmpty(this.selectorValue)) {
        return
      }
      const data = this.selectorValue
      const valueKey = this.valueKey
      data.forEach(v => {
        if (typeof v === 'string') {
          const obj = {}
          obj[valueKey] = v
          v = obj
        }
        this.cacheData[v[valueKey]] = v
      })
    },
    setSelectorValue(v) {
      if (this.multiple) {
        this.selectorValue.push(this.cacheData[v])
      } else {
        this.selectorValue = [JSON.parse(JSON.stringify(this.cacheData[v]))]
      }
    },
    /**
     * 获得数组数据
     */
    getArrayValue(value, bindId) {
      if (this.$utils.isEmpty(value)) {
        return []
      }
      if (this.store === 'json') {
        // json
        return this.parseJsonData(value)
      } else if (this.store === 'id') {
        // id
        // 可能是json数据
        if (this.$utils.isJSON(value)) {
          return this.parseJsonData(value)
        } else {
          return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
        }
      } else if (this.store === 'bind') {
        // 绑定bind this.reverseBind
        if (this.$utils.isJSON(value)) {
          return this.parseJsonData(value)
        } else {
          return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
        }
      } else {
        // array
        return value.map(d => {
          return d[this.valueKey]
        })
      }
    },
    parseJsonData(value) {
      try {
        const valueKey = this.valueKey
        const data = this.$utils.parseData(value)
        const result = []
        if (Array.isArray(data)) {
          data.forEach(d => {
            this.cacheData[d[valueKey]] = d
            const node = d[valueKey]
            if (node) {
              result.push(node)
            }
          })
        } else {
          this.cacheData[data[valueKey]] = data
          result.push(data[valueKey])
        }
        return result
      } catch (error) {
        console.warn(error)
        return []
      }
    },
    getStoreValue(value) {
      const res = []
      if (this.store === 'json') {
        // json
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
      } else if (this.store === 'id') {
        // id
        if (this.$utils.isEmpty(value)) {
          return ''
        }
        if (this.multiple) {
          value.forEach(v => {
            res.push(v[this.valueKey])
          })
        } else {
          res.push(this.$utils.isArray(value) ? value[0][this.valueKey] : value[this.valueKey])
        }
        return res.join(this.storeSeparator)
      } else if (this.store === 'bind') {
        // 绑定bind
        const bindIdValue = []
        const valueKey = this.valueKey
        value.forEach(v => {
          if (typeof v === 'string') {
            bindIdValue.push(v)
          } else {
            bindIdValue.push(v[valueKey])
          }
        })
        this.bindIdValue = bindIdValue.join(this.storeSeparator)
        return this.bindIdValue
      } else {
        // 数组 array
        return value || []
      }
    },
    getValue() {
      return this.getStoreValue(this.selectorValue)
    },
    getDataInfo(id) {
      const type = this.type
      if (TRANSFER_DATA === 'transfer') {
        this.getTransferData(type, id)
      } else {
        this.getRemoteData(type, id)
      }
    },
    setRemoteData(data) {
      const valueKey = this.valueKey
      if (this.$utils.isNotEmpty(data)) {
        this.cacheData[data[valueKey]] = data
        this.setSelectorValue(data[valueKey])
      }
    },
    getTransferData(type, id) {
      remoteTransRequest(type + 'id' + id, id).then(idset => {
        const ids = Array.from(idset)
        remoteRequest(type + 'ids', ids, () => {
          return this.getRemoteTransFunc(type, ids)
        })
          .then(response => {
            const responseData = response.data
            const data = responseData[id]
            const valueKey = this.valueKey
            data[valueKey] = id
            this.setRemoteData(data)
          })
          .catch(() => {})
      })
    },
    getRemoteTransFunc(type, ids) {
      return new Promise((resolve, reject) => {
        switch (type) {
          case 'employee': // 员工
          case 'user':
            transferEmployee({
              ids: ids
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'org': // 组织
            transferOrg({
              ids: ids
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'position': // 岗位
            transferPosition({
              ids: ids
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'role': // 角色
            transferRole({
              ids: ids
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          default:
            break
        }
      })
    },
    getRemoteData(type, id) {
      remoteRequest(type + 'id', id, () => {
        return this.getRemoteByIdFunc(type, id)
      })
        .then(response => {
          const data = response.data
          this.setRemoteData(data)
        })
        .catch(() => {})
    },
    getRemoteByIdFunc(type, id) {
      return new Promise((resolve, reject) => {
        switch (type) {
          case 'employee': // 员工
          case 'user':
            getEmployee({
              employeeId: id
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'org': // 组织
            getOrg({
              orgId: id
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'position': // 岗位
            getPosition({
              positionId: id
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          case 'role': // 角色
            getRole({
              roleId: id
            })
              .then(response => {
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
            break
          default:
            break
        }
      })
    },
    // ===================事件处理=========
    handleSelectorClick() {
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
    handleSelectorActionEvent(buttonKey, data, type) {
      let val
      switch (buttonKey) {
        case 'confirm': // 确定
          this.selectorVisible = false
          this.selectorValue = this.multiple ? data : this.$utils.isArray(data) ? data : [data]
          this.setCacheData() // 设置缓存数据
          this.handleInput(buttonKey)
          if (this.store === 'bind') {
            val = this.getValue()
            this.emitChangeLinkData(val, type)
          }
          break
      }
    },
    handleInput(buttonKey) {
      const value = this.getValue()
      this.$emit('input', value)
      this.$emit('action', buttonKey)
      this.$emit('callback', this.selectorValue)
    },
    emitChangeLinkData(val, type) {
      if (!isEqual(this.value, val)) {
        this.$emit('change-link-data', val, this.selectorValue, type)
      }
    }
  }
}
</script>
