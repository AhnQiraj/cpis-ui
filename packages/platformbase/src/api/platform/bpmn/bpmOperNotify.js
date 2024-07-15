import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL() + '/bpm/oper/notify/query',
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
    url: BPMN_URL() + '/bpm/oper/notify/remove',
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
    url: BPMN_URL() + '/bpm/oper/notify/save',
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
    url: BPMN_URL() + '/bpm/oper/notify/get',
    method: 'get',
    params: params
  })
}
/**
 * 标记为已读
 * @param {*} params
 */
export function readAll(params) {
  return request({
    url: BPMN_URL() + '/bpm/oper/notify/readAll',
    method: 'post',
    isLoading: true,
    params: params
  })
}
