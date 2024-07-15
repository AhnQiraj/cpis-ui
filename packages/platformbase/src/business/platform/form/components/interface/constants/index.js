export const defaultOptions = [
  {
    value: 'Y',
    label: '是'
  },
  {
    value: 'N',
    label: '否'
  }
]
export const defaultAllOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'Y',
    label: '是'
  },
  {
    value: 'N',
    label: '否'
  }
]
export const methodOptions = [
  {
    value: 'POST',
    label: 'POST'
  },
  {
    value: 'GET',
    label: 'GET'
  }
]
export const serviceTypeOptions = [
  {
    value: 'restful',
    label: 'restful',
    type: 'remote'
  },
  {
    value: 'webservice',
    label: 'webservice',
    type: 'remote'
  }
]
export const dataTypeOptions = [
  {
    value: 'string',
    label: '字符串'
  },
  {
    value: 'number',
    label: '数字'
  },
  {
    value: 'boolean',
    label: '布尔值'
  },
  {
    value: 'date',
    label: '日期时间'
  },
  {
    value: 'bind',
    label: '绑定值'
  }
]
export const jsonDataTypeOptions = [
  {
    value: 'string',
    label: '字符串'
  },
  {
    value: 'number',
    label: '数字'
  },
  {
    value: 'boolean',
    label: '布尔值'
  },
  {
    value: 'date',
    label: '日期时间'
  },
  {
    value: 'object',
    label: '对象'
  },
  // {
  //   value: 'array',
  //   label: '数组'
  // },
  {
    value: 'bind',
    label: '绑定值'
  }
]
export const typeOptions = [
  {
    value: 'dynamic',
    label: '动态传入'
  },
  {
    value: 'fixed',
    label: '固定值'
  },
  // {
  //   value: 'var',
  //   label: '表单变量'
  // },
  {
    value: 'script',
    label: '脚本'
  }
]
//
export const bindRequestTypeOptions = [
  {
    value: 'queryRootColumn',
    label: '查询根字段'
  },
  {
    value: 'sortRootColumn',
    label: '排序根字段'
  },
  {
    value: 'pageRootColumn',
    label: '分页根字段'
  },
  {
    value: 'pageNoColumn',
    label: '页码字段'
  },
  {
    value: 'pageLimitColumn',
    label: '页大小字段'
  }
]
export const bindResponseTypeOptions = [
  {
    value: 'dataRootClumn',
    label: '数据根字段'
  },
  {
    value: 'pageRootColumn',
    label: '分页根字段'
  },
  {
    value: 'pageNoColumn',
    label: '页码字段'
  },
  {
    value: 'pageLimitColumn',
    label: '页大小字段'
  },
  {
    value: 'pageTotalColumn',
    label: '页数字段'
  },
  {
    value: 'totalColumn',
    label: '数据总量字段'
  }
]
export const ibpsRequestOptions = [{
  'id': 'bbca2078-d058-451d-9a30-d34aa0df6f3b',
  'name': 'root',
  'dataType': 'object',
  'isRequire': 'Y',
  'testValue': '',
  'defaultValue': '',
  'level': 1,
  'desc': '',
  'children': [{
    'id': '975c7479-6b3c-47ce-a803-ec07e1630a6f',
    'name': 'parameters',
    'dataType': 'array',
    'isRequire': 'Y',
    'testValue': '',
    'defaultValue': '',
    'level': 2,
    'desc': '',
    'parentId': 'bbca2078-d058-451d-9a30-d34aa0df6f3b',
    'children': [{
      'id': '47acda9e-f4d6-438f-b0ac-4028f38c6722',
      'name': 'items',
      'dataType': 'object',
      'isRequire': 'N',
      'testValue': '',
      'defaultValue': '',
      'level': 3,
      'desc': '',
      'parentId': '975c7479-6b3c-47ce-a803-ec07e1630a6f',
      'isAry': true,
      'children': [{
        'id': '71b12078-6fb8-4f2a-a99f-77f947ccf4df',
        'name': 'key',
        'dataType': 'string',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 4,
        'desc': '',
        'parentId': '47acda9e-f4d6-438f-b0ac-4028f38c6722'
      }, {
        'id': '3be590b3-8531-41ec-a6d6-d194996780c0',
        'name': 'value',
        'dataType': 'string',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 4,
        'desc': '',
        'parentId': '47acda9e-f4d6-438f-b0ac-4028f38c6722'
      }
      ]
    }
    ]
  }, {
    'id': 'd02e82bd-8791-4775-90f8-8cebcb078039',
    'name': 'requestPage',
    'dataType': 'object',
    'isRequire': 'Y',
    'testValue': '',
    'defaultValue': '',
    'level': 2,
    'desc': '',
    'parentId': 'bbca2078-d058-451d-9a30-d34aa0df6f3b',
    'children': [{
      'id': '9b2acbb3-bfac-4656-bcef-24bd4dae3c21',
      'name': 'limit',
      'dataType': 'int',
      'isRequire': 'Y',
      'testValue': '',
      'defaultValue': '20',
      'level': 3,
      'desc': '',
      'parentId': 'd02e82bd-8791-4775-90f8-8cebcb078039',
      'children': []
    }, {
      'id': '7fac1e23-70b2-4032-b304-76121d0de7a7',
      'name': 'pageNo',
      'dataType': 'int',
      'isRequire': 'Y',
      'testValue': '',
      'defaultValue': '1',
      'level': 3,
      'desc': '',
      'parentId': 'd02e82bd-8791-4775-90f8-8cebcb078039',
      'children': []
    }
    ]
  }, {
    'id': 'd66cbfa4-c8cb-4de2-9ad1-8dcb13a2955f',
    'name': 'sorts',
    'dataType': 'array',
    'isRequire': 'Y',
    'testValue': '',
    'defaultValue': '',
    'level': 2,
    'desc': '',
    'parentId': 'bbca2078-d058-451d-9a30-d34aa0df6f3b',
    'children': [{
      'id': '30facb49-dc07-44f7-92d5-8303a61a8d39',
      'name': 'items',
      'dataType': 'object',
      'isRequire': 'N',
      'testValue': '',
      'defaultValue': '',
      'level': 3,
      'desc': '',
      'parentId': 'd66cbfa4-c8cb-4de2-9ad1-8dcb13a2955f',
      'isAry': true,
      'children': [{
        'id': '0761a90c-7b8d-459c-a1d4-9d7d47486c73',
        'name': 'field',
        'dataType': 'string',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 4,
        'desc': '',
        'parentId': '30facb49-dc07-44f7-92d5-8303a61a8d39'
      }, {
        'id': 'eb04e9a7-c3a0-4e85-9ee7-691b1da8cfb3',
        'name': 'order',
        'dataType': 'string',
        'isRequire': 'Y',
        'testValue': '',
        'defaultValue': '',
        'level': 4,
        'desc': '',
        'parentId': '30facb49-dc07-44f7-92d5-8303a61a8d39'
      }
      ]
    }
    ]
  }
  ]
}
]
export const ibpsResponseOptions = [{
  'id': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe',
  'name': 'root',
  'dataType': 'object',
  'isRequire': 'Y',
  'testValue': '',
  'level': 1,
  'desc': '',
  'children': [{
    'id': '0f43c992-fdf7-4d62-bc11-f5ccb5fadfcb',
    'name': 'state',
    'dataType': 'int',
    'isRequire': 'Y',
    'testValue': '200',
    'level': 2,
    'desc': '响应码',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe',
    'children': []
  }, {
    'id': '5c7558de-0e71-486d-8999-ba580e85be3f',
    'name': 'request',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '/user/login/apply',
    'level': 2,
    'desc': '请求地址',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe'
  }, {
    'id': 'fd90d8f1-538e-4cf3-bb74-c25ef9aa63eb',
    'name': 'message',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '成功',
    'level': 2,
    'desc': '正常响应消息',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe'
  }, {
    'id': '608226f0-965b-4e57-bac5-fb3a3d1a7281',
    'name': 'cause',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '失败',
    'level': 2,
    'desc': '异常响应内容',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe'
  }, {
    'id': '369509e6-fbf1-41d4-859c-bda68acfef9a',
    'name': 'data',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '',
    'level': 2,
    'desc': '数据体',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe'
  }, {
    'id': 'ccd1b362-84d1-4c8c-b1c4-825a42b2671b',
    'name': 'variables',
    'dataType': 'object',
    'isRequire': 'Y',
    'testValue': '',
    'level': 2,
    'desc': '响应变量',
    'parentId': 'a06cf8e0-da09-4de9-bf81-c62ff2e934fe',
    'children': []
  }
  ]
}
]
export const items = {
  'id': '47acda9e-f4d6-438f-b0ac-4028f38c6722',
  'name': 'items',
  'dataType': 'object',
  'isRequire': 'N',
  'testValue': '',
  'defaultValue': '',
  'level': 3,
  'desc': '',
  'parentId': '975c7479-6b3c-47ce-a803-ec07e1630a6f',
  'isAry': true,
  'children': [{
    'id': '71b12078-6fb8-4f2a-a99f-77f947ccf4df',
    'name': 'key',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '',
    'defaultValue': '',
    'level': 4,
    'desc': '',
    'parentId': '47acda9e-f4d6-438f-b0ac-4028f38c6722'
  }, {
    'id': '3be590b3-8531-41ec-a6d6-d194996780c0',
    'name': 'value',
    'dataType': 'string',
    'isRequire': 'Y',
    'testValue': '',
    'defaultValue': '',
    'level': 4,
    'desc': '',
    'parentId': '47acda9e-f4d6-438f-b0ac-4028f38c6722'
  }
  ]
}
