import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL() + '/bpm/common/statment/query',
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
    url: BPMN_URL() + '/bpm/common/statment/remove',
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
    url: BPMN_URL() + '/bpm/common/statment/save',
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
    url: BPMN_URL() + '/bpm/common/statment/get',
    method: 'get',
    params: params
  })
}
/**
 * 设置默认值
 * @param {*} params
 */
export function setDefault(params) {
  return request({
    url: BPMN_URL() + '/bpm/common/statment/setDefault',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取包含非空的常用语
 * @param {*} data
 */
export function queryIncludeNull(data) {
  return request({
    url: BPMN_URL() + '/bpm/common/statment/queryIncludeNull',
    method: 'post',
    data: data
  })
}
