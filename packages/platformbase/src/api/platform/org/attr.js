import request from '@platform/utils/request'
import { ORG_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL() + '/attr/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: ORG_URL() + '/attr/remove',
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
    url: ORG_URL() + '/attr/save',
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
    url: ORG_URL() + '/attr/get',
    method: 'get',
    params
  })
}
/**
 * 获取数据(包含选项数据)
 * @param {*} params
 */
export function load(params) {
  return request({
    url: ORG_URL() + '/attr/load',
    method: 'get',
    params
  })
}
/**
 * 查询扩展属性
 * @param {*} params
 */
export function findByTypeAndPartyType(params) {
  return request({
    url: ORG_URL() + '/attr/findByTypeAndPartyType',
    method: 'get',
    params
  })
}
/**
 * 根据用户ID查询扩展属性(编辑页面)
 * @param {*} params
 */
export function findByPartyTypeUserId4Edit(params) {
  return request({
    url: ORG_URL() + '/attr/findByPartyTypeUserId4Edit',
    method: 'get',
    params
  })
}
/**
 * 获取参与者属性选项
 * @param {*} params
 */
export function findByAttrId(params) {
  return request({
    url: ORG_URL() + '/attr/opt/findByAttrId',
    method: 'get',
    params
  })
}
