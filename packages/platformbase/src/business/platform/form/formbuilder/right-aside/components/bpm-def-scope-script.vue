<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="脚本"
    class="form-script-dialog"
    top="4vh"
    width="80%"
    append-to-body
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <ibps-layout ref="layout">
        <div>
          <el-form label-position="top">
            <el-form-item class="form-script-head-title">
              <label slot="label">{{ label }}=
              </label>
              <codemirror ref="dynamicScript" v-model="dynamicScript" :options="cmOption" />
            </el-form-item>
            <div class="form-script-foot">
              <ul>
                <li>支持<span class="red">groovy</span>的动态脚本</li>
                <li>脚本有且只有一个参数QueryFilter queryFilter</li>
                <li>{{ text }}</li>
                <li>动态脚本举例:比如：获取当前人<span class="red">cscript.queryBpmInstHis(queryFilter)</span></li>
              </ul>
            </div>
          </el-form>
        </div>
      </ibps-layout>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
export default {
  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: [String, Number, Array, Object]
    },
    boData: {
      type: Array
    },
    label: {
      type: String,
      default: '动态脚本'
    }
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      dynamicScript: '',
      text: '脚本返回值必须是PageJson对象且内容是PageList<BpmInstHisPo>',
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/x-groovy',
        theme: 'eclipse',
        extraKeys: {
          'Ctrl-S': function(e) {
            _this.handleConfirm(false)
          }
        }
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler: function(val, oldVal) {
        this.dynamicScript = val
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.cmOption = null
    this.toolbars = null
  },
  methods: {
    getEditor() {
      return this.$refs.dynamicScript.cminstance
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm(isColse = true) {
      const data = this.dynamicScript
      if (this.$utils.isEmpty(data)) {
        this.$message.closeAll()
        this.$message.warning('请设置动态脚本')
        this.getEditor().focus()
        return
      }
      this.$emit('callback', data)
      if (isColse) {
        this.closeDialog()
      } else {
        this.$message.closeAll()
        this.$message.success('设置动态脚成功')
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    insertField: function(obj, b) {
      this.getEditor().replaceSelection('{' + obj.key + '}')
      this.getEditor().focus()
    },
    handleDefaultScript() {
      this.dynamicScript = ''
    }
  }
}
</script>
<style lang="scss" >
.form-script-dialog{
  .el-dialog__body{
    padding-top:10px ;
  }
  .CodeMirror{
    height: 400px ;
  }
  .form-script-head-title{
    border: 1px solid #e0e0e0;
    .el-form-item__label{
        background: #f3f8fb;
        padding: 0 10px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        font-size: 14px;
        width: 100%;
    }
  }
  .form-script-info-name {
    font-size: 12px;
    color: #91A1B7;
    line-height: 18px;
    margin-bottom: 5px;
  }
  .form-script-info-main{
    height: 300px;
    border: 1px solid #e0e0e0;
    padding: 0 5px;
  }
  .function-tree-node{
    width: 100%;
  }
  .form-script-intro{
     .form-script-title {
      height: 38px;
      line-height: 38px;
      border-bottom: solid 1px #e0e0e0;
      padding-left: 10px;
    }
    .form-script-name {
      color: #761086;
    }
  }
  ul {
    font-size: 10px;
    padding: 5px 0 5px 15px;
    margin: 0 10px;
  }
  ul li {
      line-height: 20px;
      list-style-type: disc;
  }
  ul span.form-script-key {
      margin: 0 3px;
      color: #708
  }
  ul span.form-script-field {
      padding: 0 5px;
      margin: 0 3px;
      display: inline-block;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      color: #fff;
      background-color: #178cdf
  }
}
</style>
