<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-formula-dialog"
    top="0"
    width="80%"
    append-to-body
    @opened="opendDialog"
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <el-form v-if="verify" :ref="formName" :model="form" label-width="120px" @submit.native.prevent>
        <el-form-item label="校验错误提示:" prop="message" required :rules=" [{ required: true, message: $t('validate.required') }]">
          <el-input ref="message" v-model="form.message" />
        </el-form-item>
      </el-form>
      <el-form label-position="top">
        <el-form-item :label="label+'='" class="formula-head-title" prop="formula" required>
          <textarea ref="formula" v-model="form.formula" class="cm-s-default" style="height:150px;" />
        </el-form-item>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="formula-info-label">变量</div>
          <div class="formula-info-main">
            <el-tabs v-model="activeVarName" class="formula-field-tab">
              <el-tab-pane label="业务对象" name="bo">
                <el-scrollbar
                  style="height: 240px;width:100%;"
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
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="formula-info-label">函数</div>
          <div class="formula-info-main">
            <div style="padding-top: 10px;">
              <el-input
                v-model="filterFunction"
                placeholder="搜索函数"
              />
            </div>
            <el-scrollbar
              style="height: 240px;width:100%;"
              wrap-class="ibps-scrollbar-wrapper"
            >
              <el-tree
                ref="functionTree"
                :data="functionData"
                :filter-node-method="filterNode"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
                class="filter-tree"
                @node-click="clickFunctionNode"
              >
                <span slot-scope="scope" class="function-tree-node" @mouseenter="handleFunctionHover(scope)">
                  <span>{{ scope.data.name }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="formula-info-name">帮助</div>
          <div class="formula-info-main">
            <div v-if="hasTip" class="formula-intro">
              <div class="formula-title">{{ formulaIntro.name }}</div>
              <ul class="intro-wrapper">
                <li class="intro">
                  {{ formulaIntro.intro }}
                </li>
                <li class="usage">用法：{{ formulaIntro.usage }}</li>
                <li class="example">示例：{{ formulaIntro.example }}</li></ul>
            </div>
            <ul v-else>
              <li>支持<span class="red">英文</span>运算符模式下的<a class="x-c-key">基础运算</a>(+-*/等)及部分<a href="#" class="x-c-key">高级函数</a>
              </li>
              <li>
                请从左侧面板选择字段名和函数，或输入函数
              </li>
              <li>
                如果需要加入字符串，则需使用引号('',"")包起来，公式计算之间需使用'+'拼接
              </li>
              <li>
                日期格式，<span class="red">新增时候</span>是按前端原样字符串展示，<span class="red">编辑时候</span>后端返回是日期格式的字符串数据，需要转换和判断处理。
              </li>
              <li>公式编辑样式举例:<span class="formula-key">SUM</span>(<span class="formula-field">基本工资</span>,<span class="formula-field">加班工资</span>)</li>
            </ul>
          </div>
        </el-col>
      </el-row>
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
import PopupManager from '@platform/utils/popup'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { forEach, startsWith } from 'lodash'
import functionData from '../../constants/formula'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css'
// lib
const CodeMirror = window.CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/hint/show-hint')
require('@platform/business/platform/codemirror/addon/hint/formula-hint')
require('@platform/business/platform/codemirror/mode/formula/formula-mode')
const keywords = []
functionData.forEach((d) => {
  d.children.forEach(c => {
    keywords.push(c.name)
  })
})
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: [String, Number, Object, Array]
    },
    boData: {
      type: Array
    },
    title: {
      type: String,
      default: '公式编辑'
    },
    label: {
      type: String,
      default: '公式'
    },
    verify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      formName: 'formulaVerify',
      form: {
        message: '',
        formula: ''
      },
      editor: null,
      activeVarName: 'bo',
      filterFunction: '',
      functionData: functionData,
      hasTip: false,
      formulaIntro: '',
      TABLE_SEPARATOR: '.',
      toolbars: []
    }
  },
  computed: {
    boTreeData() {
      return TreeUtils.transformToTreeFormat(this.boData, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    },
    tableNameMap() {
      const map = {}
      this.boData.forEach((d) => {
        if (d.attrType === 'table' || d.attrType === 'subTable') {
          const tableNames = d.name.split(':')
          map[d.key] = tableNames[0]
        }
      })
      return map
    },
    fieldMap() {
      const map = {}
      this.boData.forEach((d) => {
        if (!(d.attrType === 'table' || d.attrType === 'subTable')) {
          map['$_widget_' + d.tableName + this.TABLE_SEPARATOR + d.key + '#'] = d
        }
      })
      return map
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.$nextTick(() => {
            this.initCodeMirror()
            setTimeout(() => {
              this.formValidate()
            }, 50)
          })
        }
      },
      immediate: true
    },
    filterFunction(val) {
      this.$refs.functionTree.filter(val)
    },
    verify: {
      handler(val) {
        if (val) {
          this.toolbars = [
            { key: 'confirm' },
            { key: 'cancel' }
          ]
        } else {
          this.toolbars = [
            { key: 'confirm' },
            { key: 'clean', type: 'info', icon: 'ibps-icon-clean', label: '重置' },
            { key: 'cancel' }
          ]
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.editor = null
    this.form = null
    this.functionData = null
    this.toolbars = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'clean':
          this.handleClean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      const data = this.getValue()
      if (this.$utils.isEmpty(data.formula)) {
        this.$message.closeAll()
        this.$message.warning('请设置公式')
        this.editor.focus()
        return
      }
      let rtn = null
      if (this.verify) {
        if (this.$utils.isEmpty(this.form.message)) {
          this.$message.closeAll()
          this.$message.warning('请设置提示文字')
          this.$refs.message.focus()
          return
        }
        data.msg = this.form.message
        rtn = data
      } else {
        rtn = data.formula
      }
      this.$emit('callback', rtn)
      this.closeDialog()
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName] ? this.$refs[this.formName].validate(() => {}) : null
      })
    },
    handleClean() {
      let rtn = null
      if (!this.verify) {
        rtn = ''
      }
      this.$emit('callback', rtn)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    clickBoNode(data) {
      this.insertField(data, false)
    },
    handleFunctionHover({ data }) {
      if (data.children) {
        return
      }
      this.hasTip = true
      this.formulaIntro = data
    },
    filterNode(value, data) {
      if (!value) {return true}
      return data.name.indexOf(value.toUpperCase()) !== -1
    },
    clickFunctionNode(data) {
      if (data.children) {return}
      this._markKeyWord(data.name)
    },
    initCodeMirror() {
      CodeMirror.keywords = keywords
      this.editor = CodeMirror.fromTextArea(this.$refs.formula, {
        line: true,
        autoCloseTags: true,
        height: 150,
        mode: 'formula', // 选择对应代码编辑器的语言
        // eslint-disable-next-line no-control-regex
        specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
        theme: 'eclipse',
        extraKeys: {
          Backspace: function(cm) {
            const token = cm.getTokenAt(cm.getCursor())
            if (token.type === 'field') { // 删除字段 ||  "keyword" == token.type
              const line = cm.getCursor().line
              cm.setSelection(new CodeMirror.Pos(line, token.start), new CodeMirror.Pos(line, token.end))
              cm.replaceSelection('', null, '+delete')
            } else {
              cm.execCommand('delCharBefore')
            }
          }
        }
      })
      this.editor.setSize('100%', '150px')
      this.editor.on('cursorActivity', function(editor, b) {
        CodeMirror.showHint(editor, CodeMirror.formulaHint, {
          completeSingle: false
        })
      })
      this.form.message = ''
      if (this.verify && this.data) {
        this.setValue(this.data.formula)
        this.form.message = this.data.msg
      } else {
        this.setValue(this.data)
      }
    },
    opendDialog() {
      this.fixZIndex()
    },
    fixZIndex() {
      const zindex = PopupManager.getZIndex()
      const cssStyle = `.CodeMirror-hints { z-index: ${zindex}  }`
      this.$utils.createStyles(cssStyle)
    },
    insertField: function(bo, b) {
      const wg = '_widget_' + bo.tableName + this.TABLE_SEPARATOR
      const key = bo.key
      const label = this.getBoLabel('$' + wg + key + '#')
      const start = this.editor.getCursor()
      this.editor.replaceSelection('​' + label + '​')
      const end = this.editor.getCursor()
      b ? this._markFieldName(start, end, wg + key, wg + bo.id) : this._markFieldValue(start, end, wg + key)
      this.editor.focus()
    },
    _markFieldValue(start, end, key) {
      this.editor.markText(start, end, {
        className: 'cm-field-value',
        attributes: {
          'data-field': key
        }
      })
    },
    _markFieldName(start, end, key, id) {
      this.editor.markText(start, end, {
        className: 'cm-field-name',
        attributes: {
          'data-field': key,
          'data-entry': id
        }
      })
    },
    _markKeyWord(key) {
      this.editor.focus()
      const cursor = this.editor.getCursor()
      this.editor.replaceSelection(key + '()')
      this.editor.setCursor({
        line: cursor.line,
        ch: cursor.ch + key.length + 1
      })
    },
    setValue(val) {
      if (!val) {
        return
      }
      const _this = this
      const c = []
      const d = []
      const valAry = val.split('\n')
      forEach(valAry, (b, a) => {
        let e = ''
        const f = b.split(new RegExp(FormOptions.t.COMMON_REG.VALIDATOR, 'g'))
        forEach(f, (c) => {
          if (/^\$(_widget_|_formula_|ext)/.test(c)) {
            const label = startsWith(c, '$ext') ? '扩展字段' : _this.getBoLabel(c)
            const g = c.replace('$', '').split('#')
            const field = g[0]
            const entry = g[1]
            const from = CodeMirror.Pos(a, e.length)
            e += '​' + label + '​'
            const to = CodeMirror.Pos(a, e.length)
            d.push({
              from: from,
              to: to,
              field: field,
              entry: entry
            })
          } else {
            e += c
          }
        })
        c.push(e)
      })
      this.editor.setValue(c.join('\n'))
      forEach(d, (c) => {
        c.entry ? _this._markFieldName(c.from, c.to, c.field, c.entry) : _this._markFieldValue(c.from, c.to, c.field)
      })
    },
    getValue: function() {
      function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
      }
      const formula = []
      const show = []
      const lineContent = this.editor.display.lineDiv.getElementsByClassName('CodeMirror-line')
      for (let i = 0; i < lineContent.length; i++) {
        const f = []
        const l = []
        const content = lineContent[i]
        const children = content.children[0].children
        for (let j = 0; j < children.length; j++) {
          const span = children[j]
          const field = span.getAttribute('data-field')
          const entry = span.getAttribute('data-entry')
          if (hasClass(span, 'cm-field-name')) {
            f.push('$' + field + '#' + entry)
          } else if (hasClass(span, 'cm-field-value')) {
            f.push('$' + field + '#')
          } else {
            if (hasClass(span, 'cm-deprecate')) {
              continue
            }
            f.push(span.textContent || span.innerText)
          }
          l.push(span.textContent || span.innerText)
        }
        const g = f.join('').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
        formula.push(g)
        const t = l.join('').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
        show.push(t)
      }
      return {
        formula: formula.join('\n'),
        show: show.join('\n')
      }
    },
    getBoLabel(key) {
      const bo = this.fieldMap[key]
      if (bo) {
        const tablename = this.tableNameMap[bo.tableName]
        return tablename + this.TABLE_SEPARATOR + bo.name
      }
      return ''
    }
  }
}
</script>
<style lang="scss" >
.form-formula-dialog{
  .el-dialog__body{
    padding-top:10px ;
  }
  .CodeMirror{
    height: auto ;
  }
  .formula-head-title{
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
  .formula-info-name {
    font-size: 12px;
    color: #91A1B7;
    line-height: 18px;
    margin-bottom: 5px;
  }
  .formula-info-main{
    height: 300px;
    border: 1px solid #e0e0e0;
    padding: 0 5px;
  }
  .function-tree-node{
    width: 100%;
  }
  .formula-intro{
     .formula-title {
      height: 38px;
      line-height: 38px;
      border-bottom: solid 1px #e0e0e0;
      padding-left: 10px;
    }
    .formula-name {
      color: #761086;
    }
  }
  .red{
    color: #F56C6C;
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
  ul span.formula-key {
      margin: 0 3px;
      color: #708
  }
  ul span.formula-field {
      padding: 0 5px;
      margin: 0 3px;
      display: inline-block;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      color: #fff;
      background-color: #178cdf
  }
  .cm-tab {
      display: inline-block;
      text-decoration: inherit
  }
  .CodeMirror-ruler {
      border-left: 1px solid #ccc;
      position: absolute
  }
  .cm-header {
      color: #00f
  }
  .cm-quote {
      color: #090
  }
  .cm-negative {
      color: #d44
  }
  .cm-positive {
      color: #292
  }
  .cm-header,.cm-strong {
      font-weight: 700
  }
  .cm-em {
      font-style: italic
  }
  .cm-link {
      text-decoration: underline
  }
  .cm-strikethrough {
      text-decoration: line-through
  }
  .cm-keyword {
        color: #781287;
  }
  .cm-atom {
      color: #219
  }
  .cm-number {
      color: #164
  }
  .cm-def {
      color: #00f
  }
  .cm-variable-2 {
      color: #05a
  }
  .cm-variable-3 {
      color: #085
  }
  .cm-comment {
      color: #a50
  }
  .cm-string {
      color: #a11
  }
  .cm-string-2 {
      color: #f50
  }
  .cm-meta {
      color: #555
  }
  .cm-qualifier {
      color: #555
  }
  .cm-builtin {
      color: #333
  }
  .cm-bracket {
      color: #997
  }
  .cm-tag {
      color: #170
  }
  .cm-attribute {
      color: #00c
  }
  .cm-hr {
      color: #999
  }
  .cm-link {
      color: #00c
  }
  .cm-field {
      display: inline-block;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      padding: 0 5px;
      margin: 1px 1px;
      color: #fff;
      font-size: 14px;
  }
  .cm-field.cm-field-name {
      background: #5cb85c
  }
  .cm-field.cm-field-value {
      background: #EBF5FF;
      color: #008DCD;
  }
  .cm-error {
      color: red
  }
  .cm-invalidchar {
      color: red
  }
}
</style>
