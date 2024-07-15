<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    width="50%"
    height="100%"
    top="15vh"
    append-to-body
    class="data-template-data-title-dialog"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form :model="formData" @submit.native.prevent>
      <el-form-item v-if="dialogVisible" prop="title" required>
        <el-row :gutter="10">
          <el-col :span="18">
            <textarea ref="title" v-model="formData.title" style="height:32px;" />
          </el-col>
          <el-col :span="6">
            <el-dropdown :hide-on-click="false" trigger="click" @command="insertField">
              <el-button type="primary">字段</el-button>
              <ibps-help content="选择的字段数据必须为当前分组共同拥有且相同。" />
              <el-dropdown-menu slot="dropdown">
                <el-scrollbar
                  tag="div"
                  wrap-class="el-select-dropdown__wrap"
                  view-class="el-select-dropdown__list"
                >
                  <el-dropdown-item
                    v-for="field in columns"
                    :key="field.id"
                    :command="field"
                  >
                    <i :class="field.icon" />{{ field.name }}
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { forEach, startsWith } from 'lodash'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
const CodeMirror = window.CodeMirror = require('codemirror/lib/codemirror')
require('@platform/business/platform/codemirror/mode/field/field-mode')
export default {
  props: {
    visible: Boolean,
    data: String,
    fields: { // 字段
      type: [Array, Object],
      default: () => []
    },
    title: { // 标题
      type: String,
      default: '设置头部信息'
    }
  },
  data() {
    return {
      dialogVisible: false,
      defaultForm: {},
      formData: {
        title: ''
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      editor: null
    }
  },
  computed: {
    columns() {
      if (this.$utils.isArray(this.fields)) {
        return this.fields
      } else {
        return []
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.formData))
  },
  beforeDestroy() {
    this.formData = null
    this.defaultForm = null
    this.editor = null
  },
  methods: {
    initCodeMirror() {
      if (this.$utils.isEmpty(this.$refs.title)) {
        return
      }
      this.editor = CodeMirror.fromTextArea(this.$refs.title, {
        line: true,
        autoCloseTags: true,
        height: 32,
        mode: 'field', // 选择对应代码编辑器的语言
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
      this.editor.setSize('100%', '32px')
      this.setValue(this.formData.title)
      this.editor.focus()
    },
    insertField: function(obj) {
      const wg = '_widget_'
      const b = false
      const start = this.editor.getCursor()
      this.editor.replaceSelection('​' + obj.name + '​')
      const end = this.editor.getCursor()
      b ? this._markFieldName(start, end, wg + obj.key, wg + obj.id) : this._markFieldValue(start, end, wg + obj.key)
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
    setValue(val) {
      if (this.$utils.isEmpty(val)) {
        this.editor.setValue('')
        return
      }
      const _this = this
      const c = []
      const d = []
      const valAry = val.split('\n')
      forEach(valAry, (b, a) => {
        let e = ''
        // eslint-disable-next-line no-useless-escape
        const f = b.split(new RegExp(FormOptions.t.COMMON_REG.VALIDATOR, 'g'))
        forEach(f, (c) => {
          if (/^\$(_widget_|_formula_|ext)/.test(c)) {
            const label = startsWith(c, '$ext') ? '扩展字段' : _this.getFieldLabel(c)
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
      const lineContent = this.editor.display.lineDiv.getElementsByClassName('CodeMirror-line')
      for (let i = 0; i < lineContent.length; i++) {
        const f = []
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
            f.push(span.textContent || span.innerText)
          }
        }
        const g = f.join('').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
        formula.push(g)
      }
      return formula.join('\n')
    },
    getFieldLabel(key) {
      for (let i = 0; i < this.fields.length; i++) {
        const n = this.fields[i]
        if (('$_widget_' + n.key + '#') === key) {
          return n.name
        }
      }
      return ''
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      const data = JSON.parse(JSON.stringify(this.formData))
      data.title = this.getValue()
      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        this.formData.title = JSON.parse(JSON.stringify(this.data))
      } else {
        this.formData = JSON.parse(JSON.stringify(this.defaultForm))
      }
      this.$nextTick(() => {
        this.initCodeMirror()
      })
    }
  }
}
</script>
<style lang="scss" >
.data-template-data-title-dialog{
  .CodeMirror{
    height: auto ;
    border: 1px solid #ccc;
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
