import CpisTreeContainer from '../../../../packages/cpis-ui/src/packages/tree-container/index.js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  components: { CpisTreeContainer },
  title: '容器组件/树容器',
  tags: ['autodocs']
}

// 添加一个新的 story 用于展示点击事件
export const WithRightClickEvent = {
  name: '右点事件',
  parameters: {
    docs: {
      source: {
        code: `
<CpisTreeContainer 
  :treeProps="treeProps" 
  title="带点击事件的树"
  @right-click="handleRightClick"
>
</CpisTreeContainer>
`
      }
    }
  },
  render: args => ({
    components: { CpisTreeContainer },
    data() {
      return {
        selectedNode: null,
        treeProps: {
          data: [
            {
              id: 1,
              label: '平台业务',
              children: [
                { id: 11, label: '业务分类' },
                { id: 12, label: '终端' },
                { id: 13, label: '服务分类' }
              ]
            },
            {
              id: 2,
              label: '平台管理',
              children: [{ id: 21, label: '用户管理' }]
            }
          ]
        }
      }
    },
    methods: {
      handleRightClick(event, object, node, element) {
        alert(`右键点击`)
      },
      handleRefresh() {
        console.log('刷新')
      }
    },
    template: `
      <div style="height: 500px; padding: 16px; background-color: #f5f5f5;">
        <CpisTreeContainer 
          :treeProps="treeProps" 
          title="带点击事件的树"
          @right-click="handleRightClick"
        >
          <div v-if="selectedNode">
            当前选中: {{ selectedNode.label }}
          </div>
          <div v-else>
            请选择一个节点
          </div>
        </CpisTreeContainer>
      </div>
    `
  })
}
// 默认展开所有
export const DefaultExpandAll = {
  name: '默认展开所有',
  parameters: {
    docs: {
      source: {
        code: `
<CpisTreeContainer 
  :treeProps="{defaultExpandAll: true}" 
  title="默认展开所有"
>
</CpisTreeContainer>
`
      }
    }
  },
  render: args => ({
    components: { CpisTreeContainer },
    data() {
      return {
        treeProps: {
          data: [
            {
              id: 1,
              label: '平台业务',
              children: [
                { id: 11, label: '业务分类' },
                { id: 12, label: '终端' },
                { id: 13, label: '服务分类' }
              ]
            },
            {
              id: 2,
              label: '平台管理',
              children: [{ id: 21, label: '用户管理' }]
            }
          ],
          defaultExpandAll: true
        }
      }
    },
    template: `
      <div style="height: 500px; padding: 16px; background-color: #f5f5f5;">
        <CpisTreeContainer 
          :treeProps="treeProps" 
          title=""
        >
        </CpisTreeContainer>
      </div>
    `
  })
}

// 懒加载示例
export const LazyLoading = {
  name: '懒加载',
  parameters: {
    docs: {
      source: {
        code: `
// 数据部分
data() {
  return {
    treeProps: {
      lazy: true,
      load: this.loadNode
    }
  }
},

// 方法部分
methods: {
  loadNode(node, resolve) {
    // 模拟异步加载数据
    setTimeout(() => {
      if (node.level === 0) {
        return resolve([
          {
            id: 1,
            label: '根节点 1'
          },
          {
            id: 2,
            label: '根节点 2'
          }
        ])
      }

      const data = [
        {
          id: \`\${node.data.id}-1\`,
          label: \`\${node.data.label}-1\`,
        },
        {
          id: \`\${node.data.id}-2\`,
          label: \`\${node.data.label}-2\`,
        }
      ]

      resolve(data)
    }, 500)
  },
  handleNodeClick(node) {
    console.log('节点被点击:', node)
  }
},

<CpisTreeContainer 
  :treeProps="treeProps" 
  title="懒加载树"
  @node-click="handleNodeClick"
>
  <template #default>
    <div style="padding: 8px;">
      <p>特点：</p>
      <ul>
        <li>点击展开节点时才加载子节点</li>
        <li>最多支持3层嵌套</li>
        <li>每个节点加载有500ms延迟，模拟网络请求</li>
      </ul>
    </div>
  </template>
</CpisTreeContainer>`
      }
    }
  },
  render: args => ({
    components: { CpisTreeContainer },
    data() {
      return {
        treeProps: {
          lazy: true,
          load: this.loadNode
        }
      }
    },
    methods: {
      loadNode(node, resolve) {
        // 模拟异步加载数据
        setTimeout(() => {
          if (node.level === 0) {
            return resolve([
              {
                id: 1,
                label: '根节点 1',
                hasChildren: true
              },
              {
                id: 2,
                label: '根节点 2',
                hasChildren: true
              }
            ])
          }

          const data = [
            {
              id: `${node.data.id}-1`,
              label: `${node.data.label}-1`
            },
            {
              id: `${node.data.id}-2`,
              label: `${node.data.label}-2`
            }
          ]

          resolve(data)
        }, 500)
      },
      handleNodeClick(node) {
        console.log('节点被点击:', node)
      }
    },
    template: `
      <div style="height: 500px; padding: 16px; background-color: #f5f5f5;">
        <CpisTreeContainer 
          :treeProps="treeProps" 
          title="懒加载树"
          @node-click="handleNodeClick"
        >
          <template #default>
            <div style="padding: 8px;">
              <p>特点：</p>
              <ul>
                <li>点击展开节点时才加载子节点</li>
                <li>最多支持3层嵌套</li>
                <li>每个节点加载有500ms延迟，模拟网络请求</li>
              </ul>
            </div>
          </template>
        </CpisTreeContainer>
      </div>
    `
  })
}
