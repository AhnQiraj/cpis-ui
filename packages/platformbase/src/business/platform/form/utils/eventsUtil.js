/**
 * 表单--封装自定义代码扩展接口
 */
import _ from 'lodash'
import Utils from '@platform/utils/util'
// 常量
const LBrace = '{'
const RBrace = '}'
const LCurves = '('
const RCurves = ')'
const LineFeed = '\n'
const Start = 'Object.assign'
/**
   * 封装自定义代码扩展接口
   */
const JFormLocal = {}
/**
 * 封装自定义代码扩展接口
 */
_.extend(JFormLocal, {
  // 初始化表单事件
  _initEvents: function(data) {
    const events = {}
    if (Utils.isEmpty(data)) {return events}
    if (!Utils.isString(data)) {return events}
    data = Utils.trim(data)
    // 保存分割后的数据
    let arrs = []
    // 保存组合成的函数的字符串
    let str = ''
    // 判断是否为多行注释文本
    let bool = false
    // 保存分割好后的对象数据
    let obj = {}
    // 正则表达式
    const regExp_one = /^(var|let|const)( ){1,}[a-zA-Z0-9_]{1,}( )*=( )*function/
    const regExp_two = /^[a-zA-Z0-9_]{1,}( )*:( )*function/
    const regExp_three = /^function( ){1,}[a-zA-Z0-9_]{1,}/
    // 1.判断是否以Object.assign开头
    // 2.当以Object.assign开头，则对data进行截取，获取事件的字符串；当不以Object.assign开头，则可直接对data直接操作
    if (data.startsWith(Start)) {
      data = data.substring(data.indexOf(LBrace) + 1, data.lastIndexOf(RBrace))
    }
    // 3.对data进行行的分割，组合成一个数组
    arrs = data.split(LineFeed)
    // 4.遍历分割后的数组，判断是否为函数的格式，对数据进行操作，并赋值到对象内
    let temp = ''
    for (let i = 0; i < arrs.length; i++) {
      temp = Utils.trim(arrs[i])
      if (Utils.isEmpty(temp)) {continue} // 去除空数据
      // 去除多行注释
      if (temp.startsWith('/*')) {
        bool = true
        continue
      }
      if (bool) {
        if (temp.endsWith('*/')) {bool = false}
        continue
      }
      if (temp.startsWith('//')) {continue} // 去除单行注释
      // 判断行是否为函数开头的
      if (regExp_one.test(temp) || regExp_two.test(temp) || regExp_three.test(temp)) {
        if (Utils.isNotEmpty(str) && Utils.isNotEmpty(obj)) {
          str = str.substring(str.indexOf(LBrace) + 1, str.lastIndexOf(RBrace))
          try {
            const _fun = new Function(...obj.args, str)
            events[obj.name] = _fun
          } catch (error) {
            console.warn('事件脚本格式出错', str)
          }
        }
        str = ''
        obj = {}
        const _argsStr = temp.substring(temp.indexOf(LCurves) + 1, temp.indexOf(RCurves))
        const _args = _argsStr.split(',')
        obj.args = _args
        const _temp = temp.substring(temp.indexOf(LBrace) + 1)
        str += _temp + LineFeed
        if (regExp_one.test(temp)) {
          obj.name = Utils.trim(temp.split('=')[0].split(/( ){1,}/)[1])
        } else if (regExp_two.test(temp)) {
          obj.name = Utils.trim(temp.split(':')[0])
        } else if (regExp_three.test(temp)) {
          obj.name = Utils.trim(temp.substring(0, temp.indexOf(LCurves)).split(/( ){1,}/)[1])
        }
      } else {
        str += temp + LineFeed
      }
    }
    if (Utils.isNotEmpty(str) && Utils.isNotEmpty(obj)) {
      str = str.substring(str.indexOf(LBrace) + 1, str.lastIndexOf(RBrace))
      try {
        const _fun = new Function(...obj.args, str)
        events[obj.name] = _fun
      } catch (error) {
        console.warn('事件脚本格式出错', str)
      }
    }
    return events
  },
  // 事件调用
  _eventCall: function(events, name, ...args) {
    if (Utils.isNotEmpty(name) &&
      Utils.isNotEmpty(events) &&
      Utils.isNotEmpty(events[name]) &&
      _.isFunction(events[name])) {
      return events[name](...args)
    }
    if (Utils.isNotEmpty(args) && _.isFunction(args[args.length - 1])) {args[args.length - 1](true)}
  }
})
export default JFormLocal
