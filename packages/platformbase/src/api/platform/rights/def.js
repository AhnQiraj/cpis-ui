import request from '@platform/utils/request'
import { PLATFORM_URL } from '@platform/api/baseUrl'
/**
 * 通过key获取权限类型
 * @param {*} params
 */
export function findRightsTypeByKey(params) {
  return request({
    url: PLATFORM_URL() + '/rights/def/findRightsTypeByKey',
    method: 'get',
    params
  })
}
/**
 * 根据类型和id获取权限配置数据
 * @param {*} params
 */
export function findByTypeId(params) {
  return request({
    url: PLATFORM_URL() + '/rights/def/findByEntityTypeId',
    method: 'get',
    params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: PLATFORM_URL() + '/rights/def/save/vo',
    method: 'post',
    isLoading: true,
    data: params
  })
}
