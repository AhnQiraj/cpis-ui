import request from '@platform/utils/request'
import { MSG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: MSG_URL() + '/msg/messageTemplate/query',
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
    url: MSG_URL() + '/msg/messageTemplate/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(data) {
  return request({
    url: MSG_URL() + '/msg/messageTemplate/save',
    method: 'post',
    isLoading: true,
    data: data
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: MSG_URL() + '/msg/messageTemplate/get',
    params: params
  })
}
/**
 * 校验KEY唯一
 * @param {*} params
 */
export function isKeyExists(params) {
  return request({
    url: MSG_URL() + '/msg/messageTemplate/isKeyExists',
    params: params
  })
}
