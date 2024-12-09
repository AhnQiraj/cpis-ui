import Theme from './Theme.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '界面/换肤',
  component: Theme,
  tags: ['autodocs'],
  render: (args, { argTypes, parameters }) => {
    return {
      setup() {
        const { columns, dataSource } = parameters
        return { ...args, columns, dataSource }
      },
      props: Object.keys(argTypes),
      components: { Theme },
      template: '<Theme />'
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
          placeholder: '请输入姓名',
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
        age: 26,
      },
      {
        id: 6,
        name: '周八',
        workAge: 9
      }
    ],
    layout: 'fullscreen'
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowPagination = {
  parameters: {
    docs: {
      autodocs: false
    },
    controls: {
      exclude: ['*']
    }
  },
  name: '一键换肤色'
}
