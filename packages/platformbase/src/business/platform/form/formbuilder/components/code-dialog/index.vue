<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="ibps-code-dialog"
    top="2vh"
    width="50%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="Vue-静态页面" name="static">
        <codemirror ref="staticScript" v-model="staticScript" :options="cmOption" />
      </el-tab-pane>
      <el-tab-pane label="Vue-动态生成" name="dynamic">
        <codemirror ref="dynamicScript" v-model="dynamicScript" :options="cmOption" />
      </el-tab-pane>
    </el-tabs>
    <div class="code-generate-foot">
      <ul>
        <li>Vue-静态页面：通过获取配置的模板数据生成对应控件的静态页面代码，需要对对应的JS功能方法进行完善。</li>
        <li>Vue-动态生成：通过获取配置的模板数据当成参数传入组件内，从而使生成的代码调用组件时，使用传入的表单配置，而不是重新请求获取表单配置数据。只需要补充完善底部按钮组的事件。</li>
        <li>推荐：当表单业务功能逻辑较浅或者表单配置项较少时，推荐使用[Vue-静态页面]，页面加载相对会更快捷；当业务逻辑较多、表单配置项较多、代码补充完善工作量较大时，推荐使用[Vue-动态生成]</li>
      </ul>
    </div>
    <div slot="footer" class="el-dialog--center cobyOrderSn">
      <el-button class="copyBtn" icon="ibps-icon-copy" type="primary" data-clipboard-action="copy" :data-clipboard-text="getCode" @click="copy">复制代码</el-button>
      <el-button type="primary" icon="ibps-icon-export" @click="exportCode">导出代码</el-button>
      <el-button icon="ibps-icon-close" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
import ActionUtils from '@platform/utils/action'
import ClipboardJS from 'clipboard'
import generateCode from '@platform/business/platform/form/formbuilder/utils/generateCode'
import { generateFormCode } from '@platform/business/platform/form/formbuilder/utils/generateDynamicCode'
export default {
  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '生成代码'
    },
    data: {
      type: Object
    },
    fileKey: String
  },
  data() {
    const _this = this
    return {
      activeName: 'static',
      dialogVisible: false,
      staticScript: '',
      dynamicScript: '',
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/javascript',
        theme: 'eclipse',
        extraKeys: {
          'Ctrl-S': function(e) {
            _this.handleConfirm(false)
          }
        }
      }
    }
  },
  computed: {
    getCode() {
      if (this.activeName === 'static') {
        return this.staticScript
      } else {
        return this.dynamicScript
      }
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
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'static') {
        this.$nextTick(() => {
          this.$refs.staticScript.codemirror.refresh()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.dynamicScript.codemirror.refresh()
        })
      }
    },
    exportCode() {
      if (this.activeName === 'static') {
        ActionUtils.exportFile(this.staticScript, this.fileKey + '.vue')
      } else {
        ActionUtils.exportFile(this.dynamicScript, this.fileKey + '.vue')
      }
    },
    copy() {
      const _this = this
      const clipboard = new ClipboardJS('.copyBtn')
      clipboard.on('success', function() {
        _this.$message({
          message: '复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', function() {
        _this.$message({
          message: '复制失败',
          type: 'error'
        })
        clipboard.destroy()
      })
    },
    getFormData() {
      const staticScript = generateCode(this.data)
      const dynamicScript = generateFormCode(this.data)
      this.$nextTick(() => {
        this.staticScript = staticScript || ''
        this.dynamicScript = dynamicScript || ''
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss" >
.ibps-code-dialog{
  .el-dialog__footer{
    border-top: 0;
  }
  .el-dialog__body{
    padding-top:10px ;
      height:  calc(90vh - 120px) !important;
  }
  .CodeMirror{
    height: 460px ;
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
