/**
 * 实现全局的请求 loading
 *  <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { Loading } from 'element-ui'
import I18n from '@platform/utils/i18n' // Internationalization 国际化
let needLoadingRequestCount = 0
let loadingInstance = null
/**
 * 加载
 * @param {*} config
 */
function startLoading(config = {}) {
  loadingInstance = Loading.service({
    lock: config.lock || true,
    text: config.text || I18n.t('common.loading'),
    background: config.background
  })
}
/**
 * 清除loaing
 */
function closeLoading() {
  if (loadingInstance) {loadingInstance.close()}
}
const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    closeLoading()
  }
}
export function showFullScreenLoading(config, isLoading) {
  if (needLoadingRequestCount === 0 && isLoading) {
    startLoading(config)
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {return}
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    setTimeout(() => {
      tryCloseLoading()
    }, 200)
  }
}
