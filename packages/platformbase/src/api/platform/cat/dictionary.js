import request from '@platform/utils/request'
import { CAT_URL } from '@platform/api/baseUrl'
// 数据字典树信息
export function getTreeData(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/getTreeData',
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/queryStruType',
    method: 'post',
    data: params
  })
}
// 数据字典项列表信息
export function findByTypeKey(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/findByTypeKey',
    method: 'get',
    params
  })
}
/**
 * 保存
 * @param {*} params
 */
export function save(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByTypeId(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/getByTypeId',
    method: 'get',
    params: params
  })
}
/**
 * 导入
 * @param {*} params
 */
export function importXml(file, dictionaryId, cover) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  data.append('dictionaryId', dictionaryId)
  if (cover) {data.append(cover)}
  return request({
    url: CAT_URL() + '/cat/dictionary/importXml',
    method: 'post',
    isLoading: true,
    gateway: true,
    data: data
  })
}
/**
 * 导出
 * @param {*} params
 */
export function exportXml(params) {
  return request({
    url: CAT_URL() + '/cat/dictionary/exportXml',
    method: 'get',
    responseType: 'arraybuffer',
    isLoading: true,
    params: params
  })
}
