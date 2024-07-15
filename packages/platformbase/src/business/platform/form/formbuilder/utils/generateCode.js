import { nestedFieldTypes, otherFieldTypes, needModelFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
import { accept as ACCEPT } from '@platform/business/platform/file/constants/fileTypes'
import FormOptions from '@platform/business/platform/form/constants/formOptions'
import Utils from '@platform/utils/util'
import DateFormatUtil from '@platform/business/platform/form/utils/dateFormatUtil'
import I18n from '@platform/utils/i18n'
import { dataFormatMap } from '@platform/business/platform/form/constants/fieldOptions'
import Styles from '@platform/business/platform/form/utils/global-style'
import FormFieldUtil from '@platform/business/platform/form/utils/formFieldUtil'
import FormUtils from '@platform/business/platform/form/utils/formUtil'
import { hasPermission } from '@platform/business/platform/form/constants/tableButtonTypes'
// 保存表单全局样式
let globalStyle = {}
// 保存控件的import语句
let sentences = []
// 保存控件的components
let components = []
// 保存样式
let styles = []
// 保存验证规则
let formRules = []
// 描述显示位置
let descPosition = ''
// 事件模版
let eventTemplate = []
// 验证导入方法
let validators = []
// 保存布局默认值
let layoutVal = []
// 保存自动编号的字段
let autoNumbers = []
// 保存自动编号的identity
let autoNumberIdentities = []
// 保存自动编号的事件
let autoNumberEvent = ''
// 保存按钮事件
let btnEvent = ''
// 保存computed
let returnSocpe = ''
// 保存按钮数据
let btns = {}
// 保存步骤条步骤事件
let stepsEvent = ''
// 步骤条数据
let stepsActive = {}
// 保存富文本的工具栏
let ueditorConfig = {}
// 图标前缀
const prefix = 'ibps-icon-'
let hasDialogTable = false
function setAutoNumber(prop, identity, init) {
  if (Utils.toBoolean(init, false)) {
    const temp = `async initAuto(identity,name){
      let result = ''
      await getNextIdByAlias({
        alias: identity
      }).then(response => {
        result = response.data
      }).catch(() => {})
      this.models[name] = result
    }`
    if (autoNumberEvent !== temp) {autoNumberEvent = temp}
    if (!autoNumbers.includes(prop)) {
      autoNumbers.push(prop)
      autoNumberIdentities.push(identity)
    }
  }
}
/**
 * 生成表单数据
 * @param {*} fields
 * @param {*} models
 */
function generateModles(fields, models) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    const fieldName = field.name
    const fieldType = field.field_type
    const fieldOptions = field.field_options
    const val = fieldOptions.default_value
    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      if (Utils.isNotEmpty(fieldOptions) && Utils.isNotEmpty(fieldOptions.columns)) {
        // 循环遍历所有字段
        fieldOptions.columns.forEach(item => {
          generateModles(item.fields, models)
        })
        // for(let i=0;i<fieldOptions.length;i++){
        //   generateModles(fieldOptions[i].fields, models)
        // }
      }
    } else if (fieldType === 'table') { // 子表单
      models[fieldName] = []
      const temp = {}
      generateModles(fieldOptions.columns, temp)
      models[fieldName].push(temp)
    } else if (fieldType === 'approval_opinion') { // 审批意见
      models[fieldName] = ''
    } else {
      // 不是只读字段
      if (needModelFieldTypes.includes(fieldType)) {
        if (fieldType === 'checkbox') {
          models[fieldName] = []
          fieldOptions.options.forEach(el => {
            if (el.checked) {
              models[fieldName].push(el.val)
            }
          })
        } else if (fieldType === 'radio') {
          models[fieldName] = ''
          fieldOptions.options.forEach(el => {
            if (el.checked) {
              models[fieldName] = el.val
            }
          })
        } else if (fieldType === 'select') {
          if (Utils.isNotEmpty(fieldOptions.multiple) && fieldOptions.multiple) {
            models[fieldName] = []
            fieldOptions.options.forEach(el => {
              if (el.checked) {
                models[fieldName].push(el.val)
              }
            })
          } else {
            models[fieldName] = ''
            fieldOptions.options.forEach(el => {
              if (el.checked) {
                models[fieldName] = el.val
              }
            })
          }
        } else {
          models[fieldName] = Utils.isNotEmpty(val) ? val : ''
        }
      }
    }
  }
}
/**
 * 表单模版
 * @param {*} fields
 */
function generateFormTempale(fields) {
  const template = []
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    // const fieldName = field.name
    const fieldType = field.field_type
    // const fieldOptions = field.field_options
    if (nestedFieldTypes.includes(fieldType)) { // 嵌套布局
      template.push(generateNestedFieldTempale(field))
    } else {
      template.push(generateFieldItemTemplate(field))
    }
  }
  return template.join('')
}
// 根据传入的数据保存
function setData(data, name, val) {
  data[name] = JSON.parse(JSON.stringify(val))
}
// 保存布局默认显示
function setLayoutVal(val) {
  if (layoutVal.includes(val)) {return}
  layoutVal.push(val)
}
// 保存步骤条数据
function setStepsActive(prop, active) {
  stepsActive[prop] = Utils.isNotEmpty(active) ? active : 0
}
/**
 * 嵌套字段
 * @param {*} field
 */
function generateNestedFieldTempale(field, type, model, isOne2One) {
  const fieldType = field.field_type
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const prop = generateProp(field)
  // 栅格布局
  if (fieldType === 'grid') {
    const gutter = fieldOptions.gutter ? fieldOptions.gutter : 0
    const justify = fieldOptions.justify
    const align = fieldOptions.align
    return `
      <el-row
        :gutter="${gutter}"
        justify="${justify || ''}"
        align="${align || ''}"
        class="widget-col"
        type="flex"
      >
      ${columns.map(col => {
    return `<el-col :span="${col.span ? col.span : 0}">
        ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
        </el-col>
        `
  }).join('')}
      </el-row>
      `
  // 标签布局
  } else if (fieldType === 'tabs') {
    return `<el-tabs
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map((col, i) => {
    if (col.checked || (i === 0 && !col.checked)) {
      setLayoutVal(`${prop}:'${col.name}'`)
    }
    return `<el-tab-pane name="${col.name}">
          <span slot="label">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
          </el-tab-pane>
          `
  }).join('')}
      </el-tabs>
      `
  // 折叠面板
  } else if (fieldType === 'collapse') {
    const arrs = []
    const temp =
     `<el-collapse
        v-model="formLayout.${prop}"
        type="${fieldOptions.type}"
        :accordion="${fieldOptions.accordion}"
        tab-position="${fieldOptions.position}"
        :stretch="${fieldOptions.stretch}"
        class="ibps-mb-10"
      >
      ${columns.map(col => {
    if (col.checked) {
      arrs.push(`'${col.name}'`)
    }
    return `<el-collapse-item name="${col.name}" >
          <span slot="title">${col.label}</span>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
          </el-collapse-item>
          `
  }).join('')}
      </el-collapse>
      `
    if (arrs && arrs.length > 0) {
      setLayoutVal(`${prop}:[${arrs.join(',')}]`)
    } else {
      setLayoutVal(`${prop}:[]`)
    }
    return temp
  // 步骤条
  } else if (fieldType === 'steps') {
    let template = `<ibps-steps
    space="${fieldOptions.space}"
    direction="${fieldOptions.direction}"
    :align-center="${fieldOptions.align_center}"
    :simple="${fieldOptions.simple}"
    process-status="${fieldOptions.process_status}"
    finish-status="${fieldOptions.finish_status}"
    :active="stepsActive.${prop}"
    class="ibps-mb-10"
  >
  ${columns.map((col, colIndex) => {
    return `<ibps-step-pane
    title="${col.label}"
    name="${col.name ? col.name : 'steps_' + colIndex}"
    class="ibps-mt-10 ibps-mb-10">
    ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
      </ibps-step-pane>
      `
  }).join('')}
    </ibps-steps>
    `
    template += `
    <div class="ibps-p-10">
      <el-button-group>
        ${fieldOptions.buttons.map((button, i) => {
    return `
        <el-button
          :disabled="${button.key === 'prev'
    ? `stepsActive.${prop} <= 0`
    : `stepsActive.${prop} >= ${columns.length - 1}`}"
          icon="${prefix + button.icon}"
          @click="${button.key === 'prev' ? `prevSteps('${prop}')` : `nextSteps('${prop}',${columns.length})`}"
        >
          ${button.label}
        </el-button>`
  }).join('')}
      </el-button-group>
    </div>
  `
    stepsEvent = `
      nextSteps(name,length){
        if(length - 1 <= this.stepsActive[name]) return
        this.stepsActive[name] ++
      },
      prevSteps(name){
        if(this.stepsActive[name] === 0) return
        this.stepsActive[name] --
      },
      `
    setStepsActive(prop, field.active)
    return template
  // 字段分组
  } else if (fieldType === 'fieldset') {
    return `
    <fieldset
      class="ibps-fieldset 
      ${Utils.isNotEmpty(fieldOptions.border_style) ? ` ibps-fieldset--${fieldOptions.border_style}` : ''} 
      ${Utils.isNotEmpty(fieldOptions.custom_class) ? ` ${fieldOptions.custom_class}` : ''}"
    >
      <legend
        class="
        ${Utils.isNotEmpty(fieldOptions.type) ? `ibps-fieldset--${fieldOptions.type}` : ''} 
        ${Utils.isNotEmpty(fieldOptions.position) ? ` ibps-fieldset--${fieldOptions.position}` : ''} 
        "
      >${field.label}
      ${(field && field.desc && descPosition === 'lableIcon') ? `<ibps-help type="tooltip" content="${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/'/g, '&acute;')}" />` : ''}
      </legend>
      ${(field && field.desc && descPosition === 'inline') ? `<div  class="ibps-fieldset--desc" v-html="${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/'/g, '&acute;')}" />` : ''}
      ${columns.map(col => {
    return `<div>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
        </div>`
  }).join('')}
    </fieldset>
    `
  // 卡片布局
  } else if (fieldType === 'card') {
    return `
    <el-card 
      ${Utils.isNotEmpty(fieldOptions.shadow) ? `shadow="${fieldOptions.shadow}"` : ''} 
      ${Utils.isNotEmpty(fieldOptions.custom_class) ? `class="${fieldOptions.custom_class}"` : ''}
      >
      ${!Utils.toBoolean(fieldOptions.hide_label, false) ? `
      <div slot="header" class="clearfix">
        <span>${field.label}</span>
      </div>` : ''}
      ${columns.map(col => {
    return `<div>
          ${col.fields.map(item => {
    return `${nestedFieldTypes.includes(item.field_type) ? generateNestedFieldTempale(item, type, model, isOne2One) : generateFieldItemTemplate(item, type, model, isOne2One)}`
  }).join('')}
        </div>`
  }).join('')}
    </el-card>
    `
  }
}
function generateProp(field, code, row) {
  if (Utils.isNotEmpty(row)) {
    return code + '.' + row + '.' + field.name
  }
  return field.name
}
function generateRules(field) {
  const required = field.field_options.required
  return buildFormRules(field, required, {})
}
// 保存validators语句
function setValidators(validator) {
  if (!validators.includes(validator)) {
    validators.push(validator)
  }
}
function buildFormRules(field, required, models) {
  const rules = []
  const fieldOptions = field.field_options || {}
  let validator = ''
  // 必填验证
  if (required) {
    validator = 'validateRequired'
    rules.push({ required: true, message: I18n.t('validate.required') })
    rules.push({ validator: validator, message: I18n.t('validate.required') })
    setValidators(validator)
  }
  // 整型验证
  if (fieldOptions.integer) {
    validator = 'validateInteger'
    rules.push({ validator: validator, message: I18n.t('validate.integer') })
    setValidators(validator)
  }
  // 小数验证
  if (fieldOptions.decimal) {
    validator = 'validateDecimal'
    setValidators(validator)
    rules.push({
      validator: validator,
      decimal: fieldOptions.decimal
    })
  }
  //  最大、最小字符串长度验证
  if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) ||
    (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
    validator = 'validateLengthRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      format: field.field_type === 'editor' ? (v) => {
        let content = v.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
        content = content.replace(/[|]*\n/, '') // 去除行尾空格
        content = content.replace(/&npsp;/ig, '') // 去掉npsp
        return content
      } : false,
      min: fieldOptions['is_min_length'] ? fieldOptions['min_length'] : null,
      max: fieldOptions['is_max_length'] ? fieldOptions['max_length'] : null
    })
  }
  //  最大、最小值验证[数字]
  if ((fieldOptions['is_min'] && Utils.isNotEmpty(fieldOptions['min'])) ||
      (fieldOptions['is_max'] && Utils.isNotEmpty(fieldOptions['max']))) {
    validator = 'validateNumberRange'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min'] ? fieldOptions['min'] : null,
      max: fieldOptions['is_max'] ? fieldOptions['max'] : null
    })
  }
  // 日期验证 date_format 不需要
  // 日期范围验证-开始、结束时间 date_between
  if (Utils.isNotEmpty(fieldOptions['start_date_type']) ||
      Utils.isNotEmpty(fieldOptions['end_date_type'])) {
    validator = 'validateDateBetween'
    setValidators(validator)
    rules.push({
      validator: validator,
      fieldOptions: fieldOptions,
      models: models
    })
  }
  //  最多、最少选项验证
  if ((fieldOptions['is_min_mum'] && Utils.isNotEmpty(fieldOptions['min_mum'])) ||
    (fieldOptions['is_max_mum'] && Utils.isNotEmpty(fieldOptions['max_mum']))) {
    validator = 'validateOptions'
    setValidators(validator)
    rules.push({
      validator: validator,
      min: fieldOptions['is_min_mum'] ? fieldOptions['min_mum'] : null,
      max: fieldOptions['is_max_mum'] ? fieldOptions['max_mum'] : null
    })
  }
  // 正则表达式
  if (fieldOptions['data_format']) {
    let dataFormatValue = fieldOptions['data_format_value']
    let dataFormatMsg = fieldOptions['data_format_msg']
    if (fieldOptions['data_format'] !== 'custom') {
      dataFormatValue = dataFormatMap[fieldOptions['data_format']].regexp
      dataFormatMsg = I18n.t('validate.' + fieldOptions['data_format'])
    }
    rules.push({
      pattern: dataFormatValue,
      message: dataFormatMsg
    })
  }
  return rules
}
// 子表单样式导入
function setTableStyle() {
  const style = `
  .dynamic-form-table{
    .panel-heading{
      border-bottom:0;
      border-left: 1px solid #dde7ee;
      border-right: 1px solid #dde7ee;
    }
    .dynamic-form-table__inner{
      .panel-body{
        padding: 0;
      }
    }
    .dynamic-form-table__block{
      padding-bottom:10px;
      .panel-body{
        border: 1px solid #dde7ee;
      }
    }
  }
  .is-error{
    .dynamic-form-table{
      border: 1px solid #F56C6C;
    }
  }
  
  .is-required:not(.is-no-asterisk){
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  `
  if (!styles.includes(style)) {
    styles.push(style)
  }
}
/**
 * 按钮过滤
 */
function filterButtons(buttons, position) {
  if (Utils.isEmpty(buttons)) {return []}
  const bs = []
  buttons.forEach(button => {
    if (hasPermission(button.key, position) && // 有位置权限
    (!button.position || button.position === 'all' || button.position === position) // 有位置权限
    ) {
      const b = JSON.parse(JSON.stringify(button))
      b.position = position
      bs.push(b)
    }
  })
  return bs
}
/**
 * 重置按钮数据
 */
function setButtons(data) {
  const buttons = data || []
  const bs = []
  buttons.forEach(button => {
    const b = JSON.parse(JSON.stringify(button))
    b.key = button.type
    b.type = button.style
    b.style = button.style
    b.icon = prefix + button.icon
    bs.push(b)
  })
  return bs
}
/**
 * 子表单控件
 * @param {*} field
 * @param {*} prop
 */
function generateTableTemplate(field, prop) {
  setTableStyle()
  const fieldOptions = field.field_options
  const columns = fieldOptions.columns
  const displayColumns = FormFieldUtil.getSubDisplayColumns(columns)
  const buttons = setButtons(fieldOptions.buttons)
  const mode = fieldOptions.mode || 'inner'
  const model = prop
  const toolbarButtons = filterButtons(buttons, 'toolbar')
  const manageButtons = filterButtons(buttons, 'manage')
  let template = `
    <div class="dynamic-form-table">
  `
  if (!(displayColumns && displayColumns.length > 0)) {
    template += `
      <el-table
        :data="[]"
        empty-text="您尚未创建任何字段。请在表单中添加字段。"
        border
      />
    </div>
    `
    return template
  }
  // 表内和弹窗模式
  if (mode === 'inner' || mode === 'dialog') {
    template += `
      <div class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">${field.label}</div>
      `
    if (toolbarButtons && toolbarButtons.length > 0) {
      template += `
          <div class="ibps-fr hidden-print">
            <el-button-group>
            ${toolbarButtons.map((button, i) => {
    return `
                <el-button
                :key="${i}"
                type="${button.type}"
                icon="${button.icon}"
                @click="handleActionEventBy${model}('${button.key}','${model}','${model}')"
              >
                ${button.label}
              </el-button>`
  }).join('')}
            </el-button-group>
          </div>
      `
      setBtnEventTemplate(`handleActionEventBy${model}`, columns, mode, model)
    }
    template += `
        </div>
        <div class="panel-body">
          <el-table
            ref="${model}"
            :data="models.${model}"
            border
            stripe
          >
            <el-table-column
              type="selection"
              width="50"
            />
            ${fieldOptions.index
    ? `<el-table-column
                type="index"
                label="序号"
                width="50"
              />`
    : ''}`
    displayColumns.forEach((column, j) => {
      if (column.field_type === 'hidden') {return}
      template += `
        <el-table-column
          :key="${j}"
          prop="${column.name}"
          ${Utils.isNotEmpty(column.field_options.is_label_width) && column.field_options.is_label_width ? `width="${column.field_options.label_width + (column.field_options.label_width_unit || 'px')}"` : ''}
        >
          <template slot="header">
            ${Utils.isNotEmpty(column.field_options.units) ? column.label + '(' + column.field_options.units + ')' : column.label}
            ${(column && column.desc && descPosition === 'lableIcon') ? `<ibps-help type="tooltip" content="${column.desc}" />` : ''}
          </template>
          <template slot-scope="props">
            ${generateTableItemTemplate(column, mode, model)}
          </template>
        </el-table-column>
      `
    })
    if (manageButtons && manageButtons.length > 0) {
      template +=
      `
      <el-table-column
        align="center"
        fixed="right"
        class-name="hidden-print"
        label="操作"
      >
        <template slot-scope="scope">
          <ibps-toolbar
            :actions="manageButtons.${model}"
            :data="scope.row"
            :socpe="thatSocpe"
            position="manage"
            class="hidden-print"
            @action-event="(action)=>operationEvent(action, scope.$index, '${model}')"
          />
        </template>
      </el-table-column>`
      returnSocpe = `
      thatSocpe() {
        return this
      },
      `
      btnEvent = `
      operationEvent(button, index, name){
        // todo
        // 根据button.key判断不同的按钮，再通过index获取指定位置的数据（index为点击行在models的下标）
        switch (button.key) {
          case 'add':
            console.info('新增')
            break
          case 'edit':
            console.info('修改')
            break
          case 'remove':
            console.info('删除')
            this.$confirm('确定删除当前行?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.models[name].splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
            break
          case 'import':
            console.info('导入')
            break
          case 'export':
            console.info('导出')
            break
          case 'custom':
            break
          default:
            break
        }
      },
      `
      btns[model] = manageButtons
    }
    template += `
          </el-table>
        </div>
      </div>
    
    `
  // 块模式
  } else if (mode === 'block') {
    const isOne2One = (fieldOptions['relation'] || 'one2More') === 'one2one'
    // isOne2One
    if (isOne2One) {
      template += `
      <div class="dynamic-form-table__block panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <!--块模式：工具栏-->
          <div class="ibps-fl dynamic-form-table__label">
            ${field.label}
          </div>
      `
      template += `
      </div>
        <!--块模式：表单-->
        <div class="panel-body">
    `
      columns.forEach((el, j) => {
        if (el.field_type === 'grid' || el.field_type === 'tabs' || el.field_type === 'collapse' || el.field_type === 'steps') {
          template += generateNestedFieldTempale(el, mode, model, isOne2One)
        } else {
          template += generateFieldItemTemplate(el, mode, model, isOne2One)
        }
      })
      template += `
                </div>
                  </div>
                `
      return template + `</div>`
    }
    template += `
    <template v-for="(data,index) in models.${model} ">
      <div :key="index" class="dynamic-form-table__block panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <!--块模式：工具栏-->
          <div class="ibps-fl dynamic-form-table__label">
            ${field.label}
          </div>
      `
    if (toolbarButtons && toolbarButtons.length > 0) {
      template += `
        <div class="ibps-fr">
          <el-button-group>
            ${toolbarButtons.map((button, b) => {
    return `
              <template v-if="!('${button.key}' === 'remove' && models.${model}.length===1) ">
                <el-button
                  :key="${b}"
                  type="${button.type}"
                  icon="${button.icon}"
                  @click="handleActionEventBy${model}('${button.key}','${model}','',index)"
                >
                  ${button.label}
                </el-button>
              </template>`
  }).join('')}
          </el-button-group>
        </div>
      `
      setBtnEventTemplate(`handleActionEventBy${model}`, columns, mode, model)
    }
    template += `
      </div>
        <!--块模式：表单-->
        <div class="panel-body">
    `
    columns.forEach((el, j) => {
      if (el.field_type === 'grid' || el.field_type === 'tabs' || el.field_type === 'collapse' || el.field_type === 'steps') {
        template += generateNestedFieldTempale(el, mode, model, isOne2One)
      } else {
        template += generateFieldItemTemplate(el, mode, model, isOne2One)
      }
    })
    template += `
                </div>
              </div>
            </template>
                `
  }
  return template + `</div>`
}
/**
 * ibps-dynamic-form-table-item
 * @param {*} field
 */
function generateTableItemTemplate(field, type, model) {
  const prop = generateProp(field)
  const rules = generateRules(field)
  setFormRules(rules, prop)
  const mode = field.field_options.mode
  let template = `
    <el-form-item
      :prop="\`${model + '[${props.$index}].' + prop}\`"
      :rules="rules.${prop}"
      ${mode === 'block' ? `label="${field.label}"` : ''}
      label-width="${mode === 'block' ? field.field_options.label_width : '0px'}"
      :class="{
        'dynamic-form-table-item__readonly':readonly
      }"
    >
  `
  if (field.field_type === 'table') {
    template += generateTableTemplate(field, prop)
  } else {
    template += generateFieldTemplate(field, prop, type, model)
  }
  if (field && field.desc && descPosition === 'inline') {
    template += `
      <div
        class="ibps-help-block"
        v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/'/g, '&acute;')}'"
      />
    `
  }
  template += `
    </el-form-item>
  `
  return template
}
// 保存验证规则
function setFormRules(rules, prop) {
  const index = formRules.findIndex((v) => {
    return v.startsWith(prop)
  })
  if (index !== -1 && Utils.isNotEmpty(prop)) {
    return
  }
  if (Utils.isNotEmpty(rules)) {
    formRules.push(`${prop}:${JSON.stringify(rules)}`)
  }
}
/**
 * ibps-dynamic-form-item
 * @param {*} field
 */
function generateFieldItemTemplate(field, type, model, isOne2One) {
  const fieldType = field.field_type
  if (fieldType === 'hidden') {
    return ''
  } else if (otherFieldTypes.includes(fieldType)) {
    return generateOtherFieldTemplate(field)
  } else {
    const prop = generateProp(field)
    const rules = generateRules(field)
    setFormRules(rules, prop)
    const flag = Utils.isNotEmpty(model)
    let _prop = `prop="${prop}"`
    if (flag) {
      if (Utils.isNotEmpty(type) && type === 'block') {
        if (isOne2One) {
          _prop = `prop="${model}.${prop}"`
        } else {
          _prop = `:prop="\`${model + '[${index}].' + prop}\`"`
        }
      } else {
        _prop = `prop="${model}[0].${prop}"`
      }
    }
    let template = `
      <el-form-item
      label="${fieldType === 'table' ? '' : field.label}"
      ${fieldType === 'table' ? `label-width="0"` : ''}
      ${_prop}
      ${flag ? `:rules="rules.${prop}"` : ''}
      >
      ${fieldType !== 'table' && field.label ? `
        <template slot="label">
          <span style="${Styles.getStyleByName(globalStyle, 'labelTypeface', 'labelFontSize', 'labelBold', 'labelColor').replace(/"/g, '&quot;')}">${field.label}</span>
          ${(field && field.desc && descPosition === 'lableIcon') ? `<ibps-help type="tooltip" content="${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/'/g, '&acute;')}" />` : ''}
        </template>` : ''}`
    if (fieldType === 'approval_opinion') {
      // 表单意见
    } else if (fieldType === 'table') {
      template += generateTableTemplate(field, prop)
    } else {
      template += generateFieldTemplate(field, prop, type, model)
    }
    if (field && field.desc && descPosition === 'inline') {
      template += `
        <div
          class="ibps-help-block"
          v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/"/g, '&acute;')}'"
        />
      `
    }
    template += `
      </el-form-item>
    `
    return template
  }
}
/**
 * 当为子表单弹窗模式下的控件，则只读
 */
function dialogFieldTemplate(fieldType, model, fieldOptions) {
  const dataOptions = fieldOptions['options']
  let template = ''
  // 单行文本
  if (fieldType === 'text') {
    template = `
    <div class="ibps-field-text">{{${model}}}</div>`
  // 多行文本
  } else if (fieldType === 'textarea') {
    template = `
    <div
      class="ibps-field-text"
      v-html="$utils.formatText(${model})"
    />`
  // 数字
  } else if (fieldType === 'number') {
    template = `
    <div class="ibps-field-text">{{${model}}}</div>`
  // 单项选择
  } else if (fieldType === 'radio') {
    template = `
    <span v-if="$utils.isNotEmpty(${model})" class="ibps-field-text">
      {{ ${model}|optionsFilter(${JSON.stringify(dataOptions)},'label','val') }}
    </span>`
  // 多选项选择
  } else if (fieldType === 'checkbox') {
    template = `
    <template v-if="${model} && ${model}.length >0">
      <span v-for="(v,i) in ${model}" :key="i" class="ibps-mr-5">
        {{ v|optionsFilter(${JSON.stringify(dataOptions)},'label','val') }}
      </span>
    </template>`
  //  计数器
  } else if (fieldType === 'inputNumber') {
    template = `
    <div class="ibps-field-text">{{${model}}}</div>`
  // 下拉框
  } else if (fieldType === 'select') {
    template = `
    <span v-if="$utils.isNotEmpty(${model})">
      {{ ${model}|optionsFilter(${JSON.stringify(dataOptions)},'label','val') }}
    </span>`
  // 开关
  } else if (fieldType === 'switch') {
    template = `
    <span v-if="$utils.isNotEmpty(${model})" class="ibps-field-text">
      {{ ${model}|optionsFilter(${JSON.stringify(FormUtils.getSwitchOptions(fieldOptions))},'label','val') }}
    </span>`
  // 滑块
  } else if (fieldType === 'slider') {
    template = `
    <div class="ibps-field-text">{{${model}}}</div>`
  // 评分
  } else if (fieldType === 'rate') {
    template = `
    <div class="ibps-field-text">{{${model}}}</div>`
  // 日期控件
  } else if (fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate') {
    const _datefmt = datefmt(fieldOptions, fieldType)
    const str = JSON.stringify(_datefmt)
    template = `
    <div>
      {{ ${model}|dateFormat(${str},${str}) }}
    </div>`
  /**
   * 增强字段
   */
  // 富文本框
  } else if (fieldType === 'editor') {
    template = `
    <div
      v-html="$utils.formatText(${model})"
    />`
  }
  return template
}
/**
 * ibps-dynamic-form-field
 * @param {*} field
 * @param {*} prop
 */
function generateFieldTemplate(field, prop, type, name, isOne2One) {
  const fieldOptions = field.field_options
  const placeholder = fieldOptions['placeholder'] || ''
  const fieldType = field.field_type
  const dataOptions = fieldOptions['options']
  let _readonly = 'readonly'
  const model = Utils.isNotEmpty(type)
    ? type === 'block'
      ? isOne2One
        ? `models.${name}.${prop}`
        : `models.${name}[index].${prop}`
      : `props.row.${prop}`
    : `models.${prop}`
  let template = ''
  // 部分控件需要进行另外的模块输出
  if (Utils.isNotEmpty(type) && type === 'dialog') {
    template = dialogFieldTemplate(fieldType, model, fieldOptions)
    if (Utils.isNotEmpty(template)) {return template}
    _readonly = 'true'
  }
  // 单行文本、 多行文本
  if (fieldType === 'text' || fieldType === 'textarea') {
    template =
  `<el-input
      v-model="${model}"
      placeholder="${placeholder}"
      type="${fieldType}"
      name="${field.name}"
      :autosize="autosize"
      :rows="${fieldOptions.rows || 3}"
      :readonly="${_readonly}"
      clearable
      :style="{width:width}"
    /> `
  // 数字
  } else if (fieldType === 'number') {
    template =
    `
    <ibps-number
      v-model="${model}"
      placeholder="${placeholder}"
      name="${field.name}"
      :readonly="${_readonly}"
      :width="width"
      ${Utils.isNotEmpty(fieldOptions.decimal_places) ? `:precision="${fieldOptions.decimal_places}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.decimal_scale) ? `:decimal-scale="${fieldOptions.decimal_scale}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.keep_decimals) ? `:keep-decimals="${fieldOptions.keep_decimals}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.number_format) ? `number-format="${fieldOptions.number_format}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.currency) ? `currency="${fieldOptions.currency}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.thousands) ? `:thousands="${fieldOptions.thousands}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.is_rounding) ? `:is-rounding="${fieldOptions.is_rounding}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.step) ? `:step="${fieldOptions.step}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.controls) ? `:controls="${fieldOptions.controls}"` : ''}
      ${Utils.isNotEmpty(fieldOptions.position) ? `position="${fieldOptions.position}"` : ''}
    />
    `
    // 保存import语句
    const sentence = "import IbpsNumber from '@platform/components/ibps-number'"
    const component = "'ibps-number': IbpsNumber"
    setSentences(sentence, component)
  // 单项选择
  } else if (fieldType === 'radio') {
    template =
    `<el-radio-group
          v-model="${model}"
          :disabled="${_readonly}"
          ${Utils.isNotEmpty(fieldOptions.arrangement) && fieldOptions.arrangement === 'vertical' ? `class='machine_direction'` : ''}
        > 
        ${dataOptions.map(o => {
    return `
        <component
          :is="'${fieldOptions.button ? 'el-radio-button' : 'el-radio'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          <span style="${Styles.getStyleByName(globalStyle, 'valTypeface', 'valFontSize', 'valBold', 'valColor').replace(/"/g, '&acute;')}">${o.label}</span>
        </component>`
  }).join('')}
      </el-radio-group>`
  // 多选项选择
  } else if (fieldType === 'checkbox') {
    template =
    `<el-checkbox-group
          v-model="${model}"
          :disabled="${_readonly}"
          ${Utils.isNotEmpty(fieldOptions.arrangement) && fieldOptions.arrangement === 'vertical' ? `class='machine_direction'` : ''}
        > 
        ${dataOptions.map(o => {
    return `
          <component
          :is="'${fieldOptions.button ? 'el-checkbox-button' : 'el-checkbox'}'"
          :label="'${o.val}'"` +
          (Utils.isNotEmpty(fieldOptions.border) ? (`
          :border="${fieldOptions.border}
          `) : '') +
          `
          class="ibps-pt-5"
        >
          <span style="${Styles.getStyleByName(globalStyle, 'valTypeface', 'valFontSize', 'valBold', 'valColor').replace(/"/g, '&acute;')}">${o.label}</span>
        </component>`
  }).join('')}
      </el-checkbox-group>`
  //  计数器
  } else if (fieldType === 'inputNumber') {
    template =
    `<el-input-number
      v-model="${model}"
      :max="${fieldOptions.max}"
      :min="${fieldOptions.min}"
      :step="${fieldOptions.step}"
      :controls="${fieldOptions.controls}"
      controls-position="${fieldOptions.controls_position}"
      placeholder="${placeholder}"
      :readonly="${_readonly}"
      :style="{width:width}"
    />`
  // 下拉框
  } else if (fieldType === 'select') {
    template =
    `
    <el-select
      v-model="${model}"
      placeholder="${placeholder}"
      name="${field.name}"
      :disabled="${_readonly}"
      :style="{width:width}"
      clearable
    >
    ${dataOptions.map(o => {
    return `
        <el-option
          key="${o.val}"
          label="${o.label}"
          value="${o.val}"
        />`
  }).join('')}
        
    </el-select>`
  // 开关
  } else if (fieldType === 'switch') {
    if (fieldOptions.appearance === 'checkbox') {
      template =
        `<el-checkbox
          v-model="${model}"
          :disabled="${_readonly}"
        />`
    } else {
      template =
      `
        <el-switch
          v-model="${model}"
          active-value="${fieldOptions.active_value}"
          inactive-value="${fieldOptions.inactive_value}"
          active-text="${fieldOptions.active_text}"
          inactive-text="${fieldOptions.inactive_text}"
          active-color="${fieldOptions.active_color}"
          inactive-color="${fieldOptions.inactive_color}"
          :disabled="${_readonly}"
        />`
    }
  // 滑块
  } else if (fieldType === 'slider') {
    template =
      `<div style="width:99%;">
        <el-slider
          v-model="${model}"
          :show-input="${fieldOptions.show_input}"
          :show-tooltip="${fieldOptions.show_tooltip}"
          :max="${fieldOptions.max}"
          :min="${fieldOptions.min}"
          :step="${fieldOptions.step}"
          :disabled="${_readonly}"
          :style="{width:width}"
        />
      </div>`
  // 评分
  } else if (fieldType === 'rate') {
    template =
      `<el-rate
        v-model="${model}"
        :max="${fieldOptions.max}"
        :allow-half="${fieldOptions.allow_half}"
        ${fieldOptions.show_text ? `show-text="${fieldOptions.show_text}"` : ''}
        ${fieldOptions.show_score ? `show-score="${fieldOptions.show_score}"` : ''}
        :disabled="${_readonly}"
        class="ibps-pt-10"
      />`
  // 日期控件
  } else if (fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate') {
    const type = datePckerType(fieldOptions, fieldType)
    const dateType = dateDealFmt(fieldOptions, fieldType).dateType || 'datetime'
    const _datefmt = datefmt(fieldOptions, fieldType)
    if (type === 'datePicker') {
      template =
      `<el-date-picker
        v-model="${model}"
        type="${dateType}"
        value-format="${_datefmt}"
        format="${_datefmt}"
        placeholder="${placeholder}"
        :style="{width:width}"
        :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : _readonly}"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
      />`
    } else if (type === 'timePicker') {
      template =
        `
        <el-time-picker
          v-model="${model}"
          value-format="${_datefmt}"
          format="${_datefmt}"
          placeholder="${placeholder}"
          :style="{width:width}"
          :readonly="${fieldType === 'currentTime' || fieldType === 'currentDate' ? true : _readonly}"
          :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        />`
    }
  /**
   * 增强字段
   */
  // 富文本框
  } else if (fieldType === 'editor') {
    template = `
      <ibps-ueditor
        v-model="${model}"
        placeholder="${placeholder}"
        :config="ueditorConfig.${prop}"
        :readonly="${_readonly}"
        destroy
      />`
    // 保存import语句
    const sentence = "import IbpsUeditor from '@platform/components/ibps-ueditor'"
    const component = "'ibps-ueditor': IbpsUeditor"
    setSentences(sentence, component)
    const config = {
      initialContent: placeholder,
      toolbars: []
    }
    const toolbars = fieldOptions.toolbars
    if (toolbars && toolbars.length > 0) {
      config.toolbars.push(toolbars)
    }
    setData(ueditorConfig, prop, config)
  // 数据字典
  } else if (fieldType === 'dictionary') {
    template = `
      <ibps-dictionary
        v-model="${model}"
        type-key="${fieldOptions.dictionary}"
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        select-mode="${fieldOptions.select_mode}"
        display-mode="${fieldOptions.display_mode}"
        separator="${fieldOptions.split}"
        placeholder="${placeholder}"
        :disabled="${_readonly}"
        :readonly="${_readonly}"
        :readonly-text="readonlyText?'text':'original'"
        :clearable="${Utils.isNotEmpty(fieldOptions.clearable) ? fieldOptions.clearable : false}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsDictionary from '@platform/business/platform/cat/dictionary/select'"
    const component = "'ibps-dictionary': IbpsDictionary"
    setSentences(sentence, component)
  // 自动编号
  } else if (fieldType === 'autoNumber') {
    template = `<ibps-auto-number
        v-model="${model}"
        alias="${fieldOptions.identity}"
        :init="${fieldOptions.init === 'true' || fieldOptions.init}"
        placeholder="${placeholder}"
        :readonly="${_readonly}"
        :readonly-text="readonlyText"
      />`
    // 保存import语句
    const sentence = "import IbpsAutoNumber from '@platform/business/platform/system/identity/auto-number'"
    const component = "'ibps-auto-number': IbpsAutoNumber"
    setSentences(sentence, component)
    setAutoNumber(prop, fieldOptions.identity, fieldOptions.init)
  // 上传附件
  } else if (fieldType === 'attachment') {
    template = `
      <ibps-attachment
        v-model="${model}"
        placeholder="${placeholder}"
        :download="${fieldOptions.download}"
        :readonly="${_readonly}"
        ${Utils.isNotEmpty(fieldOptions.max_file_quantity) ? `:limit="${fieldOptions.max_file_quantity}"` : ''}
        ${Utils.isNotEmpty(fieldOptions.max_file_size) ? `:file-size="${fieldOptions.max_file_size}"` : ''}
        accept="${fileAccept(fieldOptions).replace(/\s+/g, '')}"
        :multiple="${fieldOptions.multiple}"
        upload-type="${fieldOptions.uploadType}"
        store="${fieldOptions.store}"
        media-type="${fieldOptions.media_type}"
        media="${fieldOptions.media}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsAttachment from '@platform/business/platform/file/attachment/selector'"
    const component = "'ibps-attachment': IbpsAttachment"
    setSentences(sentence, component)
  // 选择器
  } else if (fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg') {
    template = `
      <ibps-user-selector
        v-model="${model}"
        placeholder="${placeholder}"
        type="${fieldOptions.selector_type}"
        ${Utils.isNotEmpty(fieldOptions.filter) ? `filter="${fieldOptions.filter}"` : ''}
        :multiple="${Utils.isNotEmpty(fieldOptions.multiple) ? fieldOptions.multiple : false}"
        store="${fieldOptions.store || 'id'}"
        :disabled="${(fieldType === 'currentUser' || fieldType === 'currentOrg') ? true : _readonly}"
        :readonly-text="readonlyText?'text':null"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsUserSelector from '@platform/business/platform/org/selector'"
    const component = "'ibps-user-selector': IbpsUserSelector"
    setSentences(sentence, component)
  // 自定义对话框
  } else if (fieldType === 'customDialog') {
    template = `
    <ibps-custom-dialog
      v-model="${model}"
      template-key="${fieldOptions.dialog}"
      placeholder="${placeholder}"
      store="${fieldOptions.store}"
      icon="${fieldOptions.icon ? prefix + fieldOptions.icon : ''}"
      type="${fieldOptions.dialog_type}"
      :disabled="${_readonly}"
      :readonly-text="readonlyText?'text':null"
      :style="{width:width}"
    />
    `
    // 保存import语句
    const sentence = "import IbpsCustomDialog from '@platform/business/platform/data/templaterender/custom-dialog'"
    const component = "'ibps-custom-dialog': IbpsCustomDialog"
    setSentences(sentence, component)
  // 关联数据
  } else if (fieldType === 'linkdata') {
    template = `
      <ibps-link-data
        v-model="${model}"
        template-key="${fieldOptions.linkdata}"
        placeholder="${placeholder}"
        :multiple="${Utils.toBoolean(fieldOptions['multiple'] === 'Y', true)}"
        structure="${fieldOptions['link_config'] ? fieldOptions['link_config'].structure || 'list' : 'list'}"
        value-key="${fieldOptions['link_config'] ? fieldOptions['link_config'].id || '' : ''}"
        label-type="${fieldOptions['link_config'] ? fieldOptions['link_config'].type || 'first' : 'first'}"
        label-key="${fieldOptions['link_config'] ? fieldOptions['link_config'].text || '' : ''}"
        :disabled="${_readonly}"
        :readonly="${_readonly}"
        :readonly-text="readonlyText?'text':'original'"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLinkData from '@platform/business/platform/data/templaterender/link-data'"
    const component = "'ibps-link-data': IbpsLinkData"
    setSentences(sentence, component)
  // 地址
  } else if (fieldType === 'address') {
    template = `
    <div>
      <ibps-address
        v-model="${model}"
        ${fieldOptions.size ? `size="${fieldOptions.size}"` : ''}
        top="${fieldOptions.top || 'country'}"
        top-val="${fieldOptions.topval ? fieldOptions.topval : ''}"
        level="${fieldOptions.level || 'district'}"
        :disabled="${_readonly}"
        :readonly-text="readonlyText?'text':null"
        placeholder="${placeholder}"
        data-type="code"
        :style="{width:width}"
      />
      <span v-if="readonlyText">
        ${Utils.isNotEmpty(fieldOptions.street) ? fieldOptions.street : ''}
      </span>
      <template v-else>
        <p />`
    if (fieldOptions.is_street) {
      template += `
        <el-input
          v-model="${Utils.isNotEmpty(type) ? 'props.row.streetValue' : 'models.streetValue'}streetValue"
          :disabled="${_readonly}"
          :style="{width:width}"
          placeholder="${fieldOptions.street_placeholder ? fieldOptions.street_placeholder : ''}"
          type="textarea"
        />
      `
    }
    template += `</template></div>`
    // 保存import语句
    const sentence = "import IbpsAddressCascader from '@platform/components/ibps-address/cascader'"
    const component = "'ibps-address': IbpsAddressCascader"
    setSentences(sentence, component)
  // 签名
  } else if (fieldType === 'signature') {
    template = `
      <ibps-signature
        v-model="${model}"
        placeholder="${placeholder}"
        ${fieldOptions.height ? `height="${fieldOptions.height}` : ''}
        :disabled="${_readonly}"
        :style="{width:width}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsSignature from '@platform/business/platform/form/formrender/dynamic-form/components/signature'"
    const component = "'ibps-signature': IbpsSignature"
    setSentences(sentence, component)
  // 图片
  } else if (fieldType === 'image') {
    template = `
      <ibps-image
        v-model="${model}"
        width="${Utils.isNotEmpty(fieldOptions.width) ? fieldOptions.width : ''}"
        height="${Utils.isNotEmpty(fieldOptions.height) ? fieldOptions.height : ''}"
        limit="${Utils.isNotEmpty(fieldOptions.limit) ? fieldOptions.limit : ''}"
        accept="${imagesAccept(fieldOptions).replace(/\s+/g, '')}"
        media="${Utils.isNotEmpty(fieldOptions.media) ? fieldOptions.media : ''}"
        tip="${Utils.isNotEmpty(fieldOptions.tip) ? fieldOptions.tip : ''}"
        size="${Utils.isNotEmpty(fieldOptions.size) ? fieldOptions.size : ''}"
        upload-type="${Utils.isNotEmpty(fieldOptions.uploadType) ? fieldOptions.uploadType : ''}"
        :disabled="${_readonly}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsImage from '@platform/business/platform/file/image'"
    const component = "'ibps-image': IbpsImage"
    setSentences(sentence, component)
  // 链接
  } else if (fieldType === 'hyperlink') {
    template = `
      <ibps-link
        text="${fieldOptions.text}"
        link="${fieldOptions.link}"
        show-type="${fieldOptions.showType}"
        text-type="${fieldOptions.textType}"
        link-type="${fieldOptions.linkType}"
        text-javascript="${fieldOptions.text_javascript}"
        type="${fieldOptions.type}"
        :form-data="dynamicForm"
        preview-entrance
        icon="${fieldOptions.icon ? prefix + fieldOptions.icon : ''}"
      />
    `
    // 保存import语句
    const sentence = "import IbpsLink from '@platform/components/ibps-link'"
    const component = "'ibps-link': IbpsLink"
    setSentences(sentence, component)
  // 文本
  } else if (fieldType === 'label') {
    template = `<span>
        ${fieldOptions.default_value ? fieldOptions.default_value : placeholder}
      </span>`
  }
  return template
}
// 其他字段
function generateOtherFieldTemplate(field) {
  const fieldType = field.field_type
  let template = ''
  // 描述
  if (fieldType === 'desc') {
    if (Utils.isNotEmpty(field)) {
      template = `
        <div class="ibps-desc">
          <div class="title">${field.label}</div>
          ${field.field_options && field.field_options.split_line ? `
          <div class="ibps-${field.field_options.line_style || 'dashed'}  divider" />
          ` : ''}
          ${field && field.desc ? `
          <div
            class="desc"
            v-html="'${Utils.formatText(field.desc).replace(/"/g, '&quot;').replace(/"/g, '&acute;')}'"
          />
          ` : ''}
        </div>
      `
    }
  // 分隔线
  } else if (fieldType === 'divider') {
    template =
      `
      <div>
        <el-divider
          content-position="${field.field_options.content_position}"
        >${field.label}
        </el-divider>
        ${field && field.desc ? `
        <div class="ibps-help-block">
          ${field.desc}
        </div>` : ''}
      </div>
      `
  // 警告
  } else if (fieldType === 'alert') {
    template =
    `
    <div class="ibps-pb-10">
      <el-alert
        title="${field.label}"
        description="${field.desc}"
        type="${field.field_options.type}"
        :closable="${field.field_options.closable}"
        close-text="${field.field_options.close_text}"
        :center="${field.field_options.center}"
        :show-icon="${field.field_options.show_icon}"
        effect="${field.field_options.effect}"
      />
    </div>
    `
  }
  return template
}
// 格式类型
function fileAccept(fieldOptions) {
  const mediaType = fieldOptions.media_type
  if (Utils.isEmpty(mediaType)) {return '*'}
  return ACCEPT[mediaType] || '*'
}
function imagesAccept(fieldOptions) {
  const accept = fieldOptions.accept
  if (Utils.isEmpty(accept)) {return ACCEPT['images']}
  if (accept === 'custom') {
    return fieldOptions.media
  }
  return accept
}
// 生成按钮事件模版
function setBtnEventTemplate(eventName, columns, mode, name) {
  let addEvent = ''
  let addEventName = ''
  let removeEvent = ''
  // 删除事件内容
  if (mode === 'block') {
    removeEvent = `
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.models[name].splice(index, 1)
            this.$message({
              message: '批量删除成功',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
  `
  } else {
    removeEvent = `
          // eslint-disable-next-line no-case-declarations
          const _temps = this.$refs[tableName].selection
          if (_temps && _temps.length > 0) {
            this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.models[name] = this.models[name].filter(item => {
                return !_temps.includes(item)
              })
              this.$message({
                message: '批量删除成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          } else {
            this.$message({
              message: '当前没有选择数据，请先选择数据',
              type: 'warning'
            })
          }`
  }
  if (mode === 'dialog') {
    hasDialogTable = true
    addEventName = `handleDialogModeBy${name}`
    addEvent = `
    ${addEventName}(name,index){
      this.dialogFormName = name
      const data = this.$utils.isNotEmpty(index) ? this.models[name][index] : {}
      this.dialogFormData = {
        responses: JSON.parse(JSON.stringify(data)),
      }
      const attrs = {
        hide_name: true
      }

      this.dialogFormIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.dialogFormDef = {
        code: name,
        attrs: attrs,
        fields: ${JSON.stringify(columns)}
      }
      // 表单
      this.formDialogVisible = true
    },
    /**
    * 对话框模式表单返回值
    */
    handleFormDialogActionEvent(key, data) {
      if (this.dialogFormIndex > -1) {
        // todo: 修改时触发
      } else {
        this.models[this.dialogFormName].push(data)
        this.dialogFormName = ''
      }
      this.formDialogVisible = false
    }`
  } else {
    addEventName = `handleAddBy${name}`
    addEvent = `
    ${addEventName}(name){
      // 为表格增加数据
      if(!(this.models[name] && Array.isArray(this.models[name]))){
        this.models[name] = []
      }
      this.models[name].push({
        ${columns.map(item => {
    if (item.field_type === 'checkbox' || item.field_type === 'table') {
      return item.name + ':[]'
    } else {
      return item.name + ":''"
    }
  }).join(',\n')}
          })
    }`
  }
  // 为表格增加数据
  let _params = 'type,name,tableName'
  if (mode === 'block') {_params += ',index'}
  const _temp = `
    ${eventName}(${_params}){
      // todo
      // 弹窗、表内编辑模式：修改、删除可根据this.$refs[tableName].selection获取选中行的数据
      // 块模式：删除直接下标进行删除
      switch (type) {
        case 'add':
          console.info('新增')
          this.${addEventName}(name)
          break
          case 'edit':
            console.info('修改')
            break
          case 'remove':
            console.info('删除')
            ${removeEvent}
          break
        case 'import':
          console.info('导入')
          break
        case 'export':
          console.info('导出')
          break
        case 'custom':
          // 新增自定义对话框按钮
          break
        default:
          break
      }
    },${addEvent}
  `
  eventTemplate.push(_temp)
}
// 保存import语句
function setSentences(sentence, component) {
  if (!sentences.includes(sentence)) {
    sentences.push(sentence)
    components.push(component)
  }
}
// 日期格式
function datefmt(fieldOptions, fieldType) {
  if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
    if (fieldType === 'currentDate') {
      return FormOptions.t.DATE_FORMATS['date']
    } else if (fieldType === 'currentTime') {
      return FormOptions.t.DATE_FORMATS['time']
    } else {
      return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
    }
  } else {
    return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
  }
}
/**
 * 日期格式处理
 */
function dateDealFmt(fieldOptions, fieldType) {
  return DateFormatUtil.dealFmt(datefmt(fieldOptions, fieldType))
}
// 日期控件类型
function datePckerType(fieldOptions, fieldType) {
  return dateDealFmt(fieldOptions, fieldType).datePckerType
}
// 去除字符串引号
function dislodgeQuotationMarks(str, item) {
  validators.forEach(el => {
    str = str.replace(new RegExp(`"${item}":"${el}"`, 'gm'), `"${item}":${el}`)
    str = str.replace(new RegExp(`'${item}':'${el}'`, 'gm'), `'${item}':${el}`)
  })
  return str
}
/**
 * 生成模版
 * @param {*} formDef
 */
export default function(formDef) {
  if (Utils.isNotEmpty(formDef) && Utils.isNotEmpty(formDef.attrs) && Utils.isNotEmpty(formDef.attrs.styles)) {
    globalStyle = formDef.attrs.styles
  } else {
    globalStyle = {}
  }
  sentences = []
  components = []
  styles = []
  formRules = []
  validators = []
  layoutVal = []
  eventTemplate = []
  autoNumbers = []
  autoNumberIdentities = []
  autoNumberEvent = ''
  btnEvent = ''
  returnSocpe = ''
  btns = {}
  stepsEvent = ''
  stepsActive = {}
  ueditorConfig = {}
  hasDialogTable = false
  // 表单数据
  const formAttrs = formDef ? formDef.attrs || {} : {}
  const hasHeader = formAttrs && !formAttrs.hide_name
  const hasDesc = formAttrs && !formAttrs.hide_desc && Utils.isNotEmpty(formDef.desc)
  const titlePosition = formAttrs.title_position === 'center' ? 'ibps-tc' : (formAttrs.title_position === 'right' ? 'ibps-tr' : '')
  const inline = formAttrs.inline || false
  const labelSuffix = formAttrs ? (formAttrs.colon ? formAttrs.labelSuffix || ':' : '') : ''
  const labelWidth = Utils.isNotEmpty(formAttrs.labelWidth) && Utils.isNotEmpty(formAttrs.labelWidthUnit) ? (formAttrs.labelWidth + formAttrs.labelWidthUnit) : '100px'
  const labelPosition = Utils.isNotEmpty(formAttrs.labelPosition) ? formAttrs.labelPosition : 'right'
  const statusIcon = Utils.isNotEmpty(formAttrs.statusIcon) ? formAttrs.statusIcon : false
  const hideRequiredAsterisk = Utils.toBoolean(formAttrs.hideRequiredAsterisk, false)
  // 判断是否为弹窗显示
  const _show = formAttrs.generateCodeDialog || false
  // 表单数据
  const models = {}
  descPosition = formDef.attrs ? formDef.attrs.descPosition : ''
  generateModles(formDef.fields, models)
  // 表单模版
  const formeTmpale = generateFormTempale(formDef.fields)
  let temp = ''
  if (Utils.isNotEmpty(autoNumbers)) {
    temp = `
    created(){
      `
    autoNumbers.forEach((el, i) => {
      temp += `
        this.initAuto('${autoNumberIdentities[i]}','${el}')
        `
    })
    temp += `
    },
    `
  }
  if (hasDialogTable) {
    // 保存import语句
    const sentence = "import FormrenderDialog from '@platform/business/platform/form/formrender/dialog'"
    const component = "'formrender-dialog': FormrenderDialog"
    setSentences(sentence, component)
  }
  let template = `<template>
  ${_show ? `
  <el-dialog
    title="${formDef.name}"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-generate-form"
    fullscreen
    destroy-on-close
    @open="getFormData"
    @close="closeDialog"
  >` : ''}
    <ibps-container type="full" class="generate-form page">
      <div class="dynamic-form-container" style="${Styles.getStyle(globalStyle)}">
        <div class="dynamic-form" style="${Styles.getShadowByName(globalStyle, 'shadow') + Styles.getBgColorByName(globalStyle, 'styleBgColor')}">`
  if (Utils.isNotEmpty(globalStyle) &&
    Utils.isNotEmpty(globalStyle.headerDisplay) &&
    globalStyle.headerDisplay === 'show') {
    template += `
          <!-- 页眉 -->
          <div class="ibps-page-header">`
    let style = Styles.getStyleByName(globalStyle, 'headerTypeface', 'headerFontSize', 'headerBold', 'headerColor', 'headerAlignment') +
      Styles.getBgColorByName(globalStyle, 'headerBgColor')
    if (globalStyle.headerType === 'text') {
      template += `
            <div
              class="page-header-text"
              style="${style.replace(/"/g, '&quot;')}"
            >
              ${globalStyle.headerText}
            </div>`
    } else if (globalStyle.headerType === 'sola') {
      style = Styles.getStyleByName(globalStyle, '', '', '', '', 'headerLayout') +
        Styles.getBgColorByName(globalStyle, 'headerBgColor')
      template += `
            <div
              class="page-header-sola"
              style="display: grid;${style.replace(/"/g, '&quot;')}"
            >
            ${Styles.getImageByName(globalStyle, 'headerPicture').map(el => {
    return `<el-image fit="cover" src="${el}" style="width:100%;" />`
  }).join(',\n')}
            </div>`
    } else {
      template += `
            <div class="page-header-carousel">
              ${
  Utils.isNotEmpty(globalStyle.headerCarousel) ? `
              <el-carousel indicator-position="outside" trigger="click" height="300px">
              ${Styles.getImageByName(globalStyle, 'headerCarousel').map(el => {
    return `
                <el-carousel-item style="text-align:center;${Styles.getBgColorByName(globalStyle, 'headerBgColor')}">
                  <el-image fit="contain" style="height: 100%;" src="${el}" />
                </el-carousel-item>`
  }).join(',\n')}
              </el-carousel>
                ` : ''
}
            </div>`
    }
    template += `
          </div>`
  }
  template += `
        <!--顶部按钮 请根据实际添加-->
        ` + (hasHeader ? `
        <!--表头-->
        <div class="form-header">
          <div
            class="title${titlePosition ? ' ' + titlePosition : ''}"
            style="${Styles.getStyleByName(globalStyle, 'titleTypeface', 'titleFontSize', 'titleBold', 'titleColor', 'titleAlignment').replace(/"/g, '&quot;')}"
          >${formDef.name}</div>` : '')
  if (hasDesc) {
    let result = false
    if (Utils.isNotEmpty(globalStyle.isFold) && globalStyle.isFold) {
      result = true
    }
    template += `
          <div ref="desc" class="desc " :class="${result} && isFold? 'desc-details':''" v-html="'${Utils.formatText(formDef.desc).replace(/"/g, '&quot;').replace(/"/g, '&acute;')}'" />
          <div v-if="${result} && isShow" class="desc-contract">
            <el-button v-if="isFold" type="text" @click="toggleIsFold">展开<i class="ibps-icon-angle-double-down" /></el-button>
            <el-button v-else type="text" @click="toggleIsFold">收起<i class="ibps-icon-angle-double-up" /></el-button>
          </div>
      `
  }
  template += `
            <el-form
              ref="form"
              :model="models"
              ${Utils.isNotEmpty(formRules) ? `:rules="rules"` : ''}
              :inline="inline"
              :label-suffix="labelSuffix"
              :label-width="labelWidth"
              :label-position="labelPosition"
              :status-icon="statusIcon"
              :size="size"
              :hide-required-asterisk="hideRequiredAsterisk"
              style="padding: 20px;"
              @submit.native.prevent
            >
              ${formeTmpale}
              ${formeTmpale ? `
              <el-form-item class="ibps-tc">
                <ibps-toolbar
                  ref="toolbar"
                  :actions="actions"
                  @action-event="handleButtonEvent"
                />
              </el-form-item>
              ` : ''}
            </el-form>
          </div>
        </div>
      </div>
      ${hasDialogTable ? `
      <formrender-dialog
        :visible="formDialogVisible"
        title="新增/修改数据"
        :form-def="dialogFormDef"
        :data="dialogFormData"
        :mode="mode"
        custom-class="ibps-dialog-80"
        top="5vh"
        @close="visible=>formDialogVisible = visible"
        @action-event="handleFormDialogActionEvent"
      />` : ''}
    </ibps-container>
  ${_show ? `
  </el-dialog>` : ''}
</template>
<script>
${Utils.isNotEmpty(autoNumbers) ? `import { getNextIdByAlias } from '@platform/api/platform/system/identity'` : ''}
${Utils.isNotEmpty(validators) ? `import { ${validators.join(', ')} } from '@platform/utils/validate'` : ''}
${sentences.join('\n')}
  export default {
    ${components && components.length > 0 ? `
    components: {
      ${components.join(',\n')}
    },` : ''}
    ${_show ? `
    props: {
      visible: {
        type: Boolean,
        default: true
      }
    },` : ''}
    data () {
      return {
        ${_show ? `
        dialogVisible: false,` : ''}
        ${hasDialogTable ? `
        dialogFormName: '',
        formDialogVisible:false,
        dialogFormIndex: -1,
        dialogFormData: {},
        mode: 'dialog',
        dialogFormDef: {},` : ''}
        dynamicForm: this,
        models:${JSON.stringify(models)},
        inline:${inline},
        labelSuffix:'${labelSuffix}',
        labelWidth:'${labelWidth}',
        labelPosition:'${labelPosition}',
        statusIcon:${statusIcon},
        size:'',
        hideRequiredAsterisk:${hideRequiredAsterisk},
        ${hasDesc ? `
        isFold: true,
        isShow: false,
        ` : ''}
        readonly:false,
        readonlyText:true,
        multiple:false,
        autosize:'',
        width:'',
        actions:[
          {
            key: 'submit',
            label: '提交',
            type: 'primary',
          },
          {
            key: 'reset',
            label: '重置'
          }
        ]
        ${Utils.isNotEmpty(layoutVal) ? `,formLayout:{${layoutVal.join(',')}}` : ''}
        ${Utils.isNotEmpty(formRules) ? ',rules:{' + dislodgeQuotationMarks(formRules.join(',\n'), 'validator') + '}' : ',rules:{}'}
        ${Utils.isNotEmpty(btns) ? `,manageButtons:${JSON.stringify(btns)}` : ''}
        ${Utils.isNotEmpty(stepsActive) ? `,stepsActive:${JSON.stringify(stepsActive)}` : ''}
        ${Utils.isNotEmpty(ueditorConfig) ? `,ueditorConfig:${JSON.stringify(ueditorConfig)}` : ''}
      }
    },
    ${Utils.isNotEmpty(returnSocpe) ? `
    computed: {
      ${returnSocpe}
    },
    ` : ''}
    watch: {
      ${_show ? `
      visible: {
        handler: function(val, oldVal) {
          this.dialogVisible = this.visible
        },
        immediate: true
      },` : ''}
      models: {
        handler(val) {
          // 延迟验证
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.form.validate(() => {})
            }, 10)
          })
        },
        deep: true
      }
    },
    ${temp}
    ${hasDesc ? `
    mounted() {
      this.isTooLong()
    },` : ''}
    methods: {
      ${stepsEvent}
      ${btnEvent}
      ${_show ? `
      // 关闭当前窗口
      closeDialog() {
        this.dialogVisible = false
        this.$emit('close', false)
      },
      getFormData() {
        console.info('弹窗打开触发的事件')
      },` : ''}
      handleSave () {
        console.info(this.models)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.info(this.models)
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleButtonEvent(button,data){
        console.info(button,data)
        switch (button.key) {
          case 'submit':
            this.submitForm('form')
            break
          case 'reset':
            this.resetForm('form')
            break
          default:
            break
        }
      }${hasDesc ? `,
      isTooLong() {
        this.$nextTick(() => {
          const data = this.$refs.desc
          if (this.$utils.isNotEmpty(data) && this.$utils.isNotEmpty(data.scrollHeight)) {
            this.isShow = data.scrollHeight > 80
          } else {
            this.isShow = false
          }
        })
      },
      toggleIsFold() { // 改变标题描述的收缩显示
        this.isFold = !this.isFold
      }` : ''}
      ${Utils.isNotEmpty(autoNumberEvent) ? `,${autoNumberEvent}` : ''}
      ${Utils.isNotEmpty(eventTemplate) ? `,${eventTemplate.join(',')}` : ''}
    }
  }
</script>
<style lang="scss">
@import "@platform/assets/styles/components/form-generation";
${_show ? `
.ibps-generate-form{
  .el-dialog__body{
    height:  100%;
    position: relative;
  }
}` : ''}
.generate-form{
  .ibps-container-full__body{
    padding: 0!important;
  }
  .dynamic-form {
    .el-input{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
  
    .el-collapse-item__header.is-active{
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 5px;
    }
    .form-header {
      border-bottom: 1px solid #2b34410d;
      margin-bottom: 5px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #222;
        text-align: left;
        padding: 8px 10px 10px;
        margin: 0;
      }
      .desc {
        word-wrap: break-word;
        word-break: normal;
        text-indent: 0;
        line-height: 1.6;
        margin: 0 0 11px;
        padding: 3px 30px 8px;
      }
    }
    .dynamic-form-table-item__readonly{
      margin-bottom: 0;
    }
  
  //===================border-form====================
    .ibps-border-form {
      border: 1px solid #cfd7e5;
  
      .el-form-item{
        border-top: 1px solid #cfd7e5;
      }
  
      .el-form-item__content:before {
        width: 1px;
        background: #cfd7e5;
        display: block;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom:-20px;
      }
  
      .el-form-item__content .el-form-item__error {
        left: 5px
      }
  
      .el-form--label-top .el-form-item__content:before,
      .no-label-form-item .el-form-item__content:before {
        background: transparent
      }
  
      .el-row+.el-row {
        border-top: 1px solid #cfd7e5
      }
  
      .el-col+.el-col {
        border-left: 1px solid #cfd7e5
      }
  
      .el-col {
        overflow: hidden
      }
  
      .el-form-item__content {
        padding: 5px;
        padding-bottom: 0
      }
  
      .el-form-item__label {
        padding: 5px
      }
  
      .el-table{
        .el-form-item{
            border-top: 0;
        }
        .el-form-item__content:before {
          width: 0;
        }
        .el-form-item__content {
          padding: 0;
        }
  
      }
  
    }
    .machine_direction{
      display: flex;
      flex-direction: column;
    }
    .edui-editor{
      z-index: 1000!important;
    }
  
  }
  ${styles.join(',\n')}
}
</style>
`
  return template
}
