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
          <template slot="label">阴影显示时机<help-tip prop="shadow" /></template>
          <el-select v-model="fieldOptions.shadow" placeholder="请选择阴影显示时机" style="width:100%">
            <el-option value="always" label="总是显示" />
            <el-option value="hover" label="鼠标悬浮时显示" />
            <el-option value="never" label="从不显示" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <template slot="label">描述信息<help-tip prop="desc" /></template>
          <el-input v-model="fieldItem.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入描述信息" :maxlength="1024" />
        </el-form-item> -->
      </div>
    </div>
    <!-- <div class="panel panel-default">
      <div class="panel-heading">
        <span>操作按钮</span>
      </div>
      <div class="panel-body" />
    </div> -->
  </div>
</template>
<script>
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
export default {
  mixins: [BaseMixin, EditorMixin]
}
</script>
