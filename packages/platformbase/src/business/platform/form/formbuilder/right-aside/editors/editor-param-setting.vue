<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-button
        style="width:100%;"
        type="primary"
        plain
        @click="dialogVisible=true"
      >参数设置{{ $utils.isNotEmpty(fieldItem.field_options.params)?'(已设置)':'(未设置)' }}</el-button>
    </div>
    <params-setting
      :visible="dialogVisible"
      :bo-data="boData"
      :bo-fields="boFields"
      :data="fieldItem.field_options.params"
      @callback="settingParams"
      @close="visible => dialogVisible = visible"
    />
  </div>
</template>
<script>
import ParamsSetting from '../components/params-setting'
import EditorMixin from '../mixins/editor'
export default {
  components: {
    ParamsSetting
  },
  mixins: [EditorMixin],
  props: {
    boData: Array
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    settingParams(data) {
      this.$set(this.fieldItem.field_options, 'params', data)
    }
  }
}
</script>
