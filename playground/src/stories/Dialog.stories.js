/**
  # CpisDialog 的设计
  基于 Element-UI 的 Dialog 组件进行二次封装。解决统一的布局问题，新增了全屏功能, 并且定义了 size 属性，规范了三种尺寸（small 40% / medium 60% / large 80%）, 新增了 keepAspectRatio 属性，用于配置是否保持宽高比16/9。

  同时针对业务组件，封装了2个基底组件：
  1. CpisDialogTable 弹窗框 + 表格的布局
  2. CpisDialogTreeTable 弹出框+左树右表的布局
  
  其他无论是人员选择、部门选择、角色选择、组织选择、字典选择等，都是基于这2个基底组件进行封装。

 
  ## CpisDialog 和 ElDialog 的不同
  - 新增了 showFullscreen 属性，用于配置是否显示全屏按钮。
  - 新增了 size 属性，规范了三种尺寸（small 40% / medium 60% / large 80%）
  - 新增了 keepAspectRatio 属性，用于配置是否保持宽高比16/9。
  
  ## CpisDialog Attributes
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | showFullscreen  | 是否显示全屏按钮 | boolean   | - |  false |
  | size  | 对话框大小 | string   | small 40% / medium 60% / large 80% | medium |
  | keepAspectRatio  | 是否保持宽高比16/9 | boolean   | - |  true |
  # CpisDialogTreeTable
  ## CpisDialogTable 的特点
    1. 组合了 `CpisDialog` 和 `CpisTable` 和 `CpisTreeContainer` 组件。
    2. 默认对于 `CpisDialog` 设置了 `Size` 为 `large`
    1. 新增了 `treeProps` 属性，用于配置树形结构。
    2. 新增了 `treeEvents` 属性，用于配置树形结构的事件。
    3. 新增了 `tableProps` 属性，用于配置表格结构。
    4. 新增了 `tableEvents` 属性，用于配置表格结构的事件。
    5. 新增了 `multiple` 属性，用于配置是否支持多选
    6. 新增 `getTree` 方法，用于获取树形结构Ref
    7. 新增 `select-data` 属性，用于配置选中的数据
    8. 新增 `select-data-key` 属性，用于配置选中的数据key
    9. 新增 `select-data-label` 属性，用于配置选中的数据label
    

  ## CpisDialogTable Attributes
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | treeProps  | 树形结构配置 | object   | - |  - |
  | tableProps  | 表格结构配置 | object   | - |  - |
  | multiple  | 是否支持多选 | boolean   | - |  false |
  | select-data  | 选中的数据 | array   | - |  - |
  | select-data-key  | 选中的数据key | string   | - |  id |
  | select-data-label  | 选中的数据label | string   | - |  name |

  ## CpisDialogTable Method
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | getTree  | 获取树形结构Ref | function   | - |  - |
  | getTable  | 获取表格结构Ref | function   | - |  - |

  ## CpisDialogTable Events
  | 事件      | 说明          | 参数      |
  |---------- |---------------- |---------- |
  | ok  | 确定事件 | flag |
  | cancel  | 取消事件 | flag |

 */

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/Dialog',
  layout: 'fullscreen',
  decorators: [
    () => ({
      template: `
        <div style="height: 400px; position: relative; border: 1px solid #eee;">
          <story />
        </div>
      `
    })
  ],
  argTypes: {
    visible: {
      description: '是否显示'
    }
  },
  args: {
    'modal-append-to-body': false, // 为所有故事添加默认参数
    visible: false
  },
  tags: ['autodocs']
}

export const Default = {
  name: '默认',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      methods: {
        handleClick() {
          this.visible = true
        }
      },
      template: `
        <div><el-button type="primary" size="small" @click="handleClick">点击打开</el-button>
        <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false">
          <div>
            <p>这里是内容</p>
          </div>
          <template #footer>
            <CpisButton @click="visible = false">取消</CpisButton>
            <CpisButton type="primary">确定</CpisButton>
          </template>
        </CpisDialog>
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  },
  name: '设置标题'
}

export const Size = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <div>
    <el-button @click="size = 'large'">large</el-button>
    <el-button @click="size = 'medium'">medium</el-button>
    <el-button @click="size = 'small'">small</el-button>
    <CpisDialog :size="size">
      <div>
        <p>这里是内容</p>
      </div>
      <template #footer>
        <CpisButton @click="visible = false">取消</CpisButton>
        <CpisButton type="primary">确定</CpisButton>
      </template>
    </CpisDialog>
  </div>
</template>
        `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      methods: {
        handleClick(size) {
          this.visible = true
          this.size = size
        }
      },
      data() {
        return {
          size: 'medium'
        }
      },
      template: `
        <div>
        <el-button type="primary" size="small" @click="handleClick('large')">large</el-button>
        <el-button type="primary" size="small" @click="handleClick('medium')">medium</el-button>
        <el-button type="primary" size="small" @click="handleClick('small')">small</el-button>
        <CpisDialog :visible="visible" :size="size" :title="title" :modal-append-to-body="false" @close="visible = false">
          <div>
            <p>这里是内容</p>
          </div>
          <template #footer>
            <CpisButton @click="visible = false">取消</CpisButton>
            <CpisButton type="primary">确定</CpisButton>
          </template>
        </CpisDialog>
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const Footer = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisDialog :visible.sync="visible">
    <div>
      <p>这里是内容</p>
    </div>
    <template #footer>
      <CpisButton @click="visible = false">取消</CpisButton>
      <CpisButton type="primary">确定</CpisButton>
    </template>
  </CpisDialog>
</template>
        `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          visible: false
        }
      },
      template: `
          <div>
          <el-button type="primary" size="small" @click="visible = true">点击打开</el-button>
          <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false">
            <div>
              <p>这里是内容</p>
            </div>
            <template #footer>
              <CpisButton @click="visible = false">取消</CpisButton>
              <CpisButton type="primary">确定</CpisButton>
            </template>
          </CpisDialog>
          </div>
          `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const ShowFullscreen = {
  name: '显示全屏按钮',
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      methods: {
        handleClick() {
          this.visible = true
        }
      },
      template: `
        <div><el-button type="primary" size="small" @click="handleClick">点击打开</el-button>
        <CpisDialog :visible="visible" :title="title" :modal-append-to-body="false" @close="visible = false" :show-fullscreen="true">
          <div>
            <p>这里是内容</p>
          </div>
          <template #footer>
            <CpisButton @click="visible = false">取消</CpisButton>
            <CpisButton type="primary">确定</CpisButton>
          </template>
        </CpisDialog>
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '这里是标题'
  }
}

export const Dialog_Tree_Table_Single = {
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          visible: false,
          treeProps: {
            data: [
              {
                label: '部门A',
                children: [
                  {
                    label: '研发部',
                    children: [{ label: '前端组' }, { label: '后端组' }, { label: '测试组' }]
                  },
                  {
                    label: '产品部',
                    children: [{ label: '设计组' }, { label: '产品组' }]
                  }
                ]
              },
              {
                label: '部门B',
                children: [
                  {
                    label: '销售部',
                    children: [{ label: '国内销售' }, { label: '海外销售' }]
                  },
                  {
                    label: '市场部',
                    children: [{ label: '市场推广' }, { label: '品牌运营' }]
                  }
                ]
              }
            ]
          },
          tableProps: {
            columns: [
              {
                prop: 'name',
                label: '姓名'
              },
              {
                prop: 'age',
                label: '年龄'
              }
            ],
            request: () => {
              return {
                data: [
                  { name: '张三', age: 18 },
                  { name: '李四', age: 20 },
                  { name: '王五', age: 22 },
                  { name: '赵六', age: 24 },
                  { name: '孙七', age: 26 },
                  { name: '周八', age: 28 },
                  { name: '吴九', age: 30 },
                  { name: '郑十', age: 32 },
                  { name: '周十一', age: 34 },
                  { name: '赵十二', age: 36 },
                  { name: '孙十三', age: 38 },
                  { name: '周十四', age: 40 },
                  { name: '吴十五', age: 42 },
                  { name: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      template: `
        <div>
          <CpisButton type="primary" size="small" @click="visible = true">点击打开</CpisButton>
          <CpisDialogTreeTable :treeEvents="treeEvents" :visible.sync="visible" :title="title" :table-props="tableProps" :tree-props="treeProps" />
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '单选左树右表'
  }
}

export const Dialog_Tree_Table_Multiple = {
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          visible: false,
          treeProps: {
            data: [
              {
                label: '部门A',
                children: [
                  {
                    label: '研发部',
                    children: [{ label: '前端组' }, { label: '后端组' }, { label: '测试组' }]
                  },
                  {
                    label: '产品部',
                    children: [{ label: '设计组' }, { label: '产品组' }]
                  }
                ]
              },
              {
                label: '部门B',
                children: [
                  {
                    label: '销售部',
                    children: [{ label: '国内销售' }, { label: '海外销售' }]
                  },
                  {
                    label: '市场部',
                    children: [{ label: '市场推广' }, { label: '品牌运营' }]
                  }
                ]
              }
            ]
          },
          tableProps: {
            columns: [
              {
                prop: 'name',
                label: '姓名'
              },
              {
                prop: 'age',
                label: '年龄'
              }
            ],
            request: () => {
              return {
                data: [
                  { name: '张三', age: 18 },
                  { name: '李四', age: 20 },
                  { name: '王五', age: 22 },
                  { name: '赵六', age: 24 },
                  { name: '孙七', age: 26 },
                  { name: '周八', age: 28 },
                  { name: '吴九', age: 30 },
                  { name: '郑十', age: 32 },
                  { name: '周十一', age: 34 },
                  { name: '赵十二', age: 36 },
                  { name: '孙十三', age: 38 },
                  { name: '周十四', age: 40 },
                  { name: '吴十五', age: 42 },
                  { name: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      template: `
        <div>
          <CpisButton type="primary" size="small" @click="visible = true">点击打开</CpisButton>
          <CpisDialogTreeTable multiple :treeEvents="treeEvents" :visible.sync="visible" :title="title" :table-props="tableProps" :tree-props="treeProps" />
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '多选左树右表'
  }
}

export const Dialog_Table_Single = {
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          visible: false,
          treeProps: {
            data: [
              {
                label: '部门A',
                children: [
                  {
                    label: '研发部',
                    children: [{ label: '前端组' }, { label: '后端组' }, { label: '测试组' }]
                  },
                  {
                    label: '产品部',
                    children: [{ label: '设计组' }, { label: '产品组' }]
                  }
                ]
              },
              {
                label: '部门B',
                children: [
                  {
                    label: '销售部',
                    children: [{ label: '国内销售' }, { label: '海外销售' }]
                  },
                  {
                    label: '市场部',
                    children: [{ label: '市场推广' }, { label: '品牌运营' }]
                  }
                ]
              }
            ]
          },
          tableProps: {
            columns: [
              {
                prop: 'name',
                label: '姓名'
              },
              {
                prop: 'age',
                label: '年龄'
              }
            ],
            request: () => {
              return {
                data: [
                  { name: '张三', age: 18 },
                  { name: '李四', age: 20 },
                  { name: '王五', age: 22 },
                  { name: '赵六', age: 24 },
                  { name: '孙七', age: 26 },
                  { name: '周八', age: 28 },
                  { name: '吴九', age: 30 },
                  { name: '郑十', age: 32 },
                  { name: '周十一', age: 34 },
                  { name: '赵十二', age: 36 },
                  { name: '孙十三', age: 38 },
                  { name: '周十四', age: 40 },
                  { name: '吴十五', age: 42 },
                  { name: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      template: `
        <div>
          <CpisButton type="primary" size="small" @click="visible = true">点击打开</CpisButton>
          <CpisDialogTable :treeEvents="treeEvents" :visible.sync="visible" :title="title" :table-props="tableProps" :tree-props="treeProps">
            <div>
              <p>这里是内容</p>
            </div>
          </CpisDialogTable>
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '单选表格'
  }
}

export const Dialog_Table_Multiple = {
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      data() {
        return {
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          visible: false,
          treeProps: {
            data: [
              {
                label: '部门A',
                children: [
                  {
                    label: '研发部',
                    children: [{ label: '前端组' }, { label: '后端组' }, { label: '测试组' }]
                  },
                  {
                    label: '产品部',
                    children: [{ label: '设计组' }, { label: '产品组' }]
                  }
                ]
              },
              {
                label: '部门B',
                children: [
                  {
                    label: '销售部',
                    children: [{ label: '国内销售' }, { label: '海外销售' }]
                  },
                  {
                    label: '市场部',
                    children: [{ label: '市场推广' }, { label: '品牌运营' }]
                  }
                ]
              }
            ]
          },
          tableProps: {
            columns: [
              {
                prop: 'name',
                label: '姓名'
              },
              {
                prop: 'age',
                label: '年龄'
              }
            ],
            request: () => {
              return {
                data: [
                  { name: '张三', age: 18 },
                  { name: '李四', age: 20 },
                  { name: '王五', age: 22 },
                  { name: '赵六', age: 24 },
                  { name: '孙七', age: 26 },
                  { name: '周八', age: 28 },
                  { name: '吴九', age: 30 },
                  { name: '郑十', age: 32 },
                  { name: '周十一', age: 34 },
                  { name: '赵十二', age: 36 },
                  { name: '孙十三', age: 38 },
                  { name: '周十四', age: 40 },
                  { name: '吴十五', age: 42 },
                  { name: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      template: `
        <div>
          <CpisButton type="primary" size="small" @click="visible = true">点击打开</CpisButton>
          <CpisDialogTable multiple :treeEvents="treeEvents" :visible.sync="visible" :title="title" :table-props="tableProps" :tree-props="treeProps" />
        </div>
        `
    }
  },
  args: {
    visible: false,
    title: '多选表格'
  }
}
