import { hasPermission } from "@/mixins/permission"
import { PERMISSION_EFFECT } from "@/constant"
function checkPermission(el, binding, vnode) {
  const { value } = binding
  const hasRights = hasPermission(value)
  if (hasRights) {
    return
  }
  // 另外以上几种都是如何声明组件所需权限，而如果登录用户没有这个权限，则组件将会被隐藏，
  // 但是也可以使用下面的配置让组件变为半透明且不可用点击
  if (PERMISSION_EFFECT === "disabled") {
    // 如果登录用户没有这个权限，则让组件变为半透明且不可用点击
    el.disabled = true
    el.style.opacity = "0.5"
    el.style.cursor = "not-allowed"
    if (vnode.componentInstance) {
      vnode.componentInstance.$emit("update:disabled", true)
    }
  } else if (PERMISSION_EFFECT === "hidden") {
    // 如果登录用户没有这个权限，则组件将会被隐藏
    el.parentNode && el.parentNode.removeChild(el)
  }
  // } else {
  //   throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  // }
}
/**
 * v-permission
 * 按钮级别权限
 */
export default {
  inserted(el, binding, vnode) {
    checkPermission(el, binding, vnode)
  },
  update(el, binding, vnode) {
    checkPermission(el, binding, vnode)
  }
}
