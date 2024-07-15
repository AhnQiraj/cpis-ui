import fieldTypes from '@platform/business/platform/form/constants/fieldTypes'
export const rigthGroup = [
  {
    'label': '字段',
    'key': 'fields',
    'buttonGroup': [
      {
        key: 'hide',
        type: '',
        label: '隐藏',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }],
        giveButtonKey: 'all',
        giveScope: ['hide'],
        giveButtonType: 'success'
      },
      {
        key: 'read',
        type: '',
        label: '只读',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }],
        giveButtonKey: 'all',
        giveScope: ['read'],
        giveButtonType: 'success'
      },
      {
        key: 'edit',
        type: '',
        label: '编辑',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }],
        giveButtonKey: 'all',
        giveScope: ['read', 'edit'],
        giveButtonType: 'success'
      },
      {
        key: 'required',
        type: '',
        label: '必填',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }],
        giveButtonKey: 'all',
        giveScope: ['read', 'edit', 'required'],
        giveButtonType: 'success'
      }
    ]
  },
  {
    'label': '只读权限',
    'key': 'read',
    'buttonGroup': [
      {
        key: 'all',
        type: '',
        label: '所有人',
        rights: 'read',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'none',
        type: '',
        label: '无',
        rights: 'read',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'edit',
        type: '',
        label: '编辑',
        rights: 'read',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      }
    ]
  },
  {
    'label': '编辑权限',
    'key': 'edit',
    'buttonGroup': [
      {
        key: 'all',
        type: '',
        label: '所有人',
        rights: 'edit',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'none',
        type: '',
        label: '无',
        rights: 'edit',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'edit',
        type: '',
        label: '编辑',
        rights: 'edit',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      }
    ]
  },
  {
    'label': '必填权限',
    'key': 'required',
    'buttonGroup': [
      {
        key: 'all',
        type: '',
        label: '所有人',
        rights: 'required',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'none',
        type: '',
        label: '无',
        rights: 'required',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'edit',
        type: '',
        label: '编辑',
        rights: 'required',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      }
    ]
  },
  {
    'label': '隐藏权限',
    'key': 'hide',
    'buttonGroup': [
      {
        key: 'all',
        type: '',
        label: '所有人',
        rights: 'hide',
        giveRight: [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'none',
        type: '',
        label: '无',
        rights: 'hide',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      },
      {
        key: 'edit',
        type: '',
        label: '编辑',
        rights: 'hide',
        giveRight: [{
          type: 'none',
          rightsId: '',
          rightsName: ''
        }]
      }
    ]
  }
]
export const ownRightsOptions = {
  'NONE': {
    type: 'none',
    label: '无'
  },
  'ALL': {
    type: 'all',
    label: '所有人'
  },
  'USER': {
    type: 'employee',
    label: '用户'
  },
  'ROLE': {
    type: 'role',
    label: '角色'
  },
  'ORG': {
    type: 'org',
    label: '组织(本层级)'
  },
  'ORG_SUB': {
    type: 'orgSub',
    label: '组织(包含子组织)'
  },
  'POSITION': {
    type: 'position',
    label: '岗位'
  }
}
const getTableFieldTypes = function() {
  const tableFieldTypes = []
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    field.value = type
    tableFieldTypes.push(field)
  }
  return tableFieldTypes
}
export const tableFieldTypes = getTableFieldTypes()
