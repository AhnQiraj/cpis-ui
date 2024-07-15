import { upperFirst } from 'lodash'
// import Utils from '@platform/utils/util'
import FormrenderResponseButton from '@platform/business/platform/form/formrender/button/index'
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
      const button = new FormButton.Models['ResponseButton' + (upperFirst(rf.alias))](rf, params)
      // 初始化按钮事件
      this.response_buttons.push(button)
    }
  }
}
FormButton.Models = {}
FormButton.BUTTON_TYPES = ['close', 'save', 'sefStartFlow', 'prev', 'next', 'custom']
FormButton.key = {
  BUTTON_TYPE: 'key',
  LABEL: 'label'
}
FormButton.VERSION = '2.0.0'
// 表单按钮
FormButton.Models.ResponseButton = FormrenderResponseButton.extend({
  style: 'primary',
  plain: true,
  aliasKey: FormButton.key.BUTTON_TYPE,
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
// 自定义
FormButton.Models.ResponseButtonCustom = FormButton.Models.ResponseButton.extend({
  icon: 'ibps-icon-lock',
  action(btn) {
  }
})
export default FormButton
