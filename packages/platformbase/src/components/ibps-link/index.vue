<template>
  <div ref="link" :class="classes">
    <el-link v-if="showType === 'link' && show" :underline="underline" :icon="icon" :disabled="disabled" :type="type" @click.native="handleClick">{{ showText }}</el-link>
    <el-button v-else-if="showType === 'button' && show" :icon="icon" :disabled="disabled" :type="type" @click.native="handleClick">{{ showText }}</el-button>
    <!-- 弹窗模式 -->
    <custom-dialog ref="userDialog" :visible="openDialog" :data="formData" :components="customComponents" @close="visible => (openDialog = visible)" />
    <!-- 级联配置-弹窗模式-fiexd -->
    <cascade-dialog ref="cascadeDialog" :visible="cascadeDialogVisible" :components="customComponents" :config="cascadeConfig" :dynamic-data="cascadeDynamicData" :dynamic-params="cascadeDynamicParams" @callback="callbackPage" @close="visible => (cascadeDialogVisible = visible)" />
  </div>
</template>
<script>
import request from '@platform/utils/request'
import { getScriptValue } from '@platform/api/platform/form/common.js'
import CustomDialog from './dialog'
import CascadeDialog from '@platform/components/ibps-link/components/dialog'
import CascadeMixin from './mixins/cascade'
export default {
  name: 'IbpsHyperlink',
  components: {
    CustomDialog,
    CascadeDialog
  },
  mixins: [CascadeMixin],
  props: {
    cascadeConfiguration: {
      // 级联配置
      type: Object
    },
    previewEntrance: {
      type: Boolean,
      default: false
    },
    showType: {
      // 是按钮还是文本
      type: String,
      default: 'link',
      validator: function (value) {
        return ['link', 'button'].indexOf(value) !== -1
      }
    },
    formData: {
      type: Object
    },
    text: {
      type: String
    },
    textJavascript: {
      type: String
    },
    linkType: {
      // 打开链接的类型
      type: String,
      default: 'fixed',
      validator: function (value) {
        // fixed 固定值; dynamic groovy脚本; javascript js 脚本
        return ['fixed', 'dynamic', 'javascript', 'cascade'].indexOf(value) !== -1
      }
    },
    textType: {
      // 文本展示的类型
      type: String,
      default: 'fixed',
      validator: function (value) {
        // fixed 固定值; dynamic groovy脚本; javascript js 脚本
        return ['fixed', 'dynamic', 'javascript', 'combination'].indexOf(value) !== -1
      }
    },
    link: {
      type: String
    },
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    position: String, // 位置
    isNewTab: {
      // 新开窗口还是弹框显示
      type: Boolean,
      default: true
    },
    beforeClick: {
      // 方法参数（ linkData, text, cb） cb 是回调函数
      type: Function
    },
    afterClick: {
      type: Function
    }
  },
  data() {
    return {
      linkData: '',
      showText: this.text || '暂无数据',
      openType: '',
      openDialog: false,
      cascadeDialogVisible: false,
      cascadeDynamicData: {},
      cascadeDynamicParams: {},
      customComponents: {},
      show: true,
      cascadeConfig: this.cascadeConfiguration
    }
  },
  computed: {
    classes() {
      return [this.position ? (this.position === 'center' ? 'ibps-tc' : this.position === 'right' ? 'ibps-tr' : '') : '']
    },
    models() {
      return this.formData ? this.formData.models || {} : {}
    }
  },
  watch: {
    textType: {
      handler: function (val) {
        if (!this.previewEntrance) {
          return
        }
        this.setVal(val, 'text', this.textJavascript)
      },
      immediate: true
    },
    linkType: {
      handler: function (val) {
        if (!this.previewEntrance) {
          return
        }
        this.setVal(val, 'link', this.link)
      },
      immediate: true
    },
    cascadeConfiguration: {
      handler: function (val) {
        this.cascadeConfig = val
      },
      immediate: true,
      deep: true
    },
    models: {
      handler: function (val) {
        if (this.$utils.isEmpty(val)) {
          return
        }
        this.setVal(this.textType, 'text', this.textJavascript)
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.cascadeConfig = null
    this.customComponents = null
  },
  methods: {
    /**
     * val 属性的值
     * prop [link]
     */
    setVal(type, prop, script, action) {
      if (type === 'fixed') {
        this.showText = this.text || ''
      } else if (type === 'dynamic') {
        this.runGroovy(prop, script)
      } else if (type === 'javascript') {
        this.runScript(prop, script, action)
      } else if (type === 'combination') {
        this.runCombination(script)
      } else if (type === 'cascade') {
        this.runCascadeConfiguration(action, this.cascadeConfig)
      }
    },
    /**
     *  级联配置
     */
    runCascadeConfiguration(action, cascadeConfig) {
      if (action !== 'click') {
        return
      }
      const config = cascadeConfig
      if (this.$utils.isEmpty(config)) {
        return
      }
      this.runCascadeAction(config, this.formData)
    },
    // 组合字段
    runCombination(text) {
      const models = this.models
      if (this.$utils.isEmpty(text)) {
        return ''
      }
      const d = text.split(new RegExp('(\\$[0-9a-zA-Z._]+#)', 'g'))
      const rtn = []
      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) {
          // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = models[f[0]] || ''
        }
        rtn.push(a)
      })
      this.showText = rtn.join('')
    },
    runScript(prop, scrip, action) {
      const formData = this.formData
      const options = {
        formData: formData,
        request: request,
        router: this.$router,
        message: this.$message,
        link: this
      }
      if (this.$utils.isEmpty(scrip)) {
        return
      }
      const promise = new window.Promise((resolve, reject) => {
        new Function('options', 'resolve', scrip)(options, resolve)
      })
      promise.then(result => {
        if (this.$utils.isEmpty(result)) {
          this.showText = '暂无数据'
          return
        }
        options.result = result
        if (prop === 'text') {
          this.showText = result || '暂无数据'
        } else {
          result.formData = formData
          this.linkData = result || ''
          if (result.constructor === Object && result.openType && this.showType === 'link' && action === 'click') {
            switch (result.openType) {
              case 'dialog':
                this.customComponents = result
                this.openDialog = true
                break
              case 'url':
                window.open(result.url)
                break
              case 'tab':
                this.$router.push(result.url)
                break
              case 'cascade':
                this.cascadeConfig = result.props
                this.runCascadeConfiguration('', result.action, result.props)
                break
              default:
                break
            }
          } else if (this.showType === 'button') {
            if (result.constructor === Array) {
              const promise = new window.Promise((resolve, reject) => {
                result.forEach(item => {
                  if (item.event === 'beforeSubmit' && action !== 'click') {
                    new Function('options', 'resolve', item.logic)(options, resolve)
                  } else if (item.event === 'afterSubmit' && action === 'click') {
                    new Function('options', 'resolve', item.logic)(options, resolve)
                  }
                })
              })
              promise.then(res => {
                this.conditionalExecution(res.constructor === Object && res.openType, res, 'openType')
              })
            } else {
              this.$message({
                message: '请按规定脚本格式填写脚本',
                type: 'warning'
              })
            }
          }
        }
      })
    },
    conditionalExecution(condition, res, key) {
      if (condition) {
        switch (res[key]) {
          case 'dialog':
            this.customComponents = res
            this.openDialog = true
            break
          case 'url':
            window.open(res.url)
            break
          case 'tab':
            this.$router.push(res.url)
            break
          case 'cascade':
            this.cascadeConfig = res.props
            this.runCascadeConfiguration('', res.action, res.props)
            break
          default:
            break
        }
      }
    },
    // TODO: 待完善
    runGroovy(prop, scrip) {
      const formData = this.formData
      const str = JSON.parse(JSON.stringify(scrip))
      const arr = []
      const vars = {}
      for (let i in formData.models) {
        if (str.indexOf(i) !== -1) {
          arr.push(str.substring(str.indexOf(i), str.indexOf(i) + i.length))
        }
      }
      arr.forEach(a => {
        vars[a] = formData.models[a]
      })
      if (this.$utils.isNotEmpty(scrip)) {
        getScriptValue({
          script: scrip,
          vars: JSON.stringify(vars) || ''
        })
          .then(res => {
            this[scrip + 'Data'] = res.content
            if (prop === 'text') {
              this.showText = res.data || '暂无数据'
            }
            this.$message({
              showClose: true,
              message: '动态脚本执行成功！',
              type: 'success'
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    handleClick() {
      this.setVal(this.linkType, 'link', this.link, 'click')
    },
    callbackPage() {
      this.$emit('callback', this)
    }
  }
}
</script>
