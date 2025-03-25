import axios from 'axios' //引用axios
import util from '@/libs/util'
import * as utils from '@/utils/cpUtils/index'
import { getToken } from '@/utils/auth'
import router from '@/router/index'
import { Message } from 'element-ui'
// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
  config => {
    config.baseURL = window.config.VUE_APP_BASE_API
    config.timeout = 30000
    const token = getToken()
    const tokenType = util.cookies.get('token_type')
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers.authorization = `${tokenType} ${token}`
    config.headers['X-Authorization-access_token'] = token
    try {
      const userInfo = utils.getLoginInfo()
      config.headers.username = userInfo.employee.account
    } catch (e) {
      console.log(e)
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  res => {
    //重定向到登录页面
    if (res.data.state === 401) {
      router.replace('/login')
    }
    return res
  },
  error => {
    console.log(error)
    if (error.response.status === 404) {
      Message.error('接口调用错误，请联系管理员！')
    }
    return Promise.reject(error)
  }
)
//通用接口请求，支持参数自定义。
//其中sync参数表示同步还是异步，默认给true同步会一直等待接口正确才返回，部分特殊场景接口异常也需要返回时给false(比如弹框，调编辑接口报错，这时我想哪怕报错也有返回，能让我关系弹框走其它页面逻辑，此时需要给false)
//withCredentials默认为true，一般只有接入第三方时一些不需要权限的接口时withCredentials可以设置为false，其它基本没有使用false的情况
//res.data.data和res.data.state === 200的写法是沟通后当前的通用写法，若有变动，这边需要改
export function query({ url, method, data = {}, params = {}, withCredentials = true, responseType = 'json', timeout = 10000, sync = true, headers = { 'Content-Type': 'application/json;charset=UTF-8' }, msg = '服务器错误，请联系管理员！' }) {
  return new Promise(async resolve => {
    let baseURL = window.config.baseURL
    let res = await axios({ baseURL, method, url, params, data, withCredentials, responseType, timeout, headers })
    if (res.data.state === 0 || res.data.state === 200 || !sync) {
      resolve(res.data.data)
    } else if (res.data.state === 401) {
      Message.error('权限错误，请重新登陆')
    } else {
      Message.error(msg)
    }
  })
}
export function axiosAll(list) {
  if (list instanceof Array) {
    return new Promise(resolve => {
      let axiosList = []
      list.map(item => {
        query(item)
      })
      Promise.all(axiosList).then(
        res => {
          let isOk = true
          let resList = []
          let msg = '服务器错误，请联系管理员！'
          res.map(item => {
            if (item.status !== 403) {
              if (item.status !== 200 || (item.status === 200 && item.data.state !== 200)) {
                isOk = false
                msg = item.data.data ? item.data.data.msg : item.data.message
              }
              resList.push(item.data)
            }
          })
          if (isOk) {
            resolve(resList)
          } else {
            Message.error(msg)
          }
        },
        error => {
          if (error.response.status === 403) {
            resolve(error)
          }
        }
      )
    })
  }
}
