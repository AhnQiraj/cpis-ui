/**
 * OAUTH2 授权
 *   登录，用户授权
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { OAUTH2_URL } from "@platform/api/baseUrl"
import request from "@platform/utils/request"
import requestState from "@platform/constants/state"
import { Message } from "element-ui"
import qs from "qs"
let AccessToken = function (data) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(data)
  }
  this.data = data
}
/**
 * 对返回结果的一层封装，如果遇见IBPS平台返回的错误，将返回一个错误
 * 参见：IBPS返回码说明
 */
let wrapper = function (callback) {
  return function (err, data, res) {
    callback = callback || function () {}
    if (err) {
      err.name = "IBPSAPI" + err.name
      return callback(err, data, res)
    }
    callback(null, data, res)
  }
}
/*!
 * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
 *
 * Examples:
 * ```
 * token.isValid();
 * ```
 */
AccessToken.prototype.isValid = function () {
  return !!this.data.access_token && new Date().getTime() < this.data.create_at + this.data.expires_in * 1000
}
/*!
 * 处理token，更新过期时间
 */
let processToken = function (that, callback) {
  let createAt = new Date().getTime()
  return function (err, data, res) {
    if (err) {
      return callback(err, data, res)
    }
    data.create_at = createAt
    // 存储token
    that.saveToken(data.uid, data, function (err) {
      callback(err, new AccessToken(data))
    })
  }
}
/**
 * 根据clientId和clientSecret创建OAuth接口的构造函数
 * 如需跨进程跨机器进行操作，access token需要进行全局维护
 * 使用token的优先级是：
 *
 * 1. 使用当前缓存的token对象
 * 2. 调用开发传入的获取token的异步方法，获得token之后使用（并缓存它）。
 * Examples:
 * ```
 * import IbpsOAuth from '@platform/utils/oauth2'
 * var oauthApi = new OAuth('clientId', 'clientSecret');
 * ```
 * @param {String} clientId 在平台上申请得到的clientId(或appid)
 * @param {String} clientSecret 在平台上申请得到的client secret(或app secret)
 * @param {Function} getToken 用于获取token的方法
 * @param {Function} saveToken 用于保存token的方法
 */
let OAuth = function (clientId, clientSecret, getToken, saveToken) {
  this.clientId = clientId
  this.clientSecret = clientSecret
  // token的获取和存储
  this.store = {}
  this.getToken =
    getToken ||
    function (uid, callback) {
      callback(null, this.store[uid])
    }
  // if (!saveToken && process.env.NODE_ENV === 'production') {
  //   console.warn('Please dont save oauth token into memory under production')
  // }
  this.saveToken =
    saveToken ||
    function (uid, token, callback) {
      this.store[uid] = token
      callback(null)
    }
  this.defaults = {}
}
/*!
 * request的封装
 *
 * @param {String} url 路径
 * @param {Object} opts urllib选项
 * @param {Function} callback 回调函数
 */
OAuth.prototype.request = function (opts, callback) {
  const options = {}
  Object.assign(options, this.defaults)
  if (typeof opts === "function") {
    callback = opts
    opts = {}
  }
  for (const key in opts) {
    if (key !== "headers") {
      options[key] = opts[key]
    } else {
      if (opts.headers) {
        options.headers = options.headers || {}
        Object.assign(options.headers, opts.headers)
      }
    }
  }
  request(options)
    .then(response => {
      const { state } = response
      if (state === requestState.UNSUPORT || state === requestState.WARNING) {
        const err = new Error(response.message)
        err.state = state
        err.cause = response.cause
        callback(err)
      } else {
        callback(null, response.data, response)
      }
    })
    ["catch"](error => {
      callback(error)
    })
}
/**
 * 获取授权页面的URL地址
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
 */
OAuth.prototype.getAuthorizeURL = function (redirect, state, scope) {
  const url = OAUTH2_URL() + ""
  const info = {
    clientId: this.clientId,
    redirect_uri: redirect,
    response_type: "code",
    scope: scope || "snsapi_base",
    state: state || ""
  }
  return url + "?" + qs.stringify(info) + "#ibps_redirect"
}
/**
 * 获取授权页面的URL地址
 * @param {String} redirect 授权后要跳转的地址
 * @param {String} state 开发者可提供的数据
 * @param {String} scope 作用范围，值为snsapi_login，前者用于弹出，后者用于跳转
 */
OAuth.prototype.getAuthorizeURLForWebsite = function (redirect, state, scope) {
  const url = OAUTH2_URL() + "/qrconnect"
  const info = {
    clientId: this.clientId,
    redirect_uri: redirect,
    response_type: "code",
    scope: scope || "snsapi_login",
    state: state || ""
  }
  return url + "?" + qs.stringify(info) + "#ibps_redirect"
}
/**
 * 根据授权获取到的code，换取access_token和uid
 * 获取uid之后，可以调用`IBPS.API`来获取更多用户信息
 * Examples:
 * ```
 * api.getAccessTokenByCode(code, callback);
 * ```
 * Callback:
 *
 * - `error`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  data: {
 *    "access_token": "ACCESS_TOKEN",
 *    "refresh_token": "REFRESH_TOKEN",
 *    "uid": "uid",
 *    "expires_in": 7200,
 *    "scope": "SCOPE"
 *  }
 * }
 * ```
 * @param {String} code 授权获取到的code
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getAccessTokenByCode = function (code, callback) {
  const args = {
    url: OAUTH2_URL() + "/authentication/apply",
    data: {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      authorize_code: code,
      grant_type: "authorization_code"
    },
    method: "post"
  }
  this.request(args, wrapper(processToken(this, callback)))
}
/**
 * 密码授权模式
 * 根据用户名和密码，换取access token和uid
 * 获取uid之后，可以调用`IBPS.API`来获取更多用户信息
 * Examples:
 * ```
 * api.getAccessTokenByPassword(code, callback);
 * ```
 * Callback:
 *
 * - `error`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  data: {
 *    "access_token": "ACCESS_TOKEN",
 *    "refresh_token": "REFRESH_TOKEN",
 *    "uid": "uid",
 *    "expires_in": 7200,
 *    "scope": "SCOPE"
 *  }
 * }
 * ```
 * ```
 * @param {String} username  用户名
 * @param {String} password  密码
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getAccessTokenByPassword = function ({ username, password }, callback) {
  const args = {
    url: OAUTH2_URL() + "/authentication/apply",
    data: {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: username,
      password: password,
      grant_type: "password_credentials"
    },
    method: "post"
  }
  this.request(args, wrapper(processToken(this, callback)))
}
/**
 * 根据refresh token，刷新access token，调用getAccessTokenByCode后才有效
 * Examples:
 * ```
 * api.refreshAccessToken(refreshToken, callback);
 * ```
 * Callback:
 *
 * - `err`, 刷新access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  data: {
 *    "access_token": "ACCESS_TOKEN",
 *    "expires_in": 7200,
 *    "refresh_token": "REFRESH_TOKEN",
 *    "uid": "uid",
 *    "remind_in": 7
 *  }
 * }
 * ```
 * @param {String} refreshToken 刷新tonken
 * @param {Function} callback 回调函数
 */
OAuth.prototype.refreshAccessToken = function (refreshToken, callback) {
  const args = {
    url: OAUTH2_URL() + "/authentication/apply",
    data: {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    method: "post"
  }
  this.request(args, wrapper(processToken(this, callback)))
}
/**
 * 获取用户信息 【私有方法】
 * @param {*} options
 * @param {*} accessToken
 * @param {*} callback
 */
OAuth.prototype._getUser = function (options, accessToken, callback) {
  const args = {
    url: OAUTH2_URL() + "/user/context",
    data: {
      access_token: accessToken,
      uid: options.uid,
      lang: options.lang || "zh_CN"
    }
  }
  this.request(args, wrapper(callback))
}
/**
 * 根据uid，获取用户信息。
 * 当access token无效时，自动通过refresh token获取新的access token。然后再获取用户信息
 * Examples:
 * ```
 * api.getUser(uid, callback);
 * api.getUser(options, callback);
 * ```
 *
 * Options:
 * ```
 * // 或
 * {
 *  "uid": "the user Id", // 必须
 *  "lang": "the lang code" // zh_CN 简体，zh_TW 繁体，en 英语
 * }
 * ```
 * Callback:
 *
 * - `err`, 获取用户信息出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  "uid": "uid",
 *  "nickname": "NICKNAME",
 *  "sex": "1",
 *  "province": "PROVINCE"
 *  "city": "CITY",
 *  "country": "COUNTRY",
 *  "headimgurl": "http://xxxxx.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
 *  "privilege": [
 *    "PRIVILEGE1"
 *    "PRIVILEGE2"
 *  ]
 * }
 * ```
 * @param {Object|String} options 传入uid或者参见Options
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getUser = function (options, callback) {
  if (typeof options !== "object") {
    options = {
      uid: options
    }
  }
  const that = this
  this.getToken(options.uid, function (err, data) {
    if (err) {
      return callback(err)
    }
    // 没有token数据
    if (!data) {
      const message = "No token for " + options.uid + ", please authorize first."
      Message({
        message: `${message}`,
        type: "error",
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 5 * 1000
      })
      const error = new Error(message)
      err.state = "NoOAuthTokenError"
      return callback(error)
    }
    const token = new AccessToken(data)
    if (token.isValid()) {
      that._getUser(options, token.data.access_token, callback)
    } else {
      that.refreshAccessToken(token.data.refresh_token, function (err, token) {
        if (err) {
          return callback(err)
        }
        that._getUser(options, token.data.access_token, callback)
      })
    }
  })
}
/**
 * 检验授权凭证（access_token）是否有效。
 * Examples:
 * ```
 * api.verifyToken(uid, accessToken, callback);
 * ```
 * @param {String} uid 传入uid
 * @param {String} accessToken 待校验的access token
 * @param {Function} callback 回调函数
 */
OAuth.prototype.verifyToken = function (uid, accessToken, callback) {
  const args = {
    url: OAUTH2_URL() + "/authentication/verify",
    params: {
      access_token: accessToken,
      uid: uid
    },
    method: "post"
  }
  this.request(args, wrapper(callback))
}
/**
 * 用户名、密码方式登录。
 * Examples:
 * ```
 * api.userLogin(data, callback);
 * ```
 * @param {Objcct} data
 *     username : 用户名
 *     password : 密码
 * @param {Function} callback 回调函数
 */
OAuth.prototype.userLogin = function (data, callback) {
  const args = {
    url: OAUTH2_URL() + "/user/login/apply",
    data: data,
    method: "post"
  }
  this.request(args, wrapper(callback))
}
/**
 * 用户名、密码方式单点登录。
 * Examples:
 * ```
 * api.userLogin(data, callback);
 * ```
 * @param {Objcct} data
 *     username : 用户名
 *     password : 密码
 * @param {Function} callback 回调函数
 */
OAuth.prototype.userSSOLogin = function (data, callback) {
  const args = {
    // url: OAUTH2_URL() + '/user/login/apply',
    url: OAUTH2_URL() + "/user/login/applySSO",
    data: data,
    method: "post"
  }
  this.request(args, wrapper(callback))
}
/**
 *
 *申请授权
 * Examples:
 * ```
 * api.authorize(login, callback);
 * ```
 * @param {Objcct} options
 * @param {Function} callback 回调函数
 */
OAuth.prototype.authorize = function (data, callback) {
  const url = OAUTH2_URL() + "/authorize/apply"
  if (typeof data !== "object") {
    data = {
      login_state: data
    }
  }
  data.client_id = this.clientId
  const args = {
    url,
    data: data,
    method: "post"
  }
  this.request(args, wrapper(callback))
}
/**
 * 根据code，获取用户信息。
 * Examples:
 * ```
 * api.getUserByCode(code, callback);
 * ```
 * Callback:
 *
 * - `err`, 获取用户信息出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {
 *  "uid": "uid",
 *  "nickname": "NICKNAME",
 *  "sex": "1",
 *  "province": "PROVINCE"
 *  "city": "CITY",
 *  "country": "COUNTRY",
 *  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
 *  "privilege": [
 *    "PRIVILEGE1"
 *    "PRIVILEGE2"
 *  ]
 * }
 * ```
 * @param {Object|String} options 授权获取到的code
 * @param {Function} callback 回调函数
 */
OAuth.prototype.getUserByCode = function (options, callback) {
  const that = this
  let lang
  let code
  if (typeof options === "string") {
    code = options
  } else {
    lang = options.lang
    code = options.code
  }
  this.getAccessTokenByCode(code, function (err, result) {
    if (err) {
      return callback(err)
    }
    const uid = result.data.uid
    that.getUser({ uid: uid, lang: lang }, callback)
  })
}
/**
 * 通过登录获取access_token
 * @param {*} options
 * @param {*} callback
 */
OAuth.prototype.getLoginCode = function (options, callback) {
  const that = this
  /**
   * 用户登录
   */
  this.userLogin(options, function (err, data) {
    if (err) {
      return callback(err)
    }
    // 没有token数据
    if (!data) {
      const message = "没有传回用户信息"
      Message({
        message: `${message}`,
        type: "error",
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 5 * 1000
      })
      const error = new Error(message)
      err.state = "NoOAuthTokenError"
      return callback(error)
    }
    that.authorize(data, function (err1, data1) {
      if (err1) {
        return callback(err1)
      }
      that.getAccessTokenByCode(data1, callback)
    })
  })
}
/**
 * 通过单点登录获取access_token
 * @param {*} options
 * @param {*} callback
 */
OAuth.prototype.getLoginSSOCode = function (options, callback) {
  const that = this
  /**
   * 用户登录
   */
  this.userSSOLogin(options, function (err, data) {
    if (err) {
      return callback(err)
    }
    // 没有token数据
    if (!data) {
      const message = "没有传回用户信息"
      Message({
        message: `${message}`,
        type: "error",
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 5 * 1000
      })
      const error = new Error(message)
      err.state = "NoOAuthTokenError"
      return callback(error)
    }
    that.authorize(data, function (err1, data1) {
      if (err1) {
        return callback(err1)
      }
      that.getAccessTokenByCode(data1, callback)
    })
  })
}
export default OAuth
