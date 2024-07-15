import FIELD_TYPES from '../../constants/fieldTypes'
export function getDefaultAttributes(field, formType) {
  let _base
  const attrs = {
    field_type: field.field_type,
    name: '',
    label: field.label,
    icon: field.icon,
    field_options: {}
  }
  // if (typeof (field.is_input) === 'boolean' ? field.is_input : true) {
  //   attrs.field_options.default_value_type = 'fixed'
  //   attrs.field_options.placeholder = '请输入'
  // } else {
  //   attrs.name = shortid.gen().toLowerCase()
  // }
  return (typeof (_base = FIELD_TYPES[field.field_type]).defaultAttributes === 'function' ? _base.defaultAttributes(attrs, formType) : void 0) || attrs
}
