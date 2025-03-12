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
  # CpisDialogTreeTable 和 CpisDialogTable
  这个两个组件是为了满足业务二次封装弹窗提供的基底组件。
  ## CpisDialogTable 单选
  * ![CpisTable](/dialog-tree-table-single.png)
  ## CpisDialogTable 多选
  * ![CpisTable](/dialog-table-multiple.png)
  ## CpisDialogTreeTable 单选
  * ![CpisTable](/dialog-tree-table-single.png)
  ## CpisDialogTreeTable 多选
  * ![CpisTable](/dialog-tree-table-multiple.png)
  
  ## CpisDialogTable 的特点
    1. 组合了 `CpisDialog` 和 `CpisTable` 和 `CpisTreeContainer` 组件。
    2. 默认对于 `CpisDialog` 设置了 `Size` 为 `large`
    3. 新增了 `treeProps` 属性，用于配置树形结构。
    4. 新增了 `treeEvents` 属性，用于配置树形结构的事件。
    5. 新增了 `tableProps` 属性，用于配置表格结构。
    6. 新增了 `tableEvents` 属性，用于配置表格结构的事件。
    7. 新增了 `multiple` 属性，用于配置是否支持多选
    8. 新增 `getTree` 方法，用于获取树形结构Ref
    9. 新增 `selected-data` 属性，用于配置选中的数据
    10. 新增 `selected-data-key` 属性，用于配置选中的数据key
    11. 新增 `selected-data-label` 属性，用于配置选中的数据label
    

  ## CpisDialogTable 和 CpisDialogTreeTable Attributes
  | 参数      | 说明          | 类型      | 可选值    | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | treeProps  | 树形结构配置 | object   | - |  - |
  | tableProps  | 表格结构配置 | object   | - |  - |
  | multiple  | 是否支持多选 | boolean   | - |  false |
  | selected-data  | 选中的数据 | array   | - |  - |
  | selected-data-key  | 选中的数据key | string   | - |  id |
  | selected-data-label  | 选中的数据label | string   | - |  name |

  ## CpisDialogTable 和 CpisDialogTreeTable Method
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |
  | getTree  | 获取树形结构Ref | function   | - |  - |
  | getTable  | 获取表格结构Ref | function   | - |  - |

  ## CpisDialogTable 和 CpisDialogTreeTable Events
  | 事件      | 说明          | 参数      |
  |---------- |---------------- |---------- |
  | ok  | 确定事件 | flag |
  | cancel  | 取消事件 | flag |

  ## 二次封装建议
  无论是人员选择，部门选择，角色选择，等等等等，无非区别就是
  1. 树形结构
  2. 表格列和数据
  3. 是否支持多选

  所以[参数设计](#cpisdialogtable--cpisdialogtreetable-attributes)上，也是围绕这几个去设计
  1. `treeProps` 最终会把参数透传给 `CpisTree` 组件，可以参考element 官网的 [Tree 组件](https://element.eleme.cn/#/zh-CN/component/tree#attributes)
  2. `tableProps` 最终会把参数透传给 `CpisTable` 组件，可以参考element 官网的 [Table 组件](https://element.eleme.cn/#/zh-CN/component/table#table-attributes) 和 CpisTable 的 [Table 组件](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)
  3. `treeEvents` 最终会把事件透传给 `CpisTree` 组件，可以参考element 官网的 [Tree 组件](https://element.eleme.cn/#/zh-CN/component/tree#events)
  4. `tableEvents` 最终会把事件透传给 `CpisTable` 组件， 可以参考element 官网的 [Table 组件](https://element.eleme.cn/#/zh-CN/component/table#table-events)
  5. `multiple` 会决定表格是否有复选框
  6. `selected-data` 会决定选中的数据

  ## 关于 selected-data 的说明
  1. 保证了组件，已选数据 `selected-data` 和 `ok` 后的回调数据结构是一致的。
  2. 为了统一，无论单选，多选， `ok` 后的回调数据都会返回一个数组，数组中是选中的数据。

  具体实现可以参考 [Demo](#demo)







  

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
  // argTypes: {
  //   visible: {
  //     description: '是否显示'
  //   }
  // },
  // args: {
  //   'modal-append-to-body': false, // 为所有故事添加默认参数
  //   visible: false
  // },
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
      data() {
        return {
          formData: {
            username: ''
          },
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          title: '弹出框左树右列单选',
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
                prop: 'username',
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
                  { id: 1, username: '张三', age: 18 },
                  { id: 2, username: '李四', age: 20 },
                  { id: 3, username: '王五', age: 22 },
                  { id: 4, username: '赵六', age: 24 },
                  { id: 5, username: '孙七', age: 26 },
                  { id: 6, username: '周八', age: 28 },
                  { id: 7, username: '吴九', age: 30 },
                  { id: 8, username: '郑十', age: 32 },
                  { id: 9, username: '周十一', age: 34 },
                  { id: 10, username: '赵十二', age: 36 },
                  { id: 11, username: '孙十三', age: 38 },
                  { id: 12, username: '周十四', age: 40 },
                  { id: 13, username: '吴十五', age: 42 },
                  { id: 14, username: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      methods: {
        handleOk(data) {
          this.formData.username = data[0].username
        }
      },
      template: `
        <div>
          <CpisInput 
            style="width: 200px;"
            clickable
            v-model="formData.username"
            type="primary" 
            size="small"
            @focus="visible = true"
            @suffix-click="visible = true"
            placeholder="请点击"
          />
          <CpisDialogTreeTable
            :treeEvents="treeEvents"
            :visible.sync="visible"
            :title="title"
            selected-data-key="id"
            selected-data-label="username"
            @ok="handleOk"
            :table-props="tableProps"
            :tree-props="treeProps"
          />
        </div>
        `
    }
  }
}

export const Dialog_Tree_Table_Multiple = {
  render: (args, { argTypes }) => {
    return {
      data() {
        return {
          formData: {
            username: ''
          },
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          title: '弹出框左树右列多选',

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
      methods: {
        handleOk(data) {
          this.formData.username = data.map(item => item.name).join(',')
        }
      },
      template: `
        <div>
          <CpisInput 
            style="width: 200px;"
            clickable
            v-model="formData.username"
            type="primary"
            size="small"
            @focus="visible = true"
            @suffix-click="visible = true"
            placeholder="请点击"
          />
          <CpisDialogTreeTable
            multiple
            @ok="handleOk"
            :treeEvents="treeEvents"
            :visible.sync="visible"
            :title="title"
            :table-props="tableProps"
            :tree-props="treeProps"
          />
        </div>
      `
    }
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
          formData: {
            username: ''
          },
          title: '弹出框表格单选',
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
          },
          formData: {
            username: ''
          }
        }
      },
      methods: {
        handleOk(data) {
          this.formData.username = data?.[0]?.name
        }
      },
      template: `
        <div>
          <CpisInput
            style="width: 200px;"
            clickable
            v-model="formData.username"
            type="primary"
            size="small"
            @focus="visible = true"
            @suffix-click="visible = true"
            placeholder="请点击"
          />
          <CpisDialogTable
            @ok="handleOk"
            :treeEvents="treeEvents"
            :visible.sync="visible"
            :title="title"
            :table-props="tableProps"
            :tree-props="treeProps"
          />
        </div>
        `
    }
  }
}

export const Dialog_Table_Multiple = {
  render: (args, { argTypes }) => {
    return {
      data() {
        return {
          formData: {
            username: ''
          },
          treeEvents: {
            'node-click': node => {
              console.log(node)
            }
          },
          selectedData: [],
          title: '弹出框表格多选',
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
                  { id: 1, name: '张三', age: 18 },
                  { id: 2, name: '李四', age: 20 },
                  { id: 3, name: '王五', age: 22 },
                  { id: 4, name: '赵六', age: 24 },
                  { id: 5, name: '孙七', age: 26 },
                  { id: 6, name: '周八', age: 28 },
                  { id: 7, name: '吴九', age: 30 },
                  { id: 8, name: '郑十', age: 32 },
                  { id: 9, name: '周十一', age: 34 },
                  { id: 10, name: '赵十二', age: 36 },
                  { id: 11, name: '孙十三', age: 38 },
                  { id: 12, name: '周十四', age: 40 },
                  { id: 13, name: '吴十五', age: 42 },
                  { id: 14, name: '郑十六', age: 44 }
                ],
                total: 16
              }
            }
          }
        }
      },
      methods: {
        handleOk(data) {
          this.formData.username = data.map(item => item.name).join(',')
        }
      },
      template: `
        <div>
          <CpisInput 
            style="width: 200px;"
            clickable
            v-model="formData.username"
            type="primary"
            size="small"
            @focus="visible = true"
            @suffix-click="visible = true"
            placeholder="请点击"
          />
          <CpisDialogTable
            multiple
            :selectedData="selectedData"
            @ok="handleOk"
            :treeEvents="treeEvents"
            :visible.sync="visible"
            :title="title"
            :table-props="tableProps" :tree-props="treeProps" />
        </div>
        `
    }
  }
}

export const Demo = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisDialogTreeTable
    ref="dialog"
    :multiple="multiple"
    :title="title"
    append-to-body
    :selected-data="selectedData"
    :modal="false"
    :tree-props="treeProps"
    :table-props="tableProps"
    :tree-events="treeEvents"
    :visible="localVisible"
    v-on="$listeners"
    @update:visible="$emit('update:visible', $event)"
  />
</template>

<script>
export default {
  name: 'CpisUserSelectDialog',
  props: {
    selectedData: {
      type: Array,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '用户选择'
    }
  },
  data() {
    return {
      otherParams: null,
      treeProps: {
        props: {
          label: 'name',
          value: 'id'
        },
        lazy: true,
        load: (node, resolve) => {
          const { level, data } = node
          const userInfo = JSON.parse(sessionStorage.getItem('INFO'))
          if (level === 0) {
            return resolve([
              {
                id: userInfo.company.companyId,
                name: userInfo.company.companyName
              }
            ])
          }
          const _param = {
            parameters: [
              {
                key: 'orgId',
                value: data.id
              },
              {
                key: 'depth',
                value: level + 1
              }
            ]
          }
          window.apiList['common/index'].findEntityAllByCond(_param).then(res => {
            return resolve(res?.data?.dataResult ?? [])
          })
        }
      },
      treeEvents: {
        'node-click': node => {
          this.otherParams = {
            key: 'Q^GROUP_ID_^S',
            value: node.id
          }
          this.$refs.dialog.getTable().reset()
        }
      },
      tableProps: {
        paramaterMode: 'structured',
        request: ({ parameters = [], requestPage }) => {
          const _parameters = Array.isArray(parameters) ? [...parameters] : [parameters]
          if (this.otherParams) {
            _parameters.push(this.otherParams)
          }
          return window.apiList['org/employee']
            .queryUserList({ requestPage, ...(_parameters.length > 0 ? { parameters: _parameters } : {}) })
            .then(res => {
              return {
                data: res?.data?.dataResult ?? [],
                total: res?.data?.pageResult?.totalCount ?? 0
              }
            })
        },
        search: [
          {
            label: '姓名',
            prop: 'Q^NAME_^SL'
          },
          {
            label: '部门',
            prop: 'Q^ORG_NAME_^SL'
          },
          {
            label: '工号',
            prop: 'Q^ACCOUNT_^SL'
          }
        ],
        columns: [
          {
            label: '序号',
            prop: 'index',
            valueType: 'index'
          },
          {
            label: '用户账户',
            prop: 'account'
          },
          {
            label: '姓名',
            prop: 'name'
          },
          {
            label: '部门',
            prop: 'orgName'
          }
        ]
      }
    }
  },
  computed: {
    localVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  }
}
</script>

      `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      template: `
        <div></div>
        `
    }
  }
}
