import { Message, MessageBox } from 'element-ui'
import Utils from '@platform/utils/util'
import I18n from '@platform/utils/i18n'
import common from '@platform/constants/common.js'
const action = {
  msg: function(message, options) {
    Message.closeAll()
    if (!options) {
      options = options || {}
    }
    options.message = message
    Message(options)
  },
  /**
   * 操作警告提示
   */
  warning: function(message) {
    this.msg(message, {
      type: 'warning'
    })
  },
  /**
   * 操作成功提示
   */
  success: function(message) {
    this.msg(message, {
      type: 'success'
    })
  },
  error: function(message) {
    this.msg(message, {
      type: 'error'
    })
  },
  /**
   * 默认操作成功提示
   *  @param {*} message
   */
  successMessage: function(message = I18n.t('common.dialog.operateSuccess')) {
    this.success(message)
  },
  /**
   * 删除成功提示
   * @param {*} message
   */
  removeSuccessMessage: function(message = I18n.t('common.dialog.removeSuccess')) {
    this.success(message)
  },
  /**
 * 获取选择行的id
 * @param {*} rows
 * @param {*} pkKey
 */
  getSelectedIds: function(rows, pkKey = 'id') {
    const ids = []
    rows.forEach(row => {
      ids.push(row[pkKey])
    })
    return ids
  },
  /**
 * 选择记录
 * 只能选择一个记录
 * [一般用于编辑、明细等只选择一个记录]
 *
 * @param {*} selection
 */
  selectedRecord: function(selection, selectRequired = true) {
    return new Promise((resolve, reject) => {
      if (selectRequired) {
        if (Utils.isEmpty(selection)) {
          this.warning(I18n.t('common.dialog.selectedRecords'))
          return reject(selection)
        }
        if (Array.isArray(selection) && selection.length > 1) {
          this.warning(I18n.t('common.dialog.multipleSelected'))
          return reject(selection)
        }
      }
      if (Array.isArray(selection)) {
        resolve(selection[0])
      } else {
        resolve(selection)
      }
    })
  },
  /**
 * 选择多个记录
 * [一般用于删除等选择多个记录]
 *
 * @param {*} selection 选中的值
 * @param {*} isArray 是否数组格式返回 默认 false
 * @param {*} separator 分割符 默认 `,`
 */
  selectedMultiRecord: function(selection, isArray = false, separator = ',') {
    return new Promise((resolve, reject) => {
      if (Utils.isEmpty(selection)) {
        this.warning(I18n.t('common.dialog.selectedRecords'))
        return reject(selection)
      }
      if (!Array.isArray(selection)) {
        selection = selection.split(separator)
      }
      if (!isArray) { // 不是数组返回
        selection = selection.join(separator)
      }
      resolve(selection)
    })
  },
  /**
 * 删除记录
 * @param {*} rows
 * @param {*} pkKey
 */
  removeRecord: function(selection, confirmMsg = I18n.t('common.dialog.removeRecord'), isArray = false, separator = ',') {
    return new Promise((resolve, reject) => {
      if (Utils.isEmpty(selection)) {
        this.warning(I18n.t('common.dialog.selectedRecords'))
        return reject(selection)
      }
      if (!Array.isArray(selection)) {
        selection = selection.split(separator)
      }
      if (!isArray) { // 不是数组返回
        selection = selection.join(separator)
      }
      MessageBox.confirm(confirmMsg, I18n.t('common.dialog.title'), {
        type: 'warning'
      }).then(() => {
        resolve(selection)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
 * 保存成功提示
 */
  saveSuccessMessage: function(message = I18n.t('common.dialog.operateSuccess'), callback) {
    message = Utils.isNotEmpty(message) ? message : I18n.t('common.dialog.operateSuccess')
    MessageBox.confirm(message,
      I18n.t('common.dialog.title'),
      {
        type: 'success',
        confirmButtonText: I18n.t('common.dialog.saveConfirmButtonText'),
        cancelButtonText: I18n.t('common.dialog.saveCancelButtonText'),
        closeOnClickModal: false,
        callback: (action) => {
          const flag = action !== 'confirm'
          callback(flag)
        }
      })
  },
  /**
 * 保存成功提示
 */
  saveSuccessAlert: function(message = I18n.t('common.dialog.operateSuccess'), callback) {
    MessageBox.alert(message,
      I18n.t('common.dialog.title'),
      {
        type: 'success',
        closeOnClickModal: false,
        showClose: false,
        callback: (action) => {
          callback(action)
        }
      })
  },
  /**
 * 保存失败
 */
  saveErrorMessage: function(message, callback) {
    this.warning(message || I18n.t('common.dialog.saveError'))
    if (callback) {callback()}
  },
  /**
 * 处理列表数据
 * @param vm 当前对象
 * @param data 后台返回的列表数据
 * @param options 参数
 *   dataResultKey 默认 dataResult
 *  pageResultKey 默认 pageResult
 *  resultKey 结果key 默认 listData
 *  pageKey 分页key 默认 pagination
 */
  handleListData: function(vm, data, options = {}) {
    const dataResultKey = options.dataResultKey || 'dataResult'
    const pageResultKey = options.pageResultKey || 'pageResult'
    const resultKey = options.resultKey || 'listData'
    const pageKey = options.pageKey || 'pagination'
    vm[resultKey] = data ? data[dataResultKey] || [] : []
    vm[pageKey] = data ? data[pageResultKey] || {} : {}
  },
  /**
 *  设置分页设置
 */
  setPagination: function(pagination, defaultPagination) {
    // 修复通过查询
    if (!defaultPagination) {
      defaultPagination = {
        page: common.PAGE,
        limit: pagination.limit || common.LIMIT
      }
    }
    pagination.page = defaultPagination ? (defaultPagination.page || common.PAGE) : (pagination.page || common.PAGE)
    pagination.limit = defaultPagination ? (defaultPagination.limit || common.LIMIT) : (pagination.limit || common.LIMIT)
  },
  /**
   * 设置分页第一页设置
   * @param {*} pagination
   * @param {*} defaultPagination
   */
  setFirstPagination: function(pagination) {
    pagination.page = common.PAGE
  },
  /**
 * 设置排序
 */
  setSorts: function(sorts, sort, defaultSorts = {}) {
    const defaultSortsData = function() {
      for (const key in defaultSorts) {
        sorts[key] = defaultSorts[key]
      }
      // 清空属性
      for (const key in sorts) {
        delete sorts[key]
      }
    }
    defaultSortsData()
    if (sort) {
      const { name, sortBy, order } = sort
      if (name && order) {
        sorts[name] = order === 'ascending' ? 'ASC' : 'DESC'
      } else if (sortBy && order) {
        sorts[sortBy] = order === 'ascending' ? 'ASC' : 'DESC'
      } else {
        defaultSortsData()
      }
    } else {
      defaultSortsData()
    }
  },
  /**
 * 格式分页数据
 * @param {} params 查询的参数
 * @param {} pagination 分页
 * @param {} sorts 排序
 */
  formatParams: function(params, pagination, sorts) {
    const results = {}
    if (params) {
      results.parameters = Object.keys(params).map((k) => {
        const value = params[k]
        if (Utils.isObject(value) && value['relation']) {
          return value
        } else {
          return {
            'key': k,
            'value': value
          }
        }
      })
    }
    if (pagination) {
      results.requestPage = {
        'pageNo': pagination.page || common.PAGE,
        'limit': pagination.limit || common.LIMIT
      }
      if (Utils.isNotEmpty(pagination.totalCount)) { // mock 数据时候要传
        results.requestPage['totalCount'] = pagination.totalCount
      }
    }
    if (sorts) {
      results.sorts = Object.keys(sorts).map((k) => {
        return {
          'field': k,
          'order': sorts[k]
        }
      })
    }
    return results
  },
  /**
  * @description 打开新页面
  * @param {String} url 地址
  */
  open: function(url, target = '_blank') {
    let a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('target', target)
    a.setAttribute('id', 'ibps-open-link')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('ibps-open-link'))
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
  },
  /**
 * 导出文件
 */
  exportFile: function(data, fileName, responseType = 'application/octet-stream') {
    this.download(data, fileName, responseType)
  }
}
export default action
