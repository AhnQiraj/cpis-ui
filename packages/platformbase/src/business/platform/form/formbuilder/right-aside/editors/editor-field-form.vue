<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item prop="label">
          <template slot="label">表单名称</template>
          <el-input v-model="fieldItem.label" placeholder="请输入表单名称" :maxlength="64" />
        </el-form-item>
        <el-form-item prop="name">
          <template slot="label">字段标识<help-tip prop="key" /></template>
          <el-input v-model="fieldItem.name" placeholder="字段标识" />
        </el-form-item>
        <!-- <el-form-item v-if="formType !=='combination'" label="业务对象">
          <bo-def-selector
            :value="fieldItem.code"
            value-key="code"
            disabled
          />
        </el-form-item> -->
        <el-form-item>
          <template slot="label">选择表单<help-tip prop="formKey" /></template>
          <!-- :bo-code="fieldItem.code"
                   :data-type="fieldItem.code?'boAndFormType':null"
          -->
          <form-def-selector2
            v-model="fieldOptions.formKey"
            :form-type="controlType"
            value-key="key"
            @change="handlerChangeForm"
          />
        </el-form-item>
        <el-form-item label="隐藏名称">
          <el-switch v-model="fieldOptions.hide_label" />
        </el-form-item>
        <el-form-item label="隐藏边框">
          <el-switch v-model="fieldOptions.hide_border" />
        </el-form-item>
        <el-form-item label="隐藏分割线">
          <el-switch v-model="fieldOptions.hide_border_bottom" />
        </el-form-item>
        <el-form-item>
          <template slot="label">高度<help-tip prop="controlHeight" /></template>
          <el-input-number
            v-model="fieldOptions.height"
            size="mini"
            :min="0"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" style="margin-left:10px;">像素(px)</el-tag><br>
        </el-form-item>
      </div>
    </div>
  </div>
</template>
<script>
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
import FormDefSelector2 from '@platform/business/platform/form/form-def/selector2'
// import BoDefSelector from '@platform/business/platform/bo/def/selector'
export default {
  components: {
    FormDefSelector2
    // BoDefSelector
  },
  mixins: [BaseMixin, EditorMixin],
  props: {
    controlType: String
  },
  data() {
    return {
      formToolbar: [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }]
    }
  },
  computed: {
    filterBoData() {
      const filterBoData = []
      if (this.$utils.isEmpty(this.boData)) {return []}
      for (let i = 0; i < this.boData.length; i++) {
        if (this.boData[i].attrType === 'field') { // 过滤非主表的字段
          filterBoData.push(JSON.parse(JSON.stringify(this.boData[i])))
        }
      }
      return filterBoData
    }
  },
  beforeDestroy() {
    this.formToolbar = null
  },
  methods: {
    // 选择表单
    handlerChangeForm(data) {
      const label = this.$utils.isNotEmpty(data) ? data.name : ''
      const name = this.$utils.isNotEmpty(data) ? data.key : ''
      this.$set(this.fieldItem, 'label', label)
      this.$set(this.fieldItem, 'name', name)
    }
  }
}
</script>
