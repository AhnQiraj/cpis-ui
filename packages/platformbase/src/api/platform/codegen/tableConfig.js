import request from '@platform/utils/request'
import { CODEGEN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/query',
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
    url: CODEGEN_URL() + '/codegen/table/config/remove',
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
    url: CODEGEN_URL() + '/codegen/table/config/save',
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
    url: CODEGEN_URL() + '/codegen/table/config/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取字段列表数据
 * @param {*} params
 */
export function queryFieldList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/fieldList',
    method: 'post',
    params: params
  })
}
/**
 * 获取表名下拉
 * @param {*} params
 */
export function getTableList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/findTable',
    method: 'get',
    params: params
  })
}
/**
 * 获取主表表名下拉
 * @param {*} params
 */
export function getPtableList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/ptableList',
    method: 'get',
    params: params
  })
}
/**
 * 获取外键下拉
 * @param {*} params
 */
export function getColumnList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/columnList',
    method: 'get',
    params: params
  })
}
/**
 * 获取属性下拉
 * @param {*} params
 */
export function getPcolumnList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/pcolumnList',
    method: 'get',
    params: params
  })
}
// ***************************** 生成方案
/**
 * 获取表名下拉
 * @param {*} params
 */
export function getTableConfigList(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/table/config/findByName',
    method: 'get',
    params: params
  })
}
/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: CODEGEN_URL() + '/codegen/template/setCategory',
    method: 'post',
    isLoading: true,
    params
  })
}
