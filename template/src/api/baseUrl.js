import Vue from "vue"
import { API_DOMAIN_NAMES, MULTIPLE_DOMAIN } from "@/constant"
const getApi = (api, i) => {
  if (i === null || i === undefined) {
    i = 0
  }
  const domainName = API_DOMAIN_NAMES[i] || API_DOMAIN_NAMES[0] || ""
  return api.replace("{DOMAIN}", domainName)
}
// 网关API 解决上传乱码问题
export const BASE_GATEWAY_API = function (i) {
  const api = window.config.VUE_APP_BASE_API
  return MULTIPLE_DOMAIN ? getApi(api, i) : api
}
// websocket地址
export const BASE_WEBSOCKET_API = i => {
  const api = Vue.prototype.store && Vue.prototype.store.getters.websocket ? Vue.prototype.store.getters.websocket : window.config.VUE_APP_BASE_WEBSOCKET_API
  return MULTIPLE_DOMAIN ? getApi(api, i) : api
}
export const OAUTH2_BASE_URL = () => {
  return "/oauth2/v3"
}
export const PLATFORM_BASE_URL = () => {
  return "/platform/v3"
}
export const BUSINESS_BASE_URL = () => {
  return "/business/v3"
}
// ========== business=================
export const OAUTH2_URL = () => {
  return OAUTH2_BASE_URL()
}
// ========== business=================
export const FORM_URL = () => {
  return BUSINESS_BASE_URL()
}
export const BPMN_URL = () => {
  return BUSINESS_BASE_URL()
}
export const DATA_URL = () => {
  return BUSINESS_BASE_URL()
}
export const CODEGEN_URL = () => {
  return BUSINESS_BASE_URL()
}
// ========== PLATFORM_BASE_URL=================
export const PLATFORM_URL = () => {
  return PLATFORM_BASE_URL()
}
export const ORG_URL = () => {
  return PLATFORM_BASE_URL()
}
export const AUTH_URL = () => {
  return PLATFORM_BASE_URL()
}
export const SAAS_URL = () => {
  return PLATFORM_BASE_URL()
}
export const CAT_URL = () => {
  return PLATFORM_BASE_URL()
}
export const JOB_URL = () => {
  return PLATFORM_BASE_URL()
}
export const SYSTEM_URL = () => {
  return PLATFORM_BASE_URL()
}
export const LOG_URL = () => {
  return PLATFORM_BASE_URL()
}
export const MSG_URL = () => {
  return PLATFORM_BASE_URL()
}
export const MAIL_URL = () => {
  return PLATFORM_BASE_URL()
}
export const OFFICE_URL = () => {
  return PLATFORM_BASE_URL()
}
export const SERV_URL = () => {
  return PLATFORM_BASE_URL()
}
export const DS_URL = () => {
  return PLATFORM_BASE_URL()
}
export const INFO_URL = () => {
  return PLATFORM_BASE_URL()
}
export const SOCKET_URL = () => {
  return PLATFORM_BASE_URL()
}
// ========== CPIS_URL=================
export const FUEL_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/fuel/v3"
}
