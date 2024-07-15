import request from '@platform/utils/request'
import { SERV_URL } from '@platform/api/baseUrl'
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SERV_URL() + '/serv/service/remove',
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
    url: SERV_URL() + '/serv/service/save',
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
    url: SERV_URL() + '/serv/service/get',
    method: 'get',
    params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: SERV_URL() + '/serv/service/get/key',
    method: 'get',
    params
  })
}
/**
 * 树形
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: SERV_URL() + '/serv/service/getTreeData',
    method: 'get',
    params
  })
}
/**
 * 解析器数据
 * @param {*} params
 */
export function findResponseParsers(params) {
  return request({
    url: SERV_URL() + '/serv/service/find/response/parsers',
    method: 'get',
    params
  })
}
/**
 * 处理器数据
 * @param {*} params
 */
export function findRequestHandlers(params) {
  return request({
    url: SERV_URL() + '/serv/service/find/request/handlers',
    method: 'get',
    params
  })
}
/**
 * 解析数据
 * @param {*} data
 */
export function execute(data) {
  return request({
    url: SERV_URL() + '/serv/service/execute',
    method: 'post',
    data: data
  })
}
/**
 * 解析数据
 * @param {*} params
 */
export function parseService(params) {
  return request({
    url: SERV_URL() + '/serv/service/parseService',
    method: 'post',
    params
  })
}
/**
 * 测试数据
 * @param {*} params
 */
export function testService(params) {
  return request({
    url: SERV_URL() + '/serv/service/testService',
    method: 'post',
    data: params
  })
}
