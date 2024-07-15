const util = {
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
    return obj === undefined || (!allowBlank ? obj === '' : false)
  },
  /**
   * 判断是否不为空
   * @param {*} obj
   */
  isNotEmpty: function (obj, allowBlank = false) {
    return !util.isEmpty(obj, allowBlank)
  },
  /**
   * 是否是对象
   * @param {*} input
   */
  isObject: function (input) {
    return Object.prototype.toString.call(input) === '[object Object]'
  },
  /**
   * 是否是数组
   * @param {*} input
   */
  isArray: function (input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]'
  },
  isString: function (input) {
    return input instanceof String || Object.prototype.toString.call(input) === "[object String]"
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
    if (util.isString(input) && input.substr(input.length - 1, 1) !== '.') {
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
    return typeof t === 'number' && !isNaN(t) && isFinite(t)
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
  /**
   * 转boolean 值
   * @param {*} obj
   * @param {*} defaultValue
   */
  toBoolean: function (obj, defaultValue = false) {
    if (util.isEmpty(obj)) {
      return defaultValue
    }
    return util.oneOf(obj, [true, 'True', 'Yes', 'true', '1', 1, 'yes', 'Y', 'y', 'T', 't'])
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
  }
}
export default util
