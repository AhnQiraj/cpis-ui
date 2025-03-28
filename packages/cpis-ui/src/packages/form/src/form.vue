<script>
import { Form } from 'element-ui'
export default {
  name: 'CpisForm',
  extends: Form,
  provide() {
    return {
      form: this,
      elForm: this
    }
  }
}
</script>
<style lang="scss">
.el-form {
  padding: 8px;
}
.el-dialog .cpis-dialog__body .el-form {
  padding: 0;
}
</style>
