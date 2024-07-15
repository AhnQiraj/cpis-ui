import request from '@platform/utils/request'
import { ORG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL() + '/org/auth/query',
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
    url: ORG_URL() + '/org/auth/remove',
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
    url: ORG_URL() + '/org/auth/save',
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
    url: ORG_URL() + '/org/auth/get',
    method: 'get',
    params
  })
}
/**
 * 通过当前用户获取数据
 * @param {*} params
 */
export function findByCurrentUserId(params) {
  return request({
    url: ORG_URL() + '/org/auth/findByCurrentUserId',
    method: 'get',
    params
  })
}
