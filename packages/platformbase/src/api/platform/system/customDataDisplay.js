import request from '@platform/utils/request'
import { SYSTEM_URL } from '@platform/api/baseUrl'
/**
 * 根据数据标识、数据类型及用户账号查询
 * @param {*} params
 */
export function getIdentityTypeAccount(params) {
  return request({
    url: SYSTEM_URL() + '/system/custom/data/display/scheme/get/identity/type/account',
    method: 'post',
    data: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SYSTEM_URL() + '/system/custom/data/display/scheme/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 恢复默认数据
 * @param {*} params
 */
export function reset(params) {
  return request({
    url: SYSTEM_URL() + '/system/custom/data/display/scheme/reset',
    method: 'post',
    isLoading: true,
    data: params
  })
}
