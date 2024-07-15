/**
 * 资源操作类型
 * @author 马冰冰
 * @how2use import * as ResOptypeAPI from '@platform/api/platform/auth/resOptype.js'
 */
// 暂时先用这个试试
import { systemRequest as request } from '@platform/plugins/axios/index'
// import request from '@platform/utils/request'
const RESOPTYPE_URL = '/platform/v3'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList (data) {
  return request({
    url: RESOPTYPE_URL + '/resOptype/query',
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
    url: RESOPTYPE_URL + '/resOptype/remove',
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
    url: RESOPTYPE_URL + '/resOptype/save',
    method: 'post',
    data: params
  })
}
/**
 * 保存数据(批量)
 * @param {*} params
 */
export function saveList (params) {
  return request({
    url: RESOPTYPE_URL + '/resOptype/save/list',
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
    url: RESOPTYPE_URL + '/resOptype/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getCarryOpetrationType (resId) {
  return request({
    url: RESOPTYPE_URL + '/resOptype/get/carryOpetrationType?resId=' + resId,
    method: 'get'
  })
}
