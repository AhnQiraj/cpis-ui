<template>
  <div>
    <ibps-selector v-bind="$props" :items="items" @click="handleSelectorClick" @remove="handleSelectorRemove" />
    <!-- 选择器 -->
    <ibps-level-selector-dialog :visible="selectorVisible" :value="selectorValue" :multiple="multiple" :level-type="levelType" @close="visible => (selectorVisible = visible)" @action-event="handleSelectorActionEvent" />
  </div>
</template>
<script>
import { get, getByTypeAndLevel } from '@platform/api/platform/org/level'
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import { remoteRequest } from '@platform/utils/remote'
import IbpsSelector from '@platform/components/ibps-selector/selector'
import IbpsLevelSelectorDialog from './dialog'
export default {
  components: {
    IbpsSelector,
    IbpsLevelSelectorDialog
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
    placeholder: {
      // 输入框占位文本
      type: String,
      default: '请选择等级'
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    labelKey: {
      // 展示的值
      type: String,
      default: 'name'
    },
    valueKey: {
      // 存储唯一值
      type: String,
      default: 'id'
    },
    disabled: {
      // 禁用
      type: Boolean,
      default: false
    },
    levelType: {
      type: String
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
      if (this.multiple) {
        return this.selectorValue.map(data => {
          return data[this.labelKey]
        })
      } else {
        return [this.selectorValue[this.labelKey]]
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
    this.selectorValue = null
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
        if (this.cacheData[v]) {
          this.setSelectorValue(v)
        } else {
          this.getDataInfo(v)
        }
      })
    },
    setCacheData() {
      if (this.$utils.isEmpty(this.selectorValue)) {
        return
      }
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
      if (this.store === 'json') {
        // json
        try {
          const data = this.$utils.parseData(value)
          if (this.multiple) {
            return data.map(d => {
              return d[this.valueKey]
            })
          } else {
            return [data]
          }
        } catch (error) {
          console.warn(error)
          return []
        }
      } else if (this.store === 'id') {
        // id
        return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
      } else if (this.store === 'bind') {
        // 绑定id
        if (this.$utils.isEmpty(bindId)) {
          return []
        }
        return bindId.split(this.storeSeparator)
      } else {
        // array
        return value.map(d => {
          return d[this.valueKey]
        })
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
          res.push(value[this.valueKey])
        }
        return res.join(this.storeSeparator)
      } else if (this.store === 'bind') {
        // 绑定id
        const res = []
        const bindIdValue = []
        value.forEach(v => {
          bindIdValue.push(v[this.valueKey])
          res.push(v[this.labelKey])
        })
        this.bindIdValue = bindIdValue.join(this.storeSeparator)
        return res.join(this.storeSeparator)
      } else {
        // 数组 array
        return value || []
      }
    },
    getValue() {
      return this.getStoreValue(this.selectorValue)
    },
    /**
     * 通过ID获取数据
     */
    getDataInfo(id) {
      remoteRequest('level' + this.valueKey, id, () => {
        return this.getRemoteByIdFunc(id)
      })
        .then(response => {
          const data = response.data
          this.cacheData[data[this.valueKey]] = data
          this.setSelectorValue(data[this.valueKey])
        })
        .catch(() => {})
    },
    getRemoteByIdFunc(id) {
      return new Promise((resolve, reject) => {
        if (this.valueKey === 'id') {
          get({
            levelId: id
          })
            .then(response => {
              resolve(response)
            })
            .catch(() => {})
        } else if (this.valueKey === 'level') {
          getByTypeAndLevel({
            partyType: this.levelType,
            value: id
          })
            .then(response => {
              resolve(response)
            })
            .catch(() => {})
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
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm': // 确定
          this.selectorVisible = false
          this.selectorValue = data
          this.setCacheData() // 设置缓存数据
          this.handleInput()
          break
      }
    },
    handleInput() {
      this.$emit('input', this.getValue())
      // 提供一个返回实体，提供调用
      this.$emit('callback', this.selectorValue)
    }
  }
}
</script>
