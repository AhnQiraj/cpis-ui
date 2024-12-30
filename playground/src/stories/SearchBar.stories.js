import CpisSearchBar from '../../../packages/cpis-ui/src/packages/search-bar/index'

/**
 * ## 搜索栏参数模式
 *
 * ### 1.扁平化参数模式 (paramaterMode="flat")
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
 * ### 2.结构化参数模式 (paramaterMode="structured")
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
 *
 * ## Search 配置项说明
 * search 配置支持以下字段:
 * ```
 * {
 *   prop: string | string[], // 字段名，当type为daterange并且paramaterMode是structured的时候，时可以传入数组对应开始和结束时间
 *   label: string,          // 标签文本
 *   type?: string,          // 输入框类型（默认input），支持:
 *                          // - select: 下拉选择框
 *                          // - date: 日期选择器
 *                          // - daterange: 日期范围选择器
 *   placeholder?: string,   // 输入框占位文本
 *   enum?: Array,          // 枚举值
 *   valueKey?: string,     // 枚举值的value值
 *   labelKey?: string,     // 枚举值的label值
 * }
 * ```
 *
 * ### 注意:
 * 1. 当type为daterange并且paramaterMode是structured的时可以传入数组对应开始和结束时间
 * 2. 当type为select的时候，enum是必传的
 *
 * ### 示例:
 * ```javascript
 * search: [
 *   {
 *     prop: 'name',
 *     label: '姓名',
 *     placeholder: '请输入姓名'
 *   },
 *   {
 *     prop: 'status',
 *     label: '状态',
 *     type: 'select',
 *     enum: [
 *       { name: '启用', key: 1 },
 *       { name: '禁用', key: 0 }
 *     ]
 *   },
 *  {
 *     prop: 'status',
 *     label: '状态',
 *     type: 'select',
 *     enum: [
 *       { label: '启用', value: 1 },
 *       { label: '禁用', value: 0 }
 *     ],
 *     valueKey: 'value',
 *     labelKey: 'label'
 *   },
 *   {
 *     prop: ['startTime', 'endTime'],
 *     label: '创建时间',
 *     type: 'daterange'
 *   }
 * ]
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
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: [
              { name: '启用', key: 1 },
              { name: '禁用', key: 0 }
            ]
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
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: [
              { name: '启用', key: 1 },
              { name: '禁用', key: 0 }
            ]
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
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: [
              { name: '启用', key: 1 },
              { name: '禁用', key: 0 }
            ]
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
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: [
              { name: '启用', key: 1 },
              { name: '禁用', key: 0 }
            ]
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
