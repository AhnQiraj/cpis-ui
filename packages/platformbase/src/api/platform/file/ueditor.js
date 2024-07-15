import { getToken } from "@platform/utils/auth"
import { SYSTEM_URL } from "@platform/api/baseUrl"
/**
 * 返回ueditor地址
 */
export function serverUrl() {
  return window.config.VUE_APP_BASE_API + SYSTEM_URL() + `/file/ueditor/action?access_token=` + getToken()
}
/**
 * 返回ueditor地址
 */
export function fileUrl() {
  return window.config.VUE_APP_BASE_API + SYSTEM_URL() + "/file/preview?access_token=" + getToken() + "&attachmentId="
}
