/**
 * 文件类型
 */
const FILE_TYPES = {
  'images': ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'tiff'],
  'videos': ['mkv', 'mp4', 'avi', 'swf', 'wmv', 'rmvb', 'mov', 'mpg'],
  'audios': ['mp3', 'flac', 'ape', 'wma', 'wav', 'aac', 'm4a', 'au', 'ram', 'mmf', 'aif'],
  'docs': ['doc', 'docx', 'pdf', 'rtf', 'txt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'wps', 'hip'],
  'compress': ['rar', 'zip', '7z', 'gz', 'arj', 'z']
}
/**
 * 参考http://www.w3school.com.cn/media/media_mimeref.asp
 */
const ACCEPT = {
// 'images': 'image/*',
// 'videos': 'video/*',
// 'audios': 'audio/*',
  'images': '.jpg,.jpeg,.png,.gif,.bmp,.tif',
  'videos': '.mkv,.mp4,.avi,.swf,.wmv,.rmvb,.mov,.mpg',
  'audios': '.mp3,.flac,.ape,.wma,.wav,.aac,.m4a,.au,.ram,.mmf,.aif',
  'docs': '.doc,.docx,.pdf,.rtf,.txt,.csv,.xls,.xlsx,.ppt,.pptx,.htm,.html,.wps,.hip',
  'compress': '.rar,.zip,.7z,.gz,.arj,.z'
}
const IMAGE_ACCEPT = {
  'bmp': 'image/bmp',
  'cod': 'image/cis-cod',
  'gif': 'image/gif',
  'ief': 'image/ief',
  'jpe': ' image/jpeg',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'jfif': 'image/pipeg',
  'svg': 'image/svg+xml',
  'tif': 'image/tiff',
  'tiff': 'image/tiff',
  'ras': 'image/x-cmu-raster',
  'cmx': 'image/x-cmx',
  'ico': 'image/x-icon',
  'pnm': 'image/x-portable-anymap',
  'pbm': 'image/x-portable-bitmap',
  'pgm': 'image/x-portable-graymap',
  'ppm': 'image/x-portable-pixmap',
  'rgb': 'image/x-rgb',
  'xbm': 'image/x-xbitmap',
  'xpm': 'image/x-xpixmap',
  'xwd': 'image/x-xwindowdump'
}
let AllFileTypes = []
for (const key in FILE_TYPES) {
  AllFileTypes = [...AllFileTypes, ...FILE_TYPES[key]]
}
// 文件类型
export const fileTypes = FILE_TYPES
// 所有文件
export const allFileTypes = AllFileTypes
export const accept = ACCEPT
export const imageAccept = IMAGE_ACCEPT
