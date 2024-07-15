<template>
  <div class="panel panel-default">
    <div class="panel-heading">流程关联设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">关系类型<help-tip prop="bpmLinkType" /></template>
        <el-select v-model="fieldOptions.bpmLinkType" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in bpmLinkTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="fieldOptions.bpmLinkType==='current'">
        <template slot="label">显示数量<help-tip prop="bpmLinkCount" /></template>
        <el-input-number v-model="fieldOptions.bpmLinkCount" :min="1" :max="20" style="width:100%" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { bpmLinkTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      bpmLinkTypeOptions
    }
  },
  beforeDestroy() {
    this.bpmLinkTypeOptions = null
  },
  methods: {
    changeBpmLinkType(value) {
      this.fieldOptions.bpmLinkType = value
    },
    changeBpmLinkCount(value) {
      this.fieldOptions.bpmLinkCount = value
    }
  }
}
</script>
