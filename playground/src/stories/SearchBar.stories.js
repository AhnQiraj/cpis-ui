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
        <CpisSearchBar 
          :search="search"
          @search="handleSearch"
          @reset="handleReset"
        >
        </CpisSearchBar>
      `,
      methods: {
        handleSearch(params) {
          console.log('搜索参数:', params)
        },
        handleReset() {
          console.log('重置搜索')
        }
      }
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
      autodocs: false,
      description: {
        story: '搜索栏组件，支持文本输入、下拉选择、日期范围等搜索类型'
      }
    },
    controls: {
      include: ['search']
    },
    actions: {
      handles: ['search', 'reset']
    }
  },
  argTypes: {
    search: {
      description: '搜索栏配置，支持布尔和数组',
      control: 'array'
    }
  },
  play: async ({ args, canvasElement, step }) => {
    // 这里可以添加交互测试
    console.log('Story loaded with args:', args)
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

export const WithEvents = {
  name: '查询参数',
  render: () => ({
    components: { CpisSearchBar },
    data() {
      return {
        search: [
          {
            prop: 'name',
            label: '姓名',
            placeholder: '请输入姓名'
          },
          {
            prop: 'date',
            label: '日期',
            type: 'daterange'
          }
        ],
        searchParams: null
      }
    },
    template: `
      <div>
        <CpisSearchBar 
          :search="search"
          @search="handleSearch"
          @reset="handleReset"
        />
        <div style="margin-top: 16px;">
          <p>点击查询查看搜索参数:</p>
          <pre v-if="searchParams">{{ JSON.stringify(searchParams, null, 2) }}</pre>
        </div>
      </div>
    `,
    methods: {
      handleSearch(params) {
        this.searchParams = params
        console.log('搜索参数:', params)
      },
      handleReset() {
        this.searchParams = null
        console.log('重置搜索')
      }
    }
  }),
  parameters: {
    docs: {
      description: {
        story: '展示搜索栏的事件处理，包括搜索和重置事件'
      }
    }
  }
}
