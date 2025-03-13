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

.el-date-editor .el-range__icon {
  margin-left: 0;
}
// 日期区间选择器和日期时间区间选择器的图标,使用 order 控制图标到末尾位置
.el-date-editor--daterange .el-icon-date,
.el-date-editor--datetimerange .el-icon-time,
.el-date-editor--daterange .el-range__close-icon,
.el-date-editor--datetimerange .el-range__close-icon {
  margin-left: auto; // 移动到最左面
  order: 1;
}
// 日期区间选择器和日期时间区间选择器的关闭图标,因为是flex布局,不display:none的会占用位置
.el-date-editor--daterange .el-range__close-icon,
.el-date-editor--datetimerange .el-range__close-icon {
  display: none;
}

// 现在 关闭按钮和日期图标在同一个位置, 所以需要存在关闭按钮(hover的时候会显示)隐藏日期图标
.el-date-editor--daterange .el-icon-date:has(~ .el-icon-circle-close),
.el-date-editor--datetimerange .el-icon-time:has(~ .el-icon-circle-close) {
  display: none;
}
.el-date-editor--daterange .el-icon-circle-close,
.el-date-editor--datetimerange .el-icon-circle-close {
  display: block;
}

.el-date-editor.el-range-editor.el-input__inner {
  @apply px-[5px];
}
</style>
