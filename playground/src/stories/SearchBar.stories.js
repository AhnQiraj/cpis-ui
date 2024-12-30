import CpisSearchBar from '../../../packages/cpis-ui/src/packages/search-bar/index'

/**
 * SearchBar 组件支持两种参数模式:
 *
 * ## 1.扁平化参数模式 (paramaterMode="flat")
 *    - 直接使用字段名作为参数名
 *    - 示例输出:
 * ```
 *      {
 *        "name": "张三",
 *        "startDate": "2024-03-20",
 *        "endDate": "2024-03-21"
 *      }
 * ```
 *
 * ## 2.结构化参数模式 (paramaterMode="structured")
 *    - 使用特定格式的参数名: Q^字段名^操作符
 *    - 示例输出:
 * ```
 *      [
 *        {
 *          "key": "Q^NAME_^SL",
 *          "value": "张三"
 *        },
 *        {
 *          "key": "Q^CREATE_TIME_^DL",
 *          "value": "2024-03-21"
 *        },
 *        {
 *          "key": "Q^CREATE_TIME_^DG",
 *          "value": "2024-03-20"
 *        }
 *      ]
 * ```
 */

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/搜索栏',
  component: CpisSearchBar,
  tags: ['autodocs'],
  argTypes: {
    search: {
      description: '搜索栏配置，支持布尔和数组',
      control: 'array'
    },
    paramaterMode: {
      description: '参数模式, flat扁平化参数模式， structured结构化参数模式',
      control: 'select',
      options: ['flat', 'structured']
    }
  },
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
  }
}

export const FlatSearch = {
  name: '配置搜索项-扁平化',
  parameters: {
    docs: {
      source: {
        code: `<CpisSearchBar paramater-mode="flat" :search="[
          {
            prop: 'name',
            label: '姓名',
            placeholder: '请输入姓名'
          },
          {
            prop: 'createTime',
            label: '日期',
            type: 'daterange'
          }
        ]"/>`
      }
    }
  },
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
        searchParams: {}
      }
    },
    methods: {
      handleSearch(params) {
        this.searchParams = JSON.parse(JSON.stringify(params))
        console.log('搜索参数:', params)
      },
      handleReset() {
        this.searchParams = null
        console.log('重置搜索')
      }
    },
    template: `
      <div>
        <CpisSearchBar @search="handleSearch" @reset="handleReset" :search="search" paramater-mode="flat"/>
        <div style="margin-top: 16px;">
          <p>点击查询查看搜索参数:</p>
          <pre v-if="searchParams">{{ JSON.stringify(searchParams, null, 2) }}</pre>
        </div>
      </div>
    `
  })
}

export const StructuredSearch = {
  name: '配置搜索项-结构化',
  parameters: {
    docs: {
      source: {
        code: `<CpisSearchBar paramater-mode="structured" :search="[
          {
            prop: 'Q^NAME_^SL',
            label: '姓名',
            placeholder: '请输入姓名'
          },
          {
            prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
            label: '日期',
            type: 'daterange'
          }
        ]"/>`
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar },
    data() {
      return {
        search: [
          {
            prop: 'Q^NAME_^SL',
            label: '姓名',
            placeholder: '请输入姓名'
          },
          {
            prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
            label: '日期',
            type: 'daterange'
          }
        ],
        searchParams: {}
      }
    },
    methods: {
      handleSearch(params) {
        this.searchParams = JSON.parse(JSON.stringify(params))
        console.log('搜索参数===>', params)
      },
      handleReset() {
        this.searchParams = null
        console.log('重置搜索===>')
      }
    },
    template: `
      <div>
        <CpisSearchBar @search="handleSearch" @reset="handleReset" :search="search" paramater-mode="structured"/>
        <div style="margin-top: 16px;">
          <p>点击查询查看搜索参数:</p>
          <pre v-if="searchParams">{{ JSON.stringify(searchParams, null, 2) }}</pre>
        </div>
      </div>
    `
  })
}
