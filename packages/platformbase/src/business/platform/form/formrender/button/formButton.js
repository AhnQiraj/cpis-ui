import { upperFirst } from 'lodash'
// import Utils from '@platform/utils/util'
import FormrenderResponseButton from './index'
let FormButton
window.FormButton = FormButton = function(options) {
  this.response_buttons = []
  this.initButtons(options)
}
FormButton.prototype = {
  initButtons: function(options) {
    const buttons = options.buttons
    const params = options.params
    for (let i = 0; i < buttons.length; i++) {
      const rf = buttons[i]
      rf.alias = rf[FormButton.key.BUTTON_TYPE]
      rf.label = rf[FormButton.key.LABEL]
      rf.icon = 'ibps-icon-' + rf['icon']
      rf.type = rf['style']
      const button = new FormButton.Models['ResponseButton' + (upperFirst(rf.alias))](rf, params)
      // 初始化按钮事件
      this.response_buttons.push(button)
    }
  }
}
FormButton.Models = {}
FormButton.BUTTON_TYPES = ['close', 'save', 'saveAndContinue', 'sefStartFlow', 'prev', 'next', 'custom']
FormButton.key = {
  BUTTON_TYPE: 'alias',
  LABEL: 'label'
}
FormButton.VERSION = '2.0.0'
// 表单按钮
FormButton.Models.ResponseButton = FormrenderResponseButton.extend({
  style: 'primary',
  plain: true,
  aliasKey: FormButton.key.BUTTON_TYPE,
  /**
   *获取按钮别名，如果编码是自定义（custom）则采用code +如果code没有则采用 alias+index
   */
  getAlias: function() {
    const alias = this[this.aliasKey]
    return alias === 'custom' || alias === 'sefStartFlow' ? (this.get('code') || (alias + this.get('$index'))) : alias
  },
  getTitle: function() {
    return this.get('title') || ''
  },
  // 版本号
  getVersion: function() {
    return this.get('version')
  },
  getFormKey: function() {
    return this.get('formKey')
  }
})
// 关闭
FormButton.Models.ResponseButtonClose = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-close',
  style: 'default',
  action(btn) {
    this.handleActionEvent(btn.getAlias())
  }
})
// 预览
FormButton.Models.ResponseButtonPreview = FormButton.Models.ResponseButton.extend({
  icon: 'el-icon-view',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), { formData: this.getFormData() })
  }
})
// 上一步
FormButton.Models.ResponseButtonPrev = FormButton.Models.ResponseButton.extend({
  icon: 'el-icon-arrow-left',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), { formData: this.getFormData() })
  }
})
// 下一步
FormButton.Models.ResponseButtonNext = FormButton.Models.ResponseButton.extend({
  icon: 'el-icon-arrow-right',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), { formData: this.getFormData() })
  }
})
// 保存
FormButton.Models.ResponseButtonSave = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-save',
  style: 'primary',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), btn)
  }
})
// 保存后继续
FormButton.Models.ResponseButtonSaveAndContinue = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-save',
  style: 'primary',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), btn)
  }
})
// 自定义启动流程
FormButton.Models.ResponseButtonSefStartFlow = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-save',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), btn)
  }
})
// 自定义
FormButton.Models.ResponseButtonCustom = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lock',
  action(btn) {
    this.handleActionEvent(btn.getAlias(), btn)
  }
})
export default FormButton
