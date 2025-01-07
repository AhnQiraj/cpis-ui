import { hasPermission as globalHasPermission } from '../utils/permission'
export default {
  methods: {
    hasPermission(permissionKey) {
      return globalHasPermission(permissionKey)
    },
    getPermissionKey({ key, permission }) {
      if (permission) {
        return permission
      }
      if (this.identity) {
        // 有别名拼接别名
        return this.identity + '_' + key
      }
      return key
    }
  }
}
