import request from "@platform/utils/request"
import { FORM_URL } from "@platform/api/baseUrl"
import { getToken } from "@platform/utils/auth"
import store from "@platform/store"
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: FORM_URL() + "/form/print/template/query",
    method: "post",
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: FORM_URL() + "/form/print/template/remove",
    method: "post",
    isLoading: true,
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: FORM_URL() + "/form/print/template/save/vo",
    method: "post",
    isLoading: true,
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: FORM_URL() + "/form/print/template/get",
    method: "get",
    params
  })
}
/**
 * 获取打印的数据流
 * @param {*}  params
 */
export function pdf(params) {
  return request({
    url: FORM_URL() + "/form/print/template/pdf",
    method: "post",
    isLoading: true,
    responseType: "arraybuffer",
    data: params
  })
}
/**
 * 获取打印的地址
 * @param {*} formPrintTemplateId
 */
export function getPdf(formPrintTemplateId, pk, formData) {
  return window.config.VUE_APP_BASE_API + FORM_URL() + "/form/print/template/pdf?formPrintTemplateId=" + formPrintTemplateId + "&access_token=" + getToken() + "&tenantId=" + store.getters.tenantid + "&pk=" + pk + "&formData=" + formData
}
