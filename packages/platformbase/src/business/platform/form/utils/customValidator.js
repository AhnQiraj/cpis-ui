import Utils from '@platform/utils/util'
import fecha from '@platform/utils/fecha'
import { validateEmpty } from '@platform/utils/validate'
// 设置时间差
function setDataInterval(curDate, d, interval, type) {
  const isBefore = type === 'before'
  d = isBefore ? -d : d
  // let i = 0
  if (interval === 'y') {
    // 年
    curDate.setFullYear(curDate.getFullYear() + d)
  } else if (interval === 'm') {
    // 月
    curDate.setMonth(curDate.getMonth() + d)
    // i = 1
  } else if (interval === 'd') {
    // 日
    curDate.setDate(curDate.getDate() + d)
    // i = 2
  } else if (interval === 'h') {
    // 时
    curDate.setHours(curDate.getHours() + d)
    // i = 3
  } else if (interval === 'mi') {
    // 分
    curDate.setMinutes(curDate.getMinutes() + d)
    // i = 4
  } else if (interval === 's') {
    // 秒
    curDate.setSeconds(curDate.getSeconds() + d)
    // i = 5
  }
  // if (i < 1) {
  //   isBefore ? curDate.setMonth(0) : curDate.setMonth(11)
  // }
  // if (i < 2) {
  //   isBefore ? curDate.setDate(1) :	curDate.setDate(getCurrentMonthLast(curDate))
  // }
  // if (i < 3) {
  //   isBefore ?	curDate.setHours(0) : curDate.setHours(23)
  // } if (i < 4) {
  //   isBefore ? curDate.setMinutes(0) :	curDate.setMinutes(59)
  // }
  // if (i < 5) {
  //   isBefore ?	curDate.setSeconds(0) : curDate.setSeconds(59)
  // }
  return curDate
}
/**
 * 这个月最后一天
 * @param {*} date
 */
// function getCurrentMonthLast(date) {
//   const currentMonth = date.getMonth()
//   const nextMonth = currentMonth + 1
//   const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
//   const oneDay = 1000 * 60 * 60 * 24
//   const res = new Date(nextMonthFirstDay - oneDay)
//   return res.getDate()
// }
/**
 *
 * 格式化时间【字符串】
 * @param {*} dateStr
 * @param {*} datefmt
 */
export function parseFormatDate(dateStr, datefmt) {
  if (Utils.isEmpty(dateStr)) {
    return dateStr
  }
  return fecha.parse(fecha.format(dateStr, datefmt), datefmt)
}
/**
 * 格式化时间【日期】
 * @param {*} date
 * @param {*} datefmt
 */
export function formatParseDate(date, datefmt) {
  if (Utils.isEmpty(date)) {
    return date
  }
  return fecha.format(fecha.parse(date, datefmt), datefmt)
}
/**
 * 获取时间戳
 * @param {*} value
 * @param {*} format
 */
function getDateTimestamp(value, format = 'yyyy-MM-dd HH:mm:ss') {
  return fecha.parse(value, format).getTime()
}
function getDate(dateType, dateVal, dateInterval, datefmt, nowDate, models) {
  let date
  if (dateType === 'specific') {
    // 特定时间
    date = dateVal
  } else if (dateType === 'form') {
    // 表单字段
    date = formatParseDate(models[dateVal], datefmt)
  } else if (dateType === 'today') {
    // 当前时间
    date = fecha.format(new Date(), datefmt)
  } else if (dateType === 'before') {
    let curDate = parseFormatDate(nowDate, datefmt) // 当前日期
    curDate = setDataInterval(curDate, parseInt(dateVal ? 0 : 10), dateInterval, dateType)
    date = fecha.format(curDate, datefmt)
  } else if (dateType === 'after') {
    let curDate = parseFormatDate(nowDate, datefmt) // 当前日期
    curDate = setDataInterval(curDate, parseInt(dateVal ? 0 : 10), dateInterval, dateType)
    date = fecha.format(curDate, datefmt)
  }
  return date
}
/**
 *  验证2个日期之间
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateDateBetween = (rule, value, callback) => {
  if (Utils.isEmpty(value)) {
    return validateEmpty(rule, value, callback)
  }
  let errMessage = ''
  const fieldOptions = rule.fieldOptions
  const datefmt = fieldOptions['datefmt'] || 'yyyy-MM-dd HH:mm:ss'
  const curValDate = fecha.parse(value, datefmt)
  // 验证值是否是日期
  if (curValDate === null) {
    errMessage = '不是有效的日期格式'
    return callback(new Error(errMessage))
  }
  const curTimestamp = curValDate.getTime()
  // 表单数据
  const models = rule.models
  const nowDate = new Date()
  // 开始时间
  let startDate
  let startTimestamp // 开始时间时间戳
  if (fieldOptions['is_start_date'] && Utils.isNotEmpty(fieldOptions['start_date_type'])) {
    startDate = getDate(fieldOptions['start_date_type'], fieldOptions['start_date'], fieldOptions['start_date_interval'], datefmt, nowDate, models)
    if (Utils.isNotEmpty(startDate)) {
      startTimestamp = getDateTimestamp(startDate, datefmt)
    }
  }
  // 结束时间
  let endDate
  let endTimestamp // 结束时间时间戳
  if (fieldOptions['is_end_date'] && Utils.isNotEmpty(fieldOptions['end_date_type'])) {
    endDate = getDate(fieldOptions['end_date_type'], fieldOptions['end_date'], fieldOptions['end_date_interval'], datefmt, nowDate, models)
    if (Utils.isNotEmpty(endDate)) {
      endTimestamp = getDateTimestamp(endDate, datefmt)
    }
  }
  // 时间范围
  if (Utils.isNotEmpty(startTimestamp) && Utils.isNotEmpty(startDate) && Utils.isNotEmpty(endTimestamp) && Utils.isNotEmpty(endDate) && (curTimestamp < startTimestamp || curTimestamp > endTimestamp)) {
    errMessage = '请选择时间在' + startDate + '至' + endDate + '之间'
    return callback(new Error(errMessage))
    // 开始时间
  } else if (Utils.isNotEmpty(startTimestamp) && Utils.isNotEmpty(startDate) && curTimestamp < startTimestamp) {
    errMessage = '请选择不早于' + startDate + '时间'
    return callback(new Error(errMessage))
    // 结束时间
  } else if (Utils.isNotEmpty(endTimestamp) && Utils.isNotEmpty(endDate) && curTimestamp > endTimestamp) {
    errMessage = '请选择不晚于' + endDate + '时间'
    return callback(new Error(errMessage))
  }
  return callback()
}
/**
 * 验证当前位置是否在在范围内
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateLocationRange = (rule, value, callback) => {
  if (Utils.isEmpty(value) || Utils.isEmpty(rule.limits)) {
    return callback()
  }
  const geolocation = JSON.parse(value)
  for (let i = 0; i < rule.limits.length; i++) {
    const limit = rule.limits[i]
    const distance = window.AMap.GeometryUtil.distance(limit.position, geolocation.lnglat)
    if (distance <= parseInt(limit.radius)) {
      return callback()
    }
  }
  callback(new Error(rule.message))
}
