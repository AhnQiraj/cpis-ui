<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    fullscreen
    append-to-body
    class="ibps-form-rules-dialog"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form :ref="formName" :model="ruleData" :rules="formRules" label-width="100px" @submit.native.prevent>
      <el-form-item label="规则名称" prop="label">
        <el-input v-model="ruleData.label" placeholder="规则名称" />
      </el-form-item>
      <el-form-item prop="priority">
        <template slot="label">优先级<help-tip prop="priority" /></template>
        <ibps-number
          v-model="ruleData.priority"
          :precision="0"
          :keep-decimals="true"
          :is-rounding="false"
          :min="1"
          :max="100"
        />
      </el-form-item>
    </el-form>
    <div class="form-rules">
      <div class="builder">
        <fieldset class="scheduler-border">
          <legend class="rule-legend">
            <span style="margin-right:8px;font-size:18px;">规则设置</span>
          </legend>
          <ibps-rule-setting
            ref="ruleBuilder"
            v-model="ruleData.rule"
            :fields="fieldsRejectTab"
            :conditions="conditions"
          />
          <div class="content-wrapper">
            <div class="content">
              <span>满足规则后,触发以下配置：</span>
            </div>
            <div class="content">
              <span> <el-badge value="1" type="primary" style="top: 0.3em;" /> 只</span>
              <el-select v-model="ruleData.display" placeholder="请选择" class="select_display">
                <el-option
                  v-for="item in displayOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
              <el-select v-model="ruleData.fields" multiple value-key="id" placeholder="请选择" class="select_style ibps-pr-5">
                <el-option
                  v-for="item in controls"
                  :key="item.id"
                  :label="item.label"
                  :value="item"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
              <span>字段</span>
            </div>
            <div class="content">
              <span> <el-badge value="2" type="success" style="top: 0.3em;" /> 字段</span>
              <el-select v-model="ruleData.bg_controls" multiple value-key="id" placeholder="请选择" class="select_style ibps-pr-5 ibps-pl-5">
                <el-option
                  v-for="item in controls"
                  :key="item.id"
                  :label="item.label"
                  :value="item"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
              <span>的背景颜色为：</span>
              <el-color-picker v-model="ruleData.background_color" show-alpha />
            </div>
            <div class="content">
              <span><el-badge value="3" type="warning" style="top: 0.3em;" />字段</span>
              <el-select v-model="ruleData.color_controls" multiple value-key="id" placeholder="请选择" class="select_style ibps-pr-5 ibps-pl-5">
                <el-option
                  v-for="item in controlsRejectTab"
                  :key="item.id"
                  :label="item.label"
                  :value="item"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
              <span>的颜色为：</span>
              <el-color-picker v-model="ruleData.color" show-alpha />
            </div>
          </div>
        </fieldset>
      </div>
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
import Ids from 'ids'
import IbpsRuleSetting from '@platform/business/platform/form/formbuilder/right-aside/components/form-rule-setting'
import ActionUtils from '@platform/utils/action'
import IbpsNumber from '@platform/components/ibps-number'
import { otherFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
export default {
  components: {
    IbpsRuleSetting,
    IbpsNumber
  },
  props: {
    bindField: {
      type: Object
    },
    // controls: {
    //   type: Array
    // },
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: {
      type: Object
    },
    boData: {
      type: Array
    }
  },
  data() {
    return {
      formName: 'ruleForm',
      controls: [],
      formRules: {
        label: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        priority: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      },
      displayOptions: [
        {
          key: 'show',
          label: '显示'
        },
        {
          key: 'hidden',
          label: '隐藏'
        }
      ],
      conditions: {
        'and': '且',
        'or': '或'
      },
      dialogVisible: this.visible,
      toolbars: [
        { key: 'confirm', label: '确定' },
        { key: 'clean' },
        { key: 'cancel' }
      ],
      ruleData: {
        rule: {
          type: 'group',
          rules: []
        },
        display: 'show'
      },
      msg: {
        rule: [],
        controls: []
      },
      rejects: ['dataTemplate', 'detailForm', 'onlineForm', 'table', 'subTable']
    }
  },
  computed: {
    // 过滤子表
    controlsRejectTab() {
      const fields = []
      const rejects = ['table', 'subTable']
      if (this.$utils.isEmpty(this.controls)) {return fields}
      const _controls = JSON.parse(JSON.stringify(this.controls))
      for (let i = 0; i < _controls.length; i++) {
        if (rejects.includes(_controls[i].field_type)) {continue}
        fields.push(_controls[i])// 取得value
      }
      return fields
    },
    // 规则设置 - 过滤其他的字段、子表字段、组合控件(组合字段除外)
    fieldsRejectTab() {
      const fields = []
      if (this.$utils.isEmpty(this.bindField)) {return fields}
      const _bindField = JSON.parse(JSON.stringify(this.bindField))
      for (const key in _bindField) {
        if (_bindField.hasOwnProperty(key) === true) {
          if (this.rejects.includes(_bindField[key].field_type) ||
          otherFieldTypes.includes(_bindField[key].field_type)) {continue}
          fields.push(_bindField[key])// 取得value
        }
      }
      return fields
    },
    fields() {
      const fields = []
      if (this.$utils.isEmpty(this.bindField)) {return fields}
      const _bindField = JSON.parse(JSON.stringify(this.bindField))
      for (const key in _bindField) {
        if (_bindField.hasOwnProperty(key) === true) {
          fields.push(_bindField[key])// 取得value
        }
      }
      return fields
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
        if (this.$utils.isEmpty(val)) {return}
        this.ruleData = val
      },
      immediate: true
    },
    bindField: {
      handler: function(val, oldVal) {
        this.controls = this.fields
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.formRules = null
    this.displayOptions = null
    this.conditions = null
    this.toolbars = null
    this.ruleData = null
  },
  methods: {
    addRule() {
      this.rules.push({
        rule: {
          type: 'group',
          rules: []
        },
        display: 'show'
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'clean':
          this.initRuleData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.initRuleData()
    },
    // 初始化
    initRuleData() {
      this.ruleData = {
        rule: {
          type: 'group',
          rules: []
        },
        display: 'show'
      }
      this.$refs[this.formName].resetFields()
    },
    // 验证规则设置是否存在未填选项
    validateRuleSettings(rules) {
      for (let i = 0; i < rules.length; i++) {
        if (this.$utils.isNotEmpty(rules[i].rules)) {
          const flag = this.validateRuleSettings(rules[i].rules)
          if (flag) {return true}
        } else if (this.$utils.isEmpty(rules[i].value)) {
          return true
        }
      }
      return false
    },
    handleConfirm() {
      if (this.$utils.isNotEmpty(this.ruleData) && this.$utils.isNotEmpty(this.ruleData.rule)) {
        const flag = this.validateRuleSettings(this.ruleData.rule.rules)
        if (flag) {
          this.$message.closeAll()
          this.$message({
            message: `规则设置存在未填的选项,请检查。`,
            type: 'warning'
          })
          return
        }
      }
      if (this.$utils.isEmpty(this.ruleData) ||
        ((this.$utils.isEmpty(this.ruleData.rule) || this.$utils.isEmpty(this.ruleData.rule.rules)) &&
          this.$utils.isEmpty(this.ruleData.fields))) {
        this.$message({
          message: `规则设置规则条件以及显示/隐藏的字段配置都为空，至少其中一项进行配置，请重新对其进行配置。`,
          type: 'warning'
        })
        return
      }
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          if (this.$utils.isEmpty(this.ruleData.id)) {
            this.ruleData.id = new Ids([32, 36, 1]).next()
          }
          const data = JSON.parse(JSON.stringify(this.ruleData))
          this.closeDialog()
          this.$emit('callback', data)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 重新赋值
    setRule(rules) {
      if (this.$utils.isEmpty(rules)) {return rules}
      for (let i = rules.length - 1; i >= 0; i--) {
        if (this.$utils.isArray(rules[i].rules)) {
          rules[i].rules = this.setRule(rules[i].rules)
          if (this.$utils.isEmpty(rules[i].rules)) {
            rules.splice(i, 1)
          }
          continue
        }
        const temp = rules[i].field
        const _field = this.bindField[temp.name]
        if (this.$utils.isEmpty(_field)) {
          rules.splice(i, 1)
          const _msg = `[${temp.label}]缺失`
          if (this.$utils.isEmpty(this.msg.rule)) {
            this.msg.rule = []
            this.msg.rule.push(_msg)
          } else {
            if (!this.msg.rule.includes(_msg)) {
              this.msg.rule.push(_msg)
            }
          }
        } else {
          if (temp.field_type !== _field.field_type) {
            rules.splice(i, 1)
            const _msg = `[${temp.label}]被更换`
            if (this.$utils.isEmpty(this.msg.rule)) {
              this.msg.rule = []
              this.msg.rule.push(_msg)
            } else {
              if (!this.msg.rule.includes(_msg)) {
                this.msg.rule.push(_msg)
              }
            }
          }
        }
      }
      return rules
    },
    // 根据传入的字段控件数据对数据ruleData.rule进行过滤
    filterRule() {
      if (this.$utils.isEmpty(this.ruleData) || this.$utils.isEmpty(this.ruleData.rule)) {return}
      const _rules = this.ruleData.rule.rules
      this.ruleData.rule.rules = this.setRule(_rules)
    },
    // 根据传入的name对数据进行操作
    setDataByName(name, _controls) {
      if (this.$utils.isNotEmpty(this.ruleData[name])) {
        for (let i = this.ruleData[name].length - 1; i >= 0; i--) {
          const temp = this.ruleData[name][i]
          if (this.$utils.isEmpty(_controls[temp.name])) {
            const _msg = `[${temp.label}]缺失`
            if (this.$utils.isEmpty(this.msg.controls)) {
              this.msg.controls = []
              this.msg.controls.push(_msg)
            } else {
              if (!this.msg.controls.includes(_msg)) {
                this.msg.controls.push(_msg)
              }
            }
            this.ruleData[name].splice(i, 1)
          } else {
            this.$set(this.ruleData[name], i, _controls[temp.name])
          }
        }
      }
    },
    // 根据传入的控件数据对数据过滤
    filterControl() {
      if (this.$utils.isEmpty(this.controls)) {
        this.ruleData.fields = null
        this.ruleData.bg_controls = null
        this.ruleData.color_controls = null
        return
      }
      // 将controls赋值给_controls对象，对象属性为id
      const _controls = {}
      for (let i = 0; i < this.controls.length; i++) {
        if (this.$utils.isEmpty(this.controls[i].name)) {continue}
        _controls[this.controls[i].name] = this.controls[i]
      }
      // 1.循环ruleData.fields
      this.setDataByName('fields', _controls)
      // 2.循环ruleData.bg_controls
      this.setDataByName('bg_controls', _controls)
      // 3.循环ruleData.color_controls
      this.setDataByName('color_controls', _controls)
    },
    getFormData() {
      // 将父组件传递的数据赋值
      if (this.$utils.isEmpty(this.ruleData)) {return}
      this.msg = {
        rule: [],
        controls: []
      }
      // 1.过滤掉已经不存在的控件
      this.filterControl()
      // 2.过滤掉规则设置中已经不存在或修改过的控件
      this.filterRule()
      // 3.判断是否有过滤掉数据，有则提示
      let _msg = ''
      if (this.$utils.isEmpty(this.msg)) {return}
      if (this.$utils.isNotEmpty(this.msg.rule)) {
        _msg = `规则设置中字段控件${this.msg.rule.join(',')}`
      }
      if (this.$utils.isNotEmpty(this.msg.controls)) {
        const _controlsMsg = `满足规则后设置改变颜色、背景颜色的控件${this.msg.controls.join(',')}`
        if (this.$utils.isNotEmpty(_msg)) {
          _msg += ';' + _controlsMsg
        } else {
          _msg = _controlsMsg
        }
      }
      if (this.$utils.isNotEmpty(_msg)) {
        this.$message({
          message: _msg + '。相关的配置已删除，请重新配置并进行保存！',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.ibps-form-rules-dialog{
  .el-dialog{
    .el-dialog__body{
      flex: 1;
    }
  }
  .form-rules{
    // border: 1px solid #ddd;
    // padding: 10px 0;
    .scheduler-border {
      border: 1px solid silver!important;
      padding: 0 0.4em 1.4em 0.4em !important;
      margin-bottom: 10px;
      .rule-legend{
        border-bottom: 0px;
        margin-bottom: 10px;
        padding: 0 10px;
        display: flex;
        align-items: center;
      }
      .content-wrapper{
        margin: 20px 10px 0;
        padding: 10px 10px 6px;
        border: 1px solid #DCC896;
        background: #F8F8F8;
        border-radius: 5px;
        .content{
          display: flex;
          align-items: center;
          padding: 5px 0;
        }
      }
      .select_display{
        width: 80px;
        padding: 0 5px;
      }
      .select_style{
        min-width: 100px;
      }
    }
    .rule-wrapper-legend{
      display: block;
      width: 100%;
      padding-bottom: 8px;
      margin-bottom: 20px;
      font-size: 20px;
      line-height: inherit;
      color: #333;
      border: 0;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
