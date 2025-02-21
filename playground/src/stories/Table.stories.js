import { Switch, Input } from 'element-ui'
import CpisTable from '../../../packages/cpis-ui/src/packages/table/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
/**
 * ## CpisTable 的设计
 * 基于 Element-UI 的 Table 组件进行二次封装。解决重复的工作，例如分页，搜索， 不同数据类型的对齐方式和统一的显示效果。
 * 同时降低表格类组件的维护入口
 * ## CpisTable 的的布局
 * ![CpisTable](/layout.png)
 * 
 * ## 权限 ‼️‼️‼️‼️‼️‼️（这里很重要，这里很重要，这里很重要）
 * 权限主要对 toolbar 区域 ，和列的 actions 区域进行权限控制，你需要的做的是：
 * 1. 给每个表格定义 `identity`， 可以在   `平台` - `业务配置` 下。
 * 2. 给每个按钮定义 `key`， 可以在 `平台` - `菜单管理` 下，[查看示例](#toolbar------)
 * 
 * ## 关于 toolbar 区域的权限，有两个写法二选一
 * 1. 配置化写法（推荐）
 * ```
 *  <CpisTable :identity="ibps_org_employee" :toolbar="[{key: 'add', permission: 'add'}]" />
 * ```
 * 2. 插槽的写法, 需要自己处理权限
 * ```
 * <CpisTable>
 *   <template v-slot:toolbar>
 *     <CpisButton key="add"  />
 *   </template>
 * </CpisTable>
 * ```
 * 
 * ## CpisTable 和 el-table 的不同
 * - 新增request，用于异步获取数据，可以理解为 el-table 的 data 的异步方案。
 *   - request使用场景：大部分场景使用请求（request）即可，因为内部处理了分页，搜索，排序，loading
 *   - data使用场景：如果要使用响应式数据，可以使用 data 属性，此时就需要自己处理分页，搜索，排序，loading
 * - 新增了 columns 属性，用于配置列。
 * - 新增了 editable 属性，用于配置单元格编辑。
 * - 新增了 search 属性，用于配置搜索。
 * - 新增了 paginationProps 属性，用于配置分页。
 * - 新增了 toolbar 插槽，用于配置工具栏。
 * - 新增了 paramaterMode 属性，用于配置参数模式。
 * - 新增 getTable 方法，用于获取 el-table 的 ref。
 * - 新增 reload 方法，用于重新加载数据。注：此方法只适用于 request 模式。
 * - 新增了 handle-add-row 事件，用于新增行。
 * - 新增了 handle-delete-row 事件，用于删除行。
 * 
 * 
 * ## CpisTable 参数
 ### CpisTable Attributes
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | editable  | 是否开启单元格编辑 | boolean   | true/false |  false |
  | search  | 搜索配置 | boolean/array   | - |  false |
  | columns  | 列配置,详见 [Column Attributes](#column-attributes) | array   | — | — |
  | identity  | 表格唯一标识 | string   | — | — |
  | request  | 请求配置，和data两选一 用法见 [request](#request-and-data) | function   | — | — |
  | data  | 表格数据，和request两选一 用法见 [request](#request-and-data)| array   | — | — |
  | paramaterMode  | 参数模式 | string   | structured/flat | structured |
  | autoHeight  | 是否自动高度 | boolean   | true/false | true |
### Column Attributes

  这里不列举element文档的参数，需要去element文档查看。

  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | valueType  | 列数据类型 | string   | text/number/select/action/index/tag | text |
  | align  | 列对齐方式 | string   | left/center/right | tag 为center， number为left， 其他为right |
  | editItemProps  | 编辑状态下会透传给编辑组件 | object/function   | — | — |
  | fieldProps  | 非编辑状态下会透传给 valueTyp 对应的组件 | object/function   | — | — |

### CpisTable Methods
  | 方法名      | 说明          | 参数      |
  |---------- |---------------- |---------- |
  | reload  | 重新加载数据 | — |
  | getTable  | 获取表格实例 | — |
  | getSearchBar  | 获取搜索栏实例 | — |

### CpisTable Events
  | 事件名      | 说明          | 回调参数      |
  |---------- |---------------- |---------- |
  | handle-add-row  | 新增行事件 | — |
  | handle-delete-row  | 删除行事件 | — |
  | handle-toolbar-click  | 工具栏点击事件 | — |
  | selection-change  | 多选改变的回调 | — |

  ### Request And Data
  data和request都可以用于配置表格数据，但是两者有不同的使用场景。request用于异步获取数据，data用于响应式数据。request天然的可以处理分页，搜索，排序，loading。data需要自己处理。
  但是往往一些场景下，对于数据需要存储，例如编辑表格，此时就需要使用data。
  data 属性用于配置表格数据，支持数组。和element-ui的data属性一致。
  request 属性用于配置请求，支持异步函数，返回一个 Promise 对象。
  request 返回值要求：
  ```
  {
    data: [],
    total: 0
  }
  ```
  其中 ~~success 为布尔值~~，data 为数组，total 为总数。 只有当~~sucess为true的时候~~，data才会被渲染。~~所以根据后端的接口定义正确判断success的值。~~

  **0.0.54 版本后**，success 被移除，data 为数组，total 为总数。 只有当data为数组的时候，data才会被渲染。所以根据后端的接口定义正确判断data的值。
  ### AutoHeight
  autoHeight 默认为true，属性用于配置表格高度。
  autoHeight 为true的时候（默认值），表格会自己计算高度，逻辑是，表格容器高度-搜索栏高度-工具栏高度-分页高度-表格间距 = 表格高度。所以依赖于表格容器高度，标高容器高度默认是 height: 100%。所以如果他有父级的时候，父级需要有明确的高度。
  设置一个明确的高度，会实现表头固定的效果（https://element.eleme.cn/#/zh-CN/component/table#gu-ding-biao-tou）

  autoHeight 为false的时候，表格会自动根据内容撑开高度。
  同时也可以传入height属性，强制设置高度。
  ### paramaterMode
  paramaterMode 属性用于配置参数模式。
  paramaterMode 为structured的时候，参数会按照structured模式进行传递。
 */
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/表格',
  component: CpisTable,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: `
        <div style="height: 400px; position: relative; border: 1px solid #eee;">
          <story />
        </div>
      `
    })
  ],
  render: (args, { argTypes, parameters }) => {
    return {
      setup() {
        const { columns, request } = parameters

        return { columns, request, key: 'id', ...args }
      },
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template: `
        <CpisTable v-bind="$props" :columns="columns" :request="request">
          <template v-slot:columns="{column, row}">
            <CpisButton type="text" v-if="column.prop === 'action'">编辑</CpisButton>
          </template>
        </CpisTable>
      `
    }
  },
  parameters: {
    columns: [
      {
        label: '序号',
        prop: 'id',
        valueType: 'index',
        width: '100px'
      },
      {
        label: '姓名',
        prop: 'name',
        valueType: 'text',
        width: '100px'
      },
      {
        label: '年龄',
        prop: 'age',
        valueType: 'number',
        width: '100px'
      },
      {
        label: '工龄',
        prop: 'workAge',
        valueType: 'number',
        width: '100px'
      },
      {
        label: '工号',
        prop: 'workId',
        valueType: 'number',
        width: '120px'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px',
        valueEnum: {
          male: '男',
          female: '女'
        }
      },
      {
        label: '操作',
        prop: 'action',
        valueType: 'action'
      }
    ],
    request: async params => {
      console.log(params)
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 1,
                name: '张三',
                age: 18,
                workAge: 1,
                workId: 10001,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 2,
                name: '李四',
                age: 20,
                workAge: 1,
                workId: 10002,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 3,
                name: '王五',
                age: 22,
                workAge: 3,
                workId: 10003,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 4,
                name: '赵六',
                age: 24,
                workAge: 5,
                workId: 10004,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 5,
                name: '孙七',
                age: 26,
                workAge: 6,
                workId: 10005,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 6,
                name: '周八',
                age: 28,
                workAge: 9,
                workId: 10006,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 7,
                name: '吴九',
                age: 30,
                workAge: 8,
                workId: 10007,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 8,
                name: '郑十',
                age: 32,
                workAge: 10,
                workId: 10008,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 9,
                name: '陈一',
                age: 25,
                workAge: 4,
                workId: 10009,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 10,
                name: '钱二',
                age: 27,
                workAge: 5,
                workId: 10010,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 11,
                name: '孟三',
                age: 29,
                workAge: 7,
                workId: 10011,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 12,
                name: '马四',
                age: 31,
                workAge: 9,
                workId: 10012,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 13,
                name: '黄五',
                age: 33,
                workAge: 11,
                workId: 10013,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 14,
                name: '杨六',
                age: 35,
                workAge: 12,
                workId: 10014,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 15,
                name: '朱七',
                age: 28,
                workAge: 6,
                workId: 10015,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 16,
                name: '秦八',
                age: 30,
                workAge: 8,
                workId: 10016,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 17,
                name: '许九',
                age: 32,
                workAge: 10,
                workId: 10017,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 18,
                name: '韩十',
                age: 34,
                workAge: 11,
                workId: 10018,
                sex: '女',
                idCard: '123456789012345678'
              },
              {
                id: 19,
                name: '范一',
                age: 36,
                workAge: 13,
                workId: 10019,
                sex: '男',
                idCard: '123456789012345678'
              },
              {
                id: 20,
                name: '方二',
                age: 38,
                workAge: 15,
                workId: 10020,
                sex: '女',
                idCard: '123456789012345678'
              }
            ],
            total: 22
          })
        }, 1000)
      })
    }
  },
  argTypes: {
    paramaterMode: {
      description: '参数模式',
      control: 'select',
      options: ['structured', 'flat']
    },
    dataSource: {
      description: '表格数据',
      control: 'array'
    },
    columns: {
      description: '表格列',
      control: 'array'
    },
    paginationProps: {
      description: '分页配置，支持布尔值或对象。布尔值控制是否显示分页，对象可配置分页参数',
      control: 'boolean'
    },
    search: {
      description: '搜索配置，支持布尔值或数组。布尔值控制是否显示搜索，数组可配置搜索参数',
      control: 'boolean'
    }
  }
}
export const Request = {
  render: () => {
    return {
      data() {
        return {
          request: async () => {
            // 这里模拟了一个异步请求
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  data: [
                    {
                      name: '张三',
                      functionScore: 0,
                      businessScore: 0
                    },
                    {
                      name: '李四',
                      functionScore: 1,
                      businessScore: 1
                    },
                    {
                      name: '王五',
                      functionScore: 2,
                      businessScore: 2
                    }
                  ],
                  total: 3
                })
              }, 1000)
            })
          },
          columns: [
            {
              label: '姓名',
              prop: 'name',
              valueType: 'text'
            },
            {
              label: '职能绩效',
              prop: 'functionScore'
            },
            {
              label: '业务绩效',
              prop: 'businessScore'
            },
            {
              label: '总分',
              prop: 'totalScore',
              formatter: (row, column, value) => {
                return row.functionScore + row.businessScore
              }
            }
          ]
        }
      },
      components: { CpisTable },
      template: `<CpisTable :request="request" :columns="columns" />`
    }
  },
  name: '请求数据'
}
export const ToolbarSlots = {
  render: () => {
    return {
      components: { CpisTable, CpisButton },
      template: `
      <CpisTable :columns="[{label: '姓名', prop: 'name', valueType: 'text'}]">
          <template #toolbar>
            <CpisButton type="primary">新增</CpisButton>
            <CpisButton>修改</CpisButton>
            <CpisButton>删除</CpisButton>
          </template>
        </CpisTable>
      `
    }
  },
  name: 'toolbar-插槽写法'
}
export const ToolbarConfig = {
  parameters: {
    anchor: 'ToolbarConfig',
    docs: {
      source: {
        code: `
<script>
export default {
  methods: {
    handleToolbarClick(key) {
      console.log(key)
    },
    // 多选改变的回调
    handleSelectionChange(selection) {
      this.selected = selection
    },
  },
  data() {
    return {
      selected: []
    }
  }
}
</script>

<template>
  <CpisTable 
    identity="ibps_org_employee"
    :columns="[{
      label: '姓名',
      prop: 'name',
      valueType: 'text'
    }]"
    :toolbar="[{
      key: 'add',
      label: '新增', 
      type: 'primary'
    }, {
      key: 'edit',
      label: '修改',
      disabled: () => {
        return this.selected.length === 0
      }
    }, {
      key: 'cancel',
      label: '取消'
    }, {
      key: 'delete',
      label: '删除'
    }, {
      key: 'test1',
      label: '测试1',
      children: [{
        key: 'test1-1',
        label: '测试1-1',
        disabled: () => {
          return this.selected.length === 0
        }
      }, {
        key: 'test1-2',
        label: '测试1-2'
      }, {
        key: 'test1-3',
        label: '测试1-3'
      }]
    }, {
      key: 'test2',
      label: '测试2'
    }, {
      key: 'test3',
      label: '测试3'
    }, {
      key: 'test4',
      label: '测试4'
    }, {
      key: 'test5',
      label: '测试5'
    }, {
      key: 'test6',
      label: '测试6'
    }]"
    @handle-toolbar-click="handleToolbarClick"
    @selection-change="handleSelectionChange"
  />
</template>`
      }
    }
  },
  render: () => {
    return {
      created() {
        window.sessionStorage.setItem('permissions', JSON.stringify(this.json))
      },
      methods: {
        handleSelectionChange(selection) {
          this.selected = selection
        },
        handleToolbarClick(key) {
          console.log(key)
        }
      },
      data() {
        return {
          identity: 'ibps_org_employee1',
          request: async () => {
            return {
              data: [{ name: '张三' }, { name: '李四' }, { name: '王五' }]
            }
          },
          selected: [],
          toolbar: [
            {
              key: 'add',
              label: '新增',
              type: 'primary'
            },
            {
              key: 'edit',
              label: '修改',
              disabled: () => {
                return this.selected.length === 0
              }
            },
            { key: 'cancel', label: '取消' },
            { key: 'delete', label: '删除' },
            {
              key: 'test1',
              label: '测试1',
              children: [
                {
                  key: 'test1-1',
                  label: '测试1-1',
                  disabled: () => {
                    return this.selected.length === 0
                  }
                },
                { key: 'test1-2', label: '测试1-2' },
                { key: 'test1-3', label: '测试1-3' }
              ]
            },
            { key: 'test2', label: '测试2' },
            { key: 'test3', label: '测试3' },
            { key: 'test4', label: '测试4' },
            { key: 'test5', label: '测试5' },
            { key: 'test6', label: '测试6' }
          ],
          json: {
            ibps_org_employee_add: true,
            ibps_org_employee_edit: true,
            ibps_org_employee_cancel: true,
            ibps_org_employee_delete: true,
            ibps_org_employee_test1: true,
            ibps_org_employee_test2: true,
            ibps_org_employee_test3: true,
            ibps_org_employee_test4: true,
            ibps_org_employee_test5: true,
            ibps_org_employee_test6: true
          }
        }
      },
      watch: {
        json: {
          handler(newVal) {
            this.toolbar = [...this.toolbar]
            window.sessionStorage.setItem('permissions', JSON.stringify(newVal))
          },
          immediate: true,
          deep: true
        }
      },
      components: { CpisTable, CpisButton, ElInput: Input, ElSwitch: Switch },
      template: `
        <div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <div class="text-xl font-semibold mb-3 text-gray-800">当前权限配置</div>
            <div class="text-gray-500 text-sm mb-2">平台权限存在localStorage, 这里是做模拟</div>
            <div class="text-gray-500 text-sm mb-6">当过滤掉无权限的按钮后，按钮数量超过6个会收到更多里</div>
            <div class="permission-controls space-y-4 bg-white p-4 rounded-md">
              <div v-for="(value, key) in json" 
                   :key="key" 
                   class="flex items-center hover:bg-gray-50 p-2 rounded transition-colors">
                <el-switch
                  v-model="json[key]"
                  :active-text="key"
                  class="mr-3"
                />
              </div>
            </div>
          </div>
          <CpisTable
            :height="130"
            @handle-toolbar-click="handleToolbarClick"
            @selection-change="handleSelectionChange"
            identity="ibps_org_employee"
            :request="request"
            :columns="[{prop: 'selection', valueType: 'selection'}, {label: '姓名', prop: 'name', valueType: 'text'}]"
            :toolbar="toolbar" 
          />
        </div>
      `
    }
  },
  name: 'toolbar-配置化写法'
}
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowPagination = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['paginationProps']
    }
  },
  args: {
    paginationProps: false
  },
  name: '是否显示分页'
}

export const StructuredSearch = {
  parameters: {
    docs: {
      autodocs: false,
      description: {
        story: '结构化搜索配置示例。更多搜索配置详情请参考 [SearchBar](?path=/docs/原子组件-搜索栏--docs)'
      },
      source: {
        code: `<CpisTable paramaterMode="structured"/>`
      }
    },
    controls: {
      include: ['']
    }
  },
  render: () => {
    return {
      components: { CpisTable },
      methods: {
        request(params) {
          console.log(params)
        }
      },
      template: `
        <CpisTable 
          :request="request"
          paramaterMode="structured"
          :search="[
            {
              prop: 'Q^NAME_^SL',
              label: '姓名', 
              placeholder: '请输入'
            },
            {
              prop: 'Q^SEX_^SL',
              label: '性别',
              type: 'select',
              enum: [
                {
                  key: 'male',
                  name: '男'
                },
                {
                  key: 'female', 
                  name: '女'
                }
              ]
            },
            {
              prop: 'Q^status_^SL',
              label: '异步select',
              type: 'select',
              enum: () => {
                return [
                  { key: 'protocol', name: '拟稿' },
                  { key: 'cancel', name: '作废' }
                ]
              },
              width: 50
            }
          ]"
        />
      `
    }
  },
  name: '配置搜索项-结构化'
}

export const FlatSearch = {
  parameters: {
    docs: {
      autodocs: false,
      description: {
        story: '扁平化搜索配置示例。更多搜索配置详情请参考 [SearchBar](?path=/docs/原子组件-搜索栏--docs)'
      },
      source: {
        code: `<CpisTable paramaterMode="flat"/>`
      }
    },
    controls: {
      include: ['']
    }
  },
  render: () => {
    return {
      components: { CpisTable },
      methods: {
        request(params) {
          console.log(params)
        }
      },
      template: `
        <CpisTable 
          :request="request"
          paramaterMode="flat"
          :search="[
            {
              prop: 'name',
              label: '姓名', 
              placeholder: '请输入'
            },
            {
              prop: 'sex',
              label: '性别',
              type: 'select',
              enum: [
                {
                  key: 'male',
                  name: '男'
                },
                {
                  key: 'female', 
                  name: '女'
                }
              ]
            },
            {
              prop: 'status',
              label: '异步select',
              type: 'select',
              enum: () => {
                return [
                  { key: 'protocol', name: '拟稿' },
                  { key: 'cancel', name: '作废' }
                ]
              },
              width: 50
            }
          ]"
        />
      `
    }
  },
  name: '配置搜索项-扁平化'
}

// export const ConfigEmptyText = {
//   parameters: {
//     docs: {
//       autodocs: false
//     },
//     controls: {
//       include: ['emptyText']
//     },
//     dataSource: []
//   },
//   argTypes: {
//     emptyText: {
//       description: '列无数据时显示的文本',
//       control: 'text'
//     }
//   },
//   args: {
//     emptyText: '我可以自定义'
//   },
//   name: '配置数据为空时候的文本'
// }

export const HideColumn = {
  parameters: {
    docs: {
      source: {
        code: `
        <template>
          <CpisTable ref="table" :columns="columns" :request="() => {
            return {
              data: [{
                name: '张三',
                age: 18,
                sex: '男'
              }],
            }
          }" />
        </template>

        <script>
        export default {
          data() {
            return {
              hiddenSex: false,
              columns: [
                {
                  label: '姓名', 
                  prop: 'name',
                  hideInTable: false
                },
                {
                  label: '年龄',
                  prop: 'age', 
                  hideInTable: true // 支持直接写布尔值
                },
                {
                  label: '三秒后隐藏',
                  prop: 'sex',
                  hideInTable: () => this.hiddenSex // 也支持绑定变量，但是需要写成肩头函数
                }
              ]
            }
          },
          mounted() {
            // 这里模拟了一个3秒后返回的请求，在你那里就是实际的接口
            setTimeout(() => {
              this.hiddenSex = true
            }, 3000)
          }
        }
        </script>`
      }
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  render: (args, { argTypes }) => {
    return {
      components: { CpisTable },
      mounted() {
        setTimeout(() => {
          this.hiddenSex = true
        }, 3000)
      },
      data() {
        return {
          hiddenSex: false,
          columns: [
            {
              label: '姓名',
              prop: 'name',
              hideInTable: false
            },
            {
              label: '年龄',
              prop: 'age',
              hideInTable: true
            },
            {
              label: '三秒后隐藏',
              prop: 'sex',
              hideInTable: () => this.hiddenSex
            }
          ]
        }
      },
      template: `
        <CpisTable ref="table" v-bind="$props" :columns="columns" :request="() => {
          return {
            data: [{
              name: '张三',
              age: 18,
              sex: '男'
            }],
            total: 5
          }
        }">
      `
    }
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  name: 'hiddenInTable'
}

export const Copyable = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        label: '姓名',
        prop: 'name'
      },
      {
        label: '身份证',
        prop: 'idCard',
        valueType: 'text',
        copyable: true
      },
      {
        label: '年龄',
        prop: 'age'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px'
      }
    ]
  },
  name: '配置某一列可以复制'
}

export const Editable = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisTable 
    :editable="editable"
    :columns="columns"
    :data="data"
    @handle-add-row="handleAddRow"
    @handle-delete-row="handleDeleteRow"
  />
</template>

<script>
export default {
  data() {
    return {
      editable: false,
      columns: [
            { label: '姓名', prop: 'name' },
            {
              label: '性别',
              prop: 'sex',
              valueType: 'radio',
              options: [
                { label: '男', value: '男' },
                { label: '女', value: '女' }
              ]
            },
            {
              prop: 'demo',
              editable: false,
              label: '某一行设置不编辑'
            },
            {
              label: '年龄',
              prop: 'age'
            }
      ],
      data: [
            { name: '张三', age: 18, sex: '男' },
            { name: '李四', age: 20, sex: '女' }
      ]
    }
  },
  methods: {
    handleAddRow() {
      this.data.push({
        name: '',
        age: null
      })
    },
    handleDeleteRow(row, column, index) {
      this.data.splice(index, 1)
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
      components: { CpisTable, ElSwitch: Switch },
      methods: {
        handleAddRow() {
          debugger
          this.data.push({
            name: '',
            age: null
          })
        },
        handleDeleteRow(row, column, index) {
          this.data.splice(index, 1)
        }
      },
      data() {
        return {
          editable: false,
          columns: [
            { label: '姓名', prop: 'name' },
            {
              label: '性别',
              prop: 'sex',
              valueType: 'radio',
              options: [
                { label: '男', value: '男' },
                { label: '女', value: '女' }
              ]
            },
            {
              prop: 'demo',
              editable: false,
              label: '某一行设置不编辑'
            },
            {
              label: '年龄',
              prop: 'age',
              valueType: 'number'
            }
          ],
          data: [
            { name: '张三', age: 18, sex: '男', demo: 'demo' },
            { name: '李四', age: 20, sex: '女', demo: 'demo' }
          ]
        }
      },
      template: `
        <div class="p-4">
          <div class="mb-4 bg-white h-[32px] flex items-center justify-center p-4">
            <el-switch 
              v-model="editable"
              active-text="编辑状态"
              inactive-text="正常状态"
            />
          </div>

          <CpisTable
            :columns="columns"
            :editable="editable"
            :data="data"
            @handle-add-row="handleAddRow"
            @handle-delete-row="handleDeleteRow"
          />
        </div>
      `
    }
  },
  name: '编辑状态'
}
export const Required = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        label: '姓名',
        prop: 'name',
        required: true
      },
      {
        label: '身份证',
        prop: 'idCard',
        valueType: 'text',
        copyable: true,
        required: true
      },
      {
        label: '年龄',
        prop: 'age'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px'
      }
    ]
  },
  name: '表头显示星号'
}
export const Selection = {
  parameters: {
    docs: {
      source: {
        code: `

<template>
  <CpisTable @selection-change="handleSelectionChange" />
</template>
<script>
export default {
  methods: {
    handleSelectionChange(selection) {
      this.selected = selection
    }
  },
  data() {
    return {
      selected: [],
    }
  }
}
</script>
        `
      }
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        prop: 'selection',
        valueType: 'selection'
      },
      {
        label: '姓名',
        prop: 'name'
      },
      {
        label: '身份证',
        prop: 'idCard',
        valueType: 'text',
        copyable: true
      },
      {
        label: '年龄',
        prop: 'age'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px'
      }
    ]
  },
  name: '多选'
}

export const CustomColumnSlot = {
  parameters: {
    docs: {
      source: {
        code: `
<script>
export default {
  data() {
    return {
      columns: [
        { label: '插槽1', prop: 'slot1' },
        { label: '插槽2', prop: 'slot2' },
        { label: '插槽3', prop: 'slot3' },
        { label: '插槽4', prop: 'slot4' }
      ]
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>

<template>
  <CpisTable :columns="columns">
    <template #columns="{column, row}">
      <CpisButton type="text" v-if="column.prop === 'slot1'" @click="handleClick(row)">slot1</CpisButton>
      <CpisButton type="text" v-else-if="column.prop === 'slot2'" @click="handleClick(row)">slot2</CpisButton>
      <CpisButton type="text" v-else-if="column.prop === 'slot3'" @click="handleClick(row)">slot3</CpisButton>
      <CpisButton type="text" v-else-if="column.prop === 'slot4'" @click="handleClick(row)">slot4</CpisButton>
    </template>
  </CpisTable>
</template>
        `
      },
      autodocs: false
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template: `
      <CpisTable v-bind="$props" :columns="columns" :request="() => {
        return {
          data: [{
            name: '张三',
            age: 18,
            sex: '男'
          }],
          total: 5
        }
      }">
      <template #columns="{column, row}">
        <CpisButton type="text" v-if="column.prop === 'slot1'">slot1</CpisButton>
        <CpisButton type="text" v-if="column.prop === 'slot2'">slot2</CpisButton>
        <CpisButton type="text" v-if="column.prop === 'slot3'">slot3</CpisButton>
        <CpisButton type="text" v-if="column.prop === 'slot4'">slot4</CpisButton>
      </template>
      </CpisTable>
      `
    }
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        prop: 'selection',
        valueType: 'selection'
      },
      {
        label: '插槽1',
        prop: 'slot1'
      },
      {
        label: '插槽2',
        prop: 'slot2'
      },
      {
        label: '插槽3',
        prop: 'slot3'
      },
      {
        label: '插槽3',
        prop: 'slot3'
      }
    ]
  },

  name: 'CustomColumnSlot'
}

export const FixedColumn = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['columns']
    },
    dataSource: []
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template: `
      <CpisTable v-bind="$props" :columns="columns" :request="() => {
        return {
          data: [{
            name: '张三',
            age: 18,
            sex: '男'
          }],
          total: 5
        }
      }">
      <template #columns="{column, row}">
        <CpisButton type="text" v-if="column.prop === 'name'">可以点击</CpisButton>
        <CpisButton type="text" v-else-if="column.prop === 'action'">编辑</CpisButton>
      </template>
      </CpisTable>
      `
    }
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        prop: 'selection',
        valueType: 'selection'
      },
      {
        label: '姓名',
        prop: 'name'
      },
      {
        label: '年龄',
        prop: 'age'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px'
      },
      {
        label: '测试1',
        prop: 'test1',
        width: 800
      },
      {
        label: '测试2',
        prop: 'test2',
        width: 800
      },

      {
        label: '操作',
        prop: 'action',
        valueType: 'action',
        fixed: 'right'
      }
    ]
  },
  name: '列操作项默认固定右侧'
}

export const TableHeight = {
  render: (args, { argTypes }) => {
    return {
      components: { CpisTable },
      template: `
        <CpisTable
          :height="250"
          :columns="[
            {
              label: '姓名',
              prop: 'name'
            },
            {
              label: '年龄', 
              prop: 'age'
            },
            {
              label: '性别',
              prop: 'sex'
            }
          ]"
          :request="() => {
            return {
              data: Array(50).fill(null).map((_, index) => ({
                name: '张三' + index,
                age: Math.floor(Math.random() * 40) + 20,
                sex: Math.random() > 0.5 ? '男' : '女'
              })),
              total: 50
            }
          }"
        />
      `
    }
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  args: {
    columns: [
      {
        prop: 'selection',
        valueType: 'selection'
      },
      {
        label: '姓名',
        prop: 'name'
      },
      {
        label: '年龄',
        prop: 'age'
      },
      {
        label: '性别',
        prop: 'sex',
        valueType: 'select',
        width: '100px'
      },
      {
        label: '测试1',
        prop: 'test1',
        width: 800
      },
      {
        label: '测试2',
        prop: 'test2',
        width: 800
      },

      {
        label: '操作',
        prop: 'action',
        valueType: 'action',
        fixed: 'right'
      }
    ]
  },
  name: '表格高度'
}

export const ToolTip = {
  parameters: {
    docs: {
      source: {
        code: `
        <CpisTable :columns="[{label: '地址', prop: 'address', width: 100, tooltip: true}]" />
        `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisTable },
      template: `
        <CpisTable
          :columns="[
            {
              label: '姓名',
              prop: 'name'
            },
            {
              label: '年龄', 
              prop: 'age'
            },
            {
              label: '地址',
              prop: 'address',
              valueType: 'text',
              width: 100,
              tooltip: true
            }
          ]"
          :request="() => {
            return {
              data: [{
                name: '张三',
                age: 18,
                address: '北京市海淀区中关村大街1号'
              }],
              total: 50
            }
          }"
        />
      `
    }
  },
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    }
  },
  name: '超长溢出和tooltip'
}

export const ValueType_Tag = {
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisTable :columns="columns" :request="request" />
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          label: '状态1',
          prop: 'status1',
          valueType: 'tag',
          fieldProps: {type: 'success'},
          formatter: row => row.status1 === 'success' ? '成功' : '失败'
        },
        {
          label: '状态2',
          prop: 'status2',
          valueType: 'tag',
          fieldProps: row => ({
            type: row.status2 === 'draft' ? 'draft' : 'completed'
          }),
          formatter: row => row.status2 === 'draft' ? '延期' : '正常'
        }
      ],
      request: async () => ({
        data: [{
          status1: 'success',
          status2: 'draft'
        }],
        total: 50
      })
    }
  }
}
</script>`
      }
    }
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CpisTable },
    template: `
      <CpisTable
        :columns="[
          {
            label: '状态1',
            prop: 'status1',
            valueType: 'tag',
            fieldProps: {type: 'success'},
            formatter: row => row.status1 === 'success' ? '成功' : '失败'
          },
          {
            label: '状态2',
            prop: 'status2',
            valueType: 'tag',
            fieldProps: row => ({
              type: row.status2 === 'draft' ? 'draft' : 'completed'
            }),
            formatter: row => row.status2 === 'draft' ? '延期' : '正常'
          }
        ]"
        :request="() => ({
          data: [{
            status1: 'success',
            status2: 'draft'
          }],
          total: 50
        })"
      />
    `
  }),
  argTypes: {
    columns: {
      description: '列配置',
      control: 'array',
      table: {
        category: '列配置'
      }
    },
    request: {
      description: '请求配置',
      control: 'function'
    }
  }
}

// Story 级别文档
// export const Primary = {
//   decorators: [
//     Story => ({
//       components: { Story },
//       template: `
//             <div>
//               <div class="docs-section">
//                 <h2>Columns 列定义</h2
//                 <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
//                     <tr>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">参数</th>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">说明</th>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">默认值</th>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">valueType</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">列类型，详细配置查看下面 <a href="#valueType">valueType</a></td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">text</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">copyable</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">是否支持复制</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">false</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">ellipsis</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">是否超长省略</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">可以通过设置valueEnum预设一些状态</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">search</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">配置列的搜索相关，false 为隐藏	</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">false</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">hideInTable</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">在表格中隐藏此列</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">false</td>
//                     </tr>

//                 </table>
//                 <h3>valueType</h3>
//                 <p>valueType 是列定义中最重要的参数，决定了列的显示方式</p>
//                 <table style="border-collapse: collapse; width: 100%; margin: 16px 0;" id="valueType">
//                     <tr>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">类型</th>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">说明</th>
//                         <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">特性</th>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">text</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">默认文本类型</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">居中显示</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">number</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">数字类型</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">居右显示</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">select</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">枚举类型</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">可以通过设置valueEnum预设一些状态</td>
//                     </tr>
//                     <tr>
//                         <td style="border: 1px solid #ddd; padding: 12px;">date</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">日期</td>
//                         <td style="border: 1px solid #ddd; padding: 12px;">可以预设一些状态</td>
//                     </tr>

//                 </table>
//               </div>
//             </div>
//           `
//     })
//   ],
//   name: '列设置'
// }
