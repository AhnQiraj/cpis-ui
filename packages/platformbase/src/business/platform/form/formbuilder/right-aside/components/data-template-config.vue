<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-config-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      label-width="100px"
      label-suffix=":"
      :model="formData"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item v-if="showStructure" label="展示数据结构" prop="structure">
        <el-radio-group v-model="formData.structure" @change="changeStructure">
          <el-radio
            v-for="item in structureOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="唯一标识（主键）" prop="id">
        <el-select v-model="formData.id" style="width:100%" clearable>
          <template v-if="$utils.isNotEmpty(columns)">
            <el-option
              v-for="column in columns"
              :key="column.name"
              :value="column.name"
              :label="column.label"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.structure==='list'" label="显示值类型" prop="type">
        <el-radio-group v-model="formData.type" @change="changeType">
          <el-radio label="first">固定值</el-radio>
          <el-radio label="custom">自定义标题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示值" prop="text">
        <!--固定值--->
        <el-select
          v-if="formData.type==='first'"
          v-model="formData.text"
          style="width:100%"
          clearable
        >
          <template v-if="$utils.isNotEmpty(columns)">
            <el-option
              v-for="column in columns"
              :key="column.name"
              :value="column.name"
              :label="column.label"
            />
          </template>
        </el-select>
        <!--自定义标题--->
        <template v-else>
          <el-row v-if="dialogVisible">
            <el-col :span="20">
              <textarea ref="title" v-model="formData.text" style="height:32px;" />
            </el-col>
            <el-col :span="4">
              <el-dropdown :hide-on-click="false" trigger="click" @command="insertField">
                <el-button type="primary">字段</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-scrollbar
                    tag="div"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list"
                  >
                    <template v-if="$utils.isNotEmpty(columns)">
                      <el-dropdown-item
                        v-for="(field,index) in columns"
                        :key="field.name+index"
                        :command="field"
                      >
                        <i :class="'ibps-icon-'+field.type" />{{ field.label }}
                      </el-dropdown-item>
                    </template>
                  </el-scrollbar>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <template v-if="formData.structure ==='list'">
        <el-form-item>
          <template slot="label">是否分页:</template>
          <el-switch
            v-model="formData.pageable"
            @change="changeNeedPage"
          />
        </el-form-item>
        <el-form-item v-if="formData.pageable">
          <template slot="label">分页大小:</template>
          <el-select
            v-model="formData.page_size"
            placeholder="分页大小"
          >
            <el-option
              v-for="item in pageSizeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-if="formData.structure ==='tree'">
        <el-form-item label="父ID字段" prop="parentId">
          <el-select v-model="formData.parentId" style="width:100%" clearable>
            <template v-if="$utils.isNotEmpty(columns)">
              <el-option
                v-for="column in columns"
                :key="column.name"
                :value="column.name"
                :label="column.label"
              />
            </template>
          </el-select>
        </el-form-item>
        <template v-if="showRoot">
          <el-form-item label="虚拟根ID值" prop="rootId">
            <el-input v-model="formData.rootId" />
          </el-form-item>
          <el-form-item label="虚拟根显示值" prop="rootName">
            <el-input v-model="formData.rootName" />
          </el-form-item>
        </template>
        <el-form-item label="选值模式">
          <el-select v-model="formData.selectMode" style="width:100%;">
            <el-option value="leaf" label="叶节点" />
            <el-option value="any" label="任意节点" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示模式">
          <el-select v-model="formData.displayMode" style="width:100%;">
            <el-option value="name" label="节点名称" />
            <el-option value="path" label="完整路径" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.displayMode==='path'" label="分割符">
          <el-input v-model="formData.split" />
        </el-form-item>
      </template>
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
import ActionUtils from '@platform/utils/action'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { forEach, startsWith } from 'lodash'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
const CodeMirror = window.CodeMirror = require('codemirror/lib/codemirror')
require('@platform/business/platform/codemirror/mode/field/field-mode')
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '关联配置'
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showStructure: { // 是否显示数据结构
      type: Boolean,
      default: false
    },
    showRoot: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      structureOptions: [
        {
          value: 'list',
          label: '列表'
        },
        {
          value: 'tree',
          label: '树形'
        }
      ],
      pageSizeOptions: [10, 20, 50, 100],
      defaultFormData: {
        structure: 'list',
        id: '',
        type: 'first',
        text: ''
      },
      formData: {
        structure: 'list',
        id: '',
        type: 'first',
        text: ''
      },
      rules: {
        id: [{ required: true, message: this.$t('validate.required') }],
        type: [{ required: true, message: this.$t('validate.required') }],
        text: [{ required: true, message: this.$t('validate.required') }],
        parentId: [{ required: true, message: this.$t('validate.required') }]
      },
      editor: null
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
    this.formData = null
    this.defaultFormData = null
    this.editor = null
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
      if (this.formData.type === 'custom') {
        this.formData.text = this.getValue()
      }
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          this.$emit('callback', this.formData)
          this.closeDialog()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        const data = JSON.parse(JSON.stringify(this.data))
        if (this.$utils.isEmpty(data.type)) {
          data.type = 'first'
        }
        if (this.$utils.isEmpty(data.structure)) {
          data.structure = 'list'
        }
        this.formData = data
      } else {
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
      }
      if (this.formData.type === 'custom') {
        this.$nextTick(() => {
          this.initCodeMirror(this.formData.text)
        })
      }
      this.formValidate()
    },
    changeStructure(val) {
      if (val === 'tree') {
        this.formData = Object.assign({}, this.formData, {
          type: 'first',
          selectMode: 'any',
          displayMode: 'path',
          split: '/'
        })
      } else {
        this.formData = Object.assign({}, this.formData, {
          selectMode: '',
          displayMode: '',
          split: ''
        })
      }
    },
    changeType(value) {
      this.formData.text = ''
      if (value === 'custom') {
        this.initCodeMirror('')
      }
    },
    changeNeedPage(val) {
      if (val) {
        this.$set(this.formData, 'page_size', 20)
      }
    },
    // =======自定义字段=======
    initCodeMirror(val) {
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
      this.setValue(val)
      this.editor.focus()
    },
    insertField: function(obj) {
      const wg = '_widget_'
      const b = false
      const start = this.editor.getCursor()
      this.editor.replaceSelection('​' + obj.label + '​')
      const end = this.editor.getCursor()
      b ? this._markFieldName(start, end, wg + obj.name, wg + obj.id) : this._markFieldValue(start, end, wg + obj.name)
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
      for (let i = 0; i < this.columns.length; i++) {
        const n = this.columns[i]
        if (('$_widget_' + n.name + '#') === key) {
          return n.label
        }
      }
      return ''
    }
  }
}
</script>
<style lang="scss" >
.data-template-config-dialog{
  .el-dialog__body{
    padding-top:10px ;
  }
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
