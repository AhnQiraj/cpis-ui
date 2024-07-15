<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">流水号<help-tip prop="identity" /></template>
        <ibps-identity-selector v-model="fieldOptions.identity" value-key="alias" />
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div>初始化生成<help-tip prop="identityInit" /></div>
        </template>
        <el-switch v-model="fieldOptions.init" @change="changeInit" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import IbpsIdentitySelector from '@platform/business/platform/system/identity/selector'
import EditorMixin from '../mixins/editor'
export default {
  components: {
    IbpsIdentitySelector
  },
  mixins: [EditorMixin],
  methods: {
    changeInit(val) {
      if (val) {
        this.fieldItem.field_options.placeholder = ''
      } else {
        this.fieldItem.field_options.placeholder = '自动生成无需填写'
      }
    }
  }
}
</script>
