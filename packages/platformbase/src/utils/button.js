/**
 * 按钮统一处理
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import BUTTONS from "@platform/constants/buttons"
/**
 * 获取按钮的icon
 * @param {*} key
 */
export function getButtonIcon(key) {
  return BUTTONS[key] ? BUTTONS[key].icon : null
}
/**
 * 获取按钮类型
 */
export function getButtonType(key) {
  return BUTTONS[key] ? BUTTONS[key].type : "primary"
}
/**
 * 获取是否权限控制
 */
export function getButtonAccessControl(key) {
  return BUTTONS[key] ? BUTTONS[key].accessControl !== false : true
}
