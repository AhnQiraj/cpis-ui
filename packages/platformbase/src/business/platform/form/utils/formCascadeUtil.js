/**
 *表单级联解析值
 */
import qs from 'qs'
import Utils from '@platform/utils/util'
import { getScriptValue } from '@platform/api/platform/form/common.js'
export async function getCascadeDynamicData(config, formData) {
  let cascadeDynamicData = {}
  const models = formData ? formData.models || {} : {}
  const type = config.type
  if (type === 'fixed') {
    cascadeDynamicData = await parseURL(config.url, config.params, models)
  } else if (type === 'form' && config.dataType === 'add') { // 在线表单新增
    cascadeDynamicData = await getDynamicParams(config.casadeFields, models)
  } else if ((type === 'form' && config.dataType === 'edit') || type === 'detail') { // 在线表单编辑和详情表单
    cascadeDynamicData = await getPkValue(config, models)
  } else if (type === 'dataTemplate') { // 数据模版
    cascadeDynamicData = getDataTempateDynamicParams(config.casadeFields, models)
  }
  const cascadeDynamicParams = await getDynamicParams(config.params, models)
  return new Promise((resolve, reject) => {
    resolve({
      data: cascadeDynamicData,
      params: cascadeDynamicParams
    })
  })
}
// 获得动态值
function getDynamicValue(value, vars) {
  return new Promise((resolve, reject) => {
    const params = {
      script: value,
      vars: vars || ''
    }
    getScriptValue(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
export async function getDynamicParams(params, data) {
  if (Utils.isEmpty(params)) {return null}
  const map = {}
  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    const key = param.key
    const value = await getCalculateValue({
      type: param.valueType,
      value: param.value
    }, data)
    map[key] = value
  }
  return map
}
export async function getPkValue(config, data) {
  const val = await getCalculateValue({
    type: config.pkValueType,
    value: config.pkValue
  }, data)
  return val
}
/**
  * 获取不同类型值
  * @param {*} config
  * @param {*} data
  */
async function getCalculateValue({ type, value }, data) {
  return new Promise((resolve, reject) => {
    if (Utils.isEmpty(value)) {
      resolve('')
      return
    }
    if (type === 'fixed') {
      resolve(value)
    } else if (type === 'bo') {
      resolve(data[value])
    } else if (type === 'script') {
      const vars = {
        data: data
      }
      getDynamicValue(value, vars).then(data => {
        resolve(data)
      })
    }
  })
}
/**
    * 获取数据模版动态参数数据
    */
export function getDataTempateDynamicParams(conditions, data = {}, code, row) {
  if (Utils.isEmpty(conditions)) {return {}}
  const dynamicParams = {}
  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i]
    let val = ''
    const changeValueName = condition.value
    if (Utils.isNotEmpty(changeValueName) && condition.mode === 'bind') { // 绑定表单
      const changeObj = changeValueName.split('.')// 改变的对象
      if (changeObj.length > 1) {
        const changeName = changeObj[changeObj.length - 1]
        if (Utils.isNotEmpty(row)) { // 子表的数据
          if (data[code] && data[code][row]) {
            val = data[code] && data[code][row] ? data[code][row][changeName] : (data[changeName] || '')
          } else {
            if (Array.isArray(data)) {
              val = data[code] && data[code][row] ? data[code][row][changeName] : (data[changeName] || '')
            } else {
              val = (data[changeName] || '')
            }
          }
        } else { // 弹窗模式
          const changeCode = changeObj[changeObj.length - 2]
          // 判断 相同表.避免出现重复表名取值问题
          if (changeCode === code) {
            val = data[changeName] || ''
          }
        }
      } else {
        val = data[changeObj[0]]
      }
    } else { // 固定值
      val = changeValueName
    }
    dynamicParams[condition.fieldName] = val || ''
  }
  return dynamicParams
}
/**
 * 解析url地址
 * @param {*} url
 * @param {*} casadeFields
 * @param {*} data
 * @returns
 */
export async function parseURL(url, casadeFields, data) {
  let result = url
  if (Utils.isNotEmpty(casadeFields)) {
    const params = {}
    for (let i = 0; i < casadeFields.length; i++) {
      const param = casadeFields[i]
      params[param.key] = await getCalculateValue({
        type: param.valueType,
        value: param.value
      }, data)
    }
    result = url + '?' + qs.stringify(params)
  }
  return result
}
