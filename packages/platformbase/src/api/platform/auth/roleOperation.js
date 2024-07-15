/**
 * 资源操作类型
 * @author 马冰冰
 * @how2use import * as RoleOperationAPI from '@platform/api/platform/auth/roleOperation.js'
 */
// 暂时先用这个试试
import { systemRequest as request } from '@platform/plugins/axios/index'
// import request from '@platform/utils/request'
const ROLEOPERATION_URL = '/platform/v3'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList (data) {
  return request({
    url: ROLEOPERATION_URL + '/roleOperation/query',
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
    url: ROLEOPERATION_URL + '/roleOperation/remove',
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
    url: ROLEOPERATION_URL + '/roleOperation/save',
    method: 'post',
    data: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveByResOptypeVo (params) {
  return request({
    url: ROLEOPERATION_URL + '/roleOperation/saveByResOptypeVo',
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
    url: ROLEOPERATION_URL + '/roleOperation/get',
    method: 'get',
    params: params
  })
}
