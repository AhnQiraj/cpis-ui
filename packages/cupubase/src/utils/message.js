import { Message } from 'element-ui'
let messageInstance = null
/**
 * 重写message
 */
const resetMessage = options => {
  if (messageInstance) {
    messageInstance.close()
  }
  options.duration = 2000 //延迟2s
  options.showClose = true //显示关闭
  messageInstance = Message(options)
}
;['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})
export default resetMessage
