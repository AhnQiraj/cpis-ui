/**
 * 表单--封装自定义代码扩展接口
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2017-10-01-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'
import Vue from 'vue'
import request from '@platform/utils/request'
import dialog from '@platform/utils/dialog'
import ActionUtils from '@platform/utils/action'
import Element from 'element-ui'
const _import = require('@platform/utils/util.import.' + process.env.NODE_ENV)
// 定义全局
let JForm
if (!window.JForm) {
  JForm = window.JForm = {}
} else {
  JForm = window.JForm
}
/**
   * 封装自定义代码扩展接口
   */
_.extend(JForm, {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,
  // 初始化表单
  _init: function(form) {
    if (this._isInitialization) {return}
    this.$form = form
    this.$vue = Vue
    this.$request = request
    this.$dialog = dialog
    this.$import = _import
    this.$Element = Element
    this.$ActionUtils = ActionUtils
    this._ = _
    this._isInitialization = true
  },
  // 表单加载
  _onLoad: function(form) {
    this._init(form)
    if (_.isFunction(this.onLoad)) {
      this.onLoad(form)
    }
  },
  // 加载按钮
  _onLoadActions: function(form, action, button, type) {
    if (_.isFunction(this.onLoadActions)) {
      return this.onLoadActions(form, action, button, type)
    }
  },
  // 表单校验
  _onValidate: function(form, callback) {
    if (_.isFunction(this.onValidate)) {
      return this.onValidate(form, callback)
    }
    if (_.isFunction(callback)) {callback(true)}
  },
  // 按钮提交前事件
  _beforeSubmit: function(form, action, postValue, callback) {
    if (_.isFunction(this.beforeSubmit)) {
      return this.beforeSubmit(form, action, postValue, callback)
    }
    if (_.isFunction(callback)) {callback(true)}
  },
  // 按钮提交后事件
  _afterSubmit: function(form, action, postValue, callback) {
    if (_.isFunction(this.afterSubmit)) {
      return this.afterSubmit(form, action, postValue, callback)
    }
    if (_.isFunction(callback)) {callback(true)}
  },
  // 子表按钮的提交前事件
  _beforeSubButton: function(tableForm, action, position, params, callback) {
    if (_.isFunction(this.beforeSubButton)) {
      return this.beforeSubButton(tableForm, action, position, params, callback)
    }
    if (_.isFunction(callback)) {callback(true)}
  },
  // 子表按钮的提交后事件
  _afterSubButton: function(tableForm, action, position, params, callback) {
    if (_.isFunction(this.afterSubButton)) {
      return this.afterSubButton(tableForm, action, position, params, callback)
    }
    if (_.isFunction(callback)) {callback(true)}
  },
  // 子表统计
  _summaryMethod: function(tableForm, tableName, params) {
    if (_.isFunction(this.summaryMethod)) {
      return this.summaryMethod(tableForm, tableName, params)
    }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.afterSubButton = null
    this.beforeSubButton = null
    this.summaryMethod = null
    this._isInitialization = false
  }
})
export default JForm
