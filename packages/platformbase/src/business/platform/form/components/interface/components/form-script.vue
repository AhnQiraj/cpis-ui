<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-script-dialog"
    top="2vh"
    width="80%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <div v-if="dialogVisible">
      <ibps-layout ref="layout">
        <div v-if="$utils.isNotEmpty(treeData)" slot="west" :style="{width:'200px',height:'450px'}">
          <el-scrollbar
            style="height:100%;width:100%;"
            wrap-class="ibps-scrollbar-wrapper"
          >
            <el-tree
              :data.sync="treeData"
              :props="{
                children: 'children',
                label: 'label'
              }"
              default-expand-all
              @node-click="clickBoNode"
            >
              <span slot-scope="{ node }" class="custom-tree-node">
                <el-tooltip effect="dark" :disabled="$utils.isEmpty(node.data.type_name)" :content="node.data.type_name">
                  <span>{{ node.label }}</span>
                </el-tooltip>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div>
          <el-form label-position="top" @submit.native.prevent>
            <el-form-item class="form-script-head-title">
              <label slot="label">绑定值途径</label>
              <codemirror v-if="dialogVisible" ref="formScript" v-model="formScript" :options="cmOption" />
            </el-form-item>
            <div class="form-script-foot">
              <ul>
                <li>请从左侧面板选择需要绑定到的控件</li>
                <li>【自定义组件】只配置到【自定义组件】的位置，如何获取数据，需要进行补充，如【自定义组件】中存在变量data保存该组件数据，则在配置后的途径后添加[<span class="red">.data</span>]</li>
                <li>绑定到当前表单位置的途径为：[<span class="red">this.$refs.formrender.$refs.dynamicForm</span>]</li>
                <li>可通过[<span class="red">this.getRefsField(fieldName)</span>]获取当前表单指定的控件信息，获取在线表单、详情表单、数据模板的数据，可通过拼接[<span class="red">.getFormData()</span>]获取</li>
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
      type: String
    },
    treeData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '绑定值途径'
    }
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      formScript: '',
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
        this.formScript = this.data || ''
      })
    },
    getEditor() {
      return this.$refs.formScript.cminstance
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
      const data = this.formScript
      this.$emit('callback', data)
      if (isColse) {
        this.closeDialog()
      } else {
        this.$message.closeAll()
        this.$message.success('设置表单脚本成功')
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    clickBoNode(data) {
      this.insertField(data, false)
    },
    insertField: function(obj, b) {
      this.getEditor().replaceSelection(obj.channel)
      this.getEditor().focus()
    },
    handleDefaultScript() {
      const val = 'Object.assign(JForm,{\n  //加载事件\n  onLoad:function(form){\n    \n  }\n});'
      this.formScript = val
      this.getEditor().focus()
    },
    handleScriptCommand(command) {
      let val = ''
      switch (command) {
        case 'onLoad':
          val = '\n //加载事件\n  onLoad:function(form){\n    \n  }\n'
          break
        case 'onLoadActions':
          val = '\n //表单加载按钮事件\n  onLoadActions:function(form,action,button,type){\n    \n  }\n'
          break
        case 'onValidate':
          val = '\n //表单提交校验\n  onValidate:function(form,callback){\n    callback(true) \n  }\n'
          break
        case 'beforeSubmit':
          val = '\n //表单按钮前置事件\n  beforeSubmit:function(form,action,postValue,callback){\n    callback(true) \n  }\n'
          break
        case 'afterSubmit':
          val = ' \n //表单按钮后置事件\n  afterSubmit:function(form,action,postValue,callback){\n    callback(true) \n  }\n'
          break
        case 'beforeSubButton':
          val = '\n //表单子表按钮前置事件\n  beforeSubButton:function(tableForm,action,position,params,callback){\n    callback(true) \n  }\n'
          break
        case 'afterSubButton':
          val = ' \n //表单子表按钮后置事件\n  afterSubButton:function(tableForm,action,position,params,callback){\n    callback(true) \n  }\n'
          break
        default:
          break
      }
      this.getEditor().replaceSelection(val)
      this.getEditor().focus()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-script-dialog{
  .el-dialog__body{
    padding-top:10px ;
  }
  .ibps-layout__body{
    width: 80%;
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
    .vue-codemirror{
      display: grid;
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
