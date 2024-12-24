import CpisSearchBar from '../../../packages/cpis-ui/src/packages/search-bar/index'
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/搜索栏',
  component: CpisSearchBar,
  tags: ['autodocs'],
  render: (args, { argTypes, parameters }) => {
    return {
      setup() {
        const { columns, request } = parameters

        return { columns, request, key: 'id', ...args }
      },
      props: Object.keys(argTypes),
      components: { CpisSearchBar },
      template: `
        <CpisSearchBar :search="search">
        </CpisSearchBar>
      `
    }
  },
  parameters: {
    search: {
      description: '搜索配置',
      control: 'array'
    }
  }
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
      },
      {
        prop: 'Q^SEX1_^SL',
        label: '异步select',
        type: 'select',
        enum: () => {
          return [
            { key: 'protocol', name: '拟稿' },
            { key: 'cancel', name: '作废' }
          ]
        },
        width: 50
      },
      {
        width: 200,
        prop: 'Q^date^SL',
        label: '日期',
        type: 'daterange'
      }
    ]
  },
  name: '配置搜索项'
}
