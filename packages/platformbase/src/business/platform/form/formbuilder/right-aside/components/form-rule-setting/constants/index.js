const QueryBuilder = {
}
/**
 * Allowed types and their internal representation
 * 允许的类型及其内部表示
 * @type {object.<string, string>}
 * @readonly
 * @private
 */
QueryBuilder.TYPES = {
  'varchar': 'string',
  'clob': 'string',
  'blob': 'string',
  'string': 'string',
  'integer': 'number',
  'double': 'number',
  'number': 'number',
  'date': 'datetime',
  'time': 'datetime',
  'datetime': 'datetime',
  'boolean': 'boolean'
}
/**
 * Allowed inputs
 * 允许的默认控件类型，如果扩展请custom
 * @type {string[]}
 * @readonly
 * @private
 */
QueryBuilder.INPUTS = [
  'text',
  'number',
  'textarea',
  'radio',
  'checkbox',
  'select',
  'date',
  'datetime',
  'custom'
]
/**
 *  操作符
 *  type：类型
 *  nb_inputs：有几个输入
 *  multiple：是否多选
 *  apply_to ：应用
 */
QueryBuilder.OPERATORS = {
  equal: { type: 'equal', nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'], value: 'equals' },
  not_equal: { type: 'not_equal', nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'], value: 'notEquals' },
  less: { type: 'less', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'], value: '<' },
  less_or_equal: { type: 'less_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'], value: '<=' },
  greater: { type: 'greater', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'], value: '>' },
  greater_or_equal: { type: 'greater_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'], value: '>=' },
  contains: { type: 'contains', nb_inputs: 1, multiple: false, apply_to: ['string'], value: 'contains' },
  not_contains: { type: 'not_contains', nb_inputs: 1, multiple: false, apply_to: ['string'], value: 'notContains' }
}
QueryBuilder.SOURCES = {
  'fixed': 'fixed',
  'user': 'user',
  'org': 'org'
}
export default QueryBuilder
