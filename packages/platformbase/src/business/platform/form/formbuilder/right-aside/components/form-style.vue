<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-style-dialog"
    top="2vh"
    width="80%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <div v-if="dialogVisible">
      <ibps-layout ref="layout">
        <el-form label-position="top" @submit.native.prevent>
          <el-form-item class="form-style-head-title">
            <label slot="label">表单样式</label>
            <codemirror v-if="dialogVisible" ref="formStyle" v-model="formStyle" :options="cmOption" />
          </el-form-item>
        </el-form>
      </ibps-layout>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/css/css.js'
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
      type: String
    },
    title: {
      type: String,
      default: '表单样式'
    }
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      formStyle: '',
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/css',
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
    }
  },
  beforeDestroy() {
    this.toolbars = null
    this.cmOption = null
  },
  methods: {
    getFormData() {
      this.$nextTick(() => {
        this.formStyle = this.data || ''
      })
    },
    getEditor() {
      return this.$refs.formStyle.cminstance
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
      const data = this.formStyle
      this.$emit('callback', data)
      if (isColse) {
        this.closeDialog()
      } else {
        this.$message.closeAll()
        this.$message.success('设置表单样式成功')
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss" >
.form-style-dialog{
  .el-dialog__body{
    padding-top:10px ;
  }
  .ibps-layout__body{
    width: 80%;
  }
  .CodeMirror{
    height: 400px ;
  }
  .form-style-head-title{
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
