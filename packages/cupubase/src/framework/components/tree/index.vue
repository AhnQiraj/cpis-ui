<template>
  <div class="z-tree">
    <div class="tools">
      <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" />
      <el-button type="primary" icon="fa fa-expand" @click="onToggle(true)" />
      <el-button type="primary" icon="fa fa-compress" @click="onToggle(false)" />
    </div>
    <div class="search">
      <el-input v-model="filterText" :placeholder="$t('common.field.enterKeywords')" />
      <el-button type="primary" icon="el-icon-search" @click="onSearch" />
    </div>
    <div class="tree">
      <!-- 无图标 -->
      <el-tree v-if="renderNodeFlag != '1'" ref="tree" v-loading="loading" v-bind="nativeProp" :data="insideTreeData" :node-key="nodeKey" :show-checkbox="multipleSelect" :props="propMapping" :lazy="lazyLoad" :highlight-current="true" :filter-node-method="filterNode" :load="loadNode" :default-expand-all="defaultAll" @node-click="onNodeClick" @check="onCheck" @node-contextmenu="onRightClick" />
      <!-- 有图标 -->
      <el-tree v-if="renderNodeFlag == '1'" ref="tree" v-loading="loading" v-bind="nativeProp" :data="insideTreeData" :node-key="nodeKey" :show-checkbox="multipleSelect" :props="propMapping" :lazy="lazyLoad" :highlight-current="true" :filter-node-method="filterNode" :load="loadNode" :default-expand-all="defaultAll" @node-click="onNodeClick" @check="onCheck" @node-contextmenu="onRightClick">
        <span slot-scope="{ data, node }" class="custom-tree-node">
          <span :id="node.key" :title="data.title"><i :class="data.data.icon" :title="data.data.isNo == '1' ? on : off" /> {{ data.title }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 树组件数据
    treeData: {
      type: [Function, Array],
      default() {
        return null
      }
    },
    // el-tree 原生属性
    nativeProp: {
      type: Object,
      default() {
        return {}
      }
    },
    // key
    nodeKey: {
      type: String,
      default() {
        return 'id'
      }
    },
    // 是否允许多选
    multipleSelect: {
      type: Boolean,
      default: true
    },
    //是否展开
    defaultAll: {
      type: Boolean,
      default: false
    },
    // 属性映射
    propMapping: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          filters: '' //根据这个字段过滤树节点,没有就使用label
        }
      }
    },
    // 是否懒加载
    lazyLoad: {
      type: Boolean,
      default: false
    },
    // 是否显示自定义图标
    renderNodeFlag: {
      type: String,
      default() {
        return '0'
      }
    }
  },
  data() {
    return {
      filterText: '',
      insideTreeData: [],
      insideloadNode: null,
      loading: false,
      on: '在线', //this.$t('equipment.common.on'),
      off: '离线' //this.$t('equipment.common.off')
    }
  },
  created() {
    const { treeData, lazyLoad } = this
    if (treeData instanceof Array) {
      this.insideTreeData = [...treeData]
    } else {
      this.loading = true
      this.insideloadNode = treeData
      if (!lazyLoad) {
        this.loadNode({ level: 0 }, this.setData)
      }
    }
  },
  methods: {
    /**
     * 加载树节点
     * @author mbb
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        this._node = node
        this._resolve = resolve
      }
      this.insideloadNode && this.insideloadNode(node, resolve, this.loadDone)
    },
    /**
     * 重新加载整棵树
     */
    onReload() {
      this.loadNode({ level: 0 }, this.setData)
    },
    /**
     * 关闭loading加载
     * @author mbb
     */
    loadDone() {
      this.loading = false
    },
    /**
     * 设置数据
     */
    setData(treeData) {
      this.insideTreeData = treeData
    },
    /**
     * 树刷新
     */
    onRefresh() {
      this.filterText = ''
      this.onSearch()
      this.$emit('tree-refresh')
    },
    /**
     * 展开折叠
     */
    onToggle(isExpand) {
      let node = this.$refs.tree.store.currentNode
      //如果当前无节点被选中，默认设置第一个节点
      if (!node) {
        node = this.$refs.tree.store.root
        //如果根节点无数据，设置第一个子节点
        if (!this.$refs.tree.store.root.label) {
          node = this.$refs.tree.store.root.childNodes && this.$refs.tree.store.root.childNodes.length > 0 ? this.$refs.tree.store.root.childNodes[0] : ''
        }
      }
      if (!node) {
        this.$message.warning(this.$t('baseCommon.message.pleaseSelectNode'))
      } else {
        node.expanded = isExpand
      }
      this.$forceUpdate()
    },
    /**
     * 查询节点
     * @author mbb
     */
    onSearch() {
      this.$refs.tree.filter(this.filterText)
    },
    /**
     * 过滤数据
     */
    filterNode(value, data) {
      if (!value) {
        return true
      }
      if (this.propMapping.filters) {
        return data[this.propMapping.filters].indexOf(value) !== -1
      } else {
        return data[this.propMapping.label].indexOf(value) !== -1
      }
    },
    /**
     * 清除当前所选
     * @author mbb
     */
    clearClick() {
      this.$refs.tree.setCurrentKey(null)
    },
    /**
     * 设置指定key节点选中
     * @author mbb
     */
    setNodeCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    },
    /**
     * 点击树节点
     */
    onNodeClick(data) {
      !this.multipleSelect && this.$emit('nodeClick', data)
    },
    /**
     * 右击树节点
     */
    onRightClick(MouseEvent, object, Node, element) {
      this.$emit('rightClick', MouseEvent, object, Node, element)
    },
    /**
     * 树节点多选时
     */
    onCheck(data, nodes) {
      this.multipleSelect && this.$emit('nodeClick', nodes)
    }
  }
}
</script>
<style lang="scss" scoped>
.z-tree {
  background: #fff;
  width: 100%;
  .tools {
    padding: 5px;
    border-top: 2px solid rgb(245, 245, 245);
    border-bottom: 2px solid rgb(245, 245, 245);
  }
  .search {
    padding: 5px;
    display: flex;
    border-bottom: 2px solid rgb(245, 245, 245);
  }
  .tree {
    width: 100%;
  }
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #a9d0f5;
    width: 100%;
  }
}
</style>
