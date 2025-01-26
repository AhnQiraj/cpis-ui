<script>
import { Form } from 'element-ui'
export default {
  name: 'CpisForm',
  extends: Form,
  provide() {
    return {
      form: this
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  padding: 8px;
}
</style>
