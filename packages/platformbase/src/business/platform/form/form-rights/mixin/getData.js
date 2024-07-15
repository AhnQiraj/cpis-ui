import { getPermission } from '@platform/api/platform/form/formRights'
import { nestedFieldTypes } from '@platform/business/platform/form/constants/fieldTypes'
export default {
  props: {
    formKey: String,
    flowKey: String,
    nodeId: String,
    parentFlowKey: String,
    dataTemplateKey: String,
    isInst: Boolean,
    init: Boolean,
    temporaryData: [Object, String],
    rightsType: { // 权限类型
      type: String,
      default: 'form'
    },
    isSave: { // 是否保存
      type: Boolean,
      default: false
    },
    permission: Object // 权限数据
  },
  data() {
    return {
      rootData: {}
    }
  },
  beforeDestroy() {
    this.rootData = null
  },
  methods: {
    getRightsList(rightRow) {
      const arr = []
      for (let i in rightRow) {
        if (Object.prototype.toString.call(rightRow[i]) === '[object Array]') {
          arr.push(i)
        }
      }
      return arr
    },
    getRightsParams() {
      const {
        formKey,
        flowKey,
        nodeId,
        parentflowKey,
        dataTemplateKey,
        isInst,
        rightsType,
        init
      } = this
      return {
        dataTemplateKey: dataTemplateKey || null,
        formKey: formKey || null,
        flowKey: flowKey || null,
        nodeId: nodeId || null,
        parentflowKey: parentflowKey || null,
        isInst: isInst || false,
        init: init || false,
        rightsScope: rightsType || 'form'
      }
    },
    getFormData() {
      this.rigthsTypes = JSON.parse(JSON.stringify(this.default))
      if (!this.isSave && this.$utils.isNotEmpty(this.permission)) {
        this.handlePermissionData(this.permission)
      } else {
        this.loadPermission()
      }
    },
    loadPermission() {
      const formParams = this.getRightsParams()
      formParams.rightsType = this.rightsType || 'form'
      this.dialogLoading = true
      getPermission(formParams).then(response => {
        this.dialogLoading = false
        this.handlePermissionData(response.data)
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    handlePermissionData(data) {
      this.rootData = JSON.parse(JSON.stringify(data))
      let temporaryData = null
      // const temporaryData = JSON.parse(JSON.stringify(this.temporaryData.permission || []))
      if (this.$utils.isNotEmpty(this.temporaryData)) {
        temporaryData = JSON.parse(JSON.stringify(this.temporaryData.permission))
      } else {
        temporaryData = []
      }
      const checkTemporaryData = this.$utils.isNotEmpty(temporaryData)
      const rootData = this.rootData
      if (checkTemporaryData) {
        let table = []
        const child = []
        let subfield = []
        //  存储的单个或多个子表字段
        rootData.table.forEach(r => {
          if (r.isMain === 'N') {
            subfield = subfield.concat(r.fields)
          }
        })
        // 数据结构处理
        rootData.table.forEach((t, index) => {
          if (t.isMain === 'Y') {
            t.fields = this.fieldFilteringSupplement(t.fields, temporaryData.field)
            table.push(t)
          } else if (t.isMain === 'N') {
            temporaryData.table.forEach(i => {
              if (t.name === i.name) {
                i.isMain = rootData.table[index].isMain
                i.label = rootData.table[index].label
                temporaryData.button.forEach(b => {
                  if (b.code === i.code) {
                    if (!i.buttons) {
                      i.buttons = []
                    }
                    i.buttons.push(b)
                  }
                })
                // 如果权限字段有新增或减少
                if (subfield.length !== temporaryData.subfield.length) {
                  temporaryData.subfield = this.fieldFilteringSupplement(subfield, temporaryData.subfield)
                }
                temporaryData.subfield.forEach(s => {
                  if (s.code === i.code) {
                    if (!i.fields) {
                      i.fields = []
                    }
                    i.fields.push(s)
                  }
                })
                child.push(i)
              }
            })
          }
        })
        table = table.concat(child)
        this.rightsFormData = table
      } else {
        const listData = JSON.parse(JSON.stringify(data.table))
        listData.forEach(l => {
          l.fields.forEach(lf => {
            if (nestedFieldTypes.indexOf(lf.field_type) > -1) {
              data.table.forEach(d => {
                d.fields.forEach((df, i) => {
                  if (nestedFieldTypes.indexOf(df.field_type) > -1) {
                    d.fields.splice(i, 1)
                  }
                })
              })
            }
          })
        })
        this.rightsFormData = data.table
      }
      this.opinion = this.$utils.isNotEmpty(temporaryData.opinion) ? temporaryData.opinion : data.opinion
    },
    // 权限字段变更,用于字段在表单管理字段二次调整时的初始化更新。
    fieldFilteringSupplement(d1, d2) {
      const result = []
      for (const key in d1) {
        let stra = d1[key]
        for (let j = 0; j < d2.length; j++) {
          const strb = d2[j]
          if (stra.name === strb.name && stra.code === strb.code) {
            stra = Object.assign({}, d2[j])
            stra.label = d1[key].label
            break
          }
        }
        result.push(stra)
      }
      return result
    },
    /**
     * 获取提交
     */
    getSaveData() {
      const permission = {
        field: [],
        subfield: [],
        table: [],
        button: [],
        opinion: []
      }
      const {
        rightsFormData,
        opinion
      } = this
      rightsFormData.forEach(item => {
        if (item.isMain === 'Y') {
          permission['field'] = permission['field'].concat(item.fields)
        }
        if (item.isMain === 'N') {
          const subTable = {
            code: '',
            name: '',
            read: {},
            edit: {},
            required: {},
            hide: {}
          }
          permission['subfield'] = permission['subfield'].concat(item.fields)
          for (const i in item) {
            for (const l in subTable) {
              if (i === l) {
                subTable[l] = item[i]
                subTable['code'] = subTable['name']
              }
            }
          }
          permission['table'].push(subTable)
          const button = this.$utils.isEmpty(item.buttons) ? [] : item.buttons.map((button) => {
            button['code'] = subTable['code']
            return button
          })
          permission['button'] = permission['button'].concat(button)
        }
      })
      const rootType = ['all', 'none']
      opinion.forEach(item => {
        this.rightsList.forEach(i => {
          if (this.$utils.isEmpty(item[i])) {return} // 暂时处理后端字段暂无的情况。
          item[i].forEach((v, l) => {
            if (rootType.includes(v.type)) {
              item[i][l] = this.rootDatas(item[i][l].type)
            }
          })
        })
      })
      permission.opinion = opinion
      // const formParams = this.getRightsParams()
      // formParams.permission = permission
      if (this.type === 'bpm') {
        const bpmSaveRightData = {}
        bpmSaveRightData.formKey = this.formKey
        bpmSaveRightData.flowKey = this.flowKey
        bpmSaveRightData.nodeId = this.nodeId || null
        bpmSaveRightData.parentflowKey = this.parentFlowKey || null
        bpmSaveRightData.isInst = this.isInst
        bpmSaveRightData.rightsScope = this.rightsType
        bpmSaveRightData.permission = permission
        bpmSaveRightData.permissionLabel = this.rootData
        return bpmSaveRightData
      } else {
        return permission
      }
    },
    rootDatas(type, rightsId = '', rightsName = '') {
      return {
        type: type,
        rightsId: rightsId,
        rightsName: rightsName
      }
    },
    initButtonType() {
      const rigthGroup = this.rigthGroup
      rigthGroup.forEach(rigth => {
        rigth.buttonGroup.forEach(button => {
          button.type = ''
        })
      })
    }
  }
}
