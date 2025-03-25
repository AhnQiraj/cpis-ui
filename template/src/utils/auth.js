/**
 * TOKEN  等cookies的处理
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import Cookies from "./util.cookies.js"
import { UUID_KEY, LANG_KEY, TOKEN_STORE_KEY, REFRESH_TOKEN_STORE_KEY, TOKEN_STORE, TOKEN_DOMAIN, TOKEN_STORE_PREFIX, TENANT_ID } from "@/constant"
// 是否需要前缀
const isPrefix = TOKEN_STORE_PREFIX !== "custom"
function isEmpty(v) {
  return v === undefined || v === null || v === ""
}
/**
 * 获取token
 */
export function getToken() {
  const val = Cookies.get(TOKEN_STORE_KEY, isPrefix)
  return !isEmpty(val) ? val : undefined
}
/**
 * 设置token
 */
export function setToken(token, optins) {
  return Cookies.set(TOKEN_STORE_KEY, token, optins, isPrefix)
}
/**
 * 删除token
 */
export function removeToken() {
  return Cookies.remove(TOKEN_STORE_KEY, isPrefix)
}
// ===========刷新token==========
/**
 * 获取刷新token
 */
export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_STORE_KEY, isPrefix)
}
/**
 * 设置刷新token
 */
export function setRefreshToken(token, optins) {
  return Cookies.set(REFRESH_TOKEN_STORE_KEY, token, optins, isPrefix)
}
/**
 * 删除刷新token
 */
export function removeRefreshToken() {
  return Cookies.remove(REFRESH_TOKEN_STORE_KEY, isPrefix)
}
/**
 * 删除租户信息
 */
export function removeTenantId() {
  return Cookies.remove(TENANT_ID, isPrefix)
}
/**
 * 更新tonken（包含token和 refreshToken）
 */
export function updateToken(data) {
  const domain = TOKEN_STORE === "domain" ? TOKEN_DOMAIN : null
  // tonken 过期时间提前1分钟 前端不处理过期时间，后端处理过期时间
  // data.expires_in ? new Date(new Date().getTime() + ((parseInt(data.expires_in, 10) + 60) * 1000)) : 7
  setToken(data.access_token, {
    expires: null,
    domain: domain
  })
  // 刷新tonken过期时间提前2分钟
  setRefreshToken(data.refresh_token, {
    expires: null,
    domain: domain
  })
}
// UUID
export function getUuid() {
  return Cookies.get(UUID_KEY, isPrefix)
}
export function setUuid(uuid, optins) {
  return Cookies.set(UUID_KEY, uuid, optins, isPrefix)
}
export function removeUuid() {
  return Cookies.remove(UUID_KEY, isPrefix)
}
// 语言
export function getLang() {
  return Cookies.get(LANG_KEY, isPrefix)
}
export function setLang(value, optins) {
  return Cookies.set(LANG_KEY, value, optins, isPrefix)
}
export function removeLang() {
  return Cookies.remove(LANG_KEY, isPrefix)
}
