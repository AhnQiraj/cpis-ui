export const formProps = {
  // 尺寸 ['medium ', 'small', 'mini']
  size: {
    type: String,
    validator: sizeValidator
  },
  // 是否在一行
  inline: {
    type: Boolean,
    default: true
  },
  // 文本的宽度
  labelWidth: {
    type: Number,
    default: 100
  },
  // 输入框的宽度
  itemWidth: Number,
  // 异步数据
  fuzzy: {
    type: Boolean,
    default: false
  },
  // 表单
  forms: {
    type: Array,
    required: true
  }
}
function sizeValidator(value) {
  const methodTypes = ['medium ', 'small', 'mini']
  const valid = methodTypes.indexOf(value.toLowerCase()) !== -1 || value === ''
  if (!valid) {
    throw new Error(`Size must be one of ['medium ', 'small', 'mini']`)
  }
  return valid
}
