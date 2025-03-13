<script>
import { TimeSelect } from 'element-ui'

export default {
  name: 'CpisTimeSelect',
  extends: TimeSelect,
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    bordered: {
      type: Boolean,
      default: true
    },
    startPlaceholder: {
      type: String,
      default: '请选择'
    },
    endPlaceholder: {
      type: String,
      default: '请选择'
    }
  }
}
</script>

<style>
.el-date-editor--time-select .el-input__prefix {
  left: unset;
  right: 5px;
}
.el-date-editor--time-select .el-input.is-active .el-input__inner,
.el-date-editor--time-select .el-input__inner:focus {
  @apply border-primary-6;
}
</style>
