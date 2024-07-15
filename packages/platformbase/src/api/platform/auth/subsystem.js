import request from '@platform/utils/request'
import { AUTH_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL() + '/auth/sub/system/query',
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
    url: AUTH_URL() + '/auth/sub/system/remove',
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
    url: AUTH_URL() + '/auth/sub/system/save',
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
    url: AUTH_URL() + '/auth/sub/system/getSubSystem',
    method: 'get',
    params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function find(params) {
  return request({
    url: AUTH_URL() + '/auth/sub/system/find',
    method: 'post',
    data: params
  })
}
/*
* 查询列表数据
*/
export function findAllSubsystem() {
  return request({
    url: AUTH_URL() + '/auth/sub/system/findAllSubSystem',
    method: 'get'
  })
}
/*
* 查询公司
*/
export function getCompanyByCurrentUser() {
  return request({
    url: '/extend/v3/org/getCompanyByCurrentUser',
    method: 'get'
  })
}
/*
* 获取用户所拥有的子系统
*/
export function findCurrentUserSubSystem() {
  return request({
    url: AUTH_URL() + '/auth/sub/system/findCurrentUserSubSystem',
    method: 'get'
  })
}
