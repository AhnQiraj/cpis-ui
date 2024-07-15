import { debounce } from 'lodash'
/**
 * 显示字段
 */
export default {
  props: {
    displayField: {
      type: Boolean,
      default: false
    },
    displayFieldData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      displayFieldVisible: false,
      displayFields: []
    }
  },
  watch: {
    displayFieldData: {
      handler(val, oldVal) {
        if (this.displayField) {
          if (this.$utils.isNotEmpty(this.displayFieldData)) {
            this.displayFields = JSON.parse(JSON.stringify(this.displayFieldData))
          } else {
            const displayFields = []
            this.columns.filter((column) => {
              if (!column.hidden) {
                displayFields.push(column)
              }
            })
            this.displayFields = JSON.parse(JSON.stringify(displayFields))
          }
        }
      },
      deep: true,
      immediate: true
    },
    displayFields() {
      debounce(this.handleTableHeight, 100)()
    }
  },
  beforeDestroy() {
    this.displayFields = null
  },
  methods: {
    handleDisplayField(data) {
      this.$emit('display-field-change', data, (r) => {
        if (r) {
          this.displayFieldVisible = false
          this.displayFields = this.$utils.isNotEmpty(data) ? JSON.parse(JSON.stringify(data)) : this.columns
        }
      })
    }
  }
}
