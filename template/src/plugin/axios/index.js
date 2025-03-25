import Vue from "vue"
import axios from "axios"
import { Message } from "element-ui"
import util from "@/utils/util"
import * as utils from "@/utils/cpUtils/index"
// 创建一个错误
function errorCreate(msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}
// 记录和显示错误
function errorLog(error) {
  // 添加到日志
  Vue.prototype.store.dispatch("d2admin/log/push", {
    message: "数据请求异常",
    type: "danger",
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === "development") {
    util.log.danger(">>>>>> Error >>>>>>")
    console.log(error)
  }
  // 显示提示
  Message({
    showClose: true,
    message: error.message,
    type: "error",
    duration: 5 * 1000
  })
}
// 创建一个 axios 实例
const service = axios.create({ timeout: 30000 })
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.baseURL = window.config.VUE_APP_API_HOST
    const token = util.cookies.get("token")
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers["X-Token"] = token
    try {
      let userInfo = utils.getLoginInfo()
      config.headers.username = userInfo.employee.account
    } catch (e) {
      console.log(e)
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { state } = dataAxios
    // 根据 state 进行判断
    if (state === undefined) {
      // 如果没有 state 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
      return dataAxios
    } else {
      // 有 state 代表这是一个后端接口 可以进行进一步的判断
      switch (state) {
        case 200:
          // [ 示例 ] state === 0 代表没有错误
          return dataAxios.data
        case "xxx":
          // [ 示例 ] 其它和后台约定的 state
          errorCreate(`[ state: xxx ] ${dataAxios.msg}: ${response.config.url}`)
          break
        default:
          // 不是正确的 state
          errorCreate(`${dataAxios.msg}: ${response.config.url}`)
          break
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = "未授权，请登录"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP版本不受支持"
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
/**
 * 创建令牌服务请求实例
 *
 * @author 管超
 */
const tokenRequest = axios.create({ timeout: 5000 })
tokenRequest.interceptors.request.use(config => {
  config.baseURL = window.config.VUE_APP_API_HOST
  return config
})
// 响应拦截器
tokenRequest.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = error.response.data.error_description === "invalidate username or password" ? "非法的用户名或密码" : "未授权，请登录"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP版本不受支持"
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
const ibpsRequest = axios.create({
  timeout: 5000
})
ibpsRequest.interceptors.response.use(
  response => {
    if (response.data.state == 200 || response.data.state === '200') {
      return response.data
    } else {
      Message({
        showClose: true,
        message: response.data.message,
        type: "error",
        duration: 5 * 1000
      })
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = "未授权，请登录"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP版本不受支持"
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
/**
 * 创建系统服务请求实例
 *
 * @author 管超
 */
const systemRequest = axios.create({ timeout: 5000 })
/**
 * 系统服务请求拦截器
 *
 * @author 管超
 */
systemRequest.interceptors.request.use(
  config => {
    config.baseURL = window.config.VUE_APP_BASE_API
    const token = util.cookies.get("token")
    const tokenType = util.cookies.get("token_type")
    config.headers.authorization = `${tokenType} ${token}`
    let userInfo = utils.getLoginInfo()
    try {
      config.headers.username = userInfo.employee.account
    } catch (e) {
      console.log(e)
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    return Promise.reject(error)
  }
)
const businessRequest = axios.create({ timeout: 50000 })
businessRequest.interceptors.request.use(
  config => {
    config.baseURL = window.config.VUE_APP_BASE_API
    const token = util.cookies.get("token", true)
    // const tokenType = util.cookies.get('token_type');
    config.headers["Content-Type"] = "application/json;charset=UTF-8"
    // config.headers['authorization'] = `${tokenType} ${token}`;
    config.headers["X-Authorization-access_token"] = `${token}`
    try {
      let userInfo = utils.getLoginInfo()
      config.headers.username = userInfo.employee.account
    } catch (e) {
      console.log(e)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/**
 * 系统服务响应拦截器
 *
 * @author 管超
 */
systemRequest.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = "未授权，请登录"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = `服务器内部错误`
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP版本不受支持"
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
businessRequest.interceptors.response.use(
  response => {
    if (response.data.state == 200 || response.data.state === '200') {
      //if (response.data.state != undefined ) {
      return response.data
    } else {
      Message({
        // message: response.data.message,
        message: response.data.msg,
        type: "error",
        duration: 5 * 1000,
        showClose: true
      })
      return Promise.reject(response.data)
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = "未授权，请登录"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          console.log(error)
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP版本不受支持"
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)
/**
 * 生成查询字符串
 *
 * @param {Object} query 查询条件对象
 * @author 管超
 */
export function generateQueryString(query) {
  let queryString = "?"
  let param = ""
  if (query) {
    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        param += `&${key}=${query[key]}`
      }
    }
    if (param !== "") {
      queryString += param.substring(1)
    }
  }
  return queryString
}
export { tokenRequest, systemRequest, businessRequest, ibpsRequest }
export default service
