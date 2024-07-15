import request from '@platform/utils/request'
import { AUTH_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL() + '/auth/app/query',
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
    url: AUTH_URL() + '/auth/app/remove',
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
    url: AUTH_URL() + '/auth/app/save',
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
    url: AUTH_URL() + '/auth/app/get',
    method: 'get',
    params
  })
}
