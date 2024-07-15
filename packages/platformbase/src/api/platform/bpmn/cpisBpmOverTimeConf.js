import request from '@platform/utils/request'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/query',
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
    url: '/extend/v3/cpisBpmOverTimeConf/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/save',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/get',
    method: 'get',
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findApproveCountList(data) {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/findApproveCountList',
    method: 'post',
    data: data
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findOverTimeFlowList(data) {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/findOverTimeFlowList',
    method: 'post',
    data: data
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function getProcDefList() {
  return request({
    url: '/extend/v3/cpisBpmOverTimeConf/getProcDefList',
    method: 'get'
  })
}
