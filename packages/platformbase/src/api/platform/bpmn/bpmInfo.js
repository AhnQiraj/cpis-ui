import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 获取流程定义状态
 * @param {*} params
 */
export function findBpmDefinitionState(params) {
  return request({
    url: BPMN_URL() + '/bpm/info/findBpmDefinitionState',
    method: 'get',
    params: params
  })
}
/**
 * 获取流程实例状态
 * @param {*} params
 */
export function findProcInstStatus(params) {
  return request({
    url: BPMN_URL() + '/bpm/info/findProcInstStatus',
    method: 'get',
    params: params
  })
}
