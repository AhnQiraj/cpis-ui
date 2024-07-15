import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 读取源数据属性
 * @param {*} params
 */
export function getSrcRead(params) {
  return request({
    url: BPMN_URL() + '/bpm/triger/flow/srcRead',
    method: 'get',
    params: params
  })
}
/**
 * 读取源数据属性
 * @param {*} params
 */
export function getDestRead(params) {
  return request({
    url: BPMN_URL() + '/bpm/triger/flow/destRead',
    method: 'get',
    params: params
  })
}
