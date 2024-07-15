import request from '@platform/utils/request'
import { CAT_URL } from '@platform/api/baseUrl'
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CAT_URL() + '/cat/type/remove',
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
    url: CAT_URL() + '/cat/type/save',
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
    url: CAT_URL() + '/cat/type/get',
    method: 'get',
    params
  })
}
/**
 * 导出
 * @param {*} params
 */
export function exportXml(params) {
  return request({
    url: CAT_URL() + '/cat/type/exportXml',
    method: 'get',
    isLoading: true,
    responseType: 'arraybuffer',
    params: params
  })
}
/**
 * 导入
 * @param {*} params
 */
export function importXml(file, typeId, cover) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  data.append('typeId', typeId)
  if (cover) {data.append(cover)}
  return request({
    url: CAT_URL() + '/cat/type/importXml',
    method: 'post',
    isLoading: true,
    gateway: true,
    data: data
  })
}
/**
 * 查找子节点
 * @param {*} params
 */
export function sortList(params) {
  return request({
    url: CAT_URL() + '/cat/type/findByParentId',
    method: 'get',
    params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function sortSave(params) {
  return request({
    url: CAT_URL() + '/cat/type/sort',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 根据分类组键获取分类信息
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: CAT_URL() + '/cat/type/findTreeData',
    method: 'get',
    params
  })
}
