const buttonTypes = {
  add: {
    label: '添加',
    style: 'primary',
    icon: 'add',
    position: 'toolbar',
    scope: ['toolbar'],
    formType: ['form']
  },
  remove: {
    label: '删除',
    style: 'danger',
    icon: 'remove',
    position: 'all',
    scope: ['toolbar', 'manage'],
    formType: ['form']
  },
  edit: {
    label: '编辑',
    style: 'primary',
    icon: 'edit',
    position: 'edit',
    scope: ['manage'],
    formType: ['form', 'detail']
  },
  detail: {
    label: '明细',
    style: 'primary',
    icon: 'detail',
    position: 'edit',
    scope: ['manage'],
    formType: ['detail']
  },
  import: {
    label: '导入',
    style: 'primary',
    icon: 'import',
    position: 'toolbar',
    scope: ['toolbar'],
    formType: ['form']
  },
  export: {
    label: '导出',
    style: 'primary',
    icon: 'export',
    position: 'toolbar',
    scope: ['toolbar'],
    formType: ['form']
  },
  custom: {
    label: '自定义按钮',
    style: 'primary',
    icon: 'cog',
    position: 'all',
    scope: ['toolbar', 'manage'],
    formType: ['form', 'detail']
  }
}
export default buttonTypes
export const getTableButtonsByFormType = function (formType) {
  const tableButtonTypes = []
  for (const type in buttonTypes) {
    const button = buttonTypes[type]
    if (!button.formType || button.formType.includes(formType)) {
      tableButtonTypes.push(this.getTableButtonType(type))
    }
  }
  return tableButtonTypes
}
const getTableButtonType = function (type) {
  const button = buttonTypes[type]
  const btn = {
    type: type,
    label: button.label,
    style: button.style,
    icon: button.icon,
    position: button.position
  }
  return btn
}
export const tableButtonType = getTableButtonType
const getTableButtonTypes = function () {
  const tableButtonTypes = []
  for (const type in buttonTypes) {
    tableButtonTypes.push(getTableButtonType(type))
  }
  return tableButtonTypes
}
export const tableButtonTypes = getTableButtonTypes()
function hasButtonPermission(type, action) {
  if (!type || type === '') {
    return false
  }
  const positions = buttonTypes[type] ? buttonTypes[type]['scope'] : ['toolbar', 'manage']
  if (!positions) {
    return false
  }
  return positions.indexOf(action) > -1
}
/**
 * 是否有权限
 */
export const hasPermission = hasButtonPermission
function getSubButtonTypeOptions() {
  const options = []
  for (const type in buttonTypes) {
    const button = buttonTypes[type]
    options.push({
      value: type,
      label: button.label
    })
  }
  return options
}
export const subButtonTypeOptions = getSubButtonTypeOptions()
