import i18n from '@platform/i18n'
import utils from '@platform/utils/util'
/**
 * 验证手机号
 * @param {*} phone
 */
export function validateMobile(phone) {
  const rtn = {
    result: true,
    msg: ''
  }
  let result = true
  let msg = ''
  const isPhone = /^0\d{2,3}-?\d{7,8}$/
  if (utils.isNotEmpty(phone)) {
    if (phone.length === 11) {
      if (isPhone.test(phone)) {
        msg = 'format' // '手机号码格式不正确'
        result = false
      }
    } else {
      msg = 'length' // '手机号码长度不为11位'
      result = false
    }
  } else {
    msg = 'empty'
    result = false
  }
  rtn.result = result
  rtn.msg = msg
  return rtn
}
/**
 * 字段验证
 * 首字符为字母，其它只允许为字母、数字或下划线，并且长度不超过18字符"
 * @param {*} value
 * @param {*} callback
 */
export function testField(rule, value, callback) {
  const res = /^[A-Za-z]{1}([a-zA-Z0-9_]{1,17})$/
  if (!res.test(value) && value.length < 19) {
    if (value.length < 2) {
      callback(new Error('长度不低于2字符!'))
    } else {
      callback(new Error('首字符为字母，其它只允许为字母、数字或下划线!'))
    }
  } else if ((!res.test(value) || res.test(value)) && value.length > 18) {
    callback(new Error('长度不超过18字符!'))
  } else {
    callback()
  }
}
/**
 * 判断校验为空的
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateEmpty(rule, value, callback) {
  const pattern = /\s/
  if (rule.required) {
    callback(new Error(rule.message || i18n.t('validate.required')))
  } else {
    if (pattern.test(value)) {
      callback(new Error('字符请勿携带空格'))
      return
    }
    callback()
  }
}
/**
 * 判断校验为必填
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateRequired(rule, value, callback) {
  if (utils.isEmpty(utils.trim(value))) {
    callback(new Error(rule.message || i18n.t('validate.required')))
    return
  }
  callback()
}
/**
 * 整数验证
 * @param {*} value
 */
export function isNumber(value) {
  if (isNaN(value)) {
    return false
  }
  return typeof value === 'number'
}
/**
 * 验证整数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateInteger = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  value = Number(value)
  if (value > 2147483647) {
    callback(new Error('超过数字的最大值'))
  } else if (value < -2147483648) {
    callback(new Error('超过数字的最小值'))
  } else if (isNumber(value) && parseInt(value, 10) === value) {
    callback()
  } else {
    callback(new Error(rule.message || i18n.t('validate.integer')))
  }
}
export const validateFloat = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  const re = /^-?\d*\.\d+$/
  if (!re.test(value) || !isNumber(Number(value))) {
    callback(new Error('填写只能为浮点型'))
  } else {
    callback()
  }
}
/**
 * 验证key或者变量
 * 只能为字母开头,允许字母、数字和下划线
 * @param {*} str
 */
export function testKey(str) {
  const reg = /^[a-zA-Z0-9][a-zA-Z0-9_]*$/
  return reg.test(str)
}
/**
 * 验证业务组键key
 * 只能为字母开头,允许字母、数字、下划线和横线
 * @param {*} str
 */
export function testBizKey(str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_-]*$/
  return reg.test(str)
}
/**
 * 验证类名key
 * 只能为大写字母开头,允许字母、数字
 * @param {*} str
 */
export function testUpperCaseKey(str) {
  const reg = /^[A-Z][a-zA-Z0-9]*$/
  return reg.test(str)
}
/**
 * 验证类名key
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateUpperCaseKey = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testUpperCaseKey(value)) {
    callback(new Error('规则不合法,只能以大写字母开头,允许字母、数字！'))
  } else {
    callback()
  }
}
/**
 * 验证key
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateKey = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testKey(value)) {
    callback(new Error(rule.message || i18n.t('validate.key')))
  } else {
    callback()
  }
}
/* 合法url */
export function testURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
/**
 * 验证url
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateURL = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testURL(value)) {
    callback(new Error(rule.message || i18n.t('validate.url')))
  } else {
    callback()
  }
}
/* 小写字母 */
export function testLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}
/**
 * 验证小写字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateLowerCase = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testLowerCase(value)) {
    callback(new Error(rule.message || i18n.t('validate.lowerCase')))
  } else {
    callback()
  }
}
/* 大写字母 */
export function testUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}
/**
 * 验证大写字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateUpperCase = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testUpperCase(value)) {
    callback(new Error(rule.message || i18n.t('validate.upperCase')))
  } else {
    callback()
  }
}
/* 大小写字母 */
export function testAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/**
 * 验证大小写字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validatAlphabets = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  if (!testAlphabets(value)) {
    callback(new Error(rule.message || i18n.t('validate.alphabets')))
  } else {
    callback()
  }
}
/**
 * 多少选项
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateOptions = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  const arrayValue = value.split(',') || []
  const item = arrayValue.length
  const min = rule.min
  const max = rule.max
  if (min && !max && item < min) {
    callback(new Error(rule.message || `至少选择 ${min}项`))
  } else if (max && !min && item > max) {
    callback(new Error(rule.message || `最多选择 ${max}项`))
  } else if (min && max && (item < min || item > max)) {
    callback(new Error(rule.message || `选择选项${min}至${max}项`))
  } else {
    callback()
  }
}
/**
 * 验证字符长度
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateLengthRange = (rule, value, callback) => {
  const min = typeof rule.min === 'number'
  const max = typeof rule.max === 'number'
  if (utils.isEmpty(value)) {
    callback()
    return
  }
  let val = value
  if (rule.format) {
    val = rule.format(val, rule)
  }
  const length = val.length
  if (min && !max && length < rule.min) {
    callback(new Error(rule.message || `最少填写${rule.min}个字符`))
  } else if (max && !min && length > rule.max) {
    callback(new Error(rule.message || `最多填写${rule.max}个字符`))
  } else if (min && max && (length < rule.min || length > rule.max)) {
    callback(new Error(rule.message || `填写字符个数在 ${rule.min} - ${rule.max}之间`))
  } else {
    callback()
  }
}
export const validateNumberRange = (rule, value, callback) => {
  const min = typeof rule.min === 'number'
  const max = typeof rule.max === 'number'
  if (utils.isEmpty(value)) {
    callback()
    return
  }
  if (!utils.isNum(value)) {
    callback(new Error('无效数字'))
    return
  }
  const val = Number(value)
  if (min && !max && val < rule.min) {
    callback(new Error(rule.message || `必须大于或等于${rule.min}`))
  } else if (max && !min && val > rule.max) {
    callback(new Error(rule.message || `必须小于或等于${rule.max}`))
  } else if (min && max && (val < rule.min || val > rule.max)) {
    callback(new Error(rule.message || `必须在 ${rule.min} 到 ${rule.max}之间`))
  } else {
    callback()
  }
}
/**
 * 验证小数位
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateDecimal = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  const len = (value + '').replace(/^[^.]*[.]*/, '').length
  if (len > rule.decimal) {
    callback(new Error(rule.message || `小数位不能超过${rule.decimal}位`))
  } else {
    callback()
  }
}
export const validateDateBetween = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  callback()
}
