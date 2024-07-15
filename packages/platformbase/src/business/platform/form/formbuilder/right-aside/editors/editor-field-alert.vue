<template>
  <div>
    <el-form-item label="主题类型">
      <el-select v-model="fieldOptions.type" placeholder="请选择主题类型" style="width:95%">
        <el-option
          v-for="item in alertTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <el-link :underline="false" :type="item.value === 'error'?'danger':item.value" class="ibps-fl">{{ item.label }}</el-link>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <template slot="label">主题</template>
      <el-radio-group v-model="fieldOptions.effect">
        <el-radio-button label="light">light</el-radio-button>
        <el-radio-button label="dark">dark</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
import { alertTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      alertTypeOptions
    }
  }
}
</script>
