export default {
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    types: {
      type: String
    },
    boData: {
      type: Array
    },
    formType: {
      type: String,
      default: 'form'
    },
    fields: {
      type: Array
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    },
    code() {
      return this.fieldItem.code
    },
    isSub() {
      return !!this.fieldItem.isSub
    },
    // 业务对象的字段
    boFields() {
      if (this.$utils.isEmpty(this.boData)) {
        return []
      }
      if (this.fieldType === 'table') {
        return this.boData.filter((bo) => {
          return bo.type === 'table'
        })
      } else {
        const isClob = this.fieldType === 'bpmInstHis'
        if (this.isSub) {
          if (this.$utils.isNotEmpty(this.code)) {
            return this.boData.filter((bo) => {
              return bo.attrType === 'subField' && bo.tableName === this.code && (isClob ? bo.type === 'clob' : true)
            })
          } else {
            return []
          }
        } else {
          return this.boData.filter((bo) => {
            return bo.attrType === 'field' && (isClob ? bo.type === 'clob' : true)
          })
        }
      }
    }
  },
  methods: {
    setDefaultValue() {
      if (this.fieldOptions.default_value_type === 'fixed') {
        this.fieldOptions.default_value = ''
      }
      this.fieldOptions.link_linkage = []
    }
  }
}
