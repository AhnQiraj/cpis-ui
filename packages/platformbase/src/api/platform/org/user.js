import request from '@platform/utils/request'
import { ORG_URL, OAUTH2_URL } from '@platform/api/baseUrl'
/**
 *修改密码
 * @param {*} params
 */
export function changePassword(params) {
  return request({
    url: ORG_URL() + '/user/change/userKey',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 *修改密码
 * @param {*} params
 * @param {*} url
 */
export function changePassword2(params, url) {
  return request({
    url: ORG_URL() + url,
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 查询列表数据[用于用户选择器使用]
 * @param {*} params
 */
export function query(type, params) {
  let url = '/employee/query'
  if (type === 'org') {
    url = '/user/query4Org'
  } else if (type === 'position') {
    url = '/user/query4Position'
  } else if (type === 'role') {
    url = '/user/query4Role'
  } else if (type === 'group') {
    url = '/user/query4Group'
  }
  return request({
    url: ORG_URL() + url,
    method: 'post',
    data: params
  })
}
/**
 * 获取用户信息
 * @param {*} params
 */
export function get(params) {
  return request({
    url: ORG_URL() + '/user/get',
    method: 'get',
    params: params
  })
}
/**
 * 通过账号获取用户信息
 * @param {*} params
 */
export function getByAccount(params) {
  return request({
    url: ORG_URL() + '/user/getByAccount',
    method: 'get',
    params: params
  })
}
/**
 *修改密码(注册用户认证服务)
 * @param {*} params
 */
export function registerChangePassword(params) {
  return request({
    url: OAUTH2_URL() + '/user/register/change/passwd',
    method: 'post',
    isLoading: true,
    data: params
  })
}
