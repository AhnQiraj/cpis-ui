import CpisSearchBar from '../../../packages/cpis-ui/src/packages/search-bar/index'
import CpisButton from '../../../packages/cpis-ui/src/packages/button/index'
/**
 * ### 搜索栏参数模式
 *
 * #### 1.扁平化参数模式 (paramaterMode="flat")
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
 * #### 2.结构化参数模式 (paramaterMode="structured")
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
 * ### Search 配置项说明
 * search 配置支持以下字段:
 * ```
 * {
 *   prop: string | string[], // 字段名，当type为daterange并且paramaterMode是structured的时候，时可以传入数组对应开始和结束时间
 *   label: string,          // 标签文本
 *   type?: string,          // 输入框类型（默认input），支持:
 *                          // - select: 下拉选择框
 *                          // - date: 日期选择器
 *                          // - datetime: 日期时间选择器
 *                          // - daterange: 日期范围选择器
 *                          // - datetimerange: 日期时间范围选择器
 *                          // - multiple-select: 多选下拉选择框
 *   placeholder?: string,   // 输入框占位文本
 *   enum?: Array | Function,          // 枚举值
 *   valueKey?: string,     // 枚举值的value值
 *   labelKey?: string,     // 枚举值的label值
 *   defaultValue?: any,     // 默认值
 * }
 * ```
 *
 * ### CpisSearchBar Methods
  | 方法名      | 说明          | 参数      |
  |---------- |---------------- |---------- |
  | getParams  | 获取搜索参数 | — |
 *
 * ### ⚠️ 重要注意事项:
 * 1. `type="daterange"` 且 `paramaterMode="structured"` 时:
 *    - prop 可以传入数组，分别对应开始和结束时间
 * 2. `type="select"` 时:
 *    - enum 为必传项，否则下拉框将无选项
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
  decorators: [
    () => ({
      template: `
        <div style="
          height: 400px;
          position: relative;
          background-color: #fff;
          padding: 20px;
          overflow-y: auto;
          border: 1px solid #eee;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        ">
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
            label: '姓名'
          },
          {
            prop: 'isActive',
            label: '是否有效',
            type: 'checkbox'
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
            label: '日期区间',
            type: 'daterange'
          },
          {
            prop: 'date',
            label: '日期',
            type: 'date'
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
            label: '姓名'
          },
          {
            prop: 'isActive',
            label: '是否有效',
            type: 'checkbox'
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
            label: '日期区间',
            type: 'daterange'
          },
          {
            prop: 'date',
            label: '日期',
            type: 'date'
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
            label: '姓名'
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

export const DefaultValue = {
  name: 'DefaultValue',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar paramater-mode="flat" :search="search"/>
</template>

<script>
export default {
  data() {
    return {
      search: [
        {
          prop: 'name',
          label: '姓名',
          defaultValue: '张三'
        },
        {
          prop: 'status',
          label: '状态',
          type: 'select',
          enum: [
            { name: '启用', key: 1 },
            { name: '禁用', key: 0 }
          ],
          defaultValue: 1
        },
        {
          prop: 'createTime',
          label: '日期区间',
          type: 'daterange',
          defaultValue: ['2024-01-01', '2024-01-01']
        },
        {
          prop: 'date',
          label: '日期',
          type: 'date',
          defaultValue: '2024-01-01'
        }
      ]
    }
  }
}
</script>
`
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
            defaultValue: '张三'
          },
          {
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: [
              { name: '启用', key: 1 },
              { name: '禁用', key: 0 }
            ],
            defaultValue: 1
          },
          {
            prop: 'createTime',
            label: '日期区间',
            type: 'daterange',
            defaultValue: ['2024-01-01', '2024-01-01']
          },
          {
            prop: 'date',
            label: '日期',
            type: 'date',
            defaultValue: '2024-01-01'
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

export const GetParams = {
  name: 'GetParams',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar ref="searchBar" paramater-mode="flat" :search="search"/>
  <CpisButton class="mt-2" @click="getParams">获取搜索参数</CpisButton>
</template>

<script>
export default {
  data() {
    return {
      search: [
        {
          prop: 'name',
          label: '姓名',
          defaultValue: '张三'
        }
      ]
    },
    methods: {
      getParams() {
        const params = this.$refs.searchBar.getParams()
        alert('搜索参数:' + JSON.stringify(params))
      }
    }
  }
}
</script>
`
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar, CpisButton },
    data() {
      return {
        search: [
          {
            prop: 'name',
            label: '姓名',
            defaultValue: '张三'
          }
        ],
        searchParams: {}
      }
    },
    methods: {
      getParams() {
        const params = this.$refs.searchBar.getParams()
        alert('搜索参数:' + JSON.stringify(params))
      }
    },
    template: `
    <div>
      <CpisSearchBar ref="searchBar" :search="search" paramater-mode="flat"/>
      <CpisButton style="margin-top: 16px;" @click="getParams">获取搜索参数</CpisButton>
    </div>
  `
  })
}

export const Multiple = {
  name: '多选',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar paramater-mode="structured" :search="search"/>
</template>

<script>
export default {
  data() {
    return {
      dict: [
        status: {}
      ],
      search: [
        {
          prop: 'status',
          label: '状态', 
          type: 'multiple-select',
          enum: [
            { name: '启用', key: 1 },
            { name: '禁用', key: 0 }
          ]
        }
      ]
    }
  },
}
</script>
        `
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar },
    data() {
      return {
        search: [
          {
            prop: 'status',
            label: '状态',
            type: 'multiple-select',
            enum: [
              { name: '选项1', key: 1 },
              { name: '选项2', key: 2 },
              { name: '选项3', key: 3 },
              { name: '选项4', key: 4 },
              { name: '选项5', key: 5 }
            ]
          }
        ]
      }
    },
    template: `
      <div>
        <CpisSearchBar :search="search" paramater-mode="structured"/>
      </div>
    `
  })
}

export const AsyncEnum = {
  name: 'AsyncEnum',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar paramater-mode="structured" :search="search"/>
</template>

<script>
export default {
  data() {
    return {
      dict: [
        status: {}
      ],
      search: [
        {
          prop: 'status',
          label: '状态', 
          type: 'select',
          enum: () => this.dict.status
        }
      ]
    }
  },
  mounted() {
    // 这里模拟了一个3秒后返回的请求，在你那里就是实际的接口
    setTimeout(() => {
      this.dict.status = [
        { name: '启用', key: 1 },
        { name: '禁用', key: 0 }
      ]
    }, 3000)
  }
}
</script>
        `
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar },
    data() {
      return {
        search: [
          {
            prop: 'status',
            label: '状态',
            type: 'select',
            enum: () => this.dict?.status ?? []
          }
        ],
        dict: {
          status: []
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.dict.status = [
          { name: '启用', key: 1 },
          { name: '禁用', key: 0 }
        ]
      }, 2000)
    },
    template: `
      <div>
        <CpisSearchBar :search="search" paramater-mode="structured"/>
      </div>
    `
  })
}

export const DateRange = {
  name: '各种日期选择器',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar paramater-mode="structured" :search="search"/>
</template>

<script>
export default {
  data() {
    return {
      dict: [
        status: {}
      ],
      search: [
        {
          prop: 'date',
          label: 'date',
          type: 'daterange'
        },
        {
          prop: 'datetime',
          label: 'datetime',
          type: 'datetime'
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.dict.status = [
        { name: '启用', key: 1 },
        { name: '禁用', key: 0 }
      ]
    }, 2000)
  }
}
</script>
        `
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar },
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
    data() {
      return {
        searchParams: {},
        search: [
          {
            prop: 'date',
            label: '日期',
            type: 'date'
          },
          {
            prop: 'datetime',
            label: '日期时间',
            type: 'datetime'
          },
          {
            prop: 'month',
            label: '月份',
            type: 'month'
          },
          {
            prop: 'year',
            label: '年份',
            type: 'year'
          },
          {
            prop: 'daterange',
            label: '日期',
            type: 'daterange'
          },
          {
            prop: 'datetimerange',
            label: 'datetimerange',
            type: 'datetimerange'
          }
        ]
      }
    },
    template: `
      <div>
        <CpisSearchBar :search="search" paramater-mode="structured" @search="handleSearch" @reset="handleReset"/>
        <div style="margin-top: 16px;">
          <p>点击查询查看搜索参数:</p>
          <pre v-if="searchParams">{{ JSON.stringify(searchParams, null, 2) }}</pre>
        </div>
      </div>
    `
  })
}
export const AutoWidth = {
  name: '根据placeholder自动计算宽度',
  parameters: {
    docs: {
      source: {
        code: `
<template>
  <CpisSearchBar paramater-mode="structured" :search="search"/>
</template>

<script>
export default {
  data() {
    return {
      dict: [
        status: {}
      ],
      search: [
        {
          prop: 'status',
          label: '状态', 
          type: 'select',
          enum: () => this.dict
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.dict.status = [
        { name: '启用', key: 1 },
        { name: '禁用', key: 0 }
      ]
    }, 2000)
  }
}
</script>
        `
      }
    }
  },
  render: () => ({
    components: { CpisSearchBar },
    data() {
      return {
        search: [
          {
            prop: 'status',
            label: '状态',
            placeholder: '请输入状态'
          },
          {
            prop: 'name',
            label: '姓名',
            placeholder: '请输入姓名请输入姓名'
          },
          {
            prop: 'location1',
            label: '位置1',
            placeholder: '请输入详细的位置'
          },
          {
            prop: 'location2',
            label: '位置2',
            placeholder: '请输入详细的位置'
          },
          {
            prop: 'location3',
            label: '位置3',
            placeholder: '请输入详细的位置'
          },
          {
            prop: 'location4',
            label: '位置4',
            placeholder: '请输入详细的位置'
          },
          {
            prop: 'location5',
            label: '位置5',
            placeholder: '请输入详细的位置'
          },
          {
            prop: 'location6',
            label: '位置6',
            placeholder: '请输入详细的位置'
          }
        ]
      }
    },
    template: `
      <div>
        <CpisSearchBar :search="search" paramater-mode="structured"/>
      </div>
    `
  })
}
