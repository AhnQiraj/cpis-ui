<script>
import { DatePicker } from 'element-ui'

export default {
  name: 'CpisDatePicker',
  extends: DatePicker,
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

<style scoped lang="scss">
// 输入框的日历图标的位置
::v-deep .el-input__prefix {
  left: unset;
  right: 5px;
}
// 日历图标和close 图标兼容显示问题
::v-deep .el-input__prefix:has(~ .el-input__suffix .el-icon-circle-close) {
  display: none;
}
// border 样式，解决跟随主题色切换
::v-deep .el-input.is-active .el-input__inner,
::v-deep .el-input__inner:focus {
  @apply border-primary-6;
}
</style>
