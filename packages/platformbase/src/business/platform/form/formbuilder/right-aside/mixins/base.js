import FIELD_TYPES from '@platform/business/platform/form/constants/fieldTypes'
export default {
  computed: {
    fieldTypeData() {
      return FIELD_TYPES[this.fieldItem.field_type] || {}
    },
    label() {
      return this.fieldTypeData['label'] || ''
    },
    icon() {
      return this.fieldTypeData['icon'] || ''
    }
  }
}
