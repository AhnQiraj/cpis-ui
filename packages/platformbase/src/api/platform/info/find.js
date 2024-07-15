import request from '@platform/utils/request'
import { INFO_URL } from '@platform/api/baseUrl'
/**
 *
 * 获取第三方授权作用域枚举值【作用域】
 * @param {*} params
 */
export function findScopes(params) {
  return request({
    url: INFO_URL() + '/common/info/findScopes',
    method: 'get',
    params
  })
}
/**
 *
 * 获取API授权类型【授权类型】
 * @param {*} params
 */
export function findApiGrantTypes(params) {
  return request({
    url: INFO_URL() + '/common/info/findApiGrantTypes',
    method: 'get',
    params
  })
}
/**
 *
 * 获取第三方授权授权类型【（第三方接入）搜索栏-授权类型】
 * @param {*} params
 */
export function findApiScope(params) {
  return request({
    url: INFO_URL() + '/common/info/findApiScope',
    method: 'get',
    params
  })
}
/**
 *
 * 获取第三方状态类型【（第三方接入）搜索栏-状态】
 * @param {*} params
 */
export function findClientStatus(params) {
  return request({
    url: INFO_URL() + '/common/info/findClientStatus',
    method: 'get',
    params
  })
}
/**
 *
 * 获取第三方授权授权类型【（接口授权）搜索栏-授权类型】
 * @param {*} params
 */
export function findGrantTypes(params) {
  return request({
    url: INFO_URL() + '/common/info/findGrantTypes',
    method: 'get',
    params
  })
}
/**
 *
 * 获取系统参数
 * @param {*} params
 */
export function systemInfo(params) {
  return request({
    url: INFO_URL() + '/common/info/system',
    method: 'get',
    params
  })
}
