<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">数据字典<help-tip prop="dictionary" /></template>
        <ibps-type-select
          v-model="fieldOptions.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          placeholder="请选择数据字典"
          clearable
          @change="changeDictionary"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">是否多选<help-tip prop="multiple" /></template>
        <el-switch
          v-model="fieldOptions.multiple"
          @change="changeMultiple"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">选值模式<help-tip prop="selectMode" /></template>
        <el-select v-model="fieldOptions.select_mode" style="width:100%;">
          <el-option value="leaf" label="叶节点" />
          <el-option value="any" label="任意节点" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示模式<help-tip prop="displayMode" /></template>
        <el-select v-model="fieldOptions.display_mode" style="width:100%;">
          <el-option value="name" label="节点名称" />
          <el-option value="path" label="完整路径" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="fieldOptions.display_mode==='path'">
        <template slot="label">分割符<help-tip prop="split" /></template>
        <el-input v-model="fieldOptions.split" />
      </el-form-item>
      <el-form-item>
        <template slot="label">展现形式<help-tip prop="displayEffect" /></template>
        <el-button style="width:100%;" type="primary" plain @click="settingDisplayEffect">设置展现形式（{{ $utils.isEmpty(fieldOptions.display_effect)?'未设置':'已设置' }}）</el-button>
      </el-form-item>
    </div>
    <display-effect
      :visible="displayEffectVisible"
      :dictionary="fieldOptions.dictionary"
      :data="fieldOptions.display_effect"
      @callback="setDisplayEffect"
      @close="visible => displayEffectVisible = visible"
    />
  </div>
</template>
<script>
import IbpsTypeSelect from '@platform/business/platform/cat/type/select'
import EditorMixin from '../mixins/editor'
import DisplayEffect from '../components/display-effect'
import ActionUtils from '@platform/utils/action'
export default {
  components: {
    IbpsTypeSelect,
    DisplayEffect
  },
  mixins: [EditorMixin],
  data() {
    return {
      displayEffectVisible: false
    }
  },
  methods: {
    changeMultiple(val) {
      this.fieldOptions.default_value = ''
    },
    settingDisplayEffect() {
      if (this.$utils.isEmpty(this.fieldOptions.dictionary)) {
        ActionUtils.warning(`请选择数据字典`)
        return
      }
      this.displayEffectVisible = true
    },
    setDisplayEffect(data) {
      this.fieldOptions.display_effect = data
    },
    changeDictionary() {
      this.fieldOptions.display_effect = null
    }
  }
}
</script>
