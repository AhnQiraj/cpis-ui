/**
 * ==========
 * 数字处理
 * ==============
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 * 1、转换大写货币
 * 2、转换中文
 * 3、转千分位
 */
import _ from 'lodash'
import Utils from '@platform/utils/util'
import Big from 'big.js'
// 大写的0-9 ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']
const CN_CAPITAL_NUMS = ['\u96f6', '\u58f9', '\u8d30', '\u53c1', '\u8086', '\u4f0d', '\u9646', '\u67d2', '\u634c', '\u7396']
// 小写的0-9 ['零','一','二','三','四','五','六','七','八','九']
const CN_LOWER_NUMS = ['\u96f6', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d']
// 大写 拾 \u62fe 佰 \u4f70 仟 \u4edf
const CN_CAPITAL_INT_RADICE = ['', '\u62fe', '\u4f70', '\u4edf']
// 小写的 十 百 千
const CN_LOWER_INT_RADICE = ['', '\u5341', '\u767e', '\u5343']
// 万 \u4e07 亿 \u4ebf 兆 \u5146
const CN_INT_UNITS = ['', '\u4e07', '\u4ebf', '\u5146']
// 角 \u89d2 分 \u5206 毫 \u6beb 厘 \u5398
const CN_DEC_UNITS = ['\u89d2', '\u5206', '\u6beb', '\u5398']
// 整 \u6574
const CN_INTEGER = '\u6574'
// 元 \u5143
const CN_INT_LAST = '\u5143'
// Maximum number
const maxNum = 999999999999999999999999999999.9999
/**
 * 转换中文
 * @param {*} number 数字
 * @param {*} capital 大写
 * @param {*} symbol 人民币
 */
export const numberChinese = (number, capital, symbol) => {
  /* istanbul ignore if  */
  if (number === '') {
    return ''
  }
  number = parseFloat(number)
  /* istanbul ignore if  */
  if (number >= maxNum) {
    return number + ''
  }
  // 大小写 0-9
  const cnNums = capital ? CN_CAPITAL_NUMS : CN_LOWER_NUMS
  // 大写
  const cnIntRadice = capital ? CN_CAPITAL_INT_RADICE : CN_LOWER_INT_RADICE
  const cnInteger = symbol ? CN_INTEGER : ''
  const cnIntLast = symbol ? CN_INT_LAST : ''
  // Integral part
  let integerNum
  // Decimal part
  let decimalNum
  // Capital number
  let capitalStr = ''
  let parts
  /* istanbul ignore if  */
  if (number === 0) {
    capitalStr = cnNums[0] + cnIntLast + cnInteger
    return capitalStr
  }
  // Convert to String
  number += ''
  if (number.indexOf('.') === -1) {
    integerNum = number
    decimalNum = ''
  } else {
    parts = number.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // Convert integer part
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    for (let i = 0, IntLen = integerNum.length; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          capitalStr += cnNums[0]
        }
        zeroCount = 0
        capitalStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        capitalStr += CN_INT_UNITS[q]
      }
    }
    capitalStr += cnIntLast
  }
  // Convert decimal part
  if (decimalNum !== '') {
    for (let i = 0, decLen = decimalNum.length; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        capitalStr += cnNums[Number(n)] + CN_DEC_UNITS[i]
      }
    }
  }
  if (capitalStr === '') {
    capitalStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    capitalStr += cnInteger
  }
  return capitalStr
}
/**
 * 转换大写货币
 * @param {*} number
 */
export const numberCurrency = (number) => {
  return numberChinese(number, true, true)
}
/**
 * 百分比
 * @param {*} number
 */
export const numberPercent = (number) => {
  if (isNaN(number) || number == null) {return number}
  return (number / 100) + '%'
}
/**
 * numberThousands(number, [ decimals=0, decimalSeparator='.', orderSeparator=',']) => string
 *
 * Formats the numbers.
 *
 * numberThousands(1000, 2);
 * // => "1,000.00"
 *
 * numberThousands(123456789.123, 5, ".", ",");
 * // => "123,456,789.12300"
 *
 * @param {*} number
 * @param {*} decimalPlaces  位数
 * @param {*} dsep  指定小数分隔符
 * @param {*} tsep  千分位 分隔符
 */
export const numberThousands = (number, decimalPlaces, dsep = '.', tsep) => {
  if (isNaN(number) || number == null) {return ''}
  number = decimalPlaces ? number.toFixed(~~decimalPlaces) : number + ''
  tsep = typeof tsep === 'string' ? tsep : ','
  const parts = number.split('.')
  const fnums = parts[0]
  const decimals = parts[1] ? (dsep || '.') + parts[1] : ''
  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals
}
/**
 * 数字格式
 * @param {*} number
 * @param {*} decimalPlaces 位数
 * @param {*} decimalScale  是否补零
 */
export const parseNumber = (number, decimalPlaces, decimalScale) => {
  if (isNaN(number) || number == null) {return ''}
  number = decimalPlaces && decimalScale ? number.toFixed(~~decimalPlaces) : number + ''
  const parts = number.split('.')
  const fnums = parts[0]
  const fdecimals = parts[1] ? '.' + parts[1] : ''
  return fnums + fdecimals
}
/**
 * 数字格式化
 * @param {*} a
 * @param {*} b
 */
export const numberFormat = (a, b) => {
  let c = ''
  let d = a + ''
  if (/%$/.test(b)) { // 百分比
    c = '%'
    a = 100 * a
    b = b.replace('%', '')
    let e = d.indexOf('.')
    if (e > -1) {
      let f = d.length - 3 - e
      f = f < 0 ? 0 : f > 8 ? 8 : f
      a = parseFloat(a.toFixed(f))
    }
    d = a + ''
  }
  let g = b.split('.')
  let h = g[0]
  let i = g[1]
  if (i !== '') {
    let j = i ? i.length : 0
    d = parseFloat(a).toFixed(j)
    let k,l
    for (k = d.split(''), l = j; l > 0 && i.charAt(l - 1) === '#'; l--) {
      let m = k.pop()
      if (m !== '0') {
        k.push(m)
        break
      }
    }
    let n = k.pop()
    n === '.' && (n = '')
    d = k.join('') + n
  }
  let o = d.split('.')
  let p = o[0]
  if (/,/.test(h)) {o[0] = p.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')} else {
    let q = h.match(/[0]+[0#]*$/)
    q && q.length > 0 && (o[0] = _.padStart(p, q[0].length, '0'))
  }
  return o.join('.') + c
}
/**
 *  将数字转换成特定格式的文本。
 * 其中text_format的含义如下：
 * #： 数字占位符。只显有意义的数据而不显示无意义的数据。小数点后数字如大于”#”的数量，则按”#”的位数四舍五入。小数点后数字如小于”#”的数量，则显示实际值。例：在文本框中输入：###.##，23.1显示为23.1，23.1578显示为23.16。
 * 0: 数字占位补位符。如果小数点前的数据的长度大于占位符，则显示实际数据，如果小于占位符的数量，则用0补足。小数点后的数据的长度大于占位符，则按“0”的位数四舍五入。小数点后数字如小于”0”的数量，则用“0”补足。例：在文本框中输入：000.00，23.1显示为023.10，23.1578显示为023.16。
 * ,：千位分隔符。可插入“＃”或“0”中使用，数字中插入千位分隔符。合法使用形式：1.需要在小数点前使用。2.需要在“＃”或“0”之间。
 * %：百分比。放在数字占位符或补位符之后。数据以百分比形式显示。例：代码：#%，23.1显示为2310%。
 * [Num0]显示原始数据。
 * [Num1]将数字转为中文小写。123显示为一百二十三
 * [Num2]将数字转为中文大写。123显示为壹佰贰拾叁
 * [Num3]将数字转为中文大写。123显示为壹佰贰拾叁元整
 * 直接在[Num0]或＃或0的之前加字符即是前缀，支持中文字符，英文大小写，¥，$,及空格。
 *
 *
 */
export const num2Str = (num, textFormat) => {
  if (Utils.isEmpty(num)) {
    return ''
  }
  let c = num + ''
  if (Utils.isEmpty(textFormat)) {
    return c
  }
  let d = /\[Num0\]/ // 显示原始数据。
  if (d.test(textFormat)) {
    return textFormat.replace(d, c)
  }
  d = /\[Num1\]/ // 将数字转为中文小写。123显示为一百二十三
  if (d.test(textFormat)) {
    return textFormat.replace(d, numberChinese(c, false))
  }
  d = /\[Num2\]/ // 将数字转为中文大写。123显示为壹佰贰拾叁
  if (d.test(textFormat)) {
    return textFormat.replace(d, numberChinese(c, true))
  }
  d = /\[Num3\]/ // 将数字转为中文大写。123显示为壹佰贰拾叁元整
  if (d.test(textFormat)) {
    return textFormat.replace(d, numberCurrency(c, true))
  }
  d = /[#0]+,?[#0]*\.?[#0]*%?/
  let e = textFormat.match(d)
  if (e && e.length > 0) {
    c = numberFormat(num, e[0])
    return textFormat.replace(d, c)
  }
  return num
}
const wd = window
export function toFixed(number, n) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString()
  }
  if (typeof (n) === 'undefined' || n === 0) {
    return (Math.round(number)).toString()
  }
  let result = number.toString()
  let arr = result.split('.')
  // 整数的情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i += 1) {
      result += '0'
    }
    return result
  }
  let integer = arr[0]
  let decimal = arr[1]
  if (decimal.length === n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0'
    }
    return result
  }
  result = integer + '.' + decimal.substr(0, n)
  let last = decimal.substr(n, 1)
  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    let x = Math.pow(10, n)
    result = (Math.round((parseFloat(result) * x)) + 1) / x
    result = toFixed(result, n)
  }
  return result
}
export function fixDecimalPrecision(a, b) {
  let c = ''
  b || (b = 8)
  if (!Utils.isEmpty(a)) {
    let d = parseFloat(a)
    if (!isNaN(d)) {
      let e = (d + '').split('.')[1]
      c = e && e.length > b ? parseFloat(toFixed(d, b)) : d
      b > 6 && Math.abs(c) < 1 && /e-/.test(c + '') && (c = parseFloat(toFixed(d, 6)))
    }
  }
  return c
}
export function evalExpression(op, left, right) {
  const calcOps = ['+', '-', '*', '/']
  let result
  if (op === '!') {return wd.eval(op + left)}
  if (calcOps.indexOf(op) > -1 && Utils.isValidNumber(left) && Utils.isValidNumber(right)) {
    switch (op) {
      case '+':
        result = new Big(left).plus(right)
        break
      case '-':
        result = new Big(left).minus(right)
        break
      case '*':
        result = new Big(left).times(right)
        break
      case '/':
        result = right === 0 ? '' : new Big(left).div(right)
    }
    return result === '' ? null : Number(result.toString())
  }
  return wd.eval(left + op + right)
}
