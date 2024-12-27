import CpisTree from '../../../packages/cpis-ui/src/packages/tree/index'

export default {
  title: '原子组件/树',
  component: CpisTree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '树形控件，支持选择、展开/收起、过滤等功能'
      }
    }
  }
}

// 基础用法
export const Basic = () => ({
  components: { CpisTree },
  data() {
    return {
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  template: `
    <cpis-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  `,
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
})

// 可选择
export const Checkable = () => ({
  title: '可选择',
  components: { CpisTree },
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  template: `
    <cpis-tree
      :data="data"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      @check-change="handleCheckChange"
    />
  `,
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    }
  }
})

// 右键菜单
export const ContextMenu = () => ({
  title: '右键菜单',
  components: { CpisTree },
  data() {
    return {
      data: [
        {
          label: '一级 1',
          children: [{ label: '二级 1-1' }]
        }
      ],
      contextmenus: [
        { label: '添加', command: 'add' },
        { label: '编辑', command: 'edit' },
        { label: '删除', command: 'delete' }
      ]
    }
  },
  template: `
    <cpis-tree
      :data="data"
      :props="defaultProps"
      :contextmenus="contextmenus"
      @context-menu-click="handleContextMenuClick"
    />
  `,
  methods: {
    handleContextMenuClick(data) {
      console.log(data)
    }
  }
})

// 懒加载
export const LazyLoad = () => ({
  title: '懒加载',
  components: { CpisTree },
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [] // 初始子节点为空
        },
        {
          id: 2,
          label: '一级 2',
          children: [] // 初始子节点为空
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  template: `
    <cpis-tree
      :data="data"
      :props="defaultProps"
      node-key="id"
      lazy
      :load="loadNode"
      @node-click="handleNodeClick"
    />
  `,
  methods: {
    loadNode(node, resolve) {
      // 模拟异步加载数据
      setTimeout(() => {
        if (node.level === 0) {
          return resolve(this.data)
        }
        const data = [
          {
            id: `${node.data.id}-1`,
            label: `${node.data.label}-1`,
            leaf: node.level >= 2 // 第三层及以上节点为叶子节点
          },
          {
            id: `${node.data.id}-2`,
            label: `${node.data.label}-2`,
            leaf: node.level >= 2
          }
        ]
        resolve(data)
      }, 500)
    },
    handleNodeClick(data) {
      console.log(data)
    }
  }
})
