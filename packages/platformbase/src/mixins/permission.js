import { ENABLE_PERMISSION, PERMISSION_EFFECT } from '@platform/constant'
/**
 * 获取权限值
 */
export function getPermissionKey({ key, permission }, identity) {
  if (permission) {
    return permission
  }
  if (identity) {
    // 有别名拼接别名
    return identity + '_' + key
  }
  return
}
/**
 * 是否有权限
 * @param {*} permissionKey
 */
export function hasPermission(permissionKey) {
  // 是否是超级用户
  const isSuper = JSON.parse(window.sessionStorage.getItem('isSuper'))
  if (!ENABLE_PERMISSION || !permissionKey || isSuper) {
    return true
  }
  let hasRights = false
  const permissions = JSON.parse(window.sessionStorage.getItem('permissions'))
  if (permissionKey && permissionKey.length > 0 && (permissionKey instanceof Array || Object.prototype.toString.call(permissionKey) === '[object String]')) {
    if (permissionKey instanceof Array) {
      hasRights = permissionKey.some(v => {
        return permissions[v]
      })
    } else {
      hasRights = permissions[permissionKey]
    }
  }
  return hasRights
}
/**
 * 检测右键菜单的是否有权限
 */
export function checkContextmenuPermission(contextmenuList, identity) {
  const isSuper = JSON.parse(window.sessionStorage.getItem('isSuper')) === 'Y'
  if (!ENABLE_PERMISSION || isSuper) {
    return contextmenuList
  }
  const list = []
  for (let i = 0; i < contextmenuList.length; i++) {
    const contextmenu = contextmenuList[i]
    const permissionKey = getPermissionKey(contextmenu, identity)
    const hasRights = hasPermission(permissionKey)
    if (hasRights) {
      list.push(contextmenu)
    } else {
      if (PERMISSION_EFFECT === 'disabled') {
        contextmenu.disabled = !hasRights
        list.push(contextmenu)
      }
    }
  }
  return list
}
/**
 * 是否有rowAction的权限
 * @param {*} rowActions
 * @param {*} identity
 */
export function hasRowActionsPermission(rowActions, identity) {
  if (ENABLE_PERMISSION && PERMISSION_EFFECT === 'hidden') {
    // 判断儿子节点是否隐藏
    for (let i = 0; i < rowActions.length; i++) {
      const hasRights = hasPermission(getPermissionKey(rowActions[i], identity))
      if (hasRights) {
        return true
      }
    }
  } else {
    return true
  }
}
