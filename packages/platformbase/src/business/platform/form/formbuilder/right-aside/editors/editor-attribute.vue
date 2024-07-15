<template>
  <div class="panel panel-default toolbars-panel">
    <div class="panel-heading">操作属性</div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('center')" label-width="10px">
        <el-checkbox v-model="fieldOptions.center">居中</el-checkbox>
      </el-form-item>
      <el-form-item v-if="types.includes('showIcon')" label-width="10px">
        <el-checkbox v-model="fieldOptions.show_icon">显示图标</el-checkbox>
      </el-form-item>
      <el-form-item v-if="types.includes('closable')" label-width="10px">
        <el-checkbox v-model="fieldOptions.closable">可关闭</el-checkbox>
        <el-input v-if="fieldOptions.closable" v-model="fieldOptions.close_text" placeholder="可关闭自定义文本" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
    }
  }
}
</script>
