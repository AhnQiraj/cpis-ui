import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 *预览人员条件
 * @param {*} params
 */
export function previewCondition(params) {
  return request({
    url: BPMN_URL() + '/bpm/node/def/previewCondition',
    method: 'post',
    data: params
  })
}
/**
 *节点集合
 * @param {*} params
 */
export function sameNodeDialog(params) {
  return request({
    url: BPMN_URL() + '/bpm/node/def/sameNodeDialog',
    method: 'get',
    params: params
  })
}
