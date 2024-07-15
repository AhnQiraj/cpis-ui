<template>
  <div>
    <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar :actions="toolbars" type="icon" @action-event="handleTreeAction" />
    </div>
    <div ref="searchForm" class="ibps-tree-search-form">
      <el-input v-model="filterText" placeholder="组织名称【只搜索已加载数据】" clearable />
    </div>
    <div :style="{ height: tableHeight + 'px' }">
      <el-scrollbar style="height: 100%" wrap-class="ibps-tree-wrapper ibps-scrollbar-wrapper">
        <!-- 多选-->
        <el-tree v-if="partyTypeId !== 'script' && multiple" ref="elTree" v-loading="loading" :expand-on-click-node="false" :props="{ children: 'children', label: 'name', isLeaf: 'leaf' }" :show-checkbox="multiple" :check-strictly="true" :filter-node-method="filterNode" :default-expanded-keys="refreshData" :default-expand-all="defaultExpandAll" :load="loadTreeNode" lazy :node-key="nodeKey" pid-key="parentId" highlight-current check-on-click-node @check-change="handleCheckChange" />
        <!-- 单选-->
        <el-tree v-else-if="partyTypeId !== 'script' && !multiple" ref="elTree" v-loading="loading" :data="treeData" :expand-on-click-node="false" :props="{ children: 'children', label: 'name', isLeaf: 'leaf' }" :filter-node-method="filterNode" :default-expanded-keys="refreshData" :default-expand-all="defaultExpandAll" :load="loadTreeNode" lazy :node-key="nodeKey" pid-key="parentId" highlight-current @node-click="onNodeClick">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled ? data.disabled : data.id === '0' ? true : node.data.selectable ? null : true" @change="changeRadio(data)">
              {{ node.label }}
            </el-radio>
          </span>
        </el-tree>
        <!-- 动态脚本-->
        <!-- 多选 -->
        <el-tree v-if="partyTypeId === 'script' && multiple" ref="elTree" v-loading="loading" :data="treeData" :expand-on-click-node="false" :props="{ children: 'children', label: 'name' }" :show-checkbox="multiple" :filter-node-method="filterNode" :default-expanded-keys="refreshData" :default-expand-all="defaultExpandAll" :node-key="nodeKey" pid-key="parentId" highlight-current @check-change="handleCheckChange" />
        <!-- 单选 -->
        <el-tree v-else-if="partyTypeId === 'script' && !multiple" ref="elTree" v-loading="loading" :data="treeData" :expand-on-click-node="false" :props="{ children: 'children', label: 'name' }" :filter-node-method="filterNode" :default-expanded-keys="refreshData" :default-expand-all="defaultExpandAll" :node-key="nodeKey" pid-key="parentId" highlight-current @node-click="onNodeClick">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled ? data.disabled : data.id === '0' ? true : node.data.selectable ? null : true" @change="changeRadio(data)">
              {{ node.label }}
            </el-radio>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import IbpsToolbar from '@platform/components/ibps-toolbar'
import ActionUtils from '@platform/utils/action'
import TreeUtils from '@platform/utils/tree'
import FormUtils from '@platform/utils/formUtil'
export default {
  components: {
    IbpsToolbar
  },
  props: {
    formData: [Object, Array], // 所有字段数据,(包含主主子表)
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    partyTypeId: {
      // 类型节点ID
      type: [String, Number],
      default: ''
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    pkKey: {
      type: String,
      default: 'id'
    },
    refreshData: {
      type: Array,
      default: () => ['0']
    },
    partyType: {
      type: String,
      default: 'org'
    },
    currentOrgId: {
      // 用户组ID
      type: [String, Number],
      default: ''
    },
    script: String,
    isUseScope: {
      // 是否启用范围
      type: Boolean,
      default: false
    },
    levelFilter: {
      type: String,
      default: ''
    },
    hideJgbm: {
      type: String,
      default: ''
    },
    hideOrgId: {
      type: String,
      default: ''
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: '',
      loading: false,
      scriptExecuteTime: false, // 脚本函数是否只执行一次
      filterText: '',
      title: '更多查询',
      dialogFormVisible: false,
      // 树配置
      treeData: [],
      rootTreeNode: [],
      toolbars: [
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
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    filterText(val) {
      this.$refs.elTree.filter(val)
    }
  },
  beforeDestroy() {
    this.treeData = null
    this.rootTreeNode = null
    this.toolbars = null
  },
  mounted() {
    console.log("mounted partyTypeId:", this.partyTypeId);
    if (this.partyTypeId === 'script') {
      this.loadTreeData()
    }
  },
  methods: {
    // 脚本类型初始化
    loadTreeData() {
      if (this.scriptExecuteTime) {
        return
      }
      this.loading = true
      let dynamicValue = FormUtils.getCalDynamicValue(this.script, this.formData)
      dynamicValue.then(response => {
        this.treeData = this.toTree(response.data)
        this.scriptExecuteTime = true
      })
      this.loading = false
    },
    // 懒加载分界线~~~~~~~~~~~~~~~~~~
    setCheckedNodes(data, selected) {
      if (this.multiple) {
        this.$refs['elTree'].setChecked(data, selected)
      } else {
        this.radio = ''
      }
    },
    cleanData(multiple) {
      if (multiple) {
        this.$refs['elTree'].setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    // 加载组织树
    loadTreeNode(node, resolve) {
      console.log("loadTreeNode 方法开始");
      const params = {}
      const type = this.partyTypeId !== '' ? this.partyTypeId : '1'
      const check = this.$utils.isNotEmpty(this.currentOrgId) && node.data && node.data.id === '0' && !this.$store.getters.isSuper
      params.type = type === 'script' ? '2' : type
      if (this.isUseScope) {
        // 范围选择器调用
        if (type === '1') {
          // 全部
          params.orgId = node.level === 0 ? null : node.data.id
        } else {
          params.includeSub = type === '1'
          // 指定范围
          if (type === '3' && (this.$utils.isEmpty(node.data) || node.data.id === '0')) {
            params.partyId = this.currentOrgId
          }
          // 初始化加载
          if (node.data && node.data.id !== '0') {
            params.orgId = node.level === 0 ? null : check ? this.currentOrgId : node.data.id
          }
          if (type === '2' && this.$utils.isNotEmpty(node.data) && node.data.id !== '0') {
            params.type = '1'
          }
        }
      } else {
        // 普通模式
        params.orgId = node.level === 0 ? null : node.data.id
      }
      this.loading = true;
      params.levelFilter = this.levelFilter;
      params.hideJgbm = this.hideJgbm;
      params.hideOrgId = this.hideOrgId;
      console.log("loadTreeNode 参数：", params);
      window.apiList['extend/index'].findOrgTreeData(params)
        .then(res => {
          console.log("loadTreeNode 返回：", res);
          this.loading = false
          const arr = JSON.parse(JSON.stringify(res.data))
          if (this.isUseScope && type !== '1') {
            let treeData
            if (this.$utils.isEmpty(node.data)) {
              treeData = arr
              resolve(this.toTree(treeData))
            } else {
              treeData = node.data.id === '0' ? this.filterTreeChildren(arr, 'root') : type === '3' ? this.filterTreeChildren(this.toTree(arr), 'node', node.data.id) : arr
              resolve(this.toTree(treeData))
            }
          } else {
            resolve(this.toTree(arr))
          }
        })
        .catch(res => {
          this.loading = false
          resolve([])
        })
    },
    // 根据渲染的数据范围类型，筛选目标节点
    filterTreeChildren(treeData, treeScope, nodeId) {
      let data = []
      // 返回设置的范围节点
      if (treeScope === 'root') {
        const currentOrgIds = this.currentOrgId.split(',')
        treeData.forEach(f => {
          if (currentOrgIds.includes(f.id)) {
            f.leaf = true
            data.push(f)
          }
        })
      }
      // 返回点击节点的子节点
      if (treeScope === 'node') {
        const filter = function (datas) {
          datas.find(item => {
            if (item.children && item.children !== []) {
              if (item.id === nodeId) {
                data = item.children
                return
              }
              filter(item.children)
            }
          })
        }
        filter(treeData)
      }
      return data
    },
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      })
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 处理更多查询弹窗
     */
    handleMoreSearch() {
      this.dialogFormVisible = true
    },
    /**
     * 更多查询
     */
    handleMoreSearchAction(data) {
      // const formatParams = ActionUtils.formatParams(data)
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search': // 查询
          this.search()
          break
        default:
          break
      }
    },
    handleTreeAction(action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.expandCompressTree(false)
        // this.refreshData = ['0']
      }
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleCheckChange(data, checked) {
      if (data.id === 0 || data.id === '0') {
        return
      }
      let val = JSON.parse(JSON.stringify(this.value))
      if (checked) {
        const index = val.find(v => {
          return v[this.pkKey] === data[this.pkKey]
        })
        if (!index) {
          val.push(data)
        }
      } else {
        val = val.filter(v => {
          return v[this.pkKey] !== data[this.pkKey]
        })
      }
      this.$emit('selected', val)
    },
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') {
        return
      }
      if (!data.selectable) {
        return
      }
      this.$emit('selected', data)
    },
    onNodeClick(data, node, obj) {
      if (data.id === 0 || data.id === '0') {
        return
      }
      if (!data.selectable) {
        return
      }
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
    }
  }
}
</script>
<style lang="scss" scoped>
$border-color: #e5e6e7;
.ibps-tree-toolbar {
  border: 1px solid $border-color;
  height: 30px;
  padding: 5px;
}
.ibps-tree-search-form {
  padding: 5px;
  border-right: 1px solid $border-color;
  background: #ffffff;
}
.ibps-tree-main {
  border: 1px solid $border-color;
}
.ibps-tree-wrapper {
  background: #ffffff;
  .el-tree > .el-tree-node {
    display: inline-block;
  }
}
</style>
