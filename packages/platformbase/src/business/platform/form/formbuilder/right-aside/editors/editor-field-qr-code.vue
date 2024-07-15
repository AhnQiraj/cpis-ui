<template>
  <div class="panel panel-default">
    <div class="panel-heading">二维码属性</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">内容</template>
        <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">编辑内容</el-button>
      </el-form-item>
      <el-form-item>
        <template slot="label">尺寸</template>
        <el-input v-model="fieldOptions.size" placeholder="宽高" type="text">
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">边距</template>
        <el-input v-model="fieldOptions.margin" placeholder="边距" type="text">
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">背景图</template>
        <el-input v-model="fieldOptions.bgSrc" placeholder="背景图地址" type="text" />
      </el-form-item>
      <el-form-item>
        <template slot="label">Logo</template>
        <el-input v-model="fieldOptions.logoSrc" placeholder="Logo地址" type="text" />
      </el-form-item>
      <el-form-item>
        <template slot="label">Logo大小</template>
        <el-input v-model="fieldOptions.logoScale" placeholder="宽高" type="text">
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="form-formula-dialog"
      width="60%"
      append-to-body
      center
      @close="closeDialog"
    >
      <div v-if="visible">
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="formula-info-main">
              <el-tabs v-model="activeVarName" class="formula-field-tab">
                <el-tab-pane label="业务对象" name="content">
                  <el-scrollbar
                    style="height: 460px;width:100%;"
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
          <el-col :span="16">
            <div class="formula-info-main">
              <el-tabs v-model="activeVarName" class="formula-field-tab">
                <el-tab-pane label="内容" name="content">
                  <el-form>
                    <el-form-item class="formula-head-title" prop="formula" required>
                      <textarea ref="formula" class="cm-s-default" />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeUtils from '@platform/utils/tree'
import EditorMixin from '../mixins/editor'
import { forEach, startsWith } from 'lodash'
const CodeMirror = (window.CodeMirror = require('codemirror/lib/codemirror'))
export default {
  mixins: [EditorMixin],
  data() {
    return {
      visible: false,
      title: '二维码生成内容',
      toolbars: [{ key: 'confirm' }, { key: 'cancel' }],
      activeVarName: 'content',
      editor: null,
      TABLE_SEPARATOR: '.',
      formula: null
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
        if (this.visible) {
          this.$nextTick(() => {
            this.initCodeMirror()
          })
        }
      },
      immediate: true
    },
    formula: {
      handler: function(val, oldVal) {
        this.fieldOptions.formula = val
        this.fieldItem.field_options = Object.assign({}, this.fieldOptions, { text: val.formula })
        this.fieldOptions.replacementRule = this.createReplacementRule(val.formula)
      },
      immediate: false
    }
  },
  methods: {
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
    handleConfirm() {
      this.formula = this.getValue()
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.visible = false
    },
    handleDefaultValue() {
      this.visible = true
    },
    clickBoNode(data) {
      this.insertField(data, false)
    },
    insertField: function(obj, b) {
      const wg = '_widget_' + obj.tableName + this.TABLE_SEPARATOR
      const start = this.editor.getCursor()
      this.editor.replaceSelection('​' + obj.name + '​')
      const end = this.editor.getCursor()
      b
        ? this._markFieldName(start, end, wg + obj.key, wg + obj.id)
        : this._markFieldValue(start, end, wg + obj.key)
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
    initCodeMirror() {
      this.editor = CodeMirror.fromTextArea(this.$refs.formula, {
        line: true,
        autoCloseTags: true,
        addModeClass: true,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'formula', // 选择对应代码编辑器的语言
        // eslint-disable-next-line no-control-regex
        specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
        theme: 'eclipse',
        extraKeys: {
          Backspace: function(cm) {
            const token = cm.getTokenAt(cm.getCursor())
            if (token.type === 'field') {
              // 删除字段 ||  "keyword" == token.type
              const line = cm.getCursor().line
              cm.setSelection(
                new CodeMirror.Pos(line, token.start),
                new CodeMirror.Pos(line, token.end)
              )
              cm.replaceSelection('', null, '+delete')
            } else {
              cm.execCommand('delCharBefore')
            }
          }
        }
      })
      this.editor.setSize('100%', '460px')
      if (this.fieldOptions.formula) {
        this.setValue(this.fieldOptions.formula.formula)
      }
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
        // eslint-disable-next-line no-useless-escape
        const f = b.split(/(\$[0-9a-zA-Z\._]+#)/g)
        forEach(f, (c) => {
          if (/^\$(_widget_|_formula_|ext)/.test(c)) {
            const label = startsWith(c, '$ext')
              ? '扩展字段'
              : _this.getBoLabel(c)
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
        c.entry
          ? _this._markFieldName(c.from, c.to, c.field, c.entry)
          : _this._markFieldValue(c.from, c.to, c.field)
      })
    },
    getValue() {
      function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
      }
      const formula = []
      const show = []
      const lineContent = this.editor.display.lineDiv.getElementsByClassName(
        'CodeMirror-line'
      )
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
        const g = f
          .join('')
          .replace(/\u200b/g, '')
          .replace(/\u00a0/g, ' ')
        formula.push(g)
        const t = l
          .join('')
          .replace(/\u200b/g, '')
          .replace(/\u00a0/g, ' ')
        show.push(t)
      }
      return {
        formula: formula.join('\n'),
        show: show.join('\n')
      }
    },
    getBoLabel(key) {
      for (let i = 0; i < this.boData.length; i++) {
        const bo = this.boData[i]
        if (
          '$_widget_' + bo.tableName + this.TABLE_SEPARATOR + bo.key + '#' ===
          key
        ) {
          return bo.name
        }
      }
      return ''
    },
    // 构建替换规则
    createReplacementRule(val) {
      if (!val) {return}
      const replacementRule = []
      const charArray = val.split(/(\$[0-9a-zA-Z\._]+#)/g)
      let reg = new RegExp(/(?<=^\$(_widget_|_formula_|ext)).*?(?=#)/)
      forEach(charArray, (c) => {
        if (reg.test(c)) {
          // 处理业务对象字段
          let dataKey = reg.exec(c)[0] || ''// 字段名
          dataKey = dataKey.replace(this.code + '.', '')// 把基础表名去掉,方便后面获取对应的字段值
          replacementRule.push({
            replaceStr: c,
            key: dataKey,
            dataSource: 'formData' // 在dynamic-form-field.vue绑定的数据集
          })
        }
      })
      return replacementRule
    }
  }
}
</script>
<style lang="scss" >
.CodeMirror-hints {
  z-index: 9999;
}
.form-formula-dialog {
  .el-dialog__body {
    padding-top: 10px;
    height: 525px;
  }
  .CodeMirror {
    height: auto;
  }
  .formula-head-title {
    border: 1px solid #e0e0e0;
    .el-form-item__label {
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
    color: #91a1b7;
    line-height: 18px;
    margin-bottom: 5px;
  }
  .formula-info-main {
    height: 520px;
    border: 1px solid #e0e0e0;
    padding: 0 5px;
  }
  .function-tree-node {
    width: 100%;
  }
  .formula-intro {
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
}
</style>
