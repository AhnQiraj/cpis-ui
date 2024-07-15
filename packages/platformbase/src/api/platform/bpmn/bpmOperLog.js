import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL() + '/bpm/oper/log/query',
    method: 'post',
    data: data
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL() + '/bpm/oper/log/get',
    method: 'get',
    params: params
  })
}
