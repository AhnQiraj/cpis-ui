/**
 * 系统操作类型
 * @author 马冰冰
 * @how2use import * as OpetrationTypeAPI from '@platform/api/platform/auth/opetrationType.js'
 */
// 暂时先用这个试试
import { systemRequest as request } from '@platform/plugins/axios/index'
// import request from '@platform/utils/request'
const OPETRATIONTYPE_URL = '/platform/v3'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList (data) {
  return request({
    url: OPETRATIONTYPE_URL + '/opetrationType/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove (params) {
  return request({
    url: OPETRATIONTYPE_URL + '/opetrationType/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save (params) {
  return request({
    url: OPETRATIONTYPE_URL + '/opetrationType/save',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get (params) {
  return request({
    url: OPETRATIONTYPE_URL + '/opetrationType/get',
    method: 'get',
    params: params
  })
}
