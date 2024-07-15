<template>
  <div class="panel panel-default rights-panel">
    <div class="panel-heading">操作属性</div>
    <div v-if="init" class="panel-body">
      <div class="el-form-item ibps-mb-5">
        <div v-if="types.includes('hide')" class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.hide_rights">隐藏</el-checkbox><help-tip prop="hide" />
        </div>
        <div v-if="types.includes('read')" class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.read_rights">只读</el-checkbox><help-tip prop="read" />
        </div>
        <div v-if="types.includes('edit')" class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.edit_rights">编辑</el-checkbox><help-tip prop="edit" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  props: {
    types: {
      type: String,
      default: 'hide,read'
    }
  },
  data() {
    return {
      init: true
    }
  },
  watch: {
    fieldOptions: {
      handler: function(val, oldVal) {
        this.init = false
        this.$nextTick(() => {this.init = true})
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-checkbox{
     margin-right: 10px;
  }
</style>
