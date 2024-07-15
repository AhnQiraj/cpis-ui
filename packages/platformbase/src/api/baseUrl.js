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
export const WORKORDER_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/workorder/v3"
}
export const TWOTICKETS_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/tickets/v3"
}
export const TWOTICKET_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/two-ticket/v3"
}
export const INSPECTION_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/inspection/v3"
}
export const SHIFTDUTY_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/shiftduty/v3"
}
export const SAFEPRO_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/safety/v3"
}
export const OVERHAUL_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/workorder/v3"
}
export const EQUIPMENT_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/equipment/v3"
}
export const METERIAL_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/material/v3"
}
export const EXTEND_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/extend/v3"
}
export const CALCULATION_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/calculation/v3"
}
/**
 * 小指标考核请求路径
 */
export const ASSESS_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/assess/v3"
}
export const LEANPRODUCT_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/leanproduct/v3"
}
export const EXAMINATION_URL = () => {
  return window.config.VUE_APP_BUSINESS_SINGLE === "true" ? "" : "/examination/v3"
}
