import request from '@platform/utils/request'
import { DATA_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: DATA_URL() + '/data/dataset/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: DATA_URL() + '/data/dataset/remove',
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
    url: DATA_URL() + '/data/dataset/save',
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
    url: DATA_URL() + '/data/dataset/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: DATA_URL() + '/data/dataset/getByKey',
    method: 'get',
    params: params
  })
}
/**
 * 动态获取form数据
 * @param {*} params
 */
export function getTableOrViewList(params) {
  return request({
    url: DATA_URL() + '/data/dataset/tableOrViewList',
    method: 'post',
    data: params
  })
}
/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: DATA_URL() + '/data/dataset/setCategory',
    method: 'post',
    isLoading: true,
    params
  })
}
/**
 * 数据源查询
 * @param {*} params
 */
export function queryDataSource(params) {
  return request({
    url: DATA_URL() + '/data/dataset/query/dataSource',
    method: 'get',
    params: params
  })
}
/**
 *
获取数据集树结构
 * @param {*} params
 */
export function getDatasetTree(params) {
  return request({
    url: DATA_URL() + '/data/dataset/getDatasetTree',
    method: 'get',
    params: params
  })
}
/**
 *
根据数据集key构建树
 * @param {*} params
 */
export function buildTree(params) {
  return request({
    url: DATA_URL() + '/data/dataset/buildTree',
    method: 'post',
    params: params
  })
}
/**
 *
根据数据模板key获取字段
 * @param {*} params
 */
export function findColumnList(params) {
  return request({
    url: DATA_URL() + '/data/dataset/findColumnList',
    method: 'post',
    data: params
  })
}
