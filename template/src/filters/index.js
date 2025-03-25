import { format, formatRelativeTime as getRelativeTime, dateDealFmt } from '@/utils/fecha'
import Utils from '@/utils/util'
/**
 * 时间格式化
 *
 */
export function dateFormat(dateObj, dateFormat = 'yyyy-MM-dd HH:mm:ss', origFormat) {
  if (Utils.isEmpty(dateObj)) {return ''}
  try {
    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj)
    }
    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      // 需要把字符串转换日期格式
      dateObj = dateDealFmt.dealFmt(dateObj, origFormat || dateFormat)
    }
    return format(dateObj, dateFormat)
  } catch (error) {
    console.error('转换日期格式错误：', error, dateObj, dateFormat)
    return dateObj
  }
}
/**
 * 相对时间字符串
 * @param {String|Number} time 时间格式字符串，或者时间
 * @param {String} format 格式化字符串
 * @param {String} locale 国际化语言
 * @returns {String} 相对时间字符串
 */
export function formatRelativeTime(time, format, locale) {
  return getRelativeTime(time, format, locale)
}
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  return time + label
}
/**
 * duration
 * @param {*} time
 */
export function duration(time) {
  const between = Number(time)
  if (between < 1000) {
    return pluralize(~~(between / 1000), '秒')
  } else if (between < 3600 * 1000) {
    return pluralize(~~(between / (60 * 1000)), '分钟')
  } else if (between < 86400 * 1000) {
    return pluralize(~~(between / (60 * 60 * 1000)), '小时')
  } else {
    return pluralize(~~(between / (60 * 60 * 24 * 1000)), '天')
  }
}
/**
 * 附件容量数字 格式化
 * @param {*} num
 * @param {*} digits
 */
export function numberFormatter(num, digits = 2) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}
/**
 * html 格式转文本
 * @param {*} val
*/
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}
/**
 * 正则去掉所有的html标记
 * @param {*} val
 */
export function removeHtmlTag(val) {
  if (Utils.isEmpty(val)) {return val}
  return val.replace(/<[^>]+>/g, '')
}
/**
 * 去第一个字符
 * @param {*} val
 */
export function firstStr(val) {
  return val.substr(0, 1)
}
/**
 * 金额格式化
 * @param {*} num
 * @param {*} digits
 */
export function amountFormatter(num, digits = 2) {
  if (num) {
    return Number(num).toFixed(digits)
  } else {
    return num
  }
}
/**
 * 千分位过滤
 * @param {*} num
 */
export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
/**
 * 选项过滤
 * @param {*} val  值
 * @param {*} options 选项值
 * @param {*} labelKey  选项的展示值key
 * @param {*} valueKey  选项的值key
 */
export function optionsFilter(val, options = [], labelKey = 'label', valueKey = 'value', defaultValue = '') {
  let opt
  if (Array.isArray(options)) {
    opt = options.find(x => x[valueKey] === val)
  }
  return opt ? opt[labelKey] : val || defaultValue
}
/**
 * 多选选项过滤
 * @param {*} val  值
 * @param {*} options 选项值
 * @param {*} labelKey  选项的展示值key
 * @param {*} valueKey  选项的值key
 */
export function optionsCheckboxFilter(val, options = [], labelKey = 'label', valueKey = 'value', defaultValue = '') {
  if (Utils.isEmpty(val)) {
    return []
  }
  const valAry = val.split(',')
  const optMap = []
  options.forEach(x => {
    optMap[valueKey] = x[labelKey]
  })
  const optVal = []
  valAry.forEach(v => {
    if (optMap[v]) {
      optVal.push(optMap[v])
    }
  })
  return optVal
}
/**
 * 取字符串最后一个“/”后面的内容
 * @param {*} val
 */
export function getStrAfterLastSlash(val) {
  if (Utils.isEmpty(val)) {return val}
  const index = val.lastIndexOf("/")
  return val.substr( index <= 0 ? 0 : (index == val.length -1 ? index : index + 1), val.length)
}
