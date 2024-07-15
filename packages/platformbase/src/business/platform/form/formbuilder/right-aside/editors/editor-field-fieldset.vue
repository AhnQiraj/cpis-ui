<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span><i :class="icon" />{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item prop="label">
          <template slot="label">标签文本<help-tip prop="label" /></template>
          <el-input v-model="fieldItem.label" placeholder="请输入标签文本" :maxlength="64" />
        </el-form-item>
        <el-form-item>
          <template slot="label">描述信息<help-tip prop="desc" /></template>
          <el-input v-model="fieldItem.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入描述信息" :maxlength="1024" />
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="fieldOptions.type" placeholder="请选择类型" style="width:100%">
            <el-option
              v-for="item in colorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签位置">
          <el-radio-group v-model="fieldOptions.position">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="center">居中</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <template slot="label">边框样式</template>
          <el-select v-model="fieldOptions.border_style">
            <el-option value="none" label="无" />
            <el-option value="groove" label="3D 凹槽边框" />
            <el-option value="ridge" label="3D 垄状边框" />
            <el-option value="inset" label="3D inset 边框" />
            <el-option value="outset" label="3D outset 边框" />
            <el-option value="dashed" label="虚线" />
            <el-option value="solid" label="实线" />
          </el-select>
        </el-form-item>
        <div class="el-form-item">
          <el-checkbox v-model="fieldOptions.split_line">显示分割线</el-checkbox>
        </div>
        <el-form-item v-if="fieldOptions.split_line">
          <template slot="label">分割线样式</template>
          <el-select v-model="fieldOptions.line_style">
            <el-option value="dashed" label="虚线" />
            <el-option value="solid" label="实线" />
          </el-select>
        </el-form-item>
      </div>
    </div>
  </div>
</template>
<script>
import { colorOptions } from '@platform/business/platform/form/constants/fieldOptions'
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
export default {
  mixins: [BaseMixin, EditorMixin],
  data() {
    return {
      colorOptions
    }
  }
}
</script>
