<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="构造条件"
    width="70%"
    class="scriptDialog"
    append-to-body
    @click.native.stop="closeVarTree"
    @close="closeDialog"
  >
    <table>
      <tr>
        <td class="west">表单变量</td>
        <td>
          <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
          <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
          <bpmn-form-var />
        </td>
      </tr>
      <tr>
        <td class="west">脚本</td>
        <td>
          <codemirror v-model="scriptConfig.templateHtml" :options="cmOption" />
        </td>
      </tr>
      <tr>
        <td class="west">描述</td>
        <td>
          <el-input />
        </td>
      </tr>
    </table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <common-script
      :multiple="true"
      :visible="commonScriptVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => commonScriptVisible = visible"
    />
    <condition-script-select
      :visible="conditionScriptSelectVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => conditionScriptSelectVisible = visible"
    />
  </el-dialog>
</template>
<script>
import BpmnFormVar from '@platform/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
import commonScript from '@platform/business/platform/bpmn/setting/bpmn-setting/components/form-script/common-script/dialog'
import conditionScriptSelect from '@platform/business/platform/bpmn/setting/bpmn-setting/components/form-script/condition-script'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
export default {
  components: {
    BpmnFormVar,
    codemirror,
    commonScript,
    conditionScriptSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      commonScriptVisible: false, // 常用脚本
      conditionScriptSelectVisible: false, // 条件脚本
      varTree: false, // 表单变量
      dialogVisible: this.visible,
      closeOnClickModal: false,
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      defaultScriptConfig: {
        desc: '脚本',
        templateHtml: ''
      },
      scriptConfig: {},
      toolbars: [
        { key: 'save', label: '选择' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.scriptConfig = this.$utils.newData(this.defaultScriptConfig)
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.cmOption = null
    this.defaultScriptConfig = null
    this.scriptConfig = null
    this.toolbars = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleComfirm() {
      this.$emit('close', false)
    },
    closeDialog() {
      this.$emit('close', false)
    },
    closeVarTree() {
      this.varTree = false
    }
  }
}
</script>
<style lang="scss">
.scriptDialog{
  .west{
    width: 20vh;
    text-align: center;
  }
  table,table tr th, table tr td { border:1px solid #ccc; }
  table { width: 100%; min-height: 35px; line-height: 35px; border-collapse: collapse;}
}
</style>
