<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">
          <div class="ibps-ellipsis">组件名<help-tip prop="componentName" /></div>
        </template>
        <el-input v-model="fieldOptions.component_name" />
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="ibps-ellipsis">组件路径<help-tip prop="componentUrl" /></div>
        </template>
        <el-input v-model="fieldOptions.component_url" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin]
}
</script>
