<template>
  <el-row class="combination-field">
    <el-col :span="18">
      <textarea v-show="false" ref="textarea" v-model="content" style="height:32px;" />
    </el-col>
    <el-col :span="6">
      <el-dropdown :hide-on-click="false" trigger="click" @command="insertField">
        <el-button style="margin-left:5px;" size="small" type="primary">字段</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar
            tag="div"
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list"
          >
            <el-dropdown-item
              v-for="(field,index) in fields"
              :key="field[valueKey]+index"
              :command="field"
            >
              <i :class="'ibps-icon-'+field.type" />{{ field[labelKey] }}
            </el-dropdown-item>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import { forEach, startsWith } from 'lodash'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
const CodeMirror = window.CodeMirror = require('codemirror/lib/codemirror')
require('@platform/business/platform/codemirror/mode/field/field-mode')
import FormOptions from '@platform/business/platform/form/constants/formOptions'
export default {
  props: {
    value: {
      type: String
    },
    fields: {
      type: Array
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    pkKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      cminstance: null,
      content: ''
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.content = val
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initCodeMirror()
  },
  destroy() {
    const element = this.cminstance.doc.cm.getWrapperElement()
    element && element.remove && element.remove()
    this.cminstance = null
  },
  methods: {
    initCodeMirror() {
      if (this.$utils.isEmpty(this.$refs.textarea)) {
        return
      }
      this.cminstance = CodeMirror.fromTextArea(this.$refs.textarea, {
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
      this.cminstance.setSize('100%', '32px')
      this.setValue(this.content)
      this.cminstance.on('change', cm => {
        setTimeout(() => {
          this.content = this.getValue()
          if (this.$emit) {
            this.$emit('input', this.content)
          }
        }, 500)
      })
    },
    insertField(obj) {
      const value = obj[this.valueKey] || ''
      const pkVal = obj[this.pkKey] || ''
      const label = obj[this.labelKey] || ''
      const wg = '_widget_'
      const b = false
      const start = this.cminstance.getCursor()
      this.cminstance.replaceSelection('​' + label + '​')
      const end = this.cminstance.getCursor()
      b ? this._markFieldName(start, end, wg + value, wg + pkVal) : this._markFieldValue(start, end, wg + value)
    },
    _markFieldName(start, end, key, id) {
      this.cminstance.markText(start, end, {
        className: 'cm-field-name',
        attributes: {
          'data-field': key,
          'data-entry': id
        }
      })
    },
    _markFieldValue(start, end, key) {
      this.cminstance.markText(start, end, {
        className: 'cm-field-value',
        attributes: {
          'data-field': key
        }
      })
    },
    setValue(val) {
      if (this.$utils.isEmpty(val)) {
        this.cminstance.setValue('')
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
      this.cminstance.setValue(c.join('\n'))
      forEach(d, (c) => {
        c.entry ? _this._markFieldName(c.from, c.to, c.field, c.entry) : _this._markFieldValue(c.from, c.to, c.field)
      })
    },
    getValue() {
      function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
      }
      const formula = []
      const lineContent = this.cminstance.display.lineDiv.getElementsByClassName('CodeMirror-line')
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
        const field = this.fields[i]
        const label = field[this.labelKey] || ''
        const value = field[this.valueKey] || ''
        if (('$_widget_' + value + '#') === key) {
          return label
        }
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.combination-field{
.combination-filed-block{
  .CodeMirror{
    display: block;
  }
}
  .CodeMirror{
    height: auto ;
    border: 1px solid #C0C4CC;
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
      &.cm-field-name {
          background: #5cb85c
      }
      &.cm-field-value {
          background: #EBF5FF;
          color: #008DCD;
      }
  }
  .cm-error {
      color: red
  }
  .cm-invalidchar {
      color: red
  }
}
</style>
