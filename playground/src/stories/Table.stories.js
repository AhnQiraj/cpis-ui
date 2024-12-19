import { CpisTag } from '@cpis/cpis-ui'
import CpisTable from '../../../packages/cpis-ui/src/packages/table/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/表格',
  component: CpisTable,
  tags: ['autodocs'],
  render: (args, { argTypes, parameters }) => {
    return {
      setup() {
        const { columns, request } = parameters

        return { columns, request, key: 'id', ...args }
      },
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template: `
        <CpisTable v-bind="$props" key="table-1" :columns="columns" :request="request">
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
            success: true,
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
    dataSource: {
      description: '表格数据',
      control: 'array'
    },
    columns: {
      description: '表格列',
      control: 'array'
    },
    paginationProps: {
      description:
        '分页配置，支持布尔值或对象。布尔值控制是否显示分页，对象可配置分页参数',
      control: 'boolean'
    },
    search: {
      description:
        '搜索配置，支持布尔值或数组。布尔值控制是否显示搜索，数组可配置搜索参数',
      control: 'boolean'
    }
  }
}
export const ShowActions = {
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
  name: '配置操作区'
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

export const ConfigSearchText = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['search']
    }
  },
  argTypes: {
    search: {
      description: '搜索栏配置，支持布尔和数组',
      control: 'array'
    }
  },
  args: {
    search: [
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
            key: 'protocol',
            name: '拟稿'
          },
          {
            key: 'cancel',
            name: '作废'
          }
        ]
      }
    ]
  },
  name: '配置搜索项'
}

export const ConfigEmptyText = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['emptyText']
    },
    dataSource: []
  },
  argTypes: {
    emptyText: {
      description: '列无数据时显示的文本',
      control: 'text'
    }
  },
  args: {
    emptyText: '我可以自定义'
  },
  name: '配置数据为空时候的文本'
}

export const HideColumn = {
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
        hideInTable: false
      },
      {
        label: '年龄',
        prop: 'age',
        hideInTable: true
      }
    ]
  },
  name: '配置某一列可以隐藏'
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
export const Selection = {
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
          success: true,
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
      }
    ]
  },
  name: '自定义列插槽'
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
          success: true,
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
// Story 级别文档
export const Primary = {
  decorators: [
    Story => ({
      components: { Story },
      template: `
            <div>
              <div class="docs-section">
                <h2>Columns 列定义</h2
                <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">参数</th>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">说明</th>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">默认值</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">valueType</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">列类型，详细配置查看下面 <a href="#valueType">valueType</a></td>
                        <td style="border: 1px solid #ddd; padding: 12px;">text</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">copyable</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">是否支持复制</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">false</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">ellipsis</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">是否超长省略</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">可以通过设置valueEnum预设一些状态</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">search</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">配置列的搜索相关，false 为隐藏	</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">false</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">hideInTable</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">在表格中隐藏此列</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">false</td>
                    </tr>
                    
                </table>
                <h3>valueType</h3>
                <p>valueType 是列定义中最重要的参数，决定了列的显示方式</p>
                <table style="border-collapse: collapse; width: 100%; margin: 16px 0;" id="valueType">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">类型</th>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">说明</th>
                        <th style="border: 1px solid #ddd; padding: 12px; background-color: #f5f5f5; text-align: left;">特性</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">text</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">默认文本类型</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">居中显示</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">number</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">数字类型</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">居右显示</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">select</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">枚举类型</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">可以通过设置valueEnum预设一些状态</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">date</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">日期</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">可以预设一些状态</td>
                    </tr>
                    
                </table>
              </div>
            </div>
          `
    })
  ],
  name: '列设置'
}
