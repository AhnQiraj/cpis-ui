import request from '@platform/utils/request'
import { SYSTEM_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SYSTEM_URL() + '/desktop/manage/query',
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
    url: SYSTEM_URL() + '/desktop/manage/remove',
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
    url: SYSTEM_URL() + '/desktop/manage/save',
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
    url: SYSTEM_URL() + '/desktop/manage/get',
    method: 'get',
    params: params
  })
}
