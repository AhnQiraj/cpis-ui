import request from '@platform/utils/request'
import { SERV_URL } from '@platform/api/baseUrl'
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SERV_URL() + '/serv/event/remove',
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
    url: SERV_URL() + '/serv/event/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 修改事件异常处理标识
 * @param {*} params
 */
export function changeIgnoreException(params) {
  return request({
    url: SERV_URL() + '/serv/event/change/ignore/exception',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 修改事件状态
 * @param {*} params
 */
export function changeEnabled(params) {
  return request({
    url: SERV_URL() + '/serv/event/change/enabled',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 修改事件级联前置事件状态
 * @param {*} params
 */
export function changeEnabledBeforeEvent(params) {
  return request({
    url: SERV_URL() + '/serv/event/change/enabled/before/event',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 修改事件级联后置事件状态
 * @param {*} params
 */
export function changeEnabledAfterEvent(params) {
  return request({
    url: SERV_URL() + '/serv/event/change/enabled/after/event',
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
    url: SERV_URL() + '/serv/event/get',
    method: 'get',
    params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SERV_URL() + '/serv/event/query',
    method: 'post',
    data: params
  })
}
/**
 * 设置服务
 * @param {*} params
 */
export function saveBatch(params) {
  return request({
    url: SERV_URL() + '/serv/event/save/batch',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveSort(params) {
  return request({
    url: SERV_URL() + '/serv/event/save/sort',
    method: 'post',
    isLoading: true,
    params: params
  })
}
