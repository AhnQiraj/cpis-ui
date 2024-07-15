import request from '@platform/utils/request'
import { FORM_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: FORM_URL() + '/form/def/query',
    method: 'post',
    data: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findFormJsonByBo(params) {
  return request({
    url: FORM_URL() + '/form/def/findFormJsonByBo',
    method: 'get',
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findFormByBoFormType(params) {
  return request({
    url: FORM_URL() + '/form/def/findFormByBoFormType',
    method: 'get',
    params: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: FORM_URL() + '/form/def/remove',
    method: 'post',
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
    url: FORM_URL() + '/form/def/save/vo',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 复制前数据请求
 * @param {*} params
 */
export function preCopy(params) {
  return request({
    url: FORM_URL() + '/form/def/preCopy',
    method: 'post',
    params: params
  })
}
/**
 * 保存复制的数据
 * @param {*} params
 */
export function saveCopy(params) {
  return request({
    url: FORM_URL() + '/form/def/copy',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 判断key是否存在
 * @param {*} params
 */
export function isFormKeyExists(params) {
  return request({
    url: FORM_URL() + '/form/def/isFormKeyExists',
    method: 'post',
    params
  })
}
/**
 * 设计表单
 * @param {*} params
 */
export function design(params) {
  return request({
    url: FORM_URL() + '/form/def/design',
    method: 'get',
    params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: FORM_URL() + '/form/def/get',
    method: 'get',
    params
  })
}
/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormDefId(params) {
  return request({
    url: FORM_URL() + '/form/def/getFormDataByFormDefId',
    method: 'get',
    params
  })
}
/**
 * 通过formkey获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormKey(params) {
  return request({
    url: FORM_URL() + '/form/def/getFormDataByFormKey',
    method: 'get',
    params
  })
}
/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormData(params) {
  return request({
    url: FORM_URL() + '/form/def/getFormData',
    method: 'post',
    params
  })
}
/**
 * 构建业务对象树
 * @param {*} params
 */
export function buildTree(params) {
  return request({
    url: FORM_URL() + '/form/def/buildTree',
    method: 'post',
    params
  })
}
/**
 * 导入文件
 * @param {*} file
 */
export function importForm(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    url: FORM_URL() + '/form/def/importForm',
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
    url: FORM_URL() + '/form/def/exportForm',
    method: 'post',
    responseType: 'arraybuffer',
    isLoading: true,
    params: params
  })
}
/**
 * 根据表单key获取表单字段的意见字段
 * @param {*} params
 */
export function findFormOptionField(params) {
  return request({
    url: FORM_URL() + '/form/def/findFormOptionField',
    method: 'get',
    params
  })
}
/**
 * 获取表单下拉
 * @param {*} params
 */
export function getFormList(params) {
  return request({
    url: FORM_URL() + '/form/def/getTableList',
    method: 'get',
    params: params
  })
}
/**
 * 获取表单
 * @param {*} params
 */
export function getFormKey(params) {
  return request({
    url: FORM_URL() + '/form/def/getMainByFormKey',
    method: 'get',
    params: params
  })
}
/**
 * 获取数据库类型
 * @param {*} params
 */
export function getDatabaseType(params) {
  return request({
    url: FORM_URL() + '/form/info/business/table/case',
    method: 'get',
    params: params
  })
}
/**
 * 选择器范围脚本
 * @param {*} params
 */
export function getScriptValue(params) {
  return request({
    url: FORM_URL() + '/form/def/getScriptValue',
    method: 'post',
    data: params
  })
}
/**
 * 获取表单字段
 * @param {*} params
 */
export function getFields(params) {
  return request({
    url: FORM_URL() + '/form/def/getFields',
    method: 'get',
    params: params
  })
}
