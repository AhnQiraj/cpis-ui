export default {
  on: function(obj, type, handler) {
    const types = this.isArray(type) ? type : [type]
    let k = types.length
    let d
    if (!obj.addEventListener) {
      // 绑定obj 为this
      d = function(evt) {
        evt = evt || window.event
        const el = evt.srcElement
        return handler.call(el, evt)
      }
      handler._d = d
    }
    if (!k) {
      obj = null
      return
    }
    while (k--) {
      type = types[k]
      if (obj.addEventListener) {
        obj.addEventListener(type, handler, false)
      } else {
        obj.attachEvent('on' + type, d)
      }
    }
    obj = null
  },
  un: function(obj, type, handler) {
    const types = this.isArray(type) ? type : [type]
    let k = types.length
    if (!k) {return}
    while (k--) {
      type = types[k]
      if (obj.removeEventListener) {
        obj.removeEventListener(type, handler, false)
      } else {
        obj.detachEvent('on' + type, handler._d || handler)
      }
    }
  },
  inArray: function(value, validList) {
    for (let i = 0; i < validList.length; i++) {
      if (value === validList[i]) {
        return true
      }
    }
    return false
  },
  isEmpty: function(data) {
    return data.replace(/[ ]/g, '') !== '' ? data : '无'
  },
  getEvent: function(event) {
    return event || window.event
  },
  getTarget: function(event) {
    return event.target || event.srcElement
  },
  setInnerText: function(element, text) {
    if (typeof element.textContent === 'string') {element.textContent = text} else {element.innerText = text}
  },
  $G: function(id) {
    return document.getElementById(id)
  },
  getFirstNode: function(ele) {
    return ele.firstChild.nodeType === 1 ? ele.firstChild : ele.firstElementChild
  },
  getElementsByClassName: function(clsName) {
    const doc = document
    if (!doc.getElementsByClassName) {
      const clsArr = []
      const reg = new RegExp('\\b' + clsName + '\\b')
      const eleArr = doc.getElementsByTagName('*')
      for (let i = 0; i < eleArr.length; i++) {
        const eleobj = eleArr[i]
        if (reg.test(eleobj.className)) {clsArr.push(eleobj)}
      }
      return clsArr
    } else {
      return doc.getElementsByClassName(clsName)
    }
  },
  getCharCode: function(event) {
    return event.keyCode || event.which || event.charCode
  },
  getStyleValue: function(ele, attr) {
    const doc = document
    const style = ele.currentStyle || doc.defaultView.getComputedStyle(ele, null)
    return parseInt(style[attr].replace(/px/g, ''))
  },
  getBrowerVersion: function() {
    const agent = navigator.userAgent.toLowerCase()
    const opera = window.opera
    const browser = {
      ie: !!window.ActiveXObject,
      webkit: (agent.indexOf(' applewebkit/') > -1),
      quirks: (document.compatMode === 'BackCompat'),
      opera: (!!opera && opera.version)
    }
    if (browser.ie) {
      browser.version = parseFloat(agent.match(/msie (\d+)/)[1])
    }
    browser.gecko = (navigator.product === 'Gecko' && !browser.webkit && !browser.opera)
    return browser
  },
  isArray: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }
}
