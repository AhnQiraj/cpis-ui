import { nestedFieldTypes, needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import Utils from '@platform/utils/util'
import Ids from 'ids'
export function getDefaultActive(fieldType) {
  if (fieldType === 'tabs') {
    return 'tabs_0'
  } else if (fieldType === 'steps') {
    return 0
  } else {
    return ''
  }
}
export function getFieldInWidgetAdd(field, fieldType) {
  let _temp = field
  // 单选、多选、下拉
  if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
    _temp = {
      ..._temp,
      field_options: {
        ..._temp.field_options,
        options: _temp.field_options.options.map(item => ({
          ...item
        }))
      }
    }
    // 嵌套布局
  } else if (nestedFieldTypes.includes(fieldType)) {
    let name = _temp.name
    if (Utils.isEmpty(name)) {name = fieldType + '_' + new Ids([32, 36, 1]).next()}
    _temp = {
      ..._temp,
      name: name,
      active: getDefaultActive(fieldType),
      field_options: {
        ..._temp.field_options,
        columns: _temp.field_options.columns.map(item => ({
          ...item
        }))
      }
    }
    // 子表单
  } else if (fieldType === 'table') {
    _temp = {
      ..._temp,
      field_options: {
        ..._temp.field_options,
        buttons: _temp.field_options.buttons.map(item => ({
          ...item
        })),
        columns: _temp.field_options.columns.map(item => ({
          ...item
        }))
      }
    }
    // 审批意见
  } else if (fieldType === 'approval_opinion') {
    let name = _temp.name
    if (Utils.isEmpty(name)) {name = fieldType + '_' + new Ids([32, 36, 1]).next()}
    _temp = {
      ..._temp,
      name: name,
      field_options: {
        ..._temp.field_options,
        options: _temp.field_options.options.map(item => ({
          ...item
        }))
      }
    }
    // 需要处理name的字段
  } else if (!needModelFieldTypes.includes(fieldType)) {
    let name = _temp.name
    if (Utils.isEmpty(name)) {name = fieldType + '_' + new Ids([32, 36, 1]).next()}
    _temp = {
      ..._temp,
      name: name
    }
  }
  return _temp
}
