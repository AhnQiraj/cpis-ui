import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/query',
    method: 'post',
    data: params
  })
}
/**
 * 获取流程实例信息
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/get',
    method: 'get',
    params: params
  })
}
/**
 * 流程图
 * @param {*} params
 */
export function flowImage(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/flowImage',
    method: 'get',
    params: params
  })
}
/**
 * 审批历史
 * @param {*} params
 */
export function flowHistory(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/flowHistory',
    method: 'get',
    params: params
  })
}
/**
 * 审批历史
 * @param {*} params
 */
export function instFormInfo(params) {
  return request({
    url: BPMN_URL() + '/bpm/bpmInst/instFormInfo',
    method: 'get',
    params: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 正常审批通过并通过流程key、发起人过滤，排序-结束时间降序
 * @param {*} params
 */
export function normalPassJson(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/history/normalPassJson',
    method: 'post',
    data: params
  })
}
