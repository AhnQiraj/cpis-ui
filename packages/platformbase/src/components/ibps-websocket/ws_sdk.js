import Long from 'long'
import proto from './IMDataProto'
let configure = {
  heartbeatTimer: 1500, // 心跳定时器
  timeoutTimer: null, // 超时定时器
  heartbeatMS: 3000, // 心跳时间
  timeoutMS: 30000, // 超时时间
  reconnectNum: 0, // 重连次数
  reconnectMaxNum: 20, // 最大重连次数
  reconnectMS: 1000, // 重连 毫秒 （梯度）
  allowAccess: true // 是否允许访问
}
let WS_SDK = window.WS_SDK = function(url, msgCallBackFunc, isReconnect, isEnabled) {
  if (!window.WebSocket) {
    window.WebSocket = window.MozWebSocket
  }
  if (!window.WebSocket) {
    alert('抱歉，您的浏览器不支持WebSocket协议!')
    return
  }
  if (WS_SDK._CONS_ && WS_SDK._CONS_.WEB_SOCKET && url === WS_SDK._CONS_.URL) {
    WS_SDK.close()
  }
  WS_SDK._init_(url, msgCallBackFunc, isReconnect, isEnabled)
  WS_SDK.initWebSocket()
  WS_SDK.self = this
}
WS_SDK.self = {}
WS_SDK._init_ = function(url, msgCallBackFunc, isReconnect, isEnabled) {
  this._CONS_ = {
    ENABELED: isEnabled || false, // socket 服务器地址
    URL: url, // socket 服务器地址
    WEB_SOCKET: null, // websocket 对象
    msgCallBackFunc: msgCallBackFunc,
    isReconnect: isReconnect || true, // 是否自动重连
    EVENT_TYPE: { // 事件类型
      open: 'open', // 通道打开
      message: 'message', // 服务端消息接收
      close: 'close', // 通道关闭
      error: 'error' // 消息异常
    }
  }
}
WS_SDK.handle = function(eventType, event, msg) {
  try {
    this._CONS_.handleFunc(eventType, event, msg)
  } catch (e) {
    console.error('业务处理回调方法异常：')
    console.error(e)
  }
}
WS_SDK.ping = function() {
  let imdata = new proto.IMData()
  imdata.setType(4)
  imdata.setTimestamp(new Date().getTime())
  if (WS_SDK._CONS_.WEB_SOCKET.readyState === 1 || WS_SDK._CONS_.WEB_SOCKET.readyState === WebSocket.OPEN) {
    WS_SDK._CONS_.WEB_SOCKET.send(imdata.serializeBinary())
  } else {
    console.error('ping fail')
  }
  // eslint-disable-next-line no-implied-eval
  window.setTimeout('WS_SDK.ping()', configure.heartbeatMS)
}
WS_SDK.initWebSocket = function() {
  let self = this
  // 重连
  function reconnect() {
    WS_SDK._CONS_.WEB_SOCKET.close()
    if (self._CONS_.isReconnect) {
      connect()
      configure.timeoutTimer = null
    }
    console.debug('重连--------------')
    console.debug(configure)
    console.debug('重连--------------')
  }
  // 设置长时间无通信处理定时器
  function setTimeoutTimer(timerTime) {
    if (configure.timeoutTimer) {
      clearTimeout(configure.timeoutTimer)
    }
    configure.timeoutTimer = setTimeout(function() {
      configure.timeoutTimer = null
      reconnect()
    }, timerTime)
  }
  // 设置心跳定时器
  function setTeartbeatTimer() {
    // eslint-disable-next-line no-implied-eval
    window.setTimeout('WS_SDK.ping()', configure.heartbeatMS)
  }
  // 异常重连
  function errorReconnect() {
    if (!configure.timeoutTimer) {
      if (configure.reconnectNum < configure.reconnectMaxNum) {
        configure.reconnectNum = configure.reconnectNum + 1
        configure.timeoutTimer = setTimeoutTimer(configure.reconnectMS)
      } else {
        console.error('无法连接请稍后再试')
      }
    }
  }
  // 连接
  function connect() {
    if (self._CONS_.ENABELED !== true) {
      return
    }
    if ('WebSocket' in window) {
      self._CONS_.WEB_SOCKET = new WebSocket(self._CONS_.URL)
    } else if ('MozWebSocket' in window) {
      self._CONS_.WEB_SOCKET = new window.MozWebSocket(self._CONS_.URL)
    }
    // 消息接收监听
    WS_SDK._CONS_.WEB_SOCKET.onmessage = function(event) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(event.data)
      reader.onload = function(e) {
        let buf = new Uint8Array(reader.result)
        let imData = proto.IMData.deserializeBinary(buf)
        if (imData === undefined) {
          console.info('错误的消息')
        }
        if (imData.getType() === 4) {
          console.info('收到心跳响应')
          return
        }
        if (imData.getType() === 1) {
          let initData = imData.getInitdata()
          configure.allowAccess = initData.getAllowaccess()
          if (!configure.allowAccess) {
            WS_SDK._CONS_.WEB_SOCKET.close()
            console.info('非法连接！！！')
            return
          }
          configure.heartbeatMS = initData.getHeartbeatms()
          configure.timeoutMS = initData.getTimeoutms()
          configure.reconnectMaxNum = initData.getReconnectmaxnum()
          configure.reconnectMS = initData.getReconnectms()
          setTeartbeatTimer()
          return
        }
        // TODO: 消息防丢处理
        if (imData.getType() === 3) {
          return
        }
        if (imData.getType() === 2) {
          WS_SDK._CONS_.msgCallBackFunc(imData.getMsgdata())
          let imdataResponse = new proto.IMData()
          imdataResponse.setId(imData.getId())
          imdataResponse.setType(3)
          WS_SDK._CONS_.WEB_SOCKET.send(imdataResponse.serializeBinary())
        }
      }
    }
    // 通道开启事件
    WS_SDK._CONS_.WEB_SOCKET.onopen = function(event) {
      console.debug('开启--------------')
      console.debug(configure)
      console.debug(event)
      console.debug('开启--------------')
    }
    // 关闭事件
    WS_SDK._CONS_.WEB_SOCKET.onclose = function(event) {
      console.debug('关闭--------------')
      clearTimeout(configure.heartbeatTimer)
      if (configure.allowAccess) {
        errorReconnect()
      }
    }
    // 异常事件
    WS_SDK._CONS_.WEB_SOCKET.error = function(event) {
      if (configure.allowAccess) {
        errorReconnect()
      }
    }
  }
  connect()
}
WS_SDK.prototype = {
  close: function() {
    console.info('============')
    clearTimeout(configure.timeoutTimer)
    configure.timeoutTimer = null
    clearTimeout(configure.heartbeatTimer)
    configure.heartbeatTimer = null
    WS_SDK._CONS_.WEB_SOCKET.close()
  },
  send: function(sysId, toUserId, sType, msgType, msg, customType) { // 发送消息
    if (WS_SDK._CONS_.WEB_SOCKET.readyState === 1 || WS_SDK._CONS_.WEB_SOCKET.readyState === WebSocket.OPEN) {
      try {
        let imdata = new proto.IMData()
        imdata.setId(new Date().getTime())
        imdata.setType(2)
        imdata.setTimestamp(new Date().getTime())
        let msgData = new proto.IMData.MsgData()
        if (sysId !== undefined && sysId !== '') {
          msgData.setSysid(Long.fromValue(sysId, false))
        }
        let fromData = new proto.IMData.MsgData.FromUser()
        fromData.setId(Long.fromValue(WS_SDK._CONS_.imUid, false))
        if (sysId !== undefined && sysId !== '') {
          fromData.setSysid(Long.fromValue(sysId, false))
        }
        fromData.setBususerid(WS_SDK._BUSUSERINFO_.busUid)
        fromData.setHeadimg(WS_SDK._BUSUSERINFO_.headImg)
        fromData.setNickname(WS_SDK._BUSUSERINFO_.nickName)
        msgData.setFromuser(fromData)
        msgData.setMsgbody(msg)
        msgData.setMsgtype(msgType)
        if (msgType !== undefined && msgType === 'custom') {
          if (customType === undefined || customType === '') {
            alert('自定义消息中自定义类型不能为空自定义类型不能为空')
            return
          }
          msgData.setCustomtype(customType)
        }
        msgData.setStype(sType)
        msgData.setTouserid(Long.fromValue(toUserId, false))
        msgData.setSendtime(new Date().getTime())
        imdata.setMsgdata(msgData)
        WS_SDK._CONS_.WEB_SOCKET.send(imdata.serializeBinary())
        return true
      } catch (e) {
        console.error(e)
        console.error('网络异常，请稍后再试！！！')
        return false
      }
    } else {
      console.error('网络异常，请稍后再试！！！')
      WS_SDK._CONS_.WEB_SOCKET.error('')
      return false
    }
  }
}
export default WS_SDK
