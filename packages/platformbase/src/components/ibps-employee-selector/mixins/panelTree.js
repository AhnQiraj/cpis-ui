import TreeUtils from '@platform/utils/tree'
export default {
  props: {
    // 额外配置
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    checkTreeId(treeData) {
      const arr = []
      const filter = function (datas) {
        datas.find(item => {
          if (item.children && item.children !== []) {
            item.children.forEach(i => {
              arr.push(i.id)
            })
            filter(item.children)
          }
        })
        return arr
      }
      filter(treeData)
      this.treeIds = arr
      this.loadListData()
    },
    loadTreeData(init = false, resetParams = false) {
      if (!this.showTree) {
        return
      }
      this.hiddenTree = false
      this.loadingTree = true
      this.partyId = ''
      this.treeData = []
      // if (this.$utils.isNotEmpty(this.extraOptions.initLoad) && !this.extraOptions.initLoad) {
      //   this.extraOptions.initLoad = true
      // }
      if (this.partyType === 'org') {
        this.lazyTree = true
        this.defaultExpandedKeys = ['0']
        this.defaultExpandAll = false
        this.loadOrgTreeData(init, resetParams)
      } else if (this.partyType === 'position') {
        this.lazyTree = true
        this.defaultExpandedKeys = ['0']
        this.defaultExpandAll = false
        this.loadPositionTreeData(init, resetParams)
      } else {
        this.lazyTree = false
        this.defaultExpandedKeys = null
        this.defaultExpandAll = true
        if (this.partyType === 'role') {
          this.loadRoleTreeData()
        } else if (this.partyType === 'group') {
          this.loadGroupTreeData()
        }
      }
      this.loadListData()
    },
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      })
    },
    // 根据渲染的数据范围类型，筛选目标节点
    filterPositionTreeChildren(treeData, treeScope, nodeId) {
      const data = []
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
      return data
    },
    setTree(lazy, data) {
      const ref = this.$refs.elTree
      ref.store.lazy = lazy
      ref.store.defaultExpandAll = !lazy
      ref.store.defaultExpandedKeys = lazy ? ['0'] : null
      ref.store.setData(data)
      if (lazy && !this.isUseScope && (this.partyType !== 'org' || (this.partyType === 'org' && this.partyTypeId !== '3'))) {
        // 普通模式懒加载函数调用
        ref.store.load = this.loadOrgTreeNode
      } else if (lazy && this.isUseScope) {
        if (this.partyType === 'org') {
          ref.store.load = this.partyTypeId === '3' ? this.loadOrgTreeNode3 : this.loadOrgTreeNode
        } else if (this.partyType === 'position') {
          ref.store.load = this.partyTypeId === '3' ? this.loadPosTreeNode3 : this.loadPosTreeNode
        }
      }
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar' && command.key === 'refresh') {
        this.loadTreeData()
      }
      if (command.key === 'expand') {
        this.expandCompressTree(true)
      } else if (command.key === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 点击节点
    handleNodeClick(data) {
      const ids = []
      this.getChildrenIds(data, ids)
      if (data.id === '0') {
        return
      }
      this.partyId = data.id
      this.loadListData()
    },
    // 加载机构树
    loadOrgTreeData(init, resetParams = false) {
      const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
      this.loadingTree = true
      this.hiddenTree = true
      if (type === 'script') {
        this.getScriptData(this.scriptValue)
        this.loadingTree = false
        return
      }
      const params = {}
      params.type = type
      if (resetParams && this.isUseScope) {
        params.partyId = this.currentOrgIdValue
        params.includeSub = false
      }
      window.apiList['org/org']
        .findTreeData(params)
        .then(response => {
          this.loadingTree = false
          this.hiddenTree = false
          // 普通模式
          if (!this.isUseScope) {
            if (!init) {
              const data = response.data
              this.treeData = TreeUtils.transformToTreeFormat(data)
              this.setTree(true, this.treeData)
            }
            this.treeDatas = response.data
          } else {
            // 选择器范围模式
            if (resetParams) {
              const data = response.data
              this.treeData = TreeUtils.transformToTreeFormat(data)
              this.setTree(true, this.treeData)
            } else {
              if (!init) {
                const data = response.data
                this.treeData = TreeUtils.transformToTreeFormat(data)
                this.setTree(true, this.treeData)
              }
              this.treeDatas = response.data
            }
          }
        })
        .catch(() => {
          this.loadingTree = false
        })
    },
    // 机构数节点函数【懒加载】
    loadOrgTreeNode(node, resolve) {
      this.loadingTree = true
      const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
      const check = this.$utils.isNotEmpty(this.currentOrgIdValue) && node.data.id === '0' && JSON.parse(window.sessionStorage.getItem('INFO')).user.id !== this.externalUseId && JSON.parse(window.sessionStorage.getItem('isSuper'))
      const params = {}
      params.type = type
      if (type === 'script') {
        if (this.$utils.isEmpty(node.data) || node.data.id === '0') {
          this.getScriptData(this.scriptValue, true)
          this.loadingTree = false
          return
        } else {
          params.type = '2'
        }
      }
      // if (this.$utils.isNotEmpty(this.extraOptions) && this.extraOptions.initLoad) {
      //   // 上下级专用
      //   params.currentUserId = this.extraOptions.userid
      // } else { || (this.$utils.isNotEmpty(this.extraOptions) && !this.extraOptions.initLoad && node.data.id === '0')
      params.orgId = node.level === 0 ? null : check ? this.currentOrgIdValue : this.$utils.isNotEmpty(this.extraOptions) && this.extraOptions.userid !== '1' && this.currentOrgIdValue === '' ? '5' : node.data.id
      // }
      if (type === '5') {
        params.includeSub = true
      }
      window.apiList['org/org']
        .findTreeData(params)
        .then(res => {
          this.loadingTree = false
          const arr = JSON.parse(JSON.stringify(res.data))
          let treeData
          if (this.$utils.isNotEmpty(this.isSuperInitTree)) {
            if (!this.isSuperInitTree.initNode && node.level !== 0) {
              const nodeData = this.filterTreeChildren(this.toTree(arr), 'node', node.data.id)
              resolve(this.toTree(nodeData))
            } else {
              // if (this.$utils.isNotEmpty(this.extraOptions) && this.extraOptions.initLoad) {
              //   if (node.level !== 0) {
              //     const nodeData = this.filterTreeChildren(this.toTree(arr), 'node', node.data.id)
              //     resolve(this.toTree(nodeData))
              //     this.extraOptions.initLoad = false
              //   } else {
              //     resolve(this.toTree(this.toTree(arr)))
              //   }
              // } else {
              resolve(this.toTree(arr))
              // }
            }
          } else if (this.isUseScope && (this.$utils.isEmpty(node.data) || node.data.id === '0')) {
            // 初始化和查询全部时得数据加载
            if (this.$utils.isEmpty(node.data) || type === '1') {
              treeData = arr
              resolve(this.toTree(treeData))
            } else {
              // 类型2，3得初始化数据节点筛选
              treeData = this.filterTreeChildren(arr, 'root')
              resolve(this.toTree(treeData))
            }
          } else if (this.isUseScope && this.$utils.isArray(node.data) && node.data[0].id === '0') {
            // 节点数据为数组时得初始化处理
            treeData = arr
            resolve(this.toTree(treeData))
          } else if (this.isUseScope && type === '1' && node.data.id !== '0') {
            resolve(this.toTree(arr))
          }
          if (!this.isUseScope && this.$utils.isEmpty(this.isSuperInitTree)) {
            resolve(this.toTree(arr))
          }
        })
        .catch(res => {
          this.loadingTree = false
          resolve([])
        })
    },
    // 加载岗位树
    loadPositionTreeData(init, resetParams = false) {
      const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
      this.loadingTree = true
      this.hiddenTree = true
      if (type === 'script') {
        this.getScriptData(this.scriptValue)
        this.loadingTree = false
        return
      }
      const params = {}
      params.type = type
      if (resetParams && this.isUseScope) {
        params.partyId = this.currentOrgIdValue
        params.includeSub = false
      }
      window.apiList['org/position']
        .findTreeData(params)
        .then(response => {
          this.loadingTree = false
          this.hiddenTree = false
          // 普通模式
          if (!this.isUseScope) {
            if (!init) {
              const data = response.data
              this.treeData = TreeUtils.transformToTreeFormat(data)
              this.setTree(true, this.treeData)
            }
            this.treeDatas = response.data
          } else {
            // 选择器范围模式
            if (resetParams) {
              const data = response.data
              this.treeData = TreeUtils.transformToTreeFormat(data)
              this.setTree(true, this.treeData)
            } else {
              if (!init) {
                const data = response.data
                this.treeData = TreeUtils.transformToTreeFormat(data)
                this.setTree(true, this.treeData)
              }
              this.treeDatas = response.data
            }
          }
        })
        .catch(() => {
          this.loadingTree = false
        })
    },
    // 岗位树节点函数
    loadPosTreeNode(node, resolve) {
      let params = {}
      const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
      if (this.isUseScope) {
        // 选择器范围模式参数
        params.type = type
        params.includeSub = type === '1'
        if (type === '2') {
          params.partyId = node.level === 0 ? null : node.data.id
        }
        if (type === '3') {
          params.partyId = this.currentOrgIdValue
        }
        if (type === '1') {
          params.posId = node.level === 0 ? null : node.data.id
        }
        if (type === 'script') {
          this.getScriptData(this.scriptValue)
          this.loadingTree = false
          return
        }
      } else {
        params.type = '1'
        params.posId = node.level === 0 ? null : node.data.id
      }
      if (this.moreSearchParams) {
        Object.assign(params, this.moreSearchParams)
      }
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
              treeData = type !== '2' ? arr : this.filterPositionTreeChildren(arr, 'root')
              resolve(this.toTree(treeData))
            }
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      } else if (node.data.id !== '0') {
        if (type === '2') {
          params = {}
          params.type = '1'
          params.posId = node.data.id
        }
        window.apiList['org/position']
          .findTreeData(params)
          .then(res => {
            this.loadingTree = false
            const arr = JSON.parse(JSON.stringify(res.data))
            resolve(this.toTree(arr))
          })
          .catch(res => {
            this.loadingTree = false
            resolve([])
          })
      }
    },
    // 加载角色树
    loadRoleTreeData() {
      if (this.isUseScope) {
        // 选择器范围模式参数
        const params = { parameters: [], requestPage: {}, sorts: [] }
        const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
        params.parameters.push({ key: 'type', value: type })
        if (this.isUseScope) {
          params.parameters.push({ key: 'includeSub', value: this.partyTypeIdValue === '1' })
          if (type === '3') {
            params.parameters.push({ key: 'partyId', value: this.currentOrgIdValue })
          }
          if (type === 'script') {
            this.getScriptData(this.scriptValue)
            this.loadingTree = false
            return
          }
        }
        window.apiList['org/role']
          .queryBySubSysIdOrName(params)
          .then(response => {
            this.loadingTree = false
            const data = response.data
            this.treeData = TreeUtils.transformToTreeFormat(data)
            this.setTree(false, this.treeData)
            this.checkTreeId(this.treeData)
          })
          .catch(() => {
            this.loadingTree = false
          })
      } else {
        window.apiList['org/role']
          .getTreeData()
          .then(response => {
            const data = response.data
            data.unshift({
              id: 0,
              name: '角色树',
              parentId: null
            })
            window.apiList['auth/subsystem']
              .findAllSubsystem()
              .then(response => {
                this.loadingTree = false
                const subSystemList = response.data
                subSystemList.forEach(subSystem => {
                  data.push({
                    id: subSystem.id,
                    name: subSystem.name,
                    parentId: 0
                  })
                })
                this.treeData = TreeUtils.transformToTreeFormat(data)
                this.setTree(false, this.treeData)
                this.checkTreeId(this.treeData)
              })
              .catch(() => {
                this.loadingTree = false
              })
          })
          .catch(() => {
            this.loadingTree = false
          })
      }
    },
    // 加载用户组树
    loadGroupTreeData() {
      const params = {}
      const type = this.partyTypeIdValue !== '' ? this.partyTypeIdValue : '1'
      params.type = type
      if (this.isUseScope) {
        // 选择器范围模式参数
        params.includeSub = type === '1'
        if (type === '3') {
          params.partyId = this.currentOrgIdValue
        }
        if (type === 'script') {
          this.getScriptData(this.scriptValue)
          this.loadingTree = false
          return
        }
      }
      window.apiList['org/group']
        .getTreeData(params)
        .then(response => {
          this.loadingTree = false
          const data = response.data
          this.treeData = TreeUtils.transformToTreeFormat(data)
          this.setTree(false, this.treeData)
          this.checkTreeId(this.treeData)
        })
        .catch(() => {
          this.loadingTree = false
        })
    }
  }
}
