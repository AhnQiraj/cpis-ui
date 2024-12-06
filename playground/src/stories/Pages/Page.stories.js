import { CpisTag } from '@cpis/cpis-ui'
import MyPage from './Page.vue'


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '界面/换肤',
  component: MyPage,
  tags: ['autodocs'],
  render: (args, { argTypes, parameters }) => {
    return {
      setup() {
        const { columns, data } = parameters
        return { ...args, columns, data }
      },
      props: Object.keys(argTypes),
      components: { MyPage },
      template: '<MyPage />'
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
    data: [
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
        age: 26,
      },
      {
        id: 6,
        name: '周八',
        workAge: 9
      }
    ]
  },
  argTypes: {
    tableData: {
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
  },
  args: {
    tableData: []
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
  name: '一键换肤色'
}
