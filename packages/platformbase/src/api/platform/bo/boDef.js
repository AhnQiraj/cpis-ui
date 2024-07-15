import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { FORM_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: FORM_URL() + '/bo/def/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: FORM_URL() + '/bo/def/remove',
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
    url: FORM_URL() + '/bo/def/save/vo',
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
    url: FORM_URL() + '/bo/def/get',
    method: 'get',
    params
  })
}
/**
 * 管理业务对象定义信息
 * @param {*} params
 */
export function manage(params) {
  return request({
    url: FORM_URL() + '/bo/def/manage',
    method: 'post',
    params
  })
}
/**
 * 获取业务对象树
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: FORM_URL() + '/bo/def/getBoTree',
    method: 'post',
    params
  })
}
/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: FORM_URL() + '/bo/def/setCategory',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 更多版本
 * @param {*} params
 */
export function queryVersionsList(params) {
  return request({
    url: FORM_URL() + '/bo/def/queryByCode',
    method: 'post',
    data: params
  })
}
/**
 * 检测code是否存在
 * @param {*} params
 */
export function checkCode(params) {
  return request({
    url: FORM_URL() + '/bo/def/checkCode',
    method: 'post',
    params: params
  })
}
/**
 * 现有BO
 * @param {*} params
 */
export function getBindForm(params) {
  return request({
    url: FORM_URL() + '/bo/def/getBindForm',
    method: 'post',
    params: params
  })
}
/**
 * 外部数据
 * @param {*} params
 */
export function getJsonByTbl(data) {
  return request({
    url: FORM_URL() + '/bo/def/getJsonByTbl/vo',
    method: 'post',
    data
  })
}
/**
 * 外部数据参数获取
 * @param {*} params
 */
export function getJson(params) {
  return request({
    url: FORM_URL() + '/bo/def/getJson',
    method: 'get',
    params
  })
}
/**
 * 同步表结构
 * @param {*} params
 */
export function synBoTable(params) {
  return request({
    url: FORM_URL() + '/bo/def/synBoTable',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 生成表
 * @param {*} params
 */
export function genBoTable(params) {
  return request({
    url: FORM_URL() + '/bo/def/genBoTable',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存复制
 * @param {*} params
 */
export function saveCopy(params) {
  return request({
    url: FORM_URL() + '/bo/def/copy',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 设置主版本
 * @param {*} params
 */
export function setMainVersion(params) {
  return request({
    url: FORM_URL() + '/bo/def/setMainVersion',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 导入文件
 * @param {*} file
 */
export function importBo(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    url: FORM_URL() + '/bo/def/importBo',
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
    url: FORM_URL() + '/bo/def/exportBo',
    method: 'post',
    isLoading: true,
    responseType: 'arraybuffer',
    params: params
  })
}
/**
 * 根据对象编码查询业务对象定义列表数据
 * @param {*} params
 */
export function queryByCode(params) {
  return request({
    url: FORM_URL() + '/bo/def/queryByCode',
    method: 'post',
    data: ActionUtils.formatParams(params)
  })
}
/**
 * 获取表信息【外部数据】
 * @param {*} params
 */
export function queryTable(params) {
  return request({
    url: FORM_URL() + '/bo/def/queryTable',
    method: 'post',
    params
  })
}
/**
 * 查询上一级业务对象定义
 * @param {*} params
 */
export function findBoDefByPid(params) {
  return request({
    url: FORM_URL() + '/bo/def/findBoDefByPid',
    method: 'get',
    params
  })
}
/**
 * 获取已存在的表信息
 * @param {*} params
 */
export function queryBoDefByIds(params) {
  return request({
    url: FORM_URL() + '/bo/def/queryBoDefByIds',
    method: 'post',
    params
  })
}
/**
 * 查询下一级业务对象定义
 * @param {*} params
 */
export function findBoDefBySid(params) {
  return request({
    url: FORM_URL() + '/bo/def/findBoDefBySid',
    method: 'get',
    params
  })
}
/**
 * 查询业务对象表前缀
 * @param {*} params
 */
export function getTableProfix(params) {
  return request({
    url: FORM_URL() + '/bo/def/getTableProfix',
    method: 'get',
    params
  })
}
