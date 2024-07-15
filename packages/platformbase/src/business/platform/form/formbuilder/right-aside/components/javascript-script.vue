<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="javascript脚本"
    class="form-script-dialog"
    top="0"
    width="80%"
    append-to-body
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <ibps-layout ref="layout">
        <!-- <div slot="west" :style="{width:'200px'}">
          <el-scrollbar
            style="height:100%;width:100%;"
            wrap-class="ibps-scrollbar-wrapper"
          >
            <el-tree
              :data.sync="boTreeData"
              :props="{
                children: 'children',
                label: 'name'
              }"
              default-expand-all
              @node-click="clickBoNode"
            />
          </el-scrollbar>
        </div> -->
        <div>
          <el-form label-position="top" @submit.native.prevent>
            <el-form-item class="form-script-head-title">
              <label slot="label">{{ name }}=
                &nbsp;&nbsp;
                <el-button type="text" @click="handleDefaultScript">系统脚本</el-button>
                &nbsp;&nbsp;
                <el-dropdown v-if="showType==='button'" @command="handleScriptCommand">
                  <span class="el-dropdown-link">
                    <el-button type="text">插入链接控件按钮形式函数<i class="el-icon-arrow-down el-icon--right" /></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="beforeSubmit">链接按钮提交前置事件（beforeSubmit）</el-dropdown-item>
                    <el-dropdown-item command="afterSubmit">链接按钮提交后置事件（afterSubmit）</el-dropdown-item>
                    <el-dropdown-item command="beforeSubmit&AfterSubmit">链接按钮提交前后置事件（beforeSubmit&AfterSubmit）</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </label>
              <codemirror ref="dynamicScript" v-model="dynamicScript" :options="cmOption" />
            </el-form-item>
            <div class="form-script-foot">
              <ul>
                <li>支持<span class="red">javascript</span>的脚本.参考编写脚本API。</li>
                <li>
                  返回值是表单字段填写值，如：<br>
                  resolve(options.formData.models.changMing) <br>
                  resolve: 返回表单字段的值；<br>
                  options.formData.models：获取表单字段，后面拼接.XXX需要返回字段
                </li>
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
import TreeUtils from '@platform/utils/tree'
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
      type: [String, Object, Array]
    },
    boData: {
      type: Array
    },
    showType: {
      type: String,
      default: 'link'
    },
    name: {
      type: String,
      default: '动态脚本'
    }
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
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
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    boTreeData() {
      return TreeUtils.transformToTreeFormat(this.boData, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
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
          this.handleConfirm(true)
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
        this.$message.warning('请设置javascript脚本')
        this.getEditor().focus()
        return
      }
      this.$emit('callback', data)
      if (isColse) {
        this.closeDialog()
      } else {
        this.$message.success('设置javascript脚本')
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
      this.getEditor().replaceSelection(obj.key)
      this.getEditor().focus()
    },
    handleDefaultScript() {
      // todo
      this.dynamicScript = ''
      this.getEditor().focus()
    },
    handleScriptCommand(command) {
      let val = ''
      switch (command) {
        case 'beforeSubmit':
          val = '\n //链接按钮前置事件\n resolve([{\n event:"beforeSubmit",\n logic:`alert("按钮前置事件")` \n}])\n'
          break
        case 'afterSubmit':
          val = '\n //链接按钮后置事件\n resolve([{\n event:"afterSubmit",\n logic:`alert("按钮后置的事件")` \n}])\n'
          break
        case 'beforeSubmit&AfterSubmit':
          val = '\n //链接按钮前后置事件\n resolve([{\n event:"beforeSubmit",\n logic:`alert("按钮前置事件")` \n},{\n event:"afterSubmit",\n logic:`alert("按钮后置的事件")` \n}])\n'
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
