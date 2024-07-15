export default {
  props: {
    isUseScope: {
      // 是否启用范围
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 组织类型3的特殊处理
    loadOrgTreeNode3(node, resolve) {
      const params = {}
      this.loadingTree = true
      const type = this.type !== '' ? this.partyTypeIdValue : 1
      params.type = type
      params.partyId = this.currentOrgIdValue
      params.includeSub = false
      if (this.$utils.isEmpty(node.data) || node.data.id === '0') {
        window.apiList['org/org']
          .findTreeData(params)
          .then(res => {
            this.loadingTree = false
            const arr = JSON.parse(JSON.stringify(res.data))
            let treeData
            if (this.$utils.isEmpty(node.data)) {
              treeData = arr
              resolve(this.toTree(treeData))
            } else {
              treeData = this.filterTreeChildren(arr, 'root')
              resolve(this.toTree(treeData))
            }
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      } else if (node.data.id !== '0') {
        window.apiList['org/org']
          .findTreeData({
            type: type,
            orgId: node.data.id
          })
          .then(res => {
            this.loadingTree = false
            const arr = JSON.parse(JSON.stringify(res.data))
            const nodeData = this.filterTreeChildren(this.toTree(arr), 'node', node.data.id)
            resolve(this.toTree(nodeData))
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      }
    },
    // 岗位类型3的特殊处理
    loadPosTreeNode3(node, resolve) {
      const params = {}
      this.loadingTree = true
      const type = this.type !== '' ? this.partyTypeIdValue : 1
      params.type = type
      params.partyId = this.currentOrgIdValue
      params.includeSub = false
      if (this.$utils.isEmpty(node.data) || node.data.id === '0') {
        window.apiList['org/position']
          .findTreeData(params)
          .then(res => {
            this.loadingTree = false
            const arr = JSON.parse(JSON.stringify(res.data))
            let treeData
            if (this.$utils.isEmpty(node.data)) {
              treeData = arr
              resolve(this.toTree(treeData))
            } else {
              treeData = this.filterTreeChildren(arr, 'root')
              resolve(this.toTree(treeData))
            }
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      } else if (node.data.id !== '0') {
        window.apiList['org/position']
          .findTreeData({
            type: type,
            posId: node.data.id
          })
          .then(res => {
            this.loadingTree = false
            const arr = JSON.parse(JSON.stringify(res.data))
            const nodeData = this.filterTreeChildren(this.toTree(arr), 'node', node.data.id)
            resolve(this.toTree(nodeData))
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      }
    },
    // 根据渲染的数据范围类型，筛选目标节点
    filterTreeChildren(treeData, treeScope, nodeId) {
      let data = []
      // 返回设置的范围节点
      if (treeScope === 'root') {
        const currentOrgIds = this.currentOrgIdValue.split(',')
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
    }
  }
}
