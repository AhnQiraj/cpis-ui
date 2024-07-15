/**
 * 默认值
 */
export const defaultValueTypeOptions = [{
  value: 'statistics',
  label: '总数统计'
}, {
  value: 'fixed',
  label: '固定值'
}, {
  value: 'today',
  label: '填写当前时间'
}, {
  value: 'present',
  label: '预设值'
},
{
  value: 'cascade',
  label: '级联配置'
},
{
  value: 'javascript',
  label: 'javascript脚本'
},
{
  value: 'dynamic',
  label: '动态脚本'
},
{
  value: 'linkage',
  label: '联动数据'
},
{
  value: 'formula',
  label: '公式编辑'
}
]
/**
 * 默认值
 */
export const cascadeTypeOptions = [{
  value: 'fixed',
  label: 'URL地址'
},
{
  value: 'form',
  label: '在线表单'
},
{
  value: 'detail',
  label: '详情表单'
},
// {
//   value: 'combination',
//   label: '组合表单'
// },
{
  value: 'dataTemplate',
  label: '数据模板'
}
]
export const formTypeMap = {
  form: '表单',
  detail: '详情表单',
  combination: '组合表单',
  dataTemplate: '数据模板'
}
export const combinationFormTypeMap = {
  onlineForm: '在线表单',
  detailForm: '详情表单',
  combinationForm: '组合表单',
  dataTemplate: '数据模板'
}
export const numberFormatOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'integer',
  label: '整型'
}, {
  value: 'number',
  label: '数字'
}, {
  value: 'currency',
  label: '货币'
}]
export const selectorScopeOption = [
  {
    value: '1',
    label: '全部'
  },
  {
    value: '2',
    label: '所在范围'
  },
  {
    value: '3',
    label: '指定范围'
  },
  {
    value: 'script',
    label: '脚本'
  }]
/**
 * 日期格式
 */
export const datefmtTypeOptions = [
  {
    value: 'date',
    label: '日期(yyyy-MM-dd)'
  }, {
    value: 'datetime',
    label: '日期时间(yyyy-MM-dd HH:mm:ss)'
  },
  {
    value: 'time',
    label: '时间(HH:mm:ss)'
  }, {
    value: 'custom',
    label: '自定义'
  }
]
/**
 * 日期范围
 */
export const dateScopeOptions = [{
  text: '最近一周',
  value: 'recentlyOnceWeek',
  script: `const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  return [start, end]`
}, {
  text: '最近一个月',
  value: 'recentlyOnceMonth',
  script: `
    const end = new Date()
    const start = new Date()
    var day,year = start.getFullYear()
    day = new Date(year,start.getMonth(),0).getDate() 
    start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
    return [start, end]
  `
}, {
  text: '最近三个月',
  value: 'recentlyThirdMonth',
  script: `
    const end = new Date()
    const start = new Date()
    var day,days = 0,year = start.getFullYear()
    for(let i = 0;i<3;i++){
      day = new Date(year,start.getMonth()-i,0).getDate()
      days += day
    }  
    start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
    return [start, end]
  `
}]
/**
 * 时间格式
 */
export const timefmtTypeOptions = [
  {
    value: 'time',
    label: '时间(HH:mm:ss)'
  }, {
    value: 'custom',
    label: '自定义'
  }
]
/**
 * 流程范围
 */
export const bpmDefScopeOptions = [
  {
    value: 'all',
    label: '全部'
  }, {
    value: 'spec',
    label: '指定范围'
  },
  {
    value: 'script',
    label: '脚本'
  }
]
/**
 * 发起人范围
 */
export const starterScopeOptions = [
  {
    value: 'current',
    label: '当前用户'
  }, {
    value: 'spec',
    label: '指定范围'
  },
  {
    value: 'all',
    label: '全部'
  }
]
/**
 * 关系类型
 */
export const bpmLinkTypeOptions = [
  {
    value: 'current',
    label: '当前流程'
  }, {
    value: 'postposition',
    label: '后置流程'
  }
]
/**
 * 存储格式
 */
export const scriptOptions = [
  {
    value: 'json',
    label: 'JSON'
  }
]
/**
 * 文件类型
 */
export const fileTypeOptions = [{
  value: 'images',
  label: '图片类'
}, {
  value: 'videos',
  label: '视频类'
},
{
  value: 'audios',
  label: '音频类'
}, {
  value: 'docs',
  label: '文档类'
}, {
  value: 'compress',
  label: '压缩包'
}, {
  value: 'custom',
  label: '自定义'
}
]
/**
 * 图片类型
 */
export const imageTypeOptions = [{
  value: '.jpeg',
  label: 'jpeg'
},
{
  value: '.png',
  label: 'png'
},
{
  value: '.bmp',
  label: 'bmp'
},
{
  value: '.gif',
  label: 'gif'
},
{
  value: '.jpg',
  label: 'jpg'
},
{
  value: '.tiff',
  label: 'tiff'
}
]
/**
 * 上传方式
 */
export const uploadTypeOptions = [{
  value: 'default',
  label: '直接上传'
},
{
  value: 'attachment',
  label: '附件上传'
}
]
/**
 * 文件存储格式
 */
export const fileStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}
// , {
//   value: 'path',
//   label: '仅存路径'
// }
]
/**
 * 选择器类型
 */
export const selectorTypeOptions = [{
  value: 'user',
  label: '用户'
},
{
  value: 'org',
  label: '组织'
},
{
  value: 'position',
  label: '岗位'
},
{
  value: 'role',
  label: '角色'
}
]
/**
 * 颜色选项
 */
export const colorOptions = [
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' }
]
/**
 * 标签颜色选项
 */
export const tagTypeOptions = [
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
  { value: 'custom', label: '自定义' }
]
/**
 * 按钮颜色选项
 */
export const buttonTypeOptions = [
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
  { value: 'custom', label: '自定义' }
]
/**
 * 警告颜色选项
 */
export const alertTypeOptions = [
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'error', label: '错误' }
]
export const queryConditionOptions = {
  combination: [{
    value: 'include',
    label: '包含以下内容'
  }, {
    value: 'unInclude',
    label: '不包含以下内容'
  }],
  // 字符串
  varchar: [
    {
      value: 'equal',
      label: '等于',
      suffix: 'S'
    },
    {
      value: 'not_equal',
      label: '不等于',
      suffix: 'NE'
    },
    {
      value: 'include',
      label: '包含以下内容',
      suffix: 'SL'
    },
    {
      value: 'unInclude',
      label: '不包含以下内容',
      suffix: 'SLN'
    },
    {
      value: 'begin',
      label: '以...开始',
      suffix: 'SLR'
    },
    {
      value: 'no_begin',
      label: '不以...开始',
      suffix: 'SLRN'
    },
    {
      value: 'in',
      label: '在...之内',
      suffix: 'SIN'
    },
    {
      value: 'not_in',
      label: '不在...之内',
      suffix: 'SNIN'
    }
    // {
    //   value: 'is_empty',
    //   label: '为空',
    //   suffix: 'SIE'
    // },
    // {
    //   value: 'is_not_empty',
    //   label: '不为空',
    //   suffix: 'SNE'
    // },
    // {
    //   value: 'is_null',
    //   label: '为null',
    //   suffix: 'ISN'
    // },
    // {
    //   value: 'is_not_null',
    //   label: '不为null',
    //   suffix: 'ISNN'
    // }
  ],
  // 日期
  date: [
    {
      value: 'equal',
      label: '等于',
      suffix: 'D'
    },
    {
      value: 'not_equal',
      label: '不等于',
      suffix: 'DN'
    },
    {
      value: 'less',
      label: '小于',
      suffix: 'DGT'
    },
    {
      value: 'less_or_equal',
      label: '小于或等于',
      suffix: 'DG'
    },
    {
      value: 'between',
      label: '在...之间',
      suffix: ['DL', 'DG']
    },
    {
      value: 'no_between',
      label: '不在...之间',
      suffix: ['DG', 'DL']
    },
    {
      value: 'greater',
      label: '大于',
      suffix: 'DLS'
    },
    {
      value: 'greater_or_equal',
      label: '大于或等于',
      suffix: 'DL'
    }
    // {
    //   value: 'is_null',
    //   label: '为null',
    //   suffix: 'ISN'
    // },
    // {
    //   value: 'is_not_null',
    //   label: '不为null',
    //   suffix: 'ISNN'
    // }
  ],
  // 数字
  number: [
    {
      value: 'equal',
      label: '等于',
      suffix: 'DB'
    },
    {
      value: 'not_equal',
      label: '不等于',
      suffix: 'DBN'
    },
    {
      value: 'less',
      label: '小于',
      suffix: 'DBGT'
    },
    {
      value: 'less_or_equal',
      label: '小于或等于',
      suffix: 'DBG'
    },
    {
      value: 'between',
      label: '在...之间',
      suffix: ['DBL', 'DBG']
    },
    {
      value: 'no_between',
      label: '不在...之间',
      suffix: ['DBG', 'DBL']
    },
    {
      value: 'greater',
      label: '大于',
      suffix: 'DBLS'
    },
    {
      value: 'greater_or_equal',
      label: '大于或等于',
      suffix: 'DBL'
    }
    // {
    //   value: 'is_null',
    //   label: '为null',
    //   suffix: 'ISN'
    // },
    // {
    //   value: 'is_not_null',
    //   label: '不为为null',
    //   suffix: 'ISNN'
    // }
  ]
}
/**
 * 选择器存储格式
 */
export const selectorStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}, {
  value: 'bind',
  label: '绑定标识'
}]
/**
 * 选择器存储格式-需要存储的值[用户]
 */
export const bindValueEmployeeOptions = [{
  value: 'id',
  label: '主键(id)'
}, {
  value: 'account',
  label: '帐号(account)'
}]
/**
 * 选择器存储格式-需要存储的值[角色]
 */
export const bindValueOtherOptions = [{
  value: 'id',
  label: '主键(ID)'
}, {
  value: 'alias',
  label: '别名(alias)'
}]
export const dialogStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}]
/**
 * 区域
 */
export const areaOptions = [{
  value: 'country',
  label: '国家'
},
{
  value: 'province',
  label: '省/自治区/直辖市'
},
{
  value: 'city',
  label: '市'
},
{
  value: 'district',
  label: '区/县'
}
]
/**
 * 默认工具栏
 */
export const defaultToolbars = [
  'source', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'pasteplain', '|',
  'forecolor', 'backcolor', 'selectall', 'cleardoc', 'fontfamily', 'fontsize'
]
/**
     * 日期格式
     */
export const dateTypes = [{
  value: 'specific',
  label: '特定日期'
},
{
  value: 'form',
  label: '表单字段'
},
{
  value: 'today',
  label: '填写当前日期'
}, {
  value: 'before',
  label: '当天日期前'
}, {
  value: 'after',
  label: '当天日期后'
}]
export const intervalTypes = [{
  value: 'y',
  label: '年'
}, {
  value: 'm',
  label: '月'
}, {
  value: 'd',
  label: '日'
}, {
  value: 'h',
  label: '时'
}, {
  value: 'mi',
  label: '分'
}, {
  value: 's',
  label: '秒'
}]
/**
 * 数据格式【校验】
 */
export const dataFormatOptions = [{
  value: 'phone',
  label: '手机号',
  // eslint-disable-next-line no-useless-escape
  regexp: /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/
},
{
  value: 'telephone',
  label: '电话号码',
  // eslint-disable-next-line no-useless-escape
  regexp: /^((\(0[0-9]{2,3}\))|(0[0-9]{2,3})\-)?([2-9][0-9]{6,7})(\-[0-9]{1,4})?$/
},
{
  value: 'zip',
  label: '邮编',
  regexp: /^\d{6}$/
},
{
  value: 'idcard',
  label: '身份证',
  regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
},
{
  value: 'email',
  label: '邮箱',
  // eslint-disable-next-line no-useless-escape
  regexp: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
},
{
  value: 'custom',
  label: '自定义'
}]
const dataFormatMap1 = {}
dataFormatOptions.forEach(item => {
  dataFormatMap1[item.value] = item
})
export const defaultOptions = [{
  val: '1',
  label: '选项一',
  checked: false
}, {
  val: '2',
  label: '选项二',
  checked: false
}]
export const defaultCascaderOptions = [
  {
    'val': 'part',
    'label': '部门',
    'children': [
      {
        'val': 'part_a',
        'label': 'A部门'
      },
      {
        'val': 'part_b',
        'label': 'B部门'
      }
    ]
  },
  {
    'val': 'product',
    'label': '产品',
    'children': [
      {
        'val': 'product_a',
        'label': 'a产品'
      },
      {
        'val': 'product_b',
        'label': 'b产品'
      }
    ]
  }
]
export const dataFormatMap = dataFormatMap1
