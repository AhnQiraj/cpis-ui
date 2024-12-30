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
