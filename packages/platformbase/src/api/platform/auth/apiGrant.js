import request from '@platform/utils/request'
import { AUTH_URL } from '@platform/api/baseUrl'
// import qs from 'qs'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/query',
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
    url: AUTH_URL() + '/auth/api/grant/remove',
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
    url: AUTH_URL() + '/auth/api/grant/save',
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
    url: AUTH_URL() + '/auth/api/grant/get',
    method: 'get',
    params
  })
}
// export function grant(params) {
//   return request({
//     url: AUTH_URL() + '/auth/api/grant/grant',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     data: params
//   })
// }
/**
 * 申请接口授权
 * @param {*} params
 */
export function grant(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/grant/save',
    method: 'post',
    data: params
  })
}
/**
 * 审核
 * @param {*} params
 */
export function audit(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/audit',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 通过授权角色的全部接口
 * @param {*} params
 */
export function passAllByRole(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/passAllByRole',
    method: 'post',
    data: params
  })
}
/**
 * 批量审核
 * @param {*} params
 */
export function doAuditBatch(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/audit/batch',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 添加全部接口
 * @param {*} params
 */
export function addAllApi(params) {
  return request({
    url: AUTH_URL() + '/auth/api/grant/addAllApi',
    method: 'post',
    data: params
  })
}
