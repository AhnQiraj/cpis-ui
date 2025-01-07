export function hasPermission(permissionKey) {
  // 是否是超级用户
  const isSuper = JSON.parse(window.sessionStorage.getItem('isSuper'))
  if (!permissionKey || isSuper) {
    return true
  }
  if (
    !Array.isArray(permissionKey) &&
    typeof permissionKey !== 'string' &&
    !permissionKey.length
  ) {
    return false
  }
  const permissions = JSON.parse(window.sessionStorage.getItem('permissions'))
  return Array.isArray(permissionKey)
    ? permissionKey.some(v => {
        return permissions[v]
      })
    : permissions[permissionKey]
}
