import request from '@platform/utils/request'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 我的办结列表
 * @param {*} params
 */
export function myCompleted(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/query/my/completed',
    method: 'post',
    data: params
  })
}
/**
 * 我的草稿列表
 * @param {*} params
 */
export function myDraft(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/query/my/draft',
    method: 'post',
    data: params
  })
}
/**
 * 我的请求列表
 * @param {*} params
 */
export function myRequested(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/query/my/requested',
    method: 'post',
    data: params
  })
}
/**
 * 新建流程列表
 * @param {*} params
 */
export function newProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/query/process/new',
    method: 'post',
    data: params
  })
}
/**
 * 删除草稿
 * @param {*} params
 */
export function removeDraft(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/draft/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 流程收藏列表
 * @param {*} params
 */
export function favorited(params) {
  return request({
    url: BPMN_URL() + '/bpm/initiated/query/favorited',
    method: 'post',
    data: params
  })
}
/**
 * 流程收藏排序
 * @param {*} params
 */
export function sortFavorites(params) {
  return request({
    url: BPMN_URL() + '/bpm/definition/sortFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 流程收藏
 * @param {*} params
 */
export function saveFavorites(params) {
  return request({
    url: BPMN_URL() + '/bpm/definition/saveFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 取消流程收藏
 * @param {*} params
 */
export function removeFavorites(params) {
  return request({
    url: BPMN_URL() + '/bpm/definition/removeFavorites',
    method: 'post',
    isLoading: true,
    params: params
  })
}
