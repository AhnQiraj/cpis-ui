import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { BPMN_URL } from '@platform/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/query',
        method: 'post',
        data: params
    })
}
/**
 * 获取流程实例信息
 * @param {*} params
 */
export function get(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/get',
        method: 'get',
        params: params
    })
}
/**
 * 流程图
 * @param {*} params
 */
export function flowImage(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/flowImage',
        method: 'get',
        params: params
    })
}
/**
 * 审批历史
 * @param {*} params
 */
export function flowHistory(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/flowHistory',
        method: 'post',
        data: params
    })
}
/**
 * 审批历史（会签）
 * @param {*} params
 */
export function flowHistorySign(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/flowHistorySign',
        method: 'get',
        params: params
    })
}
/**
 * 审批历史（子流程）
 * @param {*} params
 */
export function flowHistoryCallSub(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/flowHistoryCallSub',
        method: 'get',
        params: params
    })
}
/**
 * 实例表单
 * @param {*} params
 */
export function instFormInfo(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/instFormInfo',
        method: 'get',
        params: params
    })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/remove',
        method: 'post',
        isLoading: true,
        params: params
    })
}
/**
 * 启动或草稿获取表单数据
 * @param {*} params
 */
export function getFormData(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/getFormData',
        method: 'get',
        params: params
    })
}
/**
 * 流程实例获取表单数据
 * @param {*} params
 */
export function getInstFormData(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/instFormInfo',
        method: 'get',
        params: params
    })
}
/**
 * 启动流程
 * @param {*} params
 */
export function startFlow(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/start',
        method: 'post',
        isLoading: true,
        data: ActionUtils.formatParams(params)
    })
}
/**
 * 保存草稿
 * @param {*} params
 */
export function saveDraft(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/saveDraft',
        method: 'post',
        isLoading: true,
        data: ActionUtils.formatParams(params)
    })
}
/**
 * 启动流程-选择人员或路径
 * @param {*} params
 */
export function startOutgoing(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/startOutgoing',
        method: 'post',
        isLoading: true,
        data: params
    })
}
/**
 * 启动自定义流程按钮【列表】
 * @param {*} params
 */
export function startFlowFromList(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/startFlowFromList',
        method: 'post',
        isLoading: true,
        params: params
    })
}
/**
 * 启动自定义流程按钮【编辑】
 * @param {*} params
 */
export function startFlowFromEdit(params) {
    return request({
        url: BPMN_URL() + '/bpm/instance/startFlowFromEdit',
        method: 'post',
        isLoading: true,
        data: params
    })
}