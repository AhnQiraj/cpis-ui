/**
 * 头像地址帮助类
 */
import utils from '@platform/utils/util'
export function getFile(photo) {
  if (utils.isEmpty(photo)) {return ''}
  if (photo.indexOf('getImage')) {
    return window.apiList['file/attachment'].getPhoto(photo)
  } else {
    // 兼容旧版本格式，如：/platform/file/attachment/getFileById.htm?fileId=489034166378168320
    return window.apiList['file/attachment'].getImage(photo.split('=')[1])
  }
}
