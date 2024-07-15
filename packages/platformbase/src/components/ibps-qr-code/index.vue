<template>
  <div>
    <vue-qr v-if="codeText" :text="codeText" :size="(size || size.default) | parseFloat" :margin="(margin || margin.default) | parseFloat" :bg-src="bgSrc" :logo-src="logoSrc" :logo-scale="(logoScale || logoScale.default) | parseFloat" />
    <span v-else>{{ '无' }}</span>
  </div>
</template>
<script>
import QrCode from 'vue-qr'
import Vue from 'vue'
import FormulaUtil from '@platform/utils/formula'
import { forEach } from 'lodash'
Vue.use(QrCode)
export default {
  name: 'IbpsQrCode',
  filters: {
    parseFloat(value) {
      return FormulaUtil.VALUE(value)
    }
  },
  props: {
    text: String, //	二维码内容
    size: {
      // 二维码宽高
      type: String,
      default: '200'
    },
    margin: {
      // 边距
      type: String,
      default: '30'
    },
    bgSrc: String, // 嵌入背景图地址
    logoSrc: String, // 二维码中间的图
    logoScale: {
      // 中间图的尺寸
      type: String,
      default: '50'
    },
    dataSource: {
      // 外部数据集
      type: Object,
      default: () => {
        return {}
      }
    },
    replacementRule: {
      // 替换数据集规则
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      codeText: '', // 真正绑定到二维码的字符串
      noParseText: this.text // 未解析前的字符串
    }
  },
  computed: {
    _dataSource() {
      // return Object.assign({}, this.dataSource, {})
      return JSON.parse(JSON.stringify(this.dataSource))
    }
  },
  watch: {
    _dataSource: {
      // 数据集发生修改重新刷新二维码
      handler: function (val, oldVal) {
        setTimeout(() => {
          forEach(this.replacementRule, obj => {
            const newData = this.getDataSourceValue(val[obj.dataSource], obj.key)
            const oldData = this.getDataSourceValue(oldVal[obj.dataSource], obj.key)
            if (newData !== oldData) {
              this.replaceText()
              return
            }
          })
        }, 500)
      },
      immediate: false,
      deep: true
    }
  },
  created() {
    this.replaceText()
  },
  methods: {
    replaceText() {
      // 根据规则替换对应的二维码内容
      if (!this.replacementRule) {
        // 不需要替换二维码的情况
        this.codeText = this.text
        return
      }
      if (!this.dataSource) {
        return
      }
      this.noParseText = this.text
      forEach(this.replacementRule, obj => {
        // 获取对应数据
        const data = this.getDataSourceValue(this.dataSource[obj.dataSource], obj.key)
        // 替换二维码内容为对应数据
        this.noParseText = this.noParseText.replace(obj.replaceStr, data)
      })
      this.codeText = this.noParseText
    },
    getDataSourceValue(source, keys) {
      // 递归获取表单数据
      if (!source) {
        return
      }
      const key = []
      const index = keys.indexOf('.')
      if (index !== -1) {
        key.push(keys.substring(0, index))
        key.push(keys.substring(index + 1, keys.length))
      } else {
        key.push(keys.substring(0, keys.length))
      }
      if (key.length === 1) {
        return source[key[0]] || ''
      }
      this.getDataSourceValue(source[key[0]], key[1])
    }
  }
}
</script>
