<script>
import { DatePicker } from 'element-ui'

export default {
  name: 'CpisSearchDate',
  extends: DatePicker
}
</script>

<style scoped lang="scss">
::v-deep .el-input__inner {
  padding-left: 10px;
}
::v-deep .el-input__prefix {
  left: unset;
  right: 5px;
}
::v-deep .el-input__prefix:has(~ .el-input__suffix .el-icon-circle-close) {
  display: none;
}
::v-deep .el-input.is-active .el-input__inner,
::v-deep .el-input__inner:focus {
  @apply border-primary-6;
}
</style>
