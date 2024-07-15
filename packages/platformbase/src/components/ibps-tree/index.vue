<template>
  <div ref="ibpsTree" :style="{ width: width + 'px' }" class="ibps-tree">
    <div v-if="title" ref="header" :class="['layout-header--' + $ELEMENT.size]" class="layout-header">
      <div v-show="isExpand" :style="{ width: width - 55 + 'px' }" class="layout-header-title ibps-ellipsis">{{ title }}</div>
      <div v-if="angleDouble" class="layout-header-tools">
        <el-tooltip :content="isExpand ? '收缩' : '展开'" placement="bottom-start">
          <a herf="javascript:void(0);" class="pinBtn" @click="handleExpandCollapse">
            <ibps-icon :name="expandCollapseIcon" />
          </a>
        </el-tooltip>
      </div>
    </div>
    <div v-if="toolbars" :class="isExpand ? 'ibps-show-expand' : 'ibps-show-collapse'">
      <div v-if="toolbars" v-show="isExpand" ref="toolbar" class="ibps-tree-toolbar">
        <ibps-toolbar :actions="toolbars" type="icon" @action-event="handleActionEvent" />
      </div>
    </div>
    <div v-show="!isExpand" class="ibps-show" :style="{ height: (isExpand ? treeHeight : height) + 'px' }">&nbsp;</div>
    <div v-if="$slots.searchForm" v-show="isExpand" ref="searchForm" class="ibps-tree-search-form">
      <slot name="searchForm" />
    </div>
    <div v-show="isExpand" :style="cpisTreeType == 'dir' ? 'height: calc(100% - 107px)' : { height: (isExpand ? treeHeight : height) + 'px' }" class="ibps-tree-main">
      <el-scrollbar style="height: 100%; width: 100%" wrap-class="ibps-tree-wrapper">
        <el-tree ref="elTree" v-loading="loading" :data="!lazy ? treeData : null" :lazy="lazy" :load="load" v-bind="treeOptions" @node-click="handleNodeClick" @node-contextmenu="handleNodeContextmenu">
          <span slot-scope="scope" class="ibps-custom-tree-node">
            <ibps-icon v-if="showIcon" :name="getIcon(scope.data)" />
            <span>{{ scope.node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <!--右键菜单-->
    <ibps-contextmenu v-if="contextmenus" ref="contextmenu" :data="contextmenuList" :z-index="zIndex" @click="handleContextmenuClick" />
  </div>
</template>
<script>
import TreeUtils from '@platform/utils/tree'
import PopupManager from '@platform/utils/popup'
import IbpsContextmenu from '@platform/components/ibps-contextmenu'
import { checkContextmenuPermission } from '@platform/mixins/permission'
export default {
  name: 'IbpsTree',
  components: {
    IbpsContextmenu
  },
  props: {
    title: String,
    angleDouble: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 400
    },
    position: {
      type: String,
      default: 'west'
    },
    cpisTreeType: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    },
    dataType: {
      // 数据类型，tree：树形，list:列表
      type: String,
      default: 'list'
    },
    customZindex: {
      type: Number,
      default: 2003
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    toolbars: {
      type: [Array, Boolean],
      default: () => {
        return [
          {
            key: 'refresh'
          },
          {
            key: 'expand'
          },
          {
            key: 'compress'
          }
        ]
      }
    },
    contextmenus: {
      type: Array,
      default: () => {
        return []
      }
    },
    load: Function,
    lazy: {
      type: Boolean,
      default: false
    },
    identity: {
      type: String
    }
  },
  data() {
    return {
      treeHeight: this.height,
      isExpand: true,
      autoPlacement: true,
      contextmenuData: {},
      contextmenuList: [],
      zIndex: 2003
    }
  },
  computed: {
    treeData() {
      if (!this.data || this.data.length === 0) {
        return []
      }
      if (this.dataType === 'list') {
        return TreeUtils.transformToTreeFormat(JSON.parse(JSON.stringify(this.data)), {
          idKey: this.treeOptions['node-key'],
          pIdKey: this.pidKey,
          childrenKey: this.treeOptions['props']['children']
        })
      } else {
        return JSON.parse(JSON.stringify(this.data))
      }
    },
    treeOptions() {
      const defaultOptions = {
        rootPId: null,
        'node-key': 'id',
        'pid-key': 'parentId',
        'default-expand-all': true,
        'expand-on-click-node': false,
        'highlight-current': true,
        props: {
          children: 'children',
          label: 'name'
        }
      }
      return Object.assign(defaultOptions, this.options)
    },
    pidKey() {
      return this.treeOptions['pid-key']
    },
    rootPId() {
      return this.treeOptions['rootPId'] || null
    },
    showIcon() {
      return this.treeOptions['showIcon'] || false
    },
    expandCollapseIcon() {
      if (this.position === 'west') {
        return this.isExpand ? 'angle-double-left' : 'angle-double-right'
      } else {
        return this.isExpand ? 'angle-double-right' : 'angle-double-left'
      }
    }
  },
  watch: {
    height() {
      this.handleTreeHeight()
    },
    customZindex(val) {
      this.zIndex = val
    }
  },
  mounted() {
    this.handleTreeHeight()
    if (this.contextmenus && this.contextmenus.length > 0) {
      this.fixZIndex()
    }
  },
  beforeDestroy() {
    this.contextmenuData = null
    this.contextmenuList = null
  },
  methods: {
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      this.zIndex = PopupManager.getZIndex()
    },
    getIcon(data) {
      let icon = data ? data[this.treeOptions['iconKey'] || 'icon'] : 'list-alt'
      if (icon) {
        return icon
      }
      if (data[this.pidKey] === this.rootPId) {
        icon = this.treeOptions['rootIcon'] || 'home'
      } else {
        icon = this.treeOptions['nodeIcon'] || 'list-alt'
      }
      return icon
    },
    handleTreeHeight() {
      this.treeHeight = this.height
      if (this.$refs.header) {
        this.treeHeight -= this.$refs.header.clientHeight
      }
      if (this.$refs.toolbar) {
        this.treeHeight -= this.$refs.toolbar.clientHeight
      }
      if (this.$refs.searchForm) {
        this.treeHeight -= this.$refs.searchForm.clientHeight
      }
    },
    handleActionEvent(action, position, data) {
      const command = action.key
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
      this.$emit('action-event', command, position, data)
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleNodeClick(data) {
      this.$refs.contextmenu && this.$refs.contextmenu.hide()
      this.$emit('node-click', data)
    },
    refreshNode(id) {
      const node = this.$refs.elTree.getNode(id) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    /**
     * 处理节点右键菜单
     */
    handleNodeContextmenu(event, data) {
      if (!this.contextmenus || this.contextmenus.length === 0) {
        return
      }
      let target = event.target
      let flag = false
      if ((target && target.className.indexOf('el-tree-node__content') > -1) || (target && target.className.indexOf('ibps-custom-tree-node') > -1)) {
        flag = true
      } else if ((target && target.parentNode.className.indexOf('el-tree-node__content') > -1) || (target && target.parentNode.className.indexOf('ibps-custom-tree-node') > -1)) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.handleContextmenuList(data)
        this.contextmenuData = data
        this.$refs.contextmenu.handleContextMenu(event)
      }
    },
    handleContextmenuList(data) {
      const isRoot = data[this.pidKey] === this.rootPId
      const contextmenuList = []
      for (let i = 0; i < this.contextmenus.length; i++) {
        const menu = this.contextmenus[i]
        if (!menu.rights) {
          contextmenuList.push(menu)
        } else {
          if (Array.isArray(menu.rights)) {
            if (menu.rights.indexOf('node') > -1 && !isRoot) {
              contextmenuList.push(menu)
            }
          } else if (typeof menu.rights === 'function') {
            if (menu.rights.call(this, menu, data, isRoot)) {
              contextmenuList.push(menu)
            }
          }
        }
      }
      this.contextmenuList = checkContextmenuPermission(contextmenuList, this.identity)
    },
    handleContextmenuClick(item) {
      this.$emit('action-event', item.key, 'contextmenu', this.contextmenuData[this.pkKey], this.contextmenuData)
    },
    handleExpandCollapse() {
      this.isExpand = !this.isExpand
      this.$emit('expand-collapse', this.isExpand)
    },
    remove(data) {
      this.$refs.elTree.remove(data)
    },
    getCurrentKey() {
      return this.$refs.elTree.getCurrentKey()
    }
  }
}
</script>
<style lang="scss">
$border-color: #e5e6e7;
.ibps-tree {
  .layout-header {
    background: #e7eaec;
    height: 35px;
    border-left: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    font-weight: bold;
    text-align: center;
    padding: 5px;
    position: relative;
    overflow: hidden;
    &--medium {
      height: 40px;
    }
    &--small {
      height: 35px;
    }
    &--mini {
      height: 30px;
    }
    .layout-header-title {
      float: left;
      text-align: left;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-tools {
      float: right;
      margin-top: 5px;
      position: relative;
      padding: 0;
      .pinBtn {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
  }
  .ibps-show {
    background: #ffffff;
  }
  .ibps-show-expand {
    height: 42px;
    background: #ffffff;
    border-bottom: 1px solid $border-color;
  }
  .ibps-show-collapse {
    background: #ffffff;
  }
  .ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 35px;
    padding: 5px;
  }
  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
  .ibps-custom-tree-node {
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
