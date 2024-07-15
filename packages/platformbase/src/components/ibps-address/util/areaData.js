const cache = new Map()
const KEY = 'area'
function getRemoteAreaFunc() {
  return new Promise((resolve, reject) => {
    window.apiList['cat/area'].getAreaData().then(response => {
      resolve(response.data)
    }).catch((error) => {
      // 异常
      reject(error)
    })
  })
}
/**
 * 远程获取地址配置
 * @param dict 地址配置
 * @returns {Promise<any>|Promise<T | never>}
 */
export function get(areaData) {
  if (areaData != null) {
    // 配置中就有数据，直接返回
    if (areaData instanceof Promise) {
      return areaData
    }
    return new Promise((resolve) => {
      resolve(areaData)
    })
  }
  // 远程获取
  let item = cache.get(KEY)
  if (item == null || item.error === true) {
    // 还没加载过
    if (item == null) {
      item = { loading: true, callbacks: [] }
      cache.set(KEY, item)
    }
    item.loading = true
    item.error = false
    // 远程加载
    return getRemoteAreaFunc().then((ret) => {
      // prop mapping
      let data = ret.data
      if (data == null) {
        data = ret
      }
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
    // 正在加载中，注册callback，等加载完了之后，再统一触发，就只需要向服务器请求一次字典
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
