/**
 * 全局的工具类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 *
 * 可以使用 this.$utils.xx
 *  如: 判断是否为空
 *   this.$utils.isEmpty()
 */
import log from "./util.log.js"
import cookies from "./util.cookies.js"
import filterXSS from "xss"
import i18n from '@/i18n'
import { Message } from "element-ui"
const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
const util = {
  cookies,
  log,
  /**
   * 判断是否为空
   * @param {*} obj
   */
  isEmpty: function (obj, allowBlank = false) {
    if (util.isNull(obj)) {
      return true
    }
    if (util.isArray(obj)) {
      return obj.length === 0
    }
    if (util.isString(obj)) {
      return !(allowBlank || obj.length > 0)
    }
    if (util.isObject(obj)) {
      return util.isEmptyObject(obj)
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return obj === undefined || (!allowBlank ? obj === "" : false)
  },
  /**
   * 判断是否不为空
   * @param {*} obj
   */
  isNotEmpty: function (obj, allowBlank = false) {
    return !util.isEmpty(obj, allowBlank)
  },
  /**
   * 判断是否为空对象
   * @param {*} obj
   */
  isEmptyObject: function (obj) {
    if (!obj) {
      return true
    }
    for (const name in obj) {
      return false
    }
    return true
  },
  /**
   * 判断是否为不空对象
   * @param {*} obj
   */
  isNotEmptyObject: function (obj) {
    return !util.isEmptyObject(obj)
  },
  /**
   * 是否是对象
   * @param {*} input
   */
  isObject: function (input) {
    return Object.prototype.toString.call(input) === "[object Object]"
  },
  /**
   * 是否是数组
   * @param {*} input
   */
  isArray: function (input) {
    return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]"
  },
  isDate: function (input) {
    return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]"
  },
  isNumber: function (input) {
    return input instanceof Number || Object.prototype.toString.call(input) === "[object Number]"
  },
  isString: function (input) {
    return input instanceof String || Object.prototype.toString.call(input) === "[object String]"
  },
  isBoolean: function (input) {
    return typeof input === "boolean"
  },
  isFunction: function (input) {
    return typeof input === "function"
  },
  isNull: function (input) {
    return input === undefined || input === null
  },
  /**
   *  判断是否是数字（包含字符串数字和数字类型）
   * @param {*} input
   */
  isNum: function (input) {
    if (util.isEmpty(input)) {
      return false
    }
    if (util.isString(input) && input.substr(input.length - 1, 1) !== ".") {
      // 避免最后一位为小数
      input = Number(input)
    }
    if (isNaN(input)) {
      return false
    } else {
      return util.isNumber(input)
    }
  },
  isValidNumber: function (t) {
    return typeof t === "number" && !isNaN(t) && isFinite(t)
  },
  isPlainObject: function (obj) {
    if (obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object && !hasOwnProperty.call(obj, "constructor")) {
      let key
      for (let k in obj) {
        key = k
      }
      return key === undefined || hasOwnProperty.call(obj, key)
    }
    return false
  },
  isJSON: function (str) {
    if (util.isString(str)) {
      try {
        const obj = JSON.parse(str)
        return util.isPlainObject(obj) || util.isArray(obj)
      } catch (e) {
        return false
      }
    }
    return false
  },
  trim: function (text) {
    return text == null ? "" : (text + "").replace(rtrim, "")
  },
  /**
   * 判断参数是否是其中之一
   */
  oneOf: function (value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true
      }
    }
    return false
  },
  /**
   * 判断参数是否是数组对象其中之一
   */
  oneOfObj: function (value, validList, key) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i][key]) {
        return true
      }
    }
    return false
  },
  /**
   * 全局唯一标识符
   */
  guid: function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  /**
   * 转boolean 值
   * @param {*} obj
   * @param {*} defaultValue
   */
  toBoolean: function (obj, defaultValue = false) {
    if (util.isEmpty(obj)) {
      return defaultValue
    }
    return util.oneOf(obj, [true, "True", "Yes", "true", "1", 1, "yes", "Y", "y", "T", "t"])
  },
  /**
   * 创建新数据，避免对象引用
   * @param {*} data
   * @param {*} defaultValue
   */
  newData: function (data, defaultValue) {
    return util.isNotEmpty(data) ? JSON.parse(JSON.stringify(data)) : defaultValue || data
  },
  /**
   * 转换json字符串的转换
   * @param {*} data
   * @param {*} defaultValue
   */
  parseData: function (data, defaultValue) {
    if (util.isNotEmpty(data)) {
      // eslint-disable-next-line no-eval
      return util.isPlainObject(data) || util.isArray(data) ? data : window.eval("(" + data + ")")
    } else {
      return defaultValue || data
    }
  },
  /**
   * 转换json字符串的转换
   * @param {*} data
   * @param {*} defaultValue
   */
  parseJSON: function (data, defaultValue) {
    if (util.isNotEmpty(data)) {
      return util.isJSON(data) ? JSON.parse(data) : data
    } else {
      return defaultValue || data
    }
  },
  /**
   * eval 数据
   */
  evalData: function (data) {
    // eslint-disable-next-line no-eval
    return window.eval(data)
  },
  /**
   * 格式化文件大小, 输出成带单位的字符串
   * @method formatSize
   * @grammar util.formatSize( size ) => String
   * @grammar util.formatSize( size, pointLength ) => String
   * @grammar util.formatSize( size, pointLength, units ) => String
   * @param {Number} size 文件大小
   * @param {Number} [pointLength=2] 精确到的小数点数。
   * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
   * @example
   * console.log( util.formatSize( 100 ) );    // => 100B
   * console.log( util.formatSize( 1024 ) );    // => 1.00K
   * console.log( util.formatSize( 1024, 0 ) );    // => 1K
   * console.log( util.formatSize( 1024 * 1024 ) );    // => 1.00M
   * console.log( util.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
   * console.log( util.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
   */
  formatSize: function (size, pointLength, units) {
    units = units || ["B", "K", "M", "G", "TB"]
    let unit
    while ((unit = units.shift()) && size > 1024) {
      size = size / 1024
    }
    return (unit === "B" ? size : size.toFixed(pointLength || 2)) + unit
  },
  /**
   * 格式化文本
   * @param {*} text
   */
  formatText: function (text) {
    return text !== null ? ("" + filterXSS(text)).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + "<br />" + "$2") : ""
  },
  /**
   * @description 打开新页面
   * @param {String} url 地址
   */
  open: function (url, target = "_blank") {
    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("target", target)
    a.setAttribute("id", "ibps-open-link")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById("ibps-open-link"))
  },
  /**
   * 将array递归为一维数组。
   * @param {*} ary
   * @param {*} predicate
   * @param {*} result
   */
  flatten: function (ary, predicate, result) {
    result = result || []
    if (ary) {
      for (let i = 0; i < ary.length; i++) {
        const value = ary[i]
        if (Array.isArray(value)) {
          util.flatten(value, predicate, result)
        } else {
          if (!(predicate && !predicate(value))) {
            result.push(value)
          }
        }
      }
    }
    return result
  },
  //判断是否是Base64
  isBase64: function (str) {
    if (str === "" || str.trim() === "") {
      return false
    }
    try {
      return btoa(atob(str)) == str
    } catch (err) {
      return false
    }
  },
  requestAnimationFrame(callbak, time = 50) {
    let raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
    if (!raf) {
      raf = fn => setTimeout(fn, time)
    }
    raf(() => {
      setTimeout(callbak, time)
    })
  },
  /**
   * 动态加载样式
   * @param {*} styleText
   */
  createStyles(styleText, id) {
    const style = document.createElement("style")
    style.setAttribute("type", "text/css")
    if (id) {
      const styleTag = document.getElementById(id)
      if (styleTag) {
        styleTag.parentNode.removeChild(styleTag)
      }
      style.setAttribute("id", id)
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = styleText
    } else {
      style.appendChild(document.createTextNode(styleText))
    }
    let el = document.querySelector("head") || document.body
    el.appendChild(style)
    return style
  },
  /**
   * 通过format获取el-date-picker的type
   * @param {*} format
   */
  getTypeByFormat(format) {
    let result = "date"
    const reqex = {
      year: /^yyyy$/,
      month: /^yyyy(-){0,1}(M){1,2}$/,
      date: /^yyyy(-){0,1}(M){1,2}(-){0,1}(d){1,2}$/,
      datetime: /^yyyy(-){0,1}(M){1,2}(-){0,1}(d){1,2} ((H){1,2}|(h){1,2}):(m){1,2}:(s){1,2}$/,
      time: /^((((H){1,2}|(h){1,2}):(m){1,2}:(s){1,2})|(((H){1,2}|(h){1,2}):(m){1,2})|((m){1,2}:(s){1,2}))$/
    }
    if (reqex.year.test(format)) {
      result = "year"
    } else if (reqex.month.test(format)) {
      result = "month"
    } else if (reqex.date.test(format)) {
      result = "date"
    } else if (reqex.datetime.test(format)) {
      result = "datetime"
    } else if (reqex.time.test(format)) {
      result = "time"
    }
    return result
  },
  // 金额添加千分位
  comdify(n) {
    if (util.isEmpty(n)) {
      return n
    }
    const str = n.toString().split(".")
    const re = /\d{1,3}(?=(\d{3})+$)/g
    str[0] = str[0].replace(re, "$&,")
    return str.join(".")
  },
  // 去除千分位中的‘，’
  delcommafy(num) {
    if (util.isEmpty(num)) {
      return num
    }
    num = num.toString()
    num = num.replace(/,/gi, "")
    return num
  },
  // 对象比较
  valueEqual(obj1, obj2) {
    const o1 = obj1 instanceof Object
    const o2 = obj2 instanceof Object
    // 判断是不是对象
    if (!o1 || !o2) {
      return obj1 === obj2
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }
    for (let o in obj1) {
      const t1 = obj1[o] instanceof Object
      const t2 = obj2[o] instanceof Object
      if (t1 && t2) {
        return this.valueEqual(obj1[o], obj2[o])
      } else if (obj1[o] !== obj2[o]) {
        return false
      }
    }
    return true
  },
  /**
   * 可编辑表格数据校验
   * @param {Array} columns 列配置
   * @param {Array} tableData 待保存列表数据
   * @param {boolean} emptyFlag 列表是否可为空
   * @returns {boolean} 校验是否通过
   */
  tableDataRequiredValidate(columns, tableData, canEmpty = false) {
    // 参数校验，避免无意义的循环
    if (!columns?.length || !tableData?.length) {
      return canEmpty || false;
    }

    // 获取必填字段的属性和标签，提前过滤无用字段
    const requiredColumns = [];
    for (const column of columns) {
      if (column.required && column.prop) {
        requiredColumns.push({ prop: column.prop, label: column.label });
      }
    }

    // 如果没有必填字段，直接通过校验
    if (requiredColumns.length === 0) {
      return true;
    }

    // 遍历数据并校验
    const totalRows = tableData.length;
    const totalColumns = requiredColumns.length;

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const row = tableData[rowIndex];

      // 跳过删除的行
      if (row?.isDel === 1) continue;

      for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
        const { prop, label } = requiredColumns[colIndex];

        // 检查字段是否为空
        if (util.isEmpty(row?.[prop])) {
          Message({
            type: 'error',
            message: i18n.t('fuel.message.tableDataNotEmpty', {
              title1: rowIndex + 1,
              title2: label
            })
          });
          return false; // 校验失败，立即退出
        }
      }
    }
    return true; // 校验通过
  }
}
export default util
