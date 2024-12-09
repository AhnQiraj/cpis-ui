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
        const { columns, dataSource } = parameters
        
        return { columns, dataSource, key: 'id', ...args }
      },
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template:
        '<CpisTable v-bind="$props" :columns="columns" :dataSource="dataSource">' +
        '<template #toolbar>' +
        '<CpisButton type="primary">新增</CpisButton>' +
        '<CpisButton>修改</CpisButton>' +
        '<CpisButton>删除</CpisButton>' +
        '</template>' +
        '</CpisTable>'
    }
  },
  parameters: {
    columns: [
      {
        label: '序号',
        prop: 'id',
        type: 'index',
        width: '100px'
      },
      {
        label: '姓名',
        prop: 'name',
        valueType: 'text',
        width: '100px',
        search: {
          label: '姓名',
          placeholder: '请输入姓名'
        }
      },
      {
        label: '年龄',
        prop: 'age',
        valueType: 'number',
        width: '100px',
        search: {
          label: '年龄',
          placeholder: '请输入年龄'
        }
      },
      {
        label: '工龄',
        prop: 'workAge',
        valueType: 'number',
        width: '100px',
        search: {
          label: '工龄',
          placeholder: '请输入工龄'
        }
      }
    ],
    dataSource: [
      {
        id: 1,
        name: '张三',
        age: 18,
        workAge: 1
      },
      {
        id: 2,
        name: '李四',
        age: 20,
        workAge: 1
      },
      {
        id: 3,
        name: '王五',
        age: 22,
        workAge: 3
      },
      {
        id: 4,
        name: '赵六',
        age: 24,
        workAge: 5
      },
      {
        id: 5,
        name: '孙七',
        age: 26
      },
      {
        id: 6,
        name: '周八',
        workAge: 9
      }
    ]
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
        '搜索配置，支持布尔值或对象。布尔值控制是否显示搜索，对象可配置搜索参数',
      control: 'boolean'
    }
  }
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

export const ShowSearch = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['search']
    }
  },
  args: {
    search: false
  },
  name: '是否显示搜索'
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
      description: '搜索配置，支持对象。对象可配置搜索按钮文字',
      control: 'object'
    }
  },
  args: {
    search: {
      searchText: '我可以自定义',
      resetText: '我可以自定义'
    }
  },
  name: '配置搜索按钮文字'
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
