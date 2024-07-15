import request from '@platform/utils/request'
import { JOB_URL } from '@platform/api/baseUrl'
/**
 * 调度中心是否启动状态
 */
export function status() {
  return request({
    url: JOB_URL() + '/scheduler/status',
    method: 'get'
  })
}
/**
 *
 * 启动调度中心
 */
export function start() {
  return request({
    url: JOB_URL() + '/scheduler/start',
    isLoading: true,
    method: 'post'
  })
}
/**
 *
 * 停止调度中心
 */
export function stop() {
  return request({
    url: JOB_URL() + '/scheduler/stop',
    isLoading: true,
    method: 'post'
  })
}
