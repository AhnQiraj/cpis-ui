import request from '@platform/utils/request'
import { JOB_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params, data) {
  return request({
    url: JOB_URL() + '/job/trigger/query',
    method: 'post',
    params: params,
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: JOB_URL() + '/job/trigger/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params, data) {
  return request({
    url: JOB_URL() + '/job/trigger/save',
    method: 'post',
    isLoading: true,
    params: params,
    data: data
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: JOB_URL() + '/job/trigger/get',
    method: 'get',
    params
  })
}
/**
 * 定时计划启动
 * @param {*} params
 */
export function start(params) {
  return request({
    url: JOB_URL() + '/job/trigger/start',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 定时计划启动
 * @param {*} params
 */
export function stop(params) {
  return request({
    url: JOB_URL() + '/job/trigger/stop',
    method: 'post',
    isLoading: true,
    params: params
  })
}
