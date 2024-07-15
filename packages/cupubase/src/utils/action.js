import Utils from '@cupu/utils/util'
import common from '@cupu/constants/common.js'
const action = {
  formatParams: function (params, pagination, sorts) {
    const results = {}
    if (params) {
      results.parameters = Object.keys(params).map(k => {
        const value = params[k]
        if (Utils.isObject(value) && value['relation']) {
          return value
        } else {
          return {
            key: k,
            value: value
          }
        }
      })
    }
    if (pagination) {
      results.requestPage = {
        pageNo: pagination.page || common.PAGE,
        limit: pagination.limit || common.LIMIT
      }
      if (Utils.isNotEmpty(pagination.totalCount)) {
        // mock 数据时候要传
        results.requestPage['totalCount'] = pagination.totalCount
      }
    }
    if (sorts) {
      results.sorts = Object.keys(sorts).map(k => {
        return {
          field: k,
          order: sorts[k]
        }
      })
    }
    return results
  },
  exportFile: function (data, fileName, responseType = 'application/octet-stream') {
    this.download(data, fileName, responseType)
  },
  /**
   * 下载
   */
  download: function(data, fileName, responseType = 'application/octet-stream') {
    const blob = data instanceof Blob ? data : new Blob([data], { type: responseType })
    if ('download' in document.createElement('a')) { // 非IE下载
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }
}
export default action
