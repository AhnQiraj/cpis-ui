import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 获取流程图
 * @param {*} params
 */
export function getFlowDiagram(params) {
  return request({
    url: BPMN_URL() + '/bpm/instance/flowImageXml',
    method: 'get',
    params: params
  })
}
