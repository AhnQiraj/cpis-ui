const buttonTypes = {
  'close': {
    label: '关闭',
    style: 'default',
    icon: 'close',
    scope: ['form', 'detail', 'combination']
  },
  'save': {
    label: '保存',
    style: 'primary',
    icon: 'save',
    scope: ['form', 'combination']
  },
  'saveAndContinue': {
    label: '保存后继续',
    style: 'primary',
    icon: 'save',
    scope: ['combination']
  },
  'sefStartFlow': {
    label: '启动自定义流程',
    style: 'primary',
    icon: 'send',
    scope: ['form']
  },
  'custom': {
    label: '自定义按钮',
    style: 'primary',
    icon: 'cog',
    scope: ['form', 'detail', 'combination']
  }
}
const getFormButtonType = function(alias) {
  const button = buttonTypes[alias]
  const btn = {
    alias: alias,
    label: button.label,
    style: button.style,
    icon: button.icon,
    position: button.position
  }
  return btn
}
export const formButtonType = getFormButtonType
const getFormButtonTypes = function() {
  const FormButtonTypes = []
  for (const alias in buttonTypes) {
    FormButtonTypes.push(getFormButtonType(alias))
  }
  return FormButtonTypes
}
export const formButtonTypes = getFormButtonTypes()
function hasButtonPermission(alias, action) {
  if (!alias || alias === '') {return false}
  const positions = buttonTypes[alias] ? buttonTypes[alias]['scope'] : ['form']
  if (!positions) {return false}
  return positions.indexOf(action) > -1
}
/**
* 是否有权限
*/
export const hasPermission = hasButtonPermission
function getFormButtonTypeOptions() {
  const options = []
  for (const alias in buttonTypes) {
    const button = buttonTypes[alias]
    options.push({
      value: alias,
      label: button.label
    })
  }
  return options
}
export const formButtonTypeOptions = getFormButtonTypeOptions()
export default buttonTypes
