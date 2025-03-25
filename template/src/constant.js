const __IBPS_CONFIG__ = window.__IBPS_CONFIG__ || {}
export default __IBPS_CONFIG__
export const API_DOMAIN_NAMES = __IBPS_CONFIG__.API_DOMAIN_NAMES || []
export const MULTIPLE_DOMAIN = __IBPS_CONFIG__.MULTIPLE_DOMAIN || false
// ================认证中心=====================
export const GRANT_TYPE = __IBPS_CONFIG__.GRANT_TYPE || ""
export const CLIENT_ID = __IBPS_CONFIG__.CLIENT_ID || ""
export const CLIENT_SECRET = __IBPS_CONFIG__.CLIENT_SECRET || ""
// ================请求头=====================
export const HEADER_TOKEN_KEY = __IBPS_CONFIG__.HEADER_TOKEN_KEY || "X-Authorization-access_token"
export const FORM_TOKEN_KEY = __IBPS_CONFIG__.TOKEN_KEY || "access_token"
export const HEADER_SYSTEM_ID = __IBPS_CONFIG__.HEADER_SYSTEM_ID || "X-Authorization-systemid"
export const HEADER_TENANT_ID = __IBPS_CONFIG__.HEADER_TENANT_ID || "X-Authorization-tenantid"
export const TENANT_ID = __IBPS_CONFIG__.TENANT_ID || "tenant_id"
// ================Cookies 存储=====================
export const UUID_KEY = __IBPS_CONFIG__.UUID_KEY || "uuid"
export const LANG_KEY = __IBPS_CONFIG__.LANG_KEY || "lang"
export const TOKEN_STORE = __IBPS_CONFIG__.TOKEN_STORE || "default"
export const TOKEN_DOMAIN = __IBPS_CONFIG__.TOKEN_DOMAIN || "bpmhome.cn"
export const TOKEN_STORE_PREFIX = __IBPS_CONFIG__.TOKEN_STORE_PREFIX || "default"
export const TOKEN_STORE_KEY = __IBPS_CONFIG__.TOKEN_STORE_KEY || "token"
export const REFRESH_TOKEN_STORE_KEY = __IBPS_CONFIG__.REFRESH_TOKEN_STORE_KEY || "refresh_token"
export const ENABLE_PERMISSION = __IBPS_CONFIG__.ENABLE_PERMISSION || false
export const PERMISSION_EFFECT = __IBPS_CONFIG__.PERMISSION_EFFECT || "hidden"
export const AMAP_KEY = __IBPS_CONFIG__.AMAP_KEY || ""
export const TRANSFER_DATA = __IBPS_CONFIG__.TRANSFER_DATA || "transfer"
export const ENABLE_REFRESH_MESSAGE = __IBPS_CONFIG__.ENABLE_REFRESH_MESSAGE
export const REFRESH_MESSAGE_TIME = __IBPS_CONFIG__.REFRESH_MESSAGE_TIME || 10000
export const MAX_FILE_SIZE = __IBPS_CONFIG__.MAX_FILE_SIZE
export const I18N_LOCALE = __IBPS_CONFIG__.I18N_LOCALE || "zh-CN"
export const I18N_FALLBACK_LOCALE = __IBPS_CONFIG__.I18N_FALLBACK_LOCALE || "zh-CN"
export const ELEMENT_COLOR = __IBPS_CONFIG__.ELEMENT_COLOR || "#409EFF"
