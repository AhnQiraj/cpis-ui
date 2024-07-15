import Model from '@platform/utils/model'
/**
 * 功能按钮
 */
let ResponseButton = Model.extend({
  initialize: function(_attrs, options) {
    this[this.aliasKey] = _attrs.alias
    this.options = options
  },
  /**
   *获取按钮别名，如果编码是自定义（custom）则采用code +如果code没有则采用 alias+index
   */
  getAlias: function() {
    const alias = this[this.aliasKey]
    return alias === 'custom' ? (this.get('code') || (alias + this.get('$index'))) : alias
  },
  getAliasKey: function() {
    return this.aliasKey || 'alias'
  },
  getLabel: function() {
    return this.get('label') ? this.get('label') : this.label
  },
  getStyle: function() {
    return this.get('style') ? this.get('style') : this.style
  },
  getType: function() {
    return this.get('type') ? this.get('type') : this.type
  },
  getIcon: function() {
    return this.get('icon') ? this.get('icon') : this.icon
  },
  getEnablePage: function() {
    return this.get('enablePage') ? this.get('enablePage') : this.enablePage
  },
  getOptions: function(key) {
    return this.options[key]
  },
  getVersion: function() {
    return this.getOptions('version')
  },
  getPlain: function() {
    return this.get('plain') ? this.get('plain') : this.plain
  },
  style: 'default',
  icon: 'ibps-icon-check-square'
})
export default ResponseButton
