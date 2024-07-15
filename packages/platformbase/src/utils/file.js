import Utils from '@platform/utils/util'
import ActionUtils from '@platform/utils/action'
import { Loading } from 'element-ui'
export function downloadFile(file) {
  const loadingInstance = Loading.service({
    lock: true,
    text: '下载中..'
  })
  window.apiList['file/attachment'].download({
    attachmentId: file.id
  }).then(response => {
    loadingInstance.close()
    if (!response) {
      return
    }
    ActionUtils.exportFile(
      response.data,
      file.fileName || file.name + (Utils.isNotEmpty(file.ext) ? '.' + file.ext : '')
    )
  }).catch(() => {
    loadingInstance.close()
  })
}
