import request from '@platform/utils/request'
import { ORG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: ORG_URL() + '/level/query',
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
    url: ORG_URL() + '/level/remove',
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
    url: ORG_URL() + '/level/save',
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
    url: ORG_URL() + '/level/get',
    method: 'get',
    params: params
  })
}
/**
 * 根据等级类型和等级值获取数据
 * @param {*} params
 */
export function getByTypeAndLevel(params) {
  return request({
    url: ORG_URL() + '/level/getByTypeAndLevel',
    method: 'get',
    params: params
  })
}
/**
 * 根据参与者类型查询等级数据
 * @param {*} params
 */
export function findByType(params) {
  return request({
    url: ORG_URL() + '/level/findByType',
    method: 'get',
    params: params
  })
}
