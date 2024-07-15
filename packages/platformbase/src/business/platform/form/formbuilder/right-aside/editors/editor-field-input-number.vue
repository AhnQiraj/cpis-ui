<template>
  <div class="panel panel-default">
    <div class="panel-heading">计时器设置</div>
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
        <template slot="label">精度<help-tip prop="inputNumberPrecision" /></template>
        <el-input-number v-model="fieldOptions.precision" type="number" :min="0" />
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <ibps-ellipsis :length="10">使用控制按钮</ibps-ellipsis>
        </template>
        <el-switch v-model="fieldOptions.controls" />
      </el-form-item>
      <el-form-item v-if="fieldOptions.controls">
        <template slot="label">控制按钮位置</template>
        <el-radio-group v-model="fieldOptions.controls_position">
          <el-radio-button label="">两侧</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
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
