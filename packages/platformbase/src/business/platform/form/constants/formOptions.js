/* eslint-disable no-useless-escape */
const FormOptions = {
  t: {},
  options: {}
}
FormOptions.t = {
  // 权限
  PERMISSIONS: {
    READ: 'r', // 只读
    EDIT: 'e', // 编辑
    REQUIRED: 'b', // 必填
    SHOW: 's', // 显示，针对子表按钮
    HIDE: 'h'// 隐藏
  },
  // 默认日期格式
  DATE_FORMATS: {
    'date': 'yyyy-MM-dd',
    'datetime': 'yyyy-MM-dd HH:mm:ss',
    'time': 'HH:mm:ss'
  },
  // 数据格式(正则表达式)
  DATA_FORMAT: {
    'phone': /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/,
    'telephone': /^((\(0[0-9]{2,3}\))|(0[0-9]{2,3})\-)?([2-9][0-9]{6,7})(\-[0-9]{1,4})?$/,
    'zip': /^\d{6}$/,
    'idcard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    'email': /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  },
  // 默认意见
  DEFAULT_OPINION: [{
    checked: true,
    value: 'auditorName',
    label: '审批人'
  }, {
    checked: true,
    value: 'completeTime',
    label: '审批时间'
  }, {
    checked: true,
    value: 'statusName',
    label: '审批状态'
  }, {
    checked: true,
    value: 'opinion',
    label: '审批意见'
  }],
  DEFAULE_VALUE_TYPE: {
    dynamic: 'responseDynamic',
    linkage: 'responseLinkages',
    formula: 'responseFormula',
    cascade: 'responseCascades'
  },
  COMMON_REG: {
    VALIDATOR: '(\\$[0-9a-zA-Z._]+#)',
    FORM_FORMULA: '(\\$[0-9a-zA-Z._#@]+)',
    NEW_LINE: '[\\r\\n]'
  },
  DIRECT_HANDLER_SIGN_KEY: '#direct-handler-sign#'
}
export default FormOptions
