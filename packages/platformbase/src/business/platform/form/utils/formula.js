/**
 * 公式计算帮助类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'
import Utils from '@platform/utils/util'
import fecha from '@platform/utils/fecha'
import { numberCurrency, numberThousands, num2Str, evalExpression, fixDecimalPrecision } from './number'
import PinyinHelper from 'pinyin4js'
import { getSystemTimestamp } from '@platform/api/platform/form/common'
// 当前窗口
const wd = window
const FormulaUtil = {
  // ===============逻辑函数===================================
  /**
   * 并且
   */
  AND: function() {
    const args = Utils.flatten(arguments)
    for (let i = 0, c = args.length; i < c; i++) {
      if (!args[i]) {
        return false
      }
    }
    return true
  },
  /**
   * 或者
   */
  OR: function() {
    const args = Utils.flatten(arguments)
    for (let i = 0, c = args.length; i < c; i++) {
      if (args[i]) {
        return true
      }
    }
    return false
  },
  /**
   * 返回逻辑值false
   */
  FALSE: function() {
    return false
  },
  /**
   * 返回逻辑值true
   */
  TRUE: function() {
    return true
  },
  /**
   * IF(判断条件，结果为true的返回值, 结果为false的返回值)
   * 判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值。
   */
  IF: function(a, b, c) {
    return a ? b : c
  },
  /**
   * IFS 函数检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值。 IFS 可以取代多个嵌套 IF 语句，并且有多个条件时更方便阅读。
   * IFS( logical_1, value_if_true_1, logical_2, value_if_true_2, … ,logical_n, value_if_true_n)
   *
   */
  IFS: function() {
    let r = null
    for (let i = 0; i < arguments.length; i += 2) {
      if (arguments[i]) {
        const v = arguments[i + 1]
        r = Utils.isEmpty(v) ? null : v
        break
      }
    }
    return r
  },
  /**
   * 对参数逻辑值求反
   */
  NOT: function(a) {
    return !a
  },
  /**
   * 返回所有参数的异或值.
   * 异或的含义是:
   *    两个值相同，返回0，
   *    两个值不同，返回1。
   */
  XOR: function() {
    const args = Utils.flatten(arguments)
    let a = 0
    for (let i = 0, d = args.length; i < d; i++) {
      args[i] && a++
    }
    return !!(1 & Math.floor(Math.abs(a)))
  },
  // ===============文本函数===================================
  /**
   * 将多个文本字符串合并成一个文本字符串。
   * 示例：CONCATENATE(A,B,C)，即返回值为ABC
   */
  CONCATENATE: function() {
    const args = Utils.flatten(arguments)
    return args.join('')
  },
  /**
   * 返回计算机字符集的数字代码所对应的字符。
   * 示例：(10)，即返回值为换行字符。
   * 仅支持以下数字代码：
   *  编码|	字符 |	含义
   *  9	  | \t  |	制表符tab
   *  10	| \n	| 换行字符
   *  34  | "	  | 双引号
   *  39  | ’	  | 单引号
   *  92  | \	  | 反斜杠
   *
   */
  CHAR: function(code) {
    return code === 9 || code === 10 || code === 34 || code === 39 || code === 92 ? String.fromCharCode(code) : ''
  },
  /**
   * 比较两个字符串是否完全相同（区分大小写）。完全相同则返回true，否则返回false
   */
  EXACT: function(text1, text2) {
    return text1 === text2
  },
  /**
   * 从一个文本字符串的第一个字符开始返回指定个数的字符。
   */
  LEFT: function(text, numChars) {
    if (Utils.isEmpty(text)) {
      return ''
    }
    numChars = Utils.isEmpty(numChars) ? 1 : numChars
    text = text + ''
    return text ? text.substring(0, numChars) : ''
  },
  /**
   * 返回文本字符串中的字符个数。
   */
  LEN: function(a) {
    return _.isString(a) ? (a ? a.length : 0) : a && a.length ? a.length : 0
  },
  /**
   * 将一个文本字符串中的所有大写字母转换为小写字母。
   */
  LOWER: function(a) {
    return _.isString(a) ? (a ? a.toLowerCase() : a) : ''
  },
  /**
   * 根据指定的字符数，将部分文本字符串替换为不同的文本字符串。
   */
  REPLACE: function(oldText, startNum, numChars, newText) {
    oldText = oldText || ''
    newText = newText || ''
    if (_.isNumber(startNum) && _.isNumber(numChars)) {
      oldText = oldText.substr(0, startNum - 1) + newText + oldText.substr(startNum - 1 + numChars)
    }
    return oldText
  },
  /**
   * 将文本重复一定次数。
   */
  REPT: function(a, b) {
    b = b || 0
    return new Array(b + 1).join(a)
  },
  /**
   * 返回文本值中最右边的字符。
   * text: 必需。包含要提取字符的文本字符串。
   * num_chars: 可选。指定希望提取的字符数。
   */
  RIGHT: function(a, b) {
    b = undefined === b ? 1 : b
    return a ? a.substring(a.length - b) : ''
  },
  /**
   * 在第二个文本字符串中查找第一个文本字符串，并返回第一个文本字符串的起始位置的编号，该编号从第二个文本字符串的第一个字符算起。返回0则表示未查找到。
   * find_text: 必需。要查找的文本。
   * within_text: 必需。要在其中搜索find_text参数的值的文本。
   * start_num: 可选。within_text参数中从之开始搜索的字符编号。
   */
  SEARCH: function(a, b, c) {
    if (_.isString(a) && _.isString(b)) {
      c = _.isNull(c) ? 0 : c
      return b.toLowerCase().indexOf(a.toLowerCase(), c - 1) + 1
    } else {
      return 0
    }
  },
  /**
   * 字符串拆分
   */
  SPLIT: function(a, b) {
    if (Utils.isEmpty(a)) {
      return []
    }
    if (!_.isString(a)) {
      a = a + ''
    }
    return _.isString(a) ? a.split(b) : []
  },
  /**
   * 删除字符串首尾的空格，但是会保留字符串内部作为词与词之间分隔的空格。
   */
  TRIM: function(a) {
    if (Utils.isEmpty(a)) {
      return ''
    }
    if (!_.isString(a)) {
      a = a + ''
    }
    return _.isString(a) ? _.trim(a) : ''
  },
  /**
   * 将一个文本字符串中的所有小写字母转换为大写字母。
   */
  UPPER: function(a) {
    return _.isString(a) ? a.toUpperCase() : ''
  },
  /**
   * 返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定。
   * text: 必需。 包含要提取字符的文本字符串。
   *  start_num: 必需。 文本中要提取的第一个字符的位置。 文本中第一个字符的start_num为 1，以此类推。
   *  num_chars: 必需。 指定希望从文本中返回字符的个数。
   */
  MID: function(text, startNum, numChars) {
    text = text || ''
    return _.isNumber(startNum) && _.isNumber(numChars) ? text.substr(startNum - 1, numChars) : text
  },
  // =============== 数学函数===================================
  /**
   * 返回参数的平均值（算术平均值）。
   */
  AVERAGE: function() {
    const a = Utils.flatten(arguments, function(a) {
      return _.isNumber(a)
    })
    let c = 0
    let d = 0
    for (let b = a.length, e = 0; e < b; e++) {
      c += a[e]
      d += 1
    }
    if (d === 0) {
      return
    }
    return c / d
  },
  /**
   * 统计参数个数。
   */
  COUNT: function() {
    return Utils.flatten(arguments).length
  },
  /**
   * 统计满足条件的参数个数。
   * 例如：
   * COUNTIF([1,2,3,4], “>2”)，结果为2
   * COUNTIF([1,2,3,4], “!=2”)，结果为3
   * COUNTIF([1,2,3,4], “>=1”)，结果为4
   * COUNTIF([“a”, “b”, “c”], “d”)，结果为0
   */
  COUNTIF: function() {
    const len = arguments.length
    let criteria = arguments[len - 1]
    ;/[<>=!]/.test(criteria) || (criteria = '=="' + criteria + '"')
    const args = Utils.flatten(Array.prototype.slice.call(arguments, 0, len - 1))
    let matches = 0
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] !== 'string') {
        if (wd.eval(args[i] + criteria)) {
          matches++
        }
      } else {
        if (wd.eval('"' + args[i] + '"' + criteria)) {
          matches++
        }
      }
    }
    return matches
  },
  /**
   * 返回一组值中的最大值。
   */
  MAX: function() {
    const a = Utils.flatten(arguments, function(a) {
      return _.isNumber(a)
    })
    return a.length === 0 ? 0 : Math.max.apply(Math, a)
  },
  /**
   * 返回一组值中的最小值。
   */
  MIN: function() {
    const a = Utils.flatten(arguments, function(a) {
      return _.isNumber(a)
    })
    return a.length === 0 ? 0 : Math.min.apply(Math, a)
  },
  /**
   *返回数据集中第k个最大值。
   *Array: 必需。 需要确定第k个最大值的数组或数据区域。
   *k: 必需。 返回值在数组中的位置（从大到小排）
   */
  LARGE: function(a, b) {
    a = Utils.flatten(a, function(a) {
      return _.isNumber(a)
    })
    return a.sort(function(a, b) {
      return b - a
    })[b - 1]
  },
  /**
   * 返回数据集中第k个最小值。
   * Array: 必需。 需要确定第k个最小值的数组或数据区域。
   *k: 必需。 返回值在数组中的位置（从小到大排）。 用法同LARGE函数。
   */
  SMALL: function(a, b) {
    a = Utils.flatten(a, function(a) {
      return _.isNumber(a)
    })
    return a.sort(function(a, b) {
      return a - b
    })[b - 1]
  },
  /**
   * 返回数字的绝对值。
   */
  ABS: function(a) {
    return _.isNumber(a) ? Math.abs(a) : 0
  },
  /**
   * 将数字四舍五入到指定的位数。
   * number: 必需。 要四舍五入的数字。
   * num_digits: 必需。 要进行四舍五入运算的位数。
   */
  ROUND: function(number, numDigits) {
    return _.round(number, numDigits)
  },
  /**
   *返回回将参数 number 向上舍入（沿绝对值增大的方向）为最接近的指定基数的倍数。
   *number: 必需。 要舍入的值。
   *significance: 必需。 要舍入到的倍数。
   */
  CEILING: function(a, b) {
    if (b === 0) {
      return 0
    }
    return _.ceil(a, b)
  },
  /**
   * 将参数number向下舍入（沿绝对值减小的方向）为最接近的significance的倍数。
   * number: 必需。 要舍入的数值。
   * significance: 必需。 要舍入到的倍数。
   */
  FLOOR: function(a, b) {
    if (b === 0) {
      return 0
    }
    return _.floor(a, b)
  },
  /**
   * 将数字向下舍入到最接近的整数。
   */
  INT: function(a) {
    return _.isNumber(a) ? Math.floor(a) : 0
  },
  /**
   * 根据指定底数返回数字的对数。
   * number: 必需。 想要计算其对数的正实数。
   * base: 可选。 对数的底数。 如果省略 base，则假定其值为 10。
   */
  LOG: function(a, b) {
    b = undefined === b ? 10 : b
    return _.isNumber(b) ? Math.log(a) / Math.log(b) : 0
  },
  /**
   * 返回两数相除的余数。 结果的符号与除数相同。
   * number: 必需。 要计算余数的被除数。
   * divisor: 必需。 除数。
   *
   */
  MOD: function(a, b) {
    if (Utils.isEmpty(a) || Utils.isEmpty(a)) {
      return null
    }
    if (b === 0) {
      return 0
    }
    const c = evalExpression('%', a, b)
    return b > 0 ? c : -c
  },
  /**
   * 返回数字乘幂的结果。
   * number: 必需。 基数。 可为任意实数。
   * power: 必需。 基数乘幂运算的指数。
   */
  POWER: function(number, power) {
    const c = Math.pow(number, power)
    return isNaN(c) ? 0 : c
  },
  /**
   * 函数使所有以参数形式给出的数字相乘并返回乘积。
   */
  PRODUCT: function() {
    const args = Utils.flatten(arguments, function(a) {
      return _.isNumber(a)
    })
    let b = 1
    if (args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        b = evalExpression('*', b, args[i])
      }
    } else {
      b = 0
    }
    return b
  },
  /**
   * 返回正的平方根。
   */
  SQRT: function(a) {
    return a < 0 ? 0 : Math.sqrt(a)
  },
  /**
   * 函数使所有以参数形式给出的数字相加并返回和。
   */
  SUM: function() {
    const args = Utils.flatten(arguments, function(a) {
      return _.isNumber(a)
    })
    let v = 0
    for (let i = 0, d = args.length; i < d; ++i) {
      v = evalExpression('+', v, Number(args[i]))
    }
    return v
  },
  /**
   * 在给定的数组中，将数组间对应的元素相乘，并返回乘积之和。
   *
   * array: 可选。多个数字数组。
   * 主要可用于计算加权和。例如：SUMPRODUCT([1,2,3],[0.1,0.2,0.3])，相当于 1×0.1 + 2×0.2 + 3×0.3=1.4
   */
  SUMPRODUCT: function() {
    let a = 0, b = [], c = -1, d = 0
    for (a = 0, b = [], c = -1, d = 0; d < arguments.length; d++) {
      if (arguments[d] instanceof Array) {
        c = c < 0 ? arguments[d].length : Math.min(arguments[d].length, c)
        b.push(arguments[d])
      }
    }
    for (let e, f, g, h = 0; h < c; h++) {
      for (e = 1, f = 0; f < b.length; f++) {
        g = parseFloat(b[f][h])
        isNaN(g) && (g = 0)
        e = evalExpression('*', e, g)
      }
      a = evalExpression('+', a, e)
    }
    return a
  },
  /**
   * 将数字舍入到指定的小数位数，以十进制数格式对该数进行格式设置，并以文本形式返回结果。
   * number: 必需。 要进行舍入并转换为文本的数字。
   * decimals: 可选。 小数点右边的位数。
   */
  FIXED: function(a, b) {
    b = undefined === b ? 0 : b
    return _.isNumber(b) && b >= 0 ? Number(a).toFixed(b) : ''
  },
  RAND: function(a = 6) {
    return _.round(Math.random(), a)
  },
  /**
   *
   * 返回大于等于lower 且小于 upper 的均匀分布随机实数。每一次触发计算都会变化。
   * _.random(0, 5);
   * // => an integer between 0 and 5
   * _.random(5);
   * // => also an integer between 0 and 5
   * _.random(5, true);
   * // => a floating-point number between 0 and 5
   * _.random(1.2, 5.2);
   * // => a floating-point number between 1.2 and 5.2
   */
  RANDOM: function(lower, upper, floating) {
    return _.random(lower, upper, floating)
  },
  /**
   * 用于任意精度的十进制算术运算。
   * @param {*} symbol 符号
   * @param {*} a
   * @param {*} b
   */
  BIG(symbol, a, b) {
    return evalExpression(symbol, a, b)
  },
  // =============== 日期函数===================================
  /**
   * 最小日期
   */
  MINDATE: function() {
    const a = FormulaUtil.DATEFLATTEN(arguments)
    let min = a[0]
    for (let i = 1; i < a.length; i++) {
      if (a[i] < min) {
        min = a[i]
      }
    }
    const format = FormulaUtil.DATEFORMAT(min)
    return fecha.format(min, format)
  },
  /**
   * 最大日期
   */
  MAXDATE: function() {
    const a = FormulaUtil.DATEFLATTEN(arguments)
    let max = a[0]
    for (let i = 1; i < a.length; i++) {
      if (a[i] > max) {
        max = a[i]
      }
    }
    const format = FormulaUtil.DATEFORMAT(max)
    return fecha.format(max, format)
  },
  /**
   *1、 将时间戳转换为日期对象。 * timestamp: 必需。时间戳。
   *
   * DATE(year,month,day)
   * DATE(year,month,day,hour,minute,second)
   *
   *2、将年月日时分秒转换为日期对象。
   * year: 必需。年份。
   * month: 必需。月份。
   * day: 必需。天数。
   * hour: 必需。小时。
   * minute: 必需。分钟。
   * second: 必需。秒。
   * 例如，2015年11月1日的日期对象可以用如下表示：
   * DATE(2015,11,1)
   * DATE(1446307200000)
   * DATE(2015,11,1,0,0,0)
   * 这三个都表示“Sun Nov 01 2015 00:00:00 GMT+0800 (中国标准时间)”
   *
   */
  DATE: function() {
    if (Utils.isEmpty(arguments[0])) {
      return null
    }
    let v
    if (arguments.length === 6) {
      v = new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10), parseInt(arguments[3], 10), parseInt(arguments[4], 10), parseInt(arguments[5], 10))
    } else if (arguments.length === 3) {
      v = new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10))
    } else {
      //  移动端兼容问题
      const str = '' + arguments[0]
      const time = str.replace(/-/g, '/')
      v = new Date(time)
    }
    return v
  },
  /**
   * 返回特定时间的十进制数字。时间值为日期值的一部分，并用十进制数表示（例如 12:00 PM 可表示为 0.5，因为此时是一天的一半）。
   * hour: 必需。 0（零）到 32767 之间的数字，代表小时。 任何大于 23 的值都会除以 24，余数将作为小时值。 例如，TIME(27,0,0) = TIME(3,0,0) = .125
   * minute: 必需。 0 到 32767 之间的数字，代表分钟。 任何大于 59 的值将转换为小时和分钟。 例如，TIME(0,750,0) = TIME(12,30,0) = .520833
   * second: 必需。 0 到 32767 之间的数字，代表秒。 任何大于 59 的值将转换为小时、分钟和秒。 例如，TIME(0,0,2000) = TIME(0,33,20) = .023148
   *
   */
  TIME: function(a, b, c) {
    return (3600 * a + 60 * b + c) / 86400
  },
  /**
   * 将日期对象(或日期字符串)转换成时间戳。
   */
  TIMESTAMP: function(a) {
    if (Utils.isEmpty(a)) {
      return 0
    }
    if (_.isString(a)) {
      return FormulaUtil.TIMESTAMP(FormulaUtil.DATE(a))
    }
    return _.isDate(a) ? a.getTime() : 0
  },
  /**
   * 返回今天。
   */
  TODAY: function() {
    return new Date()
  },
  /**
   * 返回当前时间。与TODAY函数相同。
   */
  NOW: function() {
    return new Date()
  },
  /**
   * 返回当前服务器时间。
   * 即使客户端的时间被人为调整了，SYSTIME函数不受影响，获取的仍然是服务器时间。例如签到、打卡等场景下，可避免调整时间作弊的情况。
   */
  SYSTIME: function() {
    getSystemTimestamp()
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.error(error)
      })
  },
  /**
   *返回某日期的年。
   */
  YEAR: function(a) {
    return a.getFullYear()
  },
  /**
   * 返回某日期的天数。 天数是介于 1 到 31 之间的整数。
   */
  DAY: function(a) {
    return a.getDate()
  },
  /**
   * 返回某日期的月份。 月份是介于 1 到 12 之间的整数。
   */
  MONTH: function(a) {
    return a.getMonth() + 1
  },
  /**
   * 返回某日期的小时数。
   */
  HOUR: function(a) {
    return a.getHours()
  },
  /**
   * 返回某日期的分钟数。
   */
  MINUTE: function(a) {
    return a.getMinutes()
  },
  /**
   * 返回某日期的秒数。
   */
  SECOND: function(a) {
    return a.getSeconds()
  },
  /**
   * 返回两个日期之间的天数。
   * end_timestamp: 必需。结束日期。
   * start_timestamp: 必需。起始日期。
   */
  DAYS: function(a, b) {
    if (Utils.isEmpty(a) || Utils.isEmpty(b)) {
      return 0
    }
    const c = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const d = new Date(b.getFullYear(), b.getMonth(), b.getDate())
    return (c - d) / 864e5
  },
  /**
   * 按照一年 360 天的算法（每个月以 30 天计，一年共计 12 个月），DAYS360 函数返回两个日期间相差的天数，这在一些会计计算中将会用到。 如果财会系统是基于一年 12 个月，每月 30 天，可使用此函数帮助计算支付款项。
   * end_timestamp: 必需。结束日期。
   * start_timestamp: 必需。起始日期。
   * method: 可选。用于指定在计算中是采用美国方法还是欧洲方法。不填或false表示是美国方法，true表示是欧洲方法。
   *
   */
  DAYS360: function(a, b, c) {
    let d, e
    const f = b.getMonth()
    let g = a.getMonth()
    if (c) {
      d = b.getDate() === 31 ? 30 : b.getDate()
      e = a.getDate() === 31 ? 30 : a.getDate()
    } else {
      const h = new Date(b.getFullYear(), f + 1, 0).getDate()
      const i = new Date(a.getFullYear(), g + 1, 0).getDate()
      d = b.getDate() === h ? 30 : b.getDate()
      if (a.getDate() === i) {
        if (d < 30) {
          g++
          e = 1
        } else {
          e = 30
        }
      } else {
        e = a.getDate()
      }
    }
    return 360 * (a.getFullYear() - b.getFullYear()) + 30 * (g - f) + (e - d)
  },
  /**
   * 将指定日期加/减指定天数。
   * timestamp: 必需。初始日期。
   * deltadays: 必需。需要加减的天数。正数为增加，负数为减少。
   *
   */
  DATEDELTA: function(a, b) {
    if (Utils.isEmpty(a)) {
      return ''
    }
    if (!(a instanceof Date)) {
      return ''
    }
    if (!_.isNumber(b)) {
      b = 0
    }
    return new Date(a.getTime() + 864e5 * b)
  },
  /**
   * Start_date 必需。 一个代表开始时间的日期。
   *   End_date 必需。 一个代表结束时间的日期。
   * Unit 可选。一个可选参数，默认为 “d”，可以是 “y” 、“M”、“d”、“h”、“m”、“s” ，分别代表计算两个日期相差的年数、月数、天数、小时数、分钟数、秒数。（区分大小写，大写M代表月，小写m代表分。）
   * 通过 DATEDIF() 可以计算出两个时间的差值，根据需要，可以计算出相差的年数（“y”）、月数（“M”）、天数（“d”）、小时数（“h”）、分数（“m”）以及秒数（“s”）。
   * @param {*} startDdate
   * @param {*} endDate
   * @param {*} unit
   */
  DATEDIF: function(startDate, endDate, unit) {
    if (Utils.isEmpty(startDate) || Utils.isEmpty(endDate)) {
      return
    }
    let r
    let a = startDate.getTime()
    let b = endDate.getTime()
    switch (unit) {
      case 'y':
        r = (b - a) / 31536e6
        break
      case 'M':
        r = (b - a) / 2592e6
        break
      case 'd':
        r = (b - a) / 864e5
        break
      case 'h':
        r = (b - a) / 36e5
        break
      case 'm':
        r = (b - a) / 6e4
        break
      case 's':
        r = (b - a) / 1e3
        break
      default:
        r = (b - a) / 864e5
    }
    return fixDecimalPrecision(r)
  },
  /**
   * 返回给定日期在全年中的ISO周数。
   * timestamp: 必需。日期是Excel用于日期和时间计算的日期-时间代码。
   */
  ISOWEEKNUM: function(a) {
    a.setHours(0, 0, 0)
    a.setDate(a.getDate() + 4 - (a.getDay() || 7))
    const b = new Date(a.getFullYear(), 0, 1)
    return Math.ceil(((a - b) / 864e5 + 1) / 7)
  },
  /**
   * 返回特定日期的周数。例如，包含1月1日的周为该年的第1周，其编号为第1周。
   * timestamp: 必需。指定日期。代表一周中的日期。应使用DATE函数输入日期，或者将日期作为其他公式或函数的结果输入
   * return_type: 可选。一数字，确定星期从哪一天开始。默认值为1。
   */
  WEEKNUM: function(a, b) {
    undefined === b && (b = 1)
    if (b === 21) {
      return FormulaUtil.ISOWEEKNUM(a)
    }
    const c = [undefined, 0, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 2, 3, 4, 5, 6, 0]
    const d = c[b]
    let e = new Date(a.getFullYear(), 0, 1)
    const f = e.getDay() < d ? 1 : 0
    e -= 24 * Math.abs(e.getDay() - d) * 60 * 60 * 1e3
    return Math.floor((a - e) / 864e5 / 7 + 1) + f
  },
  /**
   * 将日期对象转换为指定格式日期字符串
   */
  FORMAT: function(date, format) {
    return fecha.format(date, format)
  },
  /**
   *  将按指定格式日期字符串转换为日期对象
   */
  PARSE: function(dateStr, format) {
    return fecha.parse(dateStr, format)
  },
  // ===================高级函数===========================
  /**
   *
   * 将数字转换成特定格式的文本。
   * 其中text_format的含义如下：
   * ＃：数字占位符。只显有意义的数据而不显示无意义的数据。小数点后数字如大于”#”的数量，则按”#”的位数四舍五入。小数点后数字如小于”#”的数量，则显示实际值。例：在文本框中输入：###.##，23.1显示为23.1，23.1578显示为23.16。
   * 0:数字占位补位符。如果小数点前的数据的长度大于占位符，则显示实际数据，如果小于占位符的数量，则用0补足。小数点后的数据的长度大于占位符，则按“0”的位数四舍五入。小数点后数字如小于”0”的数量，则用“0”补足。例：在文本框中输入：000.00，23.1显示为023.10，23.1578显示为023.16。
   * ，：千位分隔符。可插入“＃”或“0”中使用，数字中插入千位分隔符。合法使用形式：1.需要在小数点前使用。2.需要在“＃”或“0”之间。
   * ％：百分比。放在数字占位符或补位符之后。数据以百分比形式显示。例：代码：#%，23.1显示为2310%。
   * [Num0]显示原始数据。
   * [Num1]将数字转为中文小写。123显示为一百二十三
   * [Num2]将数字转为中文大写。123显示为壹佰贰拾叁
   * 直接在[Num0]或＃或0的之前加字符即是前缀，支持中文字符，英文大小写，¥，$,及空格。
   */
  TEXT: function(a, b) {
    return _.isNull(a) ? '' : _.isDate(a) && Utils.isNotEmpty(b) ? fecha.format(a, b) : num2Str(a, b)
  },
  /**
   * 将文本转化为数字。
   */
  VALUE: function(a) {
    return Utils.isEmpty(a) ? 0 : isNaN(a) ? 0 : parseFloat(a)
  },
  /**
   * 把数组变成统一深度
   */
  FLATTEN: function(input, shallow, strict, startIndex) {
    return Utils.flatten(input, shallow, strict, startIndex)
  },
  /**
   * 随机码生成器。可适用于随机流水号的使用场景等。
   * 但要注意UUID()保证输出的32位字符串不会重复，不能保证从这32位字符串中截取的一部分也不重复，因此有需要不重复的用户，要勾选“不可重复”。
   */
  UUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  /**
   * 是否为空
   */
  ISEMPTY: function(obj) {
    return Utils.isEmpty(obj)
  },
  /**
   * 人民币
   */
  CURRENCY: function(value) {
    return numberCurrency(value)
  },
  /**
   * 千分位
   */
  THOUSANDS: function(num, decimalPlaces, dsep, tsep) {
    return numberThousands(num, decimalPlaces, dsep, tsep)
  },
  DATEFLATTEN: function() {
    const a = Utils.flatten(arguments, function(a) {
      if (Utils.isEmpty(a)) {
        return 0
      }
      return a
    })
    return a
  },
  /**
   * 日期默认格式化
   * @param {*} date
   */
  DATEFORMAT: function(date) {
    let format
    if (date.indexOf(' ') !== -1) {
      format = 'yyyy-MM-dd HH:mm:ss'
    } else if (date.indexOf('-') !== -1) {
      format = 'yyyy-MM-dd'
    } else {
      format = 'HH:mm:ss'
    }
    return format
  },
  _: function() {
    return _
  },
  /**
   * 转换拼音
   * @param {*} value
   * @param {*} separator 字符间的分隔符
   * @param {*} format
   *    WITH_TONE_MARK: "WITH_TONE_MARK", //带声调
   *    WITHOUT_TONE: "WITHOUT_TONE", //不带声调
   *    WITH_TONE_NUMBER: "WITH_TONE_NUMBER", //数字代表声调
   *    FIRST_LETTER: "FIRST_LETTER" //首字母风格 【默认】
   */
  PINYIN(value, separator = '', format = 'FIRST_LETTER') {
    if (Utils.isEmpty(value)) {
      return ''
    }
    return PinyinHelper.convertToPinyinString(value, separator, format)
  }
}
export default FormulaUtil
