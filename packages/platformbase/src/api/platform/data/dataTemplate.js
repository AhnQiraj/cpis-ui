import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { DATA_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: DATA_URL() + '/data/template/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: DATA_URL() + '/data/template/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 逻辑删除
 * @param {*} params
 */
export function logicRemove(data) {
  return request({
    url: DATA_URL() + '/data/template/remove/formData/logic',
    method: 'post',
    isLoading: true,
    data: data
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: DATA_URL() + '/data/template/save/vo',
    method: 'post',
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
    url: DATA_URL() + '/data/template/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取数据(通过ID转换为名称)
 * @param {*} params
 */
export function transfer(params) {
  return request({
    url: DATA_URL() + '/data/template/transfer',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据(通过ID转换为名称)
 * @param {*} params
 */
export function transferObject(params) {
  return request({
    url: DATA_URL() + '/data/template/transfer/object',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据(通过ID转换为名称)
 * @param {*} params
 */
export function transferByIds(params) {
  return request({
    url: DATA_URL() + '/data/template/transferByIds',
    method: 'post',
    data: params
  })
}
/**
 * 判断模版key是否存在
 * @param {*} params
 */
export function isKeyExists(params) {
  return request({
    url: DATA_URL() + '/data/template/isKeyExists',
    method: 'post',
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: DATA_URL() + '/data/template/getByKey',
    method: 'get',
    params: params
  })
}
/**
 * 通过id获取数据
 * @param {*} params
 */
export function getById(params) {
  return request({
    url: DATA_URL() + '/data/template/getById',
    method: 'get',
    params: params
  })
}
/**
 * 通过id获取数据
 * @param {*} params
 */
export function getBuildDataById(params) {
  return request({
    url: DATA_URL() + '/data/template/getBuildDataById',
    method: 'get',
    params: params
  })
}
/**
 * 通过id获取数据
 * @param {*} params
 */
export function getBuildDataByKey(params) {
  return request({
    url: DATA_URL() + '/data/template/getBuildDataByKey',
    method: 'get',
    params: params
  })
}
/**
 * 导入文件
 * @param {*} file
 */
export function importTemplate(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    url: DATA_URL() + '/data/template/importTemplate',
    method: 'post',
    isLoading: true,
    gateway: true,
    data: data
  })
}
/**
 * 导出文件
 * @param {*} params
 */
export function exportFile(params) {
  return request({
    url: DATA_URL() + '/data/template/exportTemplate',
    method: 'post',
    isLoading: true,
    responseType: 'arraybuffer',
    params: params
  })
}
/**
 * 导出数据
 * @param {*} params
 */
export function exportData(params) {
  return request({
    url: DATA_URL() + '/data/template/exportData',
    method: 'post',
    isLoading: true,
    responseType: 'arraybuffer',
    data: params
  })
}
/**
 * 获取数据模版的数据
 * @param {*} params
 */
export function querySelectorData(params) {
  return request({
    url: DATA_URL() + '/data/template/querySelectorData',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
/**
 * 通过key获取数据模版的数据
 * @param {*} params
 */
export function getSelectorDataByKey(params) {
  return request({
    url: DATA_URL() + '/data/template/getSelectorDataByKey',
    method: 'get',
    params: params
  })
}
/**
 * 获取列表数据
 * @param {*} params
 */
export function queryDataTable(params) {
  return request({
    url: DATA_URL() + '/data/template/queryDataTable',
    method: 'post',
    data: params
  })
}
/**
 * 获取列表数据
 * @param {*} params
 */
export function queryLinkData(params) {
  return request({
    url: DATA_URL() + '/data/template/queryLinkData',
    method: 'post',
    data: params
  })
}
/**
 * 获取列表数据
 * @param {*} params
 */
export function queryTreeData(params) {
  return request({
    url: DATA_URL() + '/data/template/queryTreeData',
    method: 'post',
    data: params
  })
}
/**
 * 通过id，获取关联的数据
 * @param {*} params
 */
export function queryDataById(params) {
  return request({
    url: DATA_URL() + '/data/template/queryDataById',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
/**
 * 通过key，获取关联的数据
 * @param {*} params
 */
export function queryLinkageData(params) {
  return request({
    url: DATA_URL() + '/data/template/queryLinkageData',
    method: 'post',
    data: params
  })
}
/**
 * 保存表单数据
 * @param {*} params
 */
export function saveFormData(params) {
  return request({
    url: DATA_URL() + '/data/template/saveFormData/vo',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 保存表单数据-自定义
 * @param {*} params
 */
export function saveFormDataByCustom(params, data, url, method, headers) {
  return request({
    url,
    method,
    isLoading: true,
    params,
    data,
    headers: headers
  })
}
/**
 * 删除表单数据
 * @param {*} params
 */
export function removeFormData(params) {
  return request({
    url: DATA_URL() + '/data/template/removeFormData',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存复制的数据
 * @param {*} params
 */
export function saveCopy(params) {
  return request({
    url: DATA_URL() + '/data/template/copy',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 检查导出数据
 * @param {*} params
 */
export function checkExportData(params) {
  return request({
    url: DATA_URL() + '/data/template/checkExportData',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 检查导出数据
 * @param {*} params
 */
export function saveUpload(params) {
  return request({
    url: DATA_URL() + '/data/template/saveUpload/vo',
    method: 'post',
    isLoading: true,
    data: params
  })
}
