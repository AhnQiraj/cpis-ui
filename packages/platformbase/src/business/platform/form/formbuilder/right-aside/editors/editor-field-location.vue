<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      定位设置
    </div>
    <div class="panel-body">
      <div class="el-form-item ibps-mb-5">
        <div class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.lnglat">显示经纬度</el-checkbox><help-tip prop="lnglat" />
        </div>
        <div class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.adjustable" @change="changeAdjustable">允许微调</el-checkbox><help-tip prop="adjustable" />
        </div>
        <div v-if="fieldOptions.adjustable" class="el-form-item__content">
          <el-input-number v-model="fieldOptions.radius" />米
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  methods: {
    changeAdjustable(val) {
      this.fieldItem.field_options.radius = 500
    }
  }
}
</script>
