import Utils from '@platform/utils/util'
import { nestedFieldTypes, needModelFieldTypes } from './fieldTypes'
import TreeUtils from '@platform/utils/tree'
const formFieldUtil = {
  /**
   * 获取所有字段
   * @param {*} columns
   */
  getColumns(columns) {
    const formColumns = []
    const traverse = (fields) => {
      fields.forEach((field) => {
        if (nestedFieldTypes.includes(field.field_type)) {
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields)
          })
        } else {
          formColumns.push(field)
        }
      })
    }
    traverse(columns)
    return formColumns
  },
  /**
   * 获取所有字段
   * @param {*} columns
   */
  getColumnsExcludeSelf(columns, id) {
    const formColumns = []
    const traverse = (fields) => {
      fields.forEach((field) => {
        if (nestedFieldTypes.includes(field.field_type)) {
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields)
          })
        } else {
          if (id !== field.id) {
            formColumns.push(field)
          }
        }
      })
    }
    traverse(columns)
    return formColumns
  },
  getFormFields(columns, id) {
    const fields = this.getColumnsExcludeSelf(columns, id)
    const formFields = []
    if (Utils.isEmpty(fields)) {
      return formFields
    }
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const fieldType = field.field_type
      const name = field.name
      let key = ''
      if (fieldType === 'onlineForm' || fieldType === 'detailForm') {
        key = field.field_options.formKey
      } else if (fieldType === 'dataTemplate') {
        key = field.field_options.bind_template_key
      } else if (fieldType === 'component') {
        key = field.field_options.formKey
      } else {
        continue
      }
      const data = {
        label: field.label,
        name: name,
        fieldType: fieldType,
        key: key
      }
      formFields.push(data)
    }
    return formFields
  },
  /**
   * 获取子表显示所有字段
   * @param {*} columns
   */
  getSubDisplayColumns(columns, isDisplay = true) {
    const formColumns = []
    const traverse = (fields) => {
      fields.forEach((field) => {
        if (nestedFieldTypes.includes(field.field_type)) {
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields)
          })
        } else {
          if (isDisplay) {
            if (Utils.toBoolean(field.field_options.display, true)) {
              formColumns.push(field)
            }
          } else {
            formColumns.push(field)
          }
        }
      })
    }
    traverse(columns)
    return formColumns
  },
  /**
   * 获取审批意见的字段
   * @param {*} columns
   */
  getFormOpinionField(columns) {
    const formOpinionFields = {}
    const traverse = (fields) => {
      fields.forEach((field) => {
        if (nestedFieldTypes.includes(field.field_type)) {
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields)
          })
        } else {
          if (field.field_type === 'approval_opinion') {
            formOpinionFields[field.name] = field
          }
        }
      })
    }
    traverse(columns)
    return formOpinionFields
  },
  getAllFormFields(columns) {
    // 包含主子表
    const formFields = []
    if (Utils.isEmpty(columns)) {
      return formFields
    }
    const subFormFields = {}
    const traverse = (fields, parentId, code) => {
      fields.forEach((field) => {
        const fieldType = field.field_type
        if (nestedFieldTypes.includes(fieldType)) { // 栅格布局
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields, parentId, code)
          })
        } else if (fieldType === 'table') { // 子表
          formFields.push(field)
          subFormFields[field.name] = field
        } else {
          if (needModelFieldTypes.includes(fieldType)) {
            field.parentId = parentId
            field.name = Utils.isNotEmpty(parentId) ? code + '.' + field.name : field.name
            formFields.push(field)
          }
        }
      })
    }
    // 主表字段
    traverse(JSON.parse(JSON.stringify(columns)), null)
    if (Utils.isNotEmpty(subFormFields)) {
      for (const code in subFormFields) {
        const subFormField = subFormFields[code]
        traverse(subFormField.field_options.columns, subFormField.id, code)
      }
    }
    return TreeUtils.transformToTreeFormat(formFields)
  },
  /**
   *  构建表单现在有的可以输入字段，排除自己
   * @param {*} columns
   * @param {*} isSub 是否子表单
   * @param {*} curCode 当前表
   * @param {*} id 当前对象id（需要排除自己）
   */
  getFormSubField(columns, curCode, id) {
    // 包含主子表
    const formFields = []
    if (Utils.isEmpty(columns)) {
      return formFields
    }
    const subFormFields = {}
    const traverse = (fields, parentId, code) => {
      fields.forEach((field) => {
        const fieldType = field.field_type
        const fieldName = field.name
        if (nestedFieldTypes.includes(fieldType)) { // 栅格布局
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields, parentId, code)
          })
        } else if (fieldType === 'table') { // 子表
          if (curCode === code) {
            formFields.push(field)
          }
          subFormFields[fieldName] = field
        } else {
          if (curCode === code || !code) {
            if (needModelFieldTypes.includes(fieldType)) {
              if (id !== field.id) {
                field.parentId = parentId
                field.fieldName = fieldName
                field.name = Utils.isNotEmpty(parentId) ? code + '.' + fieldName : fieldName
                field.label = Utils.isNotEmpty(parentId) ? subFormFields[code].label + '--' + field.label : field.label
                formFields.push(field)
              }
            }
          }
        }
      })
    }
    // 主表字段
    traverse(JSON.parse(JSON.stringify(columns)), null)
    if (Utils.isNotEmpty(subFormFields)) {
      for (const code in subFormFields) {
        const subFormField = subFormFields[code]
        if (curCode === code) {
          traverse(subFormField.field_options.columns, subFormField.id, code)
        }
      }
    }
    return TreeUtils.transformToTreeFormat(formFields)
  },
  /**
   *  构建表单现在有的可以输入字段，排除自己
   * @param {*} columns
   * @param {*} isSub 是否子表单
   * @param {*} curCode 当前表
   * @param {*} id 当前对象id（需要排除自己）
   * @param {*} type ‘’ 类型 label
   */
  getFormField(columns, isSub = false, curCode, id, type) {
    // 包含主子表
    const formFields = []
    if (Utils.isEmpty(columns)) {
      return formFields
    }
    const subFormFields = {}
    const traverse = (fields, parentId, code) => {
      fields.forEach((field) => {
        const fieldType = field.field_type
        const fieldName = field.name
        if (nestedFieldTypes.includes(fieldType)) { // 栅格布局
          const childColumns = field.field_options.columns
          childColumns.forEach(child => {
            traverse(child.fields, parentId, code)
          })
        } else if (fieldType === 'table') { // 子表
          if (isSub) {
            if (type !== 'label') {
              if (curCode === code) {
                formFields.push(field)
              }
            }
            subFormFields[fieldName] = field
          }
        } else {
          if (type === 'label') {
            if (fieldType === 'label') {
              field.parentId = parentId
              field.fieldName = fieldName
              field.name = Utils.isNotEmpty(parentId) ? code + '.' + fieldName : fieldName
              formFields.push(field)
            }
          } else {
            if (isSub) { // 子表
              if (curCode === code) {
                if (needModelFieldTypes.includes(fieldType)) {
                  if (id !== field.id) {
                    field.parentId = parentId
                    field.fieldName = fieldName
                    field.name = Utils.isNotEmpty(parentId) ? code + '.' + fieldName : fieldName
                    field.label = Utils.isNotEmpty(parentId) ? subFormFields[code].label + '--' + field.label : field.label
                    formFields.push(field)
                  }
                }
              }
            } else {
              if (needModelFieldTypes.includes(fieldType)) {
                if (id !== field.id) {
                  field.parentId = parentId
                  field.origName = fieldName
                  field.name = Utils.isNotEmpty(parentId) ? code + '.' + fieldName : fieldName
                  formFields.push(field)
                }
              }
            }
          }
        }
      })
    }
    // 主表字段
    traverse(JSON.parse(JSON.stringify(columns)), null)
    if (Utils.isNotEmpty(subFormFields) && isSub) {
      for (const code in subFormFields) {
        const subFormField = subFormFields[code]
        traverse(subFormField.field_options.columns, subFormField.id, code)
      }
    }
    return TreeUtils.transformToTreeFormat(formFields)
  }
}
export default formFieldUtil
