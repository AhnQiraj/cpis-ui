import Utils from '@platform/utils/util'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import { optionsFilter, dateFormat } from '@platform/filters/index'
const FieldUtil = {
  showModel(val, fieldOptions) {
    val = Number(val)
    if (Utils.isEmpty(fieldOptions.number_format)) {return val}
    if (fieldOptions.number_format === 'percent') {
      val = val * 100
      val = FieldUtil.getNumByDecimals(val, fieldOptions)
      val += '%'
    } else {
      val = FieldUtil.getNumByDecimals(val, fieldOptions)
      if (fieldOptions.thousands) {
        val = Utils.comdify(val)
      }
    }
    return val
  },
  getNumByDecimals(val, fieldOptions) {
    if (fieldOptions.keep_decimals) {
      if (Utils.isNotEmpty(fieldOptions.decimal_places)) {
        if (fieldOptions.decimal_scale) {
          val = val.toFixed(fieldOptions.decimal_places)
        } else {
          const multiple = Math.pow(10, fieldOptions.decimal_places)
          val = ((Math.round(val * multiple)) / multiple).toString()
        }
      }
    }
    return val
  },
  // 日期格式
  datefmt(fieldOptions, fieldType) {
    if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
      if (fieldType === 'currentDate') {
        return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
      } else if (fieldType === 'currentTime') {
        return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['time']
      } else {
        return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
      }
    } else {
      return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
    }
  },
  // 通过字段配置，值获取
  getDescByField(field, value) {
    // 判断传入的值是否为空
    if (Utils.isEmpty(value)) {return ''}
    if (Utils.isEmpty(field)) {return value}
    const fieldType = field.field_type
    const fieldOptions = field.field_options || {}
    let result = ''
    if (fieldType === 'text') {
      result = value
    } else if (fieldType === 'textarea') {
      result = Utils.formatText(value)
    } else if (fieldType === 'number') {
      result = FieldUtil.showModel(value, fieldOptions)
    } else if (fieldType === 'inputNumber') {
      result = value
    } else if (fieldType === 'radio') {
      const options = fieldOptions['options'] || []
      result = optionsFilter(value, options, 'label', 'val')
    } else if (fieldType === 'checkbox' || fieldType === 'select') {
      const options = fieldOptions['options'] || []
      const _arrs = value.split(',')
      const _val = []
      _arrs.forEach(el => {
        const _temp = optionsFilter(el, options, 'label', 'val')
        _val.push(_temp)
      })
      result = _val.join(',')
    } else if (fieldType === 'switch') {
      const switchOptions = FormUtils.getSwitchOptions(fieldOptions)
      result = optionsFilter(value, switchOptions, 'label', 'val')
    } else if (fieldType === 'slider') {
      result = value
    } else if (fieldType === 'rate') {
      result = value
    } else if (fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate') {
      const _datefmt = FieldUtil.datefmt(fieldOptions, fieldType)
      result = dateFormat(value, _datefmt, _datefmt)
    } else if (fieldType === 'editor') {
      result = Utils.formatText(value)
    } else if (fieldType === 'address') {
      result = value
      const data = Utils.parseJSON(value)
      if (Utils.isNotEmpty(data) && Utils.isObject(data)) {
        const country = data['country'] || ''
        const province = data['province'] || ''
        const city = data['city'] || ''
        const district = data['district'] || ''
        const street = data['street'] || ''
        const arrs = []
        if (Utils.isNotEmpty(country)) {
          arrs.push(country)
        }
        if (Utils.isNotEmpty(province)) {
          arrs.push(province)
        }
        if (Utils.isNotEmpty(city)) {
          arrs.push(city)
        }
        if (Utils.isNotEmpty(district)) {
          arrs.push(district)
        }
        if (Utils.isNotEmpty(street)) {
          arrs.push(street)
        }
        result = arrs.join(' ')
      }
    // todo
    } else if (fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg') {
      result = value
    } else if (fieldType === 'dictionary') {
      result = value
    } else if (fieldType === 'autoNumber') {
      result = value
    } else if (fieldType === 'attachment') {
      result = value
    } else if (fieldType === 'customDialog') {
      result = value
    } else if (fieldType === 'linkdata') {
      result = value
    } else if (fieldType === 'signature') {
      result = value
    } else if (fieldType === 'image') {
      result = value
    } else if (fieldType === 'barcode') {
      result = value
    } else if (fieldType === 'qrcode') {
      result = value
    } else if (fieldType === 'location') {
      result = value
    } else if (fieldType === 'bpmInstHis') {
      result = value
    } else if (fieldType === 'bpmLink') {
      result = value
    } else if (fieldType === 'component') {
      result = value
    } else if (fieldType === 'control') {
      result = value
    } else if (fieldType === 'hyperlink') {
      result = value
    } else if (fieldType === 'label') {
      result = value
    } else {
      result = value
    }
    return result
  }
}
export default FieldUtil
