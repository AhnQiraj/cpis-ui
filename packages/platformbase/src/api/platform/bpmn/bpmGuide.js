import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: BPMN_URL() + '/bpm/bpmGuide/save',
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
    url: BPMN_URL() + '/bpm/bpmGuide/get',
    method: 'get',
    params: params
  })
}
