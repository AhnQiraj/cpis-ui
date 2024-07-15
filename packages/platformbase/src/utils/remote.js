const cache = new Map()
const cacheTime = new Map()
/**
 * 远程获取[避免重复请求]
 * @param prefix 前缀
 * @param params 参数配置
 * @param remoteFunc 反馈参数
 * @param repeatRequest 是否重复请求
 * @returns {Promise<any>|Promise<T | never>}
 */
export function remoteRequest(prefix, params, remoteFunc, repeatRequest = true, requestTime = 5000) {
  if (params == null) {
    return new Promise((resolve) => {
      resolve([])
    })
  }
  const timeKey = prefix + '#' + JSON.stringify(params)
  let time = ''
  if (repeatRequest) {
    const curTime = new Date().getTime()
    time = cacheTime.get(timeKey)
    if (time == null) {
      cacheTime.set(timeKey, curTime)
      time = curTime
    }
    if (curTime - requestTime >= time) { // 2秒内的请求都重新请求
      // 清除缓存换个请求
      cacheTime.clear()
      cacheTime.set(timeKey, curTime)
      time = curTime
    }
  }
  const key = timeKey + '#' + time
  // 远程获取
  let item = cache.get(key)
  if (item == null || item.error === true) {
    // 还没加载过
    if (item == null) {
      item = { loading: true, callbacks: [] }
      cache.set(key, item)
    }
    item.loading = true
    item.error = false
    // 远程加载
    return remoteFunc().then((data) => {
      // prop mapping
      item.data = data
      // 之前注册过的callback全部触发
      for (const callback of item.callbacks) {
        callback(item.data)
      }
      item.loading = false
      item.callbacks = []
      return data
    }).catch(() => {
      item.loading = false
      item.error = true
    })
  } else if (item.loading === true) {
    // 正在加载中，注册callback，等加载完了之后，再统一触发，就只需要向服务器请求一次数据模版
    return new Promise((resolve) => {
      const callback = (data) => {
        resolve(data)
      }
      item.callbacks.push(callback)
    })
  } else {
    //  从缓存拿
    return new Promise((resolve) => {
      resolve(item.data)
    })
  }
}
const cacheTrans = new Map()
const cacheTransTime = new Map()
/**
 * 远程获取数据合并同一请求 [避免重复请求]
 * @param prefix 前缀
 * @param id 参数配置
 * @returns {Promise<any>|Promise<T | never>}
 */
export function remoteTransRequest(prefix, id) {
  const curTime = new Date().getTime()
  const timeOut = 2000
  let time = cacheTransTime.get(prefix)
  if (time == null) {
    cacheTransTime.set(prefix, curTime)
    time = curTime
  }
  if (curTime - timeOut >= time) { // 2秒内的请求都重新请求
    // 清除缓存换个请求
    cacheTransTime.clear()
    cacheTransTime.set(prefix, curTime)
    time = curTime
  }
  const key = prefix + '#' + time
  // 汇总接口
  let item = cacheTrans.get(key)
  let idVal = id
  if (Object.prototype.toString.call(id) === '[object Object]') {
    idVal = JSON.stringify(id)
  }
  if (item == null || item.error === true) {
    // 还没加载过
    if (item == null) {
      item = { loading: true, ids: new Set(), callbacks: [] }
      cacheTrans.set(key, item)
    }
    item.loading = true
    item.ids = item.ids.add(idVal)
    const remoteFunc = (ids) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(ids)
        }, 100)
      })
    }
    return remoteFunc(item.ids).then((ids) => {
      item.ids = ids
      // 之前注册过的callback全部触发
      for (const callback of item.callbacks) {
        callback(ids)
      }
      item.loading = false
      item.callbacks = []
      return ids
    })
  } else if (item.loading === true) {
    // 正在加载中，注册callback，等加载完了之后，再统一触发，就只需要向服务器请求一次数据模版
    return new Promise((resolve) => {
      const callback = (ids) => {
        item.ids = ids.add(idVal)
        resolve(item.ids)
      }
      item.callbacks.push(callback)
    })
  } else {
    //  从缓存拿
    return new Promise((resolve) => {
      resolve(item.ids)
    })
  }
}
