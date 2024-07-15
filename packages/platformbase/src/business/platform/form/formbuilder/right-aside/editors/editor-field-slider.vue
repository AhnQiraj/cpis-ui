<template>
  <div class="panel panel-default">
    <div class="panel-heading">滑块设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">最小值</template>
        <el-input-number v-model="fieldOptions.min" />
      </el-form-item>
      <el-form-item>
        <template slot="label">最大值</template>
        <el-input-number v-model="fieldOptions.max" />
      </el-form-item>
      <el-form-item>
        <template slot="label">步长</template>
        <el-input-number v-model="fieldOptions.step" />
      </el-form-item>
      <el-form-item>
        <template slot="label">显示输入框</template>
        <el-switch v-model="fieldOptions.show_input" />
      </el-form-item>
      <el-form-item>
        <template slot="label">显示提示</template>
        <el-switch v-model="fieldOptions.show_tooltip" />
      </el-form-item>
      <!-- <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item> -->
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
