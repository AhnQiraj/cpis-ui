export const expressionOptioins1 = [
  { value: 'equals', label: '相等' },
  { value: 'notEquals', label: '不相等' },
  { value: 'contains', label: '包含于' },
  { value: 'notContains', label: '不包含于' }
]
export const expressionOptioins2 = [
  { value: '>', label: '大于' },
  { value: '&lt;', label: '小于' },
  { value: '>=', label: '大于等于' },
  { value: '&lt;=', label: '小于等于' }
]
export const valueTypeOptions = [
  { value: 'user', label: '用户', children: [{ value: 'userId', label: 'userId' }, { value: 'account', label: 'account' }] },
  { value: 'org', label: '组织', children: [{ value: 'orgId', label: 'orgId' }, { value: 'orgKey', label: 'orgKey' }] },
  { value: 'fixed', label: '固定值' }
]
