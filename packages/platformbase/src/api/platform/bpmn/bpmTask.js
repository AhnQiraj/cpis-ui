import request from '@platform/utils/request'
import ActionUtils from '@platform/utils/action'
import { BPMN_URL } from '@platform/api/baseUrl'
const uuid = require('uuid')
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/query',
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
    url: BPMN_URL() + '/bpm/task/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/get',
    method: 'get',
    params: params
  })
}
/**
 * 锁定任务
 * @param {*} params
 */
export function lock(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/lock',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 解锁任务
 * @param {*} params
 */
export function unlock(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/unlock',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 处理任务
 * @param  {[type]} params 参数对象
 * @deprecated 废弃，职责不清
 */
export function complete(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/complete',
    method: 'post',
    isLoading: true,
    data: ActionUtils.formatParams(params)
  })
}
/**
 * 终止流程
 * @param  {[type]} params 参数对象
 */
export function doEndProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/doEndProcess',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 挂起流程
 * @param {*} params
 */
export function suspendProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/suspendProcess',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 恢复流程
 * @param {*} params
 */
export function recoverProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/recoverProcess',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存加签
 * @param  {[type]} data 参数对象
 */
export function doAddSignTask(data) {
  return request({
    url: BPMN_URL() + '/bpm/task/doAddSignTask',
    method: 'post',
    isLoading: true,
    data: data
  })
}
/**
 * 补签
 * @param  {[type]} data 参数对象
 */
export function saveTaskChange(data) {
  return request({
    url: BPMN_URL() + '/bpm/task/chage/save',
    method: 'post',
    isLoading: true,
    data: data
  })
}
/**
 * 节点审批历史
 * @param {*} params
 */
export function getNodeApproval(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/nodeApproval',
    method: 'get',
    params: params
  })
}
/**
 * 批量同意任务
 * @param {*} params
 */
export function agreeBatch(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/agree/batch',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 批量挂起任务
 * @param {*} params
 */
export function batchSuspendProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/batchSuspendProcess',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 批量恢复任务
 * @param {*} params
 */
export function batchRecoverProcess(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/batchRecoverProcess',
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
    url: BPMN_URL() + '/bpm/task/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}
/**
 * 分配人员
 * @param {*} params
 */
export function assignee(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/assignee',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 流程任务获取表单数据
 * @param {*} params
 */
export function getTaskFormData(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/getFormData',
    method: 'get',
    params: params
  })
}
/**
 * 任务办理数据(同意、反对、弃权)
 * @param {*} data
 */
export function agreeData(data) {
  return request({
    url: BPMN_URL() + '/bpm/task/agreeData/vo',
    method: 'post',
    data: data,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 任务办理数据(同意、反对、弃权),带有事务控制
 * @param {*} data
 */
export function agreeDataWithTran(data) {
  return request({
    url: BPMN_URL() + '/bpm/task/agreeData/vo',
    method: 'post',
    data: data,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 获取驳回数据
 * @param {*} params
 */
export function toReject(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toReject',
    method: 'get',
    params: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 获取驳回数据,带有事务控制
 * @param {*} params
 */
export function toRejectWithTran(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toReject',
    method: 'get',
    params: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 获取驳回上一步
 * @param {*} params
 */
export function toRejectToPrevious(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toRejectToPrevious',
    method: 'get',
    params: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 获取驳回上一步，带有事务控制
 * @param {*} params
 */
export function toRejectToPreviousWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toRejectToPrevious',
    method: 'get',
    params: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 获取驳回发起人
 * @param {*} params
 */
export function toRejectToStart(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toRejectStarter',
    method: 'get',
    params: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 获取驳回发起人,带有事务控制
 * @param {*} params
 */
export function toRejectToStartWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toRejectStarter',
    method: 'get',
    params: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 获取补签数据
 * @param {*} params
 */
export function toAddSignTask(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/toAddSignTask',
    method: 'get',
    params: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-同意
 * @param  {[type]} params 参数对象
 */
export function agree(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/agree',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-同意,带有事务
 * @param  {[type]} params 参数对象
 */
export function agreeWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/agree',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 处理任务-反对
 * @param  {[type]} params 参数对象
 */
export function oppose(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/oppose',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-反对，带有事务控制
 * @param  {[type]} params 参数对象
 */
export function opposeWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/oppose',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 处理任务-弃权
 * @param  {[type]} params 参数对象
 */
export function abandon(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/abandon',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-弃权,带有事务控制
 * @param  {[type]} params 参数对象
 */
export function abandonWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/abandon',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 处理任务-撤销
 * @param  {[type]} params 参数对象
 */
export function revoke(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/revoke',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-驳回
 * @param  {[type]} params 参数对象
 */
export function reject(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-驳回,带有事务控制
 * @param  {[type]} params 参数对象
 */
export function rejectWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 处理任务-驳回发起人
 * @param  {[type]} params 参数对象
 */
export function rejectToStarter(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject/starter',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-驳回发起人,带有事务控制
 * @param  {[type]} params 参数对象
 */
export function rejectToStarterWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject/starter',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 处理任务-驳回上一步
 * @param  {[type]} params 参数对象
 */
export function rejectToPrevious(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject/previous',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 处理任务-驳回上一步，带有事务控制
 * @param  {[type]} params 参数对象
 */
export function rejectToPreviousWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/reject/previous',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
/**
 * 节点按钮设置-保存
 * @param  {[type]} params 参数对象
 */
export function bpmTaskSave(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/save/task',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: false
    }
  })
}
/**
 * 节点按钮设置-保存，带有事务控制
 * @param  {[type]} params 参数对象
 */
export function bpmTaskSaveWithTrans(params) {
  return request({
    url: BPMN_URL() + '/bpm/task/save/task',
    method: 'post',
    isLoading: true,
    data: params,
    headers: {
      transFlag: true,
      'CP-message-id': uuid(),
      'CP-transaction-id': uuid()
    }
  })
}
