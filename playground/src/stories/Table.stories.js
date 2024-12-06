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
        const { columns, data } = parameters
        return { ...args, columns, data }
      },
      props: Object.keys(argTypes),
      components: { CpisTable, CpisButton },
      template:
        '<CpisTable v-bind="args" :columns="columns" :data="data">' +
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
        type: 'text',
        width: '100px',
        search: {
          label: '姓名',
          placeholder: '请输入姓名'
        }
      },
      {
        label: '年龄',
        prop: 'age',
        type: 'number',
        width: '100px',
        search: {
          label: '年龄',
          placeholder: '请输入年龄'
        }
      },
      {
        label: '工龄',
        prop: 'workAge',
        type: 'number',
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
        workAge: 7
      },
      {
        id: 6,
        name: '周八',
        age: 28,
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
  name: '是否显示分页'
}

export const ShowLoading = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      include: ['loading']
    }
  },
  args: {
    loading: false
  },
  name: '是否加载中'
}
