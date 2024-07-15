import util from './utils'
let UE_BUILDER_CONFIG = {
  'toolbars': {
    'base|基本': {
      'fullscreen': '全屏',
      'source': '源码',
      'undo': '撤销',
      'redo': '恢复',
      'insertunorderedlist': '无序列表',
      'insertorderedlist': '有序列表',
      'unlink': '取消链接',
      'link': '超链接',
      'cleardoc': '清空文档',
      'selectall': '全选',
      'print': '打印',
      'searchreplace': '查找替换',
      'preview': '预览',
      'drafts': '草稿箱',
      'help': '帮助',
      'separate': '分隔线'
    },
    'insert|插入': {
      //           'gmap':'谷歌地图',
      'pagebreak': '分页',
      'simpleupload': '单图上传',
      'insertimage': '多图上传',
      'scrawl': '涂鸦',
      //           'music':'音乐',
      'snapscreen': '屏幕截图',
      'emotion': '表情',
      'insertvideo': '视频',
      'attachment': '附件',
      'insertframe': 'iframe',
      'date': '日期',
      'time': '时间',
      'wordimage': '图片转存',
      // 'map': '百度地图',
      // 'webapp': '百度应用',
      'horizontal': '水平线',
      'anchor': '锚点',
      'spechars': '特殊字符',
      'blockquote': '引用',
      'pasteplain': '存文本粘贴',
      'insertcode': '代码',
      'template': '模板',
      'background': '背景'
    },
    'format|格式化': {
      'bold': '加粗',
      'italic': '斜体',
      'underline': '下划线',
      'fontborder': '文字边框',
      'strikethrough': '删除线',
      'forecolor': '文字颜色',
      'backcolor': '背景颜色',
      'superscript': '上标',
      'subscript': '下标',
      'justifyleft': '左对齐',
      'justifycenter': '居中',
      'justifyright': '右对齐',
      'justifyjustify': '两端对齐',
      'touppercase': '字母大写',
      'tolowercase': '字母小写',
      'directionalityltr': '从左向右输',
      'directionalityrtl': '从右向左输',
      'indent': '首行缩进',
      'removeformat': '清除格式',
      'formatmatch': '格式刷',
      'autotypeset': '自动排版',
      'customstyle': '自定义标题',
      'paragraph': '段落格式',
      'rowspacingbottom': '段后间距',
      'rowspacingtop': '段前间距',
      'lineheight': '行间距',
      'fontfamily': '字体',
      'fontsize': '字号',
      'imagenone': '图片默认',
      'imageleft': '图片居左',
      'imageright': '图片居右',
      'imagecenter': '图片居中'
    },
    'table|表格': {
      'inserttable': '插入表格',
      'deletetable': '删除表格',
      'mergeright': '向右合并',
      'mergedown': '向下合并',
      'splittorows': '拆分成行',
      'splittocols': '拆分成列',
      'splittocells': '拆成单元格',
      'mergecells': '合并单元格',
      'insertcol': '前插入列',
      'insertrow': '前插入行',
      'deletecol': '删除列',
      'deleterow': '删除行',
      'insertparagraphbeforetable': '表格前插行',
      'charts': '生成图表'
    }
  },
  'selfConfigs': {
    'autofloatenabled': { 'name': '自动浮动' },
    'autoheightenabled': { 'name': '自动长高' },
    'autolink': { 'name': '自动加超链接' },
    'autosubmit': { 'name': '自动提交' },
    'autosave': { 'name': '自动保存草稿' },
    'autoupload': { 'name': '拖放图片自动上传和粘贴QQ截图' },
    'catchremoteimageenable': { 'name': '抓取远程图片' },
    'wordcount': { 'name': '字数统计' },
    'elementpath': { 'name': '元素路径' },
    'insertparagraph': { 'name': '前插后插段落' },
    'shortcutmenu': { 'name': '快捷菜单' },
    'contextmenu': { 'name': '右键菜单' },
    'section': { 'name': '目录大纲支持' }
  }
}
let UBuilder = {}
UBuilder.core = {
  clearSelection: function() {
    document.getSelection && document.getSelection().removeAllRanges && document.getSelection().removeAllRanges()
    document.selection && document.selection.empty()
  },
  getClientLeft(obj) {
    return 325
  },
  getPosition: function(obj) {
    let left = 0
    let top = 0
    while (obj.offsetParent) {
      left += obj.offsetLeft + (obj.currentStyle ? (isNaN(parseInt(obj.currentStyle.borderLeftWidth))
        ? 0 : parseInt(obj.currentStyle.borderLeftWidth)) : 0)
      top += obj.offsetTop + (obj.currentStyle ? (isNaN(parseInt(obj.currentStyle.borderTopWidth))
        ? 0 : parseInt(obj.currentStyle.borderTopWidth)) : 0)
      obj = obj.offsetParent
    }
    left += obj.offsetLeft + (obj.currentStyle ? (isNaN(parseInt(obj.currentStyle.borderLeftWidth))
      ? 0 : parseInt(obj.currentStyle.borderLeftWidth)) : 0)
    top += obj.offsetTop + (obj.currentStyle ? (isNaN(parseInt(obj.currentStyle.borderTopWidth))
      ? 0 : parseInt(obj.currentStyle.borderTopWidth)) : 0)
    return { x: left - this.getClientLeft(obj), y: top }
  },
  mouseCoords: function(e) {
    if (e.pageX || e.pageY) {
      return { x: e.pageX, y: e.pageY }
    }
    return {
      x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: e.clientY + document.body.scrollTop - document.body.clientTop
    }
  },
  getMouseOffset: function(obj, e) {
    let targetPos = this.getPosition(obj)
    let mousePos = this.mouseCoords(e)
    return {
      x: mousePos.x - targetPos.x,
      y: mousePos.y - targetPos.y
    }
  },
  switchTab: function(tabParentId, keepFocus) {
    let tabElements = util.$G(tabParentId).children
    let tabHeads = tabElements[0].children
    let tabBodys = tabElements[1].children
    for (let i = 0, length = tabHeads.length; i < length; i++) {
      let head = tabHeads[i]
      util.on(head, 'click', function() {
        // head样式更改
        for (let k = 0, len = tabHeads.length; k < len; k++) {
          if (!keepFocus) {tabHeads[k].className = ''}
        }
        this.className = 'focus'
        // body显隐
        let tabSrc = this.getAttribute('tabSrc')
        for (let j = 0, length = tabBodys.length; j < length; j++) {
          let body = tabBodys[j]
          if (body.getAttribute('id') === tabSrc) {
            body.style.display = ''
          } else {
            body.style.display = 'none'
          }
        }
      })
    }
  },
  getPropertyNames: function(obj) {
    let arr = []
    for (let i in obj) {arr.push(i)}
    return arr
  },
  move: function(from, to, isAll) {
    if (from.children.length) {
      if (isAll) {
        for (const ele in from.children[0]) {
          to.appendChild(ele)
        }
      } else {
        for (let i = 0; i < from.children.length; i++) {
          const node = from.children[i]
          if (node.selected) {
            to.appendChild(node)
          }
        }
      }
    }
  }
}
let selectedTools = [[]]
let dragHelper = null
let toolTip = null
let funCount = 0
let dragCon = []
let core = UBuilder.core
let mouseJustDown = false
// 当前是否刚刚按下鼠标
let mouseHasDown = false
// 前一瞬间鼠标是否处于按下状态
let curTarget = null
// 当前被拖动的对象;
let curParent = null
// 当前拖动对象的父节点，
let curSibling = null
// 当前拖动对象的下一个兄弟节点，用于标记拖动对象的插入位置
let activeContainer = null
// 当前激活的container
let mouseOffset = null // 鼠标当前坐标和被拖动元素原始坐标之间的偏移
UBuilder.main = {
  /**
   * 依据从服务器传回的数据初始化main页面的数据
   */
  init: function(toolbars) {
    let section = util.$G('toolbarsSection')
    util.on(section, 'mousedown', function() {
      mouseJustDown = true
    })
    util.on(section, 'mousemove', mouseMove)
    util.on(section, 'mouseup', mouseUp)
    dragCon = []
    selectedTools = [[]]
    funCount = 0
    // 创建功能工具类
    this._createFunGroups()
    this._createToolTip()
    this._createDragHelper()
    this._initdragCon(3)
    this._addChangeLineListener()
    this._addClearListener()
    this.addTools(toolbars)
    this._addAddAllListener(toolbars)
  },
  addTools: function(toolbars) {
    let tabIds = []
    let bars = UE_BUILDER_CONFIG.toolbars
    let funGroupNames = core.getPropertyNames(bars)
    for (let i = 0; i < funGroupNames.length; i++) {
      const ci = funGroupNames[i]
      tabIds.push(ci.split('|')[0])
    }
    let addTools = {}
    let separateTools
    for (let i = 0; i < tabIds.length; i++) {
      const ci = tabIds[i]
      let tools = util.$G(ci).children
      for (let j = 0; j < tools.length; j++) {
        let cj = tools[j]
        let id = cj.getAttribute('id')
        if (id === 'separate') {
          separateTools = cj
        }
        if (!util.inArray(id, toolbars)) {
          continue
        }
        addTools[id] = cj
      }
    }
    for (let i = 0; i < toolbars.length; i++) {
      let ci = toolbars[i]
      let c = addTools[ci]
      if (ci === '|') {
        ci = 'separate'
        c = separateTools
      }
      if (c) {
        this._addToDragContainer(c, dragCon[0])
        this._addToSelected(c.getAttribute('id'), 0)
        this._transparentize(c)
      }
    }
  },
  // 添加所有
  _addAddAllListener: function(toolbars) {
    let me = this
    util.$G('J_addAllFun').onclick = function() {
      let tabIds = []
      let bars = UE_BUILDER_CONFIG.toolbars
      let funGroupNames = core.getPropertyNames(bars)
      for (let i = 0; i < funGroupNames.length; i++) {
        const ci = funGroupNames[i]
        tabIds.push(ci.split('|')[0])
      }
      let addTools = {}
      let otherToolbar = []
      for (let i = 0; i < tabIds.length; i++) {
        const ci = tabIds[i]
        let tools = util.$G(ci).children
        for (let j = 0; j < tools.length; j++) {
          const cj = tools[j]
          let id = cj.getAttribute('id')
          if (!util.inArray(id, toolbars)) {
            otherToolbar.push(id)
          }
          addTools[id] = cj
        }
      }
      // 原选择加上其他选项
      toolbars.push.apply(toolbars, otherToolbar)
      // 清除原选择
      me._resetFunSelect()
      dragCon = []
      selectedTools = [[]]
      funCount = 0
      // 初始化拖动
      me._initdragCon(3)
      // 重新填充
      for (let i = 0; i < toolbars.length; i++) {
        const ci = toolbars[i]
        let c = addTools[ci]
        if (c) {
          me._addToDragContainer(c, dragCon[0])
          me._addToSelected(c.getAttribute('id'), 0)
          me._transparentize(c)
        }
      }
      // 重新初始化计数，防止计数器忽略“separate”
      util.$G('J_funCount').innerHTML = !(toolbars.length) ? '&nbsp;当前尚未选择任何功能……' : '&nbsp;当前已选中 ' + (toolbars.length) + ' 个功能'
    }
  },
  // 清空选择
  _addClearListener: function() {
    let me = this
    util.$G('J_clearFun').onclick = function() {
      me._resetFunSelect()
    }
    this._addContainer()
  },
  // 重置功能选择
  _resetFunSelect: function() {
    let cons = util.$G('J_dragCon').children
    for (let i = 0; i < cons.length; i++) {
      const ci = cons[i]
      let children = ci.children
      if (!children.length) {continue}
      for (let j = 0; j < children.length; j++) {
        const cj = children[j]
        let id = cj.getAttribute('id').replace('drag_', '')
        this._devitrify(util.$G(id))
        this._updateFunCount(false)
        if (id === 'fullScreen') {
          this._hideFullScreenTip()
        }
      }
      if (!this._getContainerIndex(ci)) {
        ci.innerHTML = ''
      } else {
        // 更新dragCon
        for (let k = 0, length = dragCon.length; k < length; k++) {
          if (ci === dragCon[k]) {
            dragCon.splice(k, 1)
            break
          }
        }
        ci.parentNode.removeChild(ci)
        // 删掉了一个dom，修正当前位置
        i--
      }
    }
    updateContainerHeight()
  },
  _createToolTip: function() {
    // 创建一个tooltip实例
    toolTip = document.createElement('div')
    toolTip.style.cssText = 'position:absolute;display:none;z-index:1000'
    toolTip.className = 'toolTip'
    util.$G('J_funAll').appendChild(toolTip)
  },
  /**
   * 显示tooltip
   * @param e
   */
  _showToolTip: function(e) {
    e = e || window.event
    let mousePos = core.mouseCoords(e)
    let mouseOffset = core.getMouseOffset(this, e)
    toolTip.style.top = mousePos.y - mouseOffset.y + 'px'
    toolTip.style.left = mousePos.x - mouseOffset.x + 'px'
    toolTip.style.display = ''
    let id = this.getAttribute('id')
    if (id !== 'add' && id !== 'del') {
      toolTip.innerHTML = this.getAttribute('name')
      return
    }
    if (id === 'add') {
      toolTip.innerHTML = '增加一行'
    } else if (id === 'del') {
      toolTip.innerHTML = '减少一行'
    } else if (id === 'separate') {
      toolTip.innerHTML = '增加分割线'
    }
  },
  /**
   * 隐藏tooltip
   */
  _hideToolTip: function() {
    toolTip.style.display = 'none'
  },
  _createDragHelper: function() {
    // 创建一个临时的div来显示拖动过程
    dragHelper = document.createElement('div')
    dragHelper.style.cssText = 'position:absolute;display:none;cursor: pointer;border:1px solid #888;opacity: 0.5;filter: alpha(opacity = 50)'
    util.$G('J_funAll').appendChild(dragHelper)
  },
  /**
   * 创建功能切换分组
   */
  _createFunGroups: function() {
    let toolbars = UE_BUILDER_CONFIG.toolbars
    let funGroupNames = core.getPropertyNames(toolbars)
    this._createFunGroupsHead(funGroupNames, 'J_selectHead')
    this._createFunGroupsBody(toolbars, 'J_selectBody')
    core.switchTab('J_funSelect')
  },
  _createFunGroupsHead: function(arr, containerId) {
    let container = util.$G(containerId)
    let me = this
    for (let i = 0; i < arr.length; i++) {
      const ci = arr[i]
      let tmp = ci.split('|')
      let span = document.createElement('span')
      span.setAttribute('tabSrc', tmp[0])
      if (tmp[0] === 'base') {span.setAttribute('class', 'focus')}
      span.innerHTML = tmp[1]
      span.style.fontSize = 12 + 'px'
      span.title = '双击全选该组按钮'
      util.on(span, 'dblclick', function() {
        core.clearSelection()
        me._addGroupToDragContainer(this.getAttribute('tabSrc'))
      })
      container.appendChild(span)
    }
  },
  _createFunGroupsBody: function(obj, containerId) {
    let container = util.$G(containerId)
    let me = this
    for (let i in obj) {
      let tmp = i.split('|')
      let div = document.createElement('div')
      div.setAttribute('id', tmp[0])
      if (tmp[0] !== 'base') {div.style.display = 'none'}
      let tools = obj[i]
      for (let j in tools) {
        let toolDiv = document.createElement('div')
        toolDiv.setAttribute('id', j)
        toolDiv.setAttribute('name', tools[j])
        toolDiv.className = 'dragBox ' + j
        // 已经从服务器返回选中
        if (me._checkSelectedFromServer(j)) {
          me._transparentize(toolDiv)
        }
        toolDiv.onclick = function() {
          // var id = this.getAttribute('id')
          if (!this.getAttribute('hasSelected')) {
            me._addToDragContainer(this, dragCon[0])
            me._transparentize(this)
          } else {
            me._removeFromDragContainer(this.getAttribute('id'), null)
            me._devitrify(this)
          }
        }
        util.on(toolDiv, 'mouseover', this._showToolTip)
        util.on(toolDiv, 'mouseout', this._hideToolTip)
        div.appendChild(toolDiv)
      }
      container.appendChild(div)
    }
  },
  _addGroupToDragContainer: function(id) {
    let tools = util.$G(id).children
    for (let i = 0; i < tools.length; i++) {
      const ci = tools[i]
      if (!ci.getAttribute('hasSelected')) {
        this._addToDragContainer(ci, dragCon[0])
        this._addToSelected(ci.getAttribute('id'), 0)
        this._transparentize(ci)
      }
    }
  },
  _checkSelectedFromServer: function(id) {
    for (let i = 0; i < selectedTools.length; i++) {
      const ci = selectedTools[i]
      for (let j = 0; j < ci.length; j++) {
        const cj = ci[i]
        let tmpid = cj.split('-')[0]
        if (id === tmpid) {
          return true
        }
      }
    }
    return false
  },
  // 半透明
  _transparentize: function(obj) {
    if (obj.getAttribute('id') === 'separate') {return}
    obj.setAttribute('hasSelected', 'true')
    obj.style.cssText = 'opacity:0.5;filter:alpha(opacity=50)'
  },
  // 取消半透明
  _devitrify: function(obj) {
    obj.removeAttribute('hasSelected')
    obj.style.cssText = 'opacity:1;filter:alpha(opacity=100)'
  },
  /**
     * 初始化count个拖动元素的容器
     * @param count
     */
  _initdragCon: function(count) {
    let containers = util.$G('J_dragCon')
    let container = null
    let groupTools = null
    let tool = null
    let me = this
    for (let i = 0; i < count; i++) {
      container = document.createElement('div')
      container.className = 'dragContainer'
      container.setAttribute('id', 'dragContainer' + i)
      groupTools = selectedTools[i]
      if (!groupTools) {continue}
      if (!groupTools.length && i === 0) {
        util.$G('J_funCount').innerHTML = '&nbsp;当前尚未选择任何功能……'
        containers.appendChild(container)
        dragCon.push(container)
        updateContainerHeight()
        break
      }
      for (let j = 0; j < groupTools.length; j++) {
        const cj = groupTools[j]
        let tmp = cj.split('-'); let name = tmp[0]; let des = tmp[1]
        if (name === 'fullScreen') {
          this._showFullScreenTip()
        }
        tool = document.createElement('div')
        if (name.indexOf('|') === -1) {
          tool.setAttribute('id', 'drag_' + name)
          tool.className = 'dragBox ' + name
        } else {
          tool.setAttribute('id', 'Separate' + (Math.ceil(Math.random() * 100000) + 1))
          tool.className = 'dragBox Separate'
        }
        tool.setAttribute('name', des)
        tool.setAttribute('dragable', '1')
        util.on(tool, 'mouseover', this._showToolTip)
        util.on(tool, 'mouseout', this._hideToolTip)
        util.on(tool, 'dblclick', function() {
          core.clearSelection()
          let id = this.getAttribute('id').replace('drag_', '')
          let con = this.parentNode
          if (id.indexOf('separate') !== -1) {
            me._removeFromDragContainer(id, con)
          } else {
            me._updateSourceDivState(id)
            me._removeFromDragContainer(id, con)
          }
        })
        container.appendChild(tool)
        if (name.indexOf('|') === -1) {this._updateFunCount(true)}
      }
      containers.appendChild(container)
      dragCon.push(container)
    }
    updateContainerHeight()
  },
  /**
     * 从con中删除一个id为id的可拖动元素
     * @param id
     * @param con
     */
  _removeFromDragContainer: function(id, con) {
    if (id === 'fullScreen') {
      this._hideFullScreenTip()
    }
    let div = util.$G('drag_' + id) || util.$G(id)
    con = con || div.parentNode
    con.removeChild(div)
    let index = this._getContainerIndex(con)
    this._deleteFromSelected(id, index)
    if (id.indexOf('separate') === -1) {this._updateFunCount(false)}
    updateContainerHeight(con)
    this._hideToolTip()
  },
  /**
   * 添加一个tool到dragContainer
   * @param tool
   * @param con
   */
  _addToDragContainer: function(tool, con) {
    if (tool && con) {
      let clone = tool.cloneNode(true)
      let id = tool.getAttribute('id')
      let me = this
      clone.setAttribute('dragable', '1')
      // 分隔线例外,生成一个随机数
      if (id !== 'separate') {
        clone.setAttribute('id', 'drag_' + id)
      } else {
        clone.setAttribute('id', id + Math.ceil(Math.random() * 100000) + 1)
      }
      if (id === 'fullScreen') {
        this._showFullScreenTip()
      }
      util.on(clone, 'mouseover', this._showToolTip)
      util.on(clone, 'mouseout', this._hideToolTip)
      util.on(clone, 'dblclick', function() {
        core.clearSelection()
        let id = this.getAttribute('id').replace('drag_', '')
        let con = this.parentNode
        if (id.indexOf('separate') !== -1) {
          me._removeFromDragContainer(this.getAttribute('id'), con)
        } else {
          me._updateSourceDivState(id)
          me._removeFromDragContainer(id, con)
        }
      })
      con.appendChild(clone)
      let index = this._getContainerIndex(con)
      this._addToSelected(id, index)
      if (id.indexOf('separate') === -1) {this._updateFunCount(true)}
      updateContainerHeight(con)
    }
  },
  _getContainerIndex: function(con) {
    for (let i = 0; i < dragCon.length; i++) {
      const ci = dragCon[i]
      // eslint-disable-next-line eqeqeq
      if (ci == con) {return i - 1}
    }
    return -1
  },
  _deleteFromSelected: function(id, index) {
    if (index > -1) {
      delete selectedTools[index][id]
    }
  },
  _addToSelected: function(id, index) {
    if (index > -1) {
      selectedTools[index].push(id + '-' + util.$G(id).getAttribute('name'))
    }
  },
  _updateFunCount: function(ifAddOne) {
    if (!ifAddOne) {
      funCount--
    } else {
      funCount++
    }
    if (funCount < 0) {funCount = 0}
    util.$G('J_funCount').innerHTML = !funCount ? '&nbsp;当前尚未选择任何功能……' : '&nbsp;当前已选中 ' + funCount + ' 个功能'
  },
  _updateSourceDivState: function(id) {
    let sourceDiv = util.$G(id)
    let state = sourceDiv.getAttribute('hasSelected')
    if (state) {
      this._devitrify(sourceDiv)
    } else {
      this._transparentize(sourceDiv)
    }
  },
  _showFullScreenTip: function() {
    let tip = util.$G('J_fullScreenTip')
    tip.style.display = ''
  },
  _hideFullScreenTip: function() {
    let tip = util.$G('J_fullScreenTip')
    tip.style.display = 'none'
  },
  /**
     * 添加一个container
     */
  _addContainer: function() {
    if (dragCon.length > 4) {
      return
    }
    let container = document.createElement('div')
    container.className = 'dragContainer'
    container.setAttribute('id', 'dragContainer' + dragCon.length)
    util.$G('J_dragCon').appendChild(container)
    dragCon.push(container)
    selectedTools.push([])
    updateContainerHeight()
  },
  /**
   * 删除一个container；
   */
  _delContainer: function() {
    if (dragCon.length === 1) {
      return
    }
    let containers = util.$G('J_dragCon')
    let lastContainer = containers.children[containers.children.length - 1]
    if (lastContainer.children.length !== 0) {
      let childs = lastContainer.children
      let preContainer = lastContainer.previousSibling
      for (let i = 0; i < childs.length; i++) {
        const ci = childs[i]
        preContainer && preContainer.appendChild(ci)
      }
    }
    // 最后一个container不允许删除
    if (containers.children.length > 1) {
      containers.removeChild(lastContainer)
      dragCon.pop()
      updateContainerHeight()
    }
  },
  _addChangeLineListener: function() {
    let add = util.$G('J_addFun')
    let del = util.$G('J_delFun')
    util.on(add, 'click', this._addContainer)
    util.on(add, 'mouseover', this._showToolTip)
    util.on(add, 'mouseout', this._hideToolTip)
    util.on(del, 'click', this._delContainer)
    util.on(del, 'mouseover', this._showToolTip)
    util.on(del, 'mouseout', this._hideToolTip)
  },
  /**
   * 添加分割线
   */
  _addSeparate: function() {
  },
  /**
   * 获取有序的tools列表，
   * @param withDescription 是否包含描述
   */
  _getToolsByOrder: function(withDescription = false) {
    let orderToolsContainers = util.$G('J_dragCon').children
    let tmpArr = []
    for (let i = 0; i < orderToolsContainers.length; i++) {
      const ci = orderToolsContainers[i]
      let tmpToolbars = []
      let tools = ci.children
      for (let j = 0; j < tools.length; j++) {
        const cj = tools[j]
        let id = cj.getAttribute('id').replace('drag_', '')
        let name = cj.getAttribute('name');
        (id.indexOf('separate') !== -1) ? tmpToolbars.push('|' + (withDescription ? '-分隔线' : '')) : tmpToolbars.push(id + (withDescription ? '-' + name : ''))
      }
      tmpArr.push(tmpToolbars)
    }
    return tmpArr
  },
  _getConfig: function() {
    let list = util.getElementsByClassName('U_config'); let obj = {}
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].checked) {
        obj[list[i].getAttribute('_key')] = list[i].checked
      }
    }
    return obj
  },
  _getLangs: function() {
    let list = util.$G('J_uLang').children; let arr = []
    for (let i = 0, len = list.length; i < len; i++) {
      arr.push(list[i].value)
    }
    return arr
  },
  _getServer: function() {
    let list = util.$G('J_server').children
    let node
    for (let i = 0, len = list.length; i < len; i++) {
      node = list[i].children[0]
      if (node.checked) {
        return node.value
      }
    }
    return ''
  },
  _getCmds: function(obj) {
    let arr = []
    for (let i = 0, len = obj.length; i < len; i++) {
      arr = arr.concat(obj[i])
    }
    return arr.join(',')
  }
}
/**
   * 更新container的高度
   * @param onlyThisCon
   */
function updateContainerHeight(onlyThisCon) {
  let length = 0
  if (!onlyThisCon) {
    for (let i = 0; i < dragCon.length; i++) {
      const container = dragCon[i]
      length = 0
      for (let j = 0; j < container.children.length; j++) {
        const tool = container.children[j]
        if (tool.style.display !== 'none') {
          length++
        }
      }
      setHeight(container, length)
    }
  } else {
    let childs = onlyThisCon.children
    for (let i = 0; i < childs.length; i++) {
      const ci = childs[i]
      if (ci.style.display !== 'none') {
        length++
      }
    }
    setHeight(onlyThisCon, length)
  }
}
function setHeight(con, heightLine) {
  let multiple = (heightLine === 0) ? 1 : Math.floor((heightLine - 1) / 22) + 1
  con.style.height = multiple * 31 + 'px'
}
/**
     * 序列化
     */
// function serialize() {
//   var option = {}
//   option.toolbars = UBuilder.main._getToolsByOrder(false)
//   option.cmds = UBuilder.main._getCmds(option.toolbars)
//   option.configs = UBuilder.main._getConfig()
//   option.langs = UBuilder.main._getLangs()
//   option.server = UBuilder.main._getServer()
//   return option
// }
/**
     * 鼠标移动事件
     * @param e
     */
function mouseMove(e) {
  e = e || window.event
  e.preventDefault ? e.preventDefault() : e.returnValue = false
  try {
    document.body.style.webkitUserSelect = 'none'
  } catch (e) {
    console.error(e)
  }
  let target = e.target || e.srcElement
  let mousePos = core.mouseCoords(e)
  let dragable = target.getAttribute('dragable')
  // var dragContainer = util.$G('dragContainer')
  // 符合拖动条件时保存现场并为拖动做准备
  if (dragable) {
    // 仅当刚刚开始拖动，即鼠标当前按下，但是在前一瞬间处于弹起状态时，放置重复初始化
    if (mouseJustDown && !mouseHasDown) {
      core.clearSelection()
      curTarget = target
      // 记录当前鼠标位置和拖动目标的偏移
      mouseOffset = core.getMouseOffset(curTarget, e)
      // 记录当前拖动对象的兄弟节点,用于拖动取消时的回插
      curSibling = curTarget.nextSibling
      curParent = curTarget.parentNode
      // 清空原有的dragHelper节点,并拷贝一个当前拖动节点放置其中，并移动到鼠标当前位置
      dragHelper.innerHTML = ''
      dragHelper.appendChild(curTarget.cloneNode(true))
      dragHelper.style.display = 'block'
      // 记录当前被移动节点的起始坐标，并将其隐藏起来，方便后面还原时的取用
      curTarget.setAttribute('startWidth', parseInt(curTarget.offsetWidth))
      curTarget.setAttribute('startHeight', parseInt(curTarget.offsetHeight))
      curTarget.style.display = 'none'
      // 更新当前container的高度
      updateContainerHeight(curParent)
      for (let i = 0; i < dragCon.length; i++) {
        const ci = dragCon[i]
        // 保存所有container的大小和起始坐标
        let pos = core.getPosition(ci)
        ci.setAttribute('startLeft', pos.x)
        ci.setAttribute('startTop', pos.y)
        ci.setAttribute('startWidth', parseInt(ci.offsetWidth))
        ci.setAttribute('startHeight', parseInt(ci.offsetHeight))
        // 标记所有可拖动元素的大小和起始坐标
        for (let j = 0; j < ci.children.length; j++) {
          const cj = ci.children[j]
          // 忽略当前拖动节点
          if (cj === curTarget) {continue}
          let position = core.getPosition(cj)
          // 保存初始状态时各个元素的大小和起始坐标
          cj.setAttribute('startWidth', parseInt(cj.offsetWidth))
          cj.setAttribute('startHeight', parseInt(cj.offsetHeight))
          cj.setAttribute('startLeft', position.x)
          cj.setAttribute('startTop', position.y)
        }
      }
    }
  }
  // 处理拖动逻辑
  if (curTarget) {
    dragHelper.style.top = mousePos.y - mouseOffset.y + 'px'
    dragHelper.style.left = mousePos.x - mouseOffset.x + 'px'
    // 检测当前鼠标处于哪个container内部，即寻找激活container
    let xPos = mousePos.x - mouseOffset.x + (parseInt(curTarget.getAttribute('startWidth')) / 2)
    let yPos = mousePos.y - mouseOffset.y + (parseInt(curTarget.getAttribute('startHeight')) / 2)
    for (let i = 0; i < dragCon.length; i++) {
      const ci = dragCon[i]
      if ((parseInt(ci.getAttribute('startLeft')) < xPos) &&
                    (parseInt(ci.getAttribute('startTop')) < yPos) &&
                    ((parseInt(ci.getAttribute('startLeft')) + parseInt(ci.getAttribute('startWidth'))) > xPos) &&
                    ((parseInt(ci.getAttribute('startTop')) + parseInt(ci.getAttribute('startHeight'))) > yPos)) {
        activeContainer = ci
        break
      }
    }
    if (!activeContainer) {
      // 当前拖动元素位于container外部，隐藏对应的元素
      if (curTarget.style.display !== 'none') {
        curTarget.style.display = 'none'
        updateContainerHeight(curParent)
      }
    } else {
      let flagNode = null
      let childs = activeContainer.children
      // 寻找插入位置
      for (let i = childs.length - 1; i >= 0; i--) {
        let child = childs[i]
        if (curTarget !== child &&
                        (parseInt(activeContainer.getAttribute('startLeft')) < xPos) &&
                        (parseInt(activeContainer.getAttribute('startTop')) < yPos) &&
                        ((parseInt(child.getAttribute('startLeft')) + parseInt(child.getAttribute('startWidth'))) > xPos) &&
                        ((parseInt(child.getAttribute('startTop')) + parseInt(child.getAttribute('startHeight'))) > yPos)) {
          flagNode = child
        }
      }
      // 如果寻到标记元素，则在之前插入当前被移动的元素，并占位，否则在container的末尾插入当前元素
      if (flagNode) {
        if (flagNode !== curTarget.nextSibling) {
          activeContainer.insertBefore(curTarget, flagNode)
        }
      } else {
        if ((curTarget.nextSibling) || (curTarget.parentNode !== activeContainer)) {
          activeContainer.appendChild(curTarget)
        }
      }
      // 更新当前container的坐标位置
      setTimeout(function() {
        updateContainerHeight()
        let contPos = core.getPosition(activeContainer)
        activeContainer.setAttribute('startWidth', parseInt(activeContainer.offsetWidth))
        activeContainer.setAttribute('startHeight', parseInt(activeContainer.offsetHeight))
        activeContainer.setAttribute('startLeft', contPos.x)
        activeContainer.setAttribute('startTop', contPos.y)
      }, 0)
      // 显示当前拖动元素
      if (curTarget.style.display !== '') {
        curTarget.style.display = ''
        // 让新移动的元素显示，但是被visibility属性hidden，占位用。
        curTarget.style.visibility = 'hidden'
      }
    }
  }
  mouseHasDown = mouseJustDown
}
/**
   * 鼠标弹起事件
   */
function mouseUp() {
  if (curTarget) {
    // 隐藏拖动辅助元素
    dragHelper.style.display = 'none'
    // 插入当前移动元素
    if (curTarget.style.display === 'none') {
      if (curSibling) { // 在某个container内部
        curParent.insertBefore(curTarget, curSibling)
      } else { // 移出了所有可能的container
        curParent.appendChild(curTarget)
      }
    }
    curTarget.style.display = ''
    curTarget.style.visibility = 'visible'
  }
  curTarget = null
  mouseJustDown = false
}
export default UBuilder
