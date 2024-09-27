<template>
  <Story title="级联选择器（Cascader）">
    <Variant
      title="单选inline（推荐）"
      :init-state="initState"
    >
      <cpis-pro-cascader
        v-model="singleInlineKeys"
        :options="state.options"
        :props="{
          label: 'name',
          value: 'id',
          children: 'childPartyEntityTrees',
          multiple: false
        }"
        :placeholder="state.placeholder"
        mode="inline"
      />
      <br />
      <div>当前选中的值：{{ singleInlineKeys }}</div>
    </Variant>
    <Variant title="多选弹出框（推荐）">
      <cpis-pro-cascader
        v-model="multipleDialogKeys"
        :options="state.options"
        :model-props="{
          title: '请选择部门',
          okText: '确定',
          cancelText: '取消'
        }"
        :props="{
          label: 'name',
          value: 'id',
          children: 'childPartyEntityTrees',
          multiple: true
        }"
        mode="dialog"
      />
      <br />
      <div>当前选中的值：{{ multipleDialogKeys }}</div>
    </Variant>
    <Variant title="多选inline">
      <cpis-pro-cascader
        v-model="multipleInlineKeys"
        :options="state.options"
        :props="{
          label: 'name',
          value: 'id',
          children: 'childPartyEntityTrees',
          multiple: true
        }"
        mode="inline"
      />

      <br />
      <div>当前选中的值：{{ multipleInlineKeys }}</div>
    </Variant>
    <Variant title="单选弹出框">
      <cpis-pro-cascader
        v-model="singleDialogKeys"
        :options="state.options"
        :props="{
          label: 'name',
          value: 'id',
          children: 'childPartyEntityTrees',
          multiple: false
        }"
        mode="dialog"
      />

      <br />
      <div>当前选中的值：{{ singleDialogKeys }}</div>
    </Variant>
  </Story>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css'
import CpisProCascader from '@cpis/cpis-ui'

export default {
  components: {
    CpisProCascader
  },
  data() {
    return {
      singleDialogKeys: null,
      singleInlineKeys: null,
      multipleDialogKeys: null,
      multipleInlineKeys: null,
      state: {
        placeholder: '',
        options: [
          {
            name: '测试有限责任公司',
            id: '1',
            childPartyEntityTrees: [
              {
                name: '公司领导层',
                id: '2',
                title: '公司领导层'
              },
              {
                name: '总经理办公室',
                id: '3',
                childPartyEntityTrees: [
                  {
                    name: '车队',
                    id: '4',
                    title: '车队',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '信息中心',
                    id: '5',
                    title: '信息中心',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '党群工作部',
                id: '6',
                title: '党群工作部',
                childPartyEntityTrees: []
              },
              {
                name: '人力资源部',
                id: '7',
                title: '人力资源部',
                childPartyEntityTrees: []
              },
              {
                name: '财务部',
                id: '8',
                childPartyEntityTrees: []
              },
              {
                name: '纪检审计法务部',
                id: '9',
                childPartyEntityTrees: []
              },
              {
                name: '计划经营部',
                id: '10',
                childPartyEntityTrees: []
              },
              {
                name: '营销部',
                id: '11',
                childPartyEntityTrees: [
                  {
                    name: '煤灰管理组',
                    id: '12',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '安全生产部',
                id: '13',
                childPartyEntityTrees: []
              },
              {
                name: '扩建工程部',
                id: '14',
                childPartyEntityTrees: [
                  {
                    name: '工程部',
                    id: '15',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '安监部',
                    id: '16',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '技经部',
                    id: '17',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '办公室（扩建）',
                    id: '18',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '燃料物资供应部',
                id: '19',
                childPartyEntityTrees: [
                  {
                    name: '燃料公司',
                    id: '20',
                    title: '燃料公司',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '物资组',
                    id: '21',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '业务组',
                    id: '22',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '综合组',
                    id: '23',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '仓库班',
                    id: '24',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '发电部',
                id: '25',
                childPartyEntityTrees: [
                  {
                    name: '值长组',
                    id: '26',
                    childPartyEntityTrees: [
                      {
                        name: '值长',
                        id: '27',

                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行甲值',
                        id: '28',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行乙值',
                        id: '29',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行丙值',
                        id: '30',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行丁值',
                        id: '31',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行戊值',
                        id: '32',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '集控运行',
                    id: '33',
                    childPartyEntityTrees: [
                      {
                        name: '集控运行甲班',
                        id: '34',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行乙班',
                        id: '35',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行丙班',
                        id: '36',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行丁班',
                        id: '37',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行戊班',
                        id: '38',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '集控运行（百万）',
                    id: '39',
                    childPartyEntityTrees: [
                      {
                        name: '百万一班',
                        id: '40',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万二班',
                        id: '41',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万三班',
                        id: '42',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万四班',
                        id: '43',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万五班',
                        id: '44',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '硫化运行',
                    id: '45',
                    childPartyEntityTrees: [
                      {
                        name: '硫化运行甲班',
                        id: '46',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行乙班',
                        id: '47',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行丙班',
                        id: '48',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行丁班',
                        id: '49',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行戊班',
                        id: '50',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '硫化运行（百万）',
                    id: '51',
                    childPartyEntityTrees: [
                      {
                        name: '百万硫化一班',
                        id: '52',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化二班',
                        id: '53',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化三班',
                        id: '54',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化四班',
                        id: '55',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化五班',
                        id: '56',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '化常班',
                    id: '57',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '检修部',
                id: '58',
                childPartyEntityTrees: [
                  {
                    name: '电气高压班',
                    id: '59',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '电气低压班',
                    id: '60',

                    childPartyEntityTrees: []
                  },
                  {
                    name: '电气保护班',
                    id: '61',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '汽机化学班',
                    id: '62',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '锅炉专业班',
                    id: '63',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '硫灰班',
                    id: '64',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '综合班',
                    id: '65',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '热工机控班',
                    id: '66',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '热工炉控班',
                    id: '67',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '燃料部',
                id: '68',

                childPartyEntityTrees: [
                  {
                    name: '燃料部电气班',
                    id: '69',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '燃料部机务班',
                    id: '70',
                    childPartyEntityTrees: [
                      {
                        name: '机务班工程机械组',
                        id: '71',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '燃运',
                    id: '72',
                    childPartyEntityTrees: [
                      {
                        name: '燃运甲班',
                        id: '73',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运乙班',
                        id: '74',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运丙班',
                        id: '75',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运丁班',
                        id: '76',

                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运戊班',
                        id: '77',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运卸煤班',
                        id: '78',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运调度采制班',
                        id: '79',
                        childPartyEntityTrees: []
                      }
                    ]
                  }
                ]
              },
              {
                name: '后勤管理部',

                id: '80',

                childPartyEntityTrees: [
                  {
                    id: '81',
                    name: '武装保卫组',

                    childPartyEntityTrees: []
                  },
                  {
                    name: '后勤管理组',
                    id: '82',
                    childPartyEntityTrees: [
                      {
                        name: '小区',
                        id: '83',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '医务室',
                        id: '84',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '水电班',
                        id: '85',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '服务班',
                        id: '86',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '炊事班',
                        id: '87',
                        childPartyEntityTrees: []
                      }
                    ]
                  }
                ]
              },
              {
                name: '其他1',
                id: '88',
                childPartyEntityTrees: []
              },
              {
                name: '其他2',
                id: '89',
                childPartyEntityTrees: []
              },
              {
                name: '外委单位',
                id: '90',
                childPartyEntityTrees: [
                  {
                    name: '宁波富仕达电力工程有限责任公司',
                    id: '91',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '丰宇电力环保（南通）有限公司',
                    id: '92',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '扬州电力设备修造厂有限公司',
                    id: '93',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '南京杰思尔环保智能科技有限公司',
                    id: '94',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '盐城生物质',
                    id: '95',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '江苏新海电力工程有限公司',
                    id: '96',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '南通苏源天电检修安装工程有限公司',
                    id: '97',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '上海电力建设有限责任公司',
                    id: '98',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '江苏普雷信息技术有限公司',
                    id: '99',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '钟星建设集团有限公司',

                    id: '100',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '湖南火电建设有限公司',
                    id: '101',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '中石化工建设有限公司',
                    id: '102',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '项目组',
                id: '103',
                childPartyEntityTrees: []
              },
              {
                name: '沿海能投',
                id: '104',
                childPartyEntityTrees: []
              }
            ]
          },
          {
            name: '测试',
            id: '105',
            childPartyEntityTrees: []
          }
        ]
      }
    }
  },
  methods: {
    initState() {
      return {
        options: [
          {
            name: '测试有限责任公司',
            id: '1',
            childPartyEntityTrees: [
              {
                name: '公司领导层',
                id: '2',
                title: '公司领导层'
              },
              {
                name: '总经理办公室',
                id: '3',
                childPartyEntityTrees: [
                  {
                    name: '车队',
                    id: '4',
                    title: '车队',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '信息中心',
                    id: '5',
                    title: '信息中心',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '党群工作部',
                id: '6',
                title: '党群工作部',
                childPartyEntityTrees: []
              },
              {
                name: '人力资源部',
                id: '7',
                title: '人力资源部',
                childPartyEntityTrees: []
              },
              {
                name: '财务部',
                id: '8',
                childPartyEntityTrees: []
              },
              {
                name: '纪检审计法务部',
                id: '9',
                childPartyEntityTrees: []
              },
              {
                name: '计划经营部',
                id: '10',
                childPartyEntityTrees: []
              },
              {
                name: '营销部',
                id: '11',
                childPartyEntityTrees: [
                  {
                    name: '煤灰管理组',
                    id: '12',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '安全生产部',
                id: '13',
                childPartyEntityTrees: []
              },
              {
                name: '扩建工程部',
                id: '14',
                childPartyEntityTrees: [
                  {
                    name: '工程部',
                    id: '15',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '安监部',
                    id: '16',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '技经部',
                    id: '17',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '办公室（扩建）',
                    id: '18',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '燃料物资供应部',
                id: '19',
                childPartyEntityTrees: [
                  {
                    name: '燃料公司',
                    id: '20',
                    title: '燃料公司',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '物资组',
                    id: '21',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '业务组',
                    id: '22',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '综合组',
                    id: '23',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '仓库班',
                    id: '24',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '发电部',
                id: '25',
                childPartyEntityTrees: [
                  {
                    name: '值长组',
                    id: '26',
                    childPartyEntityTrees: [
                      {
                        name: '值长',
                        id: '27',

                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行甲值',
                        id: '28',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行乙值',
                        id: '29',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行丙值',
                        id: '30',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行丁值',
                        id: '31',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '运行戊值',
                        id: '32',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '集控运行',
                    id: '33',
                    childPartyEntityTrees: [
                      {
                        name: '集控运行甲班',
                        id: '34',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行乙班',
                        id: '35',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行丙班',
                        id: '36',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行丁班',
                        id: '37',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '集控运行戊班',
                        id: '38',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '集控运行（百万）',
                    id: '39',
                    childPartyEntityTrees: [
                      {
                        name: '百万一班',
                        id: '40',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万二班',
                        id: '41',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万三班',
                        id: '42',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万四班',
                        id: '43',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万五班',
                        id: '44',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '硫化运行',
                    id: '45',
                    childPartyEntityTrees: [
                      {
                        name: '硫化运行甲班',
                        id: '46',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行乙班',
                        id: '47',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行丙班',
                        id: '48',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行丁班',
                        id: '49',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '硫化运行戊班',
                        id: '50',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '硫化运行（百万）',
                    id: '51',
                    childPartyEntityTrees: [
                      {
                        name: '百万硫化一班',
                        id: '52',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化二班',
                        id: '53',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化三班',
                        id: '54',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化四班',
                        id: '55',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '百万硫化五班',
                        id: '56',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '化常班',
                    id: '57',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '检修部',
                id: '58',
                childPartyEntityTrees: [
                  {
                    name: '电气高压班',
                    id: '59',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '电气低压班',
                    id: '60',

                    childPartyEntityTrees: []
                  },
                  {
                    name: '电气保护班',
                    id: '61',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '汽机化学班',
                    id: '62',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '锅炉专业班',
                    id: '63',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '硫灰班',
                    id: '64',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '综合班',
                    id: '65',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '热工机控班',
                    id: '66',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '热工炉控班',
                    id: '67',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '燃料部',
                id: '68',

                childPartyEntityTrees: [
                  {
                    name: '燃料部电气班',
                    id: '69',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '燃料部机务班',
                    id: '70',
                    childPartyEntityTrees: [
                      {
                        name: '机务班工程机械组',
                        id: '71',
                        childPartyEntityTrees: []
                      }
                    ]
                  },
                  {
                    name: '燃运',
                    id: '72',
                    childPartyEntityTrees: [
                      {
                        name: '燃运甲班',
                        id: '73',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运乙班',
                        id: '74',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运丙班',
                        id: '75',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运丁班',
                        id: '76',

                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运戊班',
                        id: '77',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运卸煤班',
                        id: '78',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '燃运调度采制班',
                        id: '79',
                        childPartyEntityTrees: []
                      }
                    ]
                  }
                ]
              },
              {
                name: '后勤管理部',

                id: '80',

                childPartyEntityTrees: [
                  {
                    id: '81',
                    name: '武装保卫组',

                    childPartyEntityTrees: []
                  },
                  {
                    name: '后勤管理组',
                    id: '82',
                    childPartyEntityTrees: [
                      {
                        name: '小区',
                        id: '83',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '医务室',
                        id: '84',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '水电班',
                        id: '85',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '服务班',
                        id: '86',
                        childPartyEntityTrees: []
                      },
                      {
                        name: '炊事班',
                        id: '87',
                        childPartyEntityTrees: []
                      }
                    ]
                  }
                ]
              },
              {
                name: '其他1',
                id: '88',
                childPartyEntityTrees: []
              },
              {
                name: '其他2',
                id: '89',
                childPartyEntityTrees: []
              },
              {
                name: '外委单位',
                id: '90',
                childPartyEntityTrees: [
                  {
                    name: '宁波富仕达电力工程有限责任公司',
                    id: '91',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '丰宇电力环保（南通）有限公司',
                    id: '92',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '扬州电力设备修造厂有限公司',
                    id: '93',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '南京杰思尔环保智能科技有限公司',
                    id: '94',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '盐城生物质',
                    id: '95',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '江苏新海电力工程有限公司',
                    id: '96',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '南通苏源天电检修安装工程有限公司',
                    id: '97',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '上海电力建设有限责任公司',
                    id: '98',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '江苏普雷信息技术有限公司',
                    id: '99',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '钟星建设集团有限公司',

                    id: '100',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '湖南火电建设有限公司',
                    id: '101',
                    childPartyEntityTrees: []
                  },
                  {
                    name: '中石化工建设有限公司',
                    id: '102',
                    childPartyEntityTrees: []
                  }
                ]
              },
              {
                name: '项目组',
                id: '103',
                childPartyEntityTrees: []
              },
              {
                name: '沿海能投',
                id: '104',
                childPartyEntityTrees: []
              }
            ]
          },
          {
            name: '测试',
            id: '105',
            childPartyEntityTrees: []
          }
        ],
        placeholder: '请选择'
      }
    }
  }
}
</script>

<docs lang="md">
# 级联选择器（Pro Cascader）

## 说明

主要用于部门组织选择，支持多选和单选，支持弹出框和内联两种模式。
特点：支持只选某一级，
建议：多选时候采用弹出框模式，单选时候采用内联模式；
原则上组件库不应该耦合业务，所以数据需从外部传入，具体接口 查看 swagger /ibps/extend/v3/org/findAllExtend 接口，使用时候注意做好权限控制。

## 组件参数

| 参数          | 说明                               | 类型   | 可选值 | 默认值 |
| ------------- | ---------------------------------- | ------ | ------ | ------ |
| options       | 数据                               | Array  | -      | -      |
| dialogProps   | 弹出框参数-见下面 dialogProps 部分 | Object | -      | -      |
| cascaderProps | 级联参数-见下面 cascaderProps 部分 | Object | -      | -      |
| props         | 配置选项-见下面 Props 部分         | Object | -      | -      |

## DialogProps

| 参数        | 说明                   | 类型    | 可选值      | 默认值 |
| ----------- | ---------------------- | ------- | ----------- | ------ |
| okText      | 弹出框确认按钮文字     | String  | -           | 确认   |
| okCancel    | 弹窗框取消按钮文字     | String  | -           | 取消   |
| placeholder | 弹窗框搜索占位文字     | String  | -           | 取消   |
| title       | 弹窗框标题             | String  | -           | 请选择 |
| center      | 标题和底部按钮是否居中 | Boolean | true，false | false  |
| width       | 弹出框的宽度           | String  | -           | 30%    |

## CascaderProps

| 参数        | 说明         | 类型    | 可选值 | 默认值 |
| ----------- | ------------ | ------- | ------ | ------ |
| placeholder | 级联占位文字 | string  | -      | 请选择 |
| clearable   | 是否支持清空 | Boolean | -      | true   |

## Props

| 参数     | 说明                                 | 类型    | 可选值         | 默认值   |
| -------- | ------------------------------------ | ------- | -------------- | -------- |
| children | children 的 key                      | String  | -              | children |
| label    | label 的 key                         | String  | -              | label    |
| value    | value 的 key                         | String  | -              | value    |
| mode     | 模式 dialog 为弹出框， inline 为级联 | String  | dialog，inline | -        |
| multiple | 是否多选                             | Boolean | true，false    | false    |
</docs>
