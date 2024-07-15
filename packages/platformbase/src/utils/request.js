/**
 * 和服务端进行交互
 *  它封装了全局 request拦截器、respone拦截器、统一的错误处理、统一做了超时，baseURL设置等
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { isIE } from 'element-ui/lib/utils/util'
import store from '@platform/store'
import I18n from '@platform/utils/i18n' // Internationalization 国际化
import Utils from '@platform/utils/util'
import Ids from 'ids'
import setting from '@platform/setting.js'
// 验权
import { getToken, updateToken, removeRefreshToken } from '@platform/utils/auth'
import { refreshAccessToken } from '@platform/api/oauth2/user'
import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'
import requestState from '@platform/constants/state'
import { HEADER_TOKEN_KEY, HEADER_SYSTEM_ID, HEADER_TENANT_ID, MULTIPLE_DOMAIN, API_DOMAIN_NAMES } from '@platform/constant'
const TIMEOUT = setting.requestTimeout // 请求超时（timeout）时间
/**
 * 创建axios实例
 */
const service = axios.create({
  timeout: TIMEOUT, // request timeout
  withCredentials: true, //  跨域安全策略
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Security-Policy': "default-src 'none';font-src 'self' data:;connect-src 'self' https:;script-src 'self' 'unsafe-inline' 'unsafe-eval';frame-ancestors 'self';style-src 'self' 'unsafe-inline';media-src 'self';object-src 'self';img-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': 'content=1;mode=block'
  }
})
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
// 取消请求
let cancelRequest = false
/**
 * 请求(request)拦截器
 *
 *  get 请求  统一参数放在params里面 // 后台对应只有@RequestParam
 *      // `params` 是即将与请求一起发送的 URL 参数
 *     // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
 *  post 请求 统一参数放在data里面    // json 格式 后台对应@RequestBody ,其他 后台对应@RequestParam
 *   === // `data` 是作为请求主体被发送的数据
 *     // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
 *    // 在没有设置 `transformRequest` 时，必须是以下类型之一：
 *    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 *     // - 浏览器专属：FormData, File, Blob
 *     // - Node 专属： Stream
 *   ==// post 请求 `params`  这个同get 但要注意  后台对应@RequestParam 请求的`Content-Type`是 application/x-www-form-urlencoded 用 qs.stringify 去构造数据
 */
service.interceptors.request.use(
  async config => {
    config.baseURL = window.config.VUE_APP_BASE_API
    config.isLoading = config.isLoading !== undefined && config.isLoading !== null ? config.isLoading : false
    showFullScreenLoading(config.loading, config.isLoading)
    // 如果超时不对还原默认超时时间
    if (config.timeout !== TIMEOUT) {
      config.timeout = TIMEOUT
    }
    // 只设置当前的时间设置以设置为准
    if (Utils.isNotEmpty(config.overtime)) {
      config.timeout = config.overtime
    }
    // IE下防止缓存
    if (config.method.toUpperCase() === 'GET' && isIE()) {
      config.params = {
        ...config.params,
        _t: new Ids([32, 36, 1]).next()
      }
    }
    // 判断是否需要token
    if (setting.whiteRequestList.indexOf(config.url) !== -1) {
      return config
    }
    // if (config.url === '/v1/agent/services') {
    //   config.baseURL = window.config.VUE_APP_API_HOST
    //   config.headers = {
    //     'Content-Type': 'application/json;charset=utf-8'
    //   }
    //   config.withCredentials = false
    //   return config
    // }
    config.headers[HEADER_TOKEN_KEY] = getToken()
    // 系统ID
    if (store && store.getters.systemid) {
      config.headers[HEADER_SYSTEM_ID] = store.getters.systemid
    }
    // 租户ID
    if (store && store.getters.tenantid) {
      config.headers[HEADER_TENANT_ID] = store.getters.designTenantid ? store.getters.designTenantid : store.getters.tenantid
    }
    // 租户模式
    if (store && store.getters.isTenantOpen) {
      config.headers[HEADER_TENANT_ID] = store.getters.designTenantid ? store.getters.designTenantid : store.getters.tenantid
    }
    return config
  },
  error => {
    tryHideFullScreenLoading()
    Utils.log.error('request-error =>', error) // for debug
    // 处理异常
    handleErrorMessage(error ? error.response : null, error)
    Promise.reject(error)
  }
)
/**
 * 响应(respone)拦截器
 */
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    const config = response.config
    if (config.processDataType === 'none' || config.responseType === 'arraybuffer') {
      return response
    }
    const dataAxios = response.data || {}
    // 新版本改变返回码为code或者state
    let state
    if (dataAxios.state) {
      state = dataAxios.state
    } else if (dataAxios.code) {
      state = dataAxios.code
    } else {
      state = ''
    }
    // 如果没有 state 代表这不是项目后端开发的接口 比如可能是请求最新版本,或者是请求的数据，或者是
    if (state === undefined) {
      showErrorMessage(I18n.t('error.unknownStatus', { url: config.url }))
      return response
    }
    // state为200是正确的请求  或者  验证码问题,或者警告类型的错误 自行处理
    if (state === requestState.CODESUCCESS || state === requestState.SUCCESS || state === requestState.UNSUPORT || state === requestState.WARNING || state === requestState.WARN) {
      return dataAxios
    }
    // 处理刷新tonken问题,说明token过期了,刷新token
    if (state === requestState.TOKEN_EXPIRED) {
      if (!isRefreshing) {
        isRefreshing = true
        return refreshAccessToken()
          .then(res => {
            const data = res.data
            updateToken(data)
            const token = getToken()
            config.headers[HEADER_TOKEN_KEY] = token
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => cb(token))
            requests = []
            return service(config)
          })
          ['catch'](res => {
            console.error('refreshtoken error =>', res)
            removeRefreshToken()
            window.location.href = '/'
          })
          ['finally'](() => {
            isRefreshing = false
          })
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(token => {
            config.headers[HEADER_TOKEN_KEY] = token
            resolve(service(config))
          })
        })
      }
    } else if (state === requestState.ILLEGAL_ACCOUNT_EXPIRED_CREDENTIALS) {
      console.log('platform报错')
    } else {
      // 错误处理
      const err = handleErrorMessage(response)
      return Promise.reject(err)
    }
  },
  // 异常处理
  error => {
    tryHideFullScreenLoading()
    Utils.log.error('response-error =>', error) // for debug
    // 处理异常
    handleErrorMessage(error ? error.response : null, error)
    return Promise.reject(error)
  }
)
/**
 * 显示错误消息
 * @param {*} errorMsg
 */
function showErrorMessage(errorMsg) {
  Message.closeAll()
  Message({ message: `${errorMsg}`, type: 'error', showClose: true, dangerouslyUseHTMLString: true, duration: 5 * 1000 })
}
/**
 *  处理错误消息
 * @param {*} response
 * @param {*} error
 */
function handleErrorMessage(response, error) {
  let errorState
  let errorMsg = ''
  let errorCause = ''
  if (response) {
    const config = response.config || {}
    if (response.data) {
      const dataAxios = response.data || {}
      errorState = dataAxios.state
      errorMsg = dataAxios.message
      errorCause = dataAxios.cause
      // 6020201:非法的token;6020202:其他客户端登录了;6020301:Token 过期了;
      if (errorState === requestState.ILLEGAL_TOKEN || errorState === requestState.OTHER_CLIENTS) {
        if (!cancelRequest) {
          cancelRequest = false
          MessageBox.closeAll()
          MessageBox.confirm(I18n.t('error.logout.message'), I18n.t('error.logout.title'), { confirmButtonText: I18n.t('error.logout.confirmButtonText'), cancelButtonText: I18n.t('error.logout.cancelButtonText'), type: 'warning' })
            .then(() => {
              store
                .dispatch('ibps/account/fedLogout')
                .then(() => {
                  // 终止所有请求
                  cancelRequest = true
                  console.log('token过期')
                })
                ['catch'](() => {
                  cancelRequest = true
                })
            })
            ['finally'](() => {
              cancelRequest = false
            })
        }
        return new Error(errorMsg)
      } else {
        if (Utils.isNotEmpty(errorMsg)) {
          // 有错误消息
          errorMsg = Utils.isNotEmpty(errorCause) ? I18n.t('error.messageCause', { message: errorMsg, cause: errorCause }) : I18n.t('error.message', { message: errorMsg })
        } else if (Utils.isNotEmpty(errorCause)) {
          // 只有错误原因
          errorMsg = I18n.t('error.cause', {
            cause: errorCause
          })
        } else if (I18n.te('error.status.' + errorState)) {
          // 有错误编码
          errorMsg = I18n.t('error.status.' + errorState, {
            url: config.url
          })
        } else {
          // 未知状态
          errorMsg = errorMsg || I18n.t('error.unknown', { errorState })
        }
      }
    } else {
      errorState = response.status
      errorMsg = response.statusText
      if (I18n.te('error.status.' + errorState)) {
        // 有错误编码
        errorMsg = I18n.t('error.status.' + errorState, { url: config.url })
      } else {
        // 未知状态
        errorMsg = errorMsg || I18n.t('error.unknown', { state: errorState })
      }
    }
  } else {
    errorMsg = I18n.t('error.network') // '服务器君开小差了，请稍后再试'
    errorState = error ? error.status : 500
    errorCause = errorMsg
  }
  showErrorMessage(errorMsg)
  const err = new Error(errorMsg)
  err.state = errorState
  err.cause = errorCause
  return err
}
export default service
