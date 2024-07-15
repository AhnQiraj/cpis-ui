<template>
  <div class="panel panel-default">
    <div class="panel-heading">主键设置<el-switch v-model="fieldOptions.isPk" @change="changePk" /></div>
    <div v-if="fieldOptions.isPk" class="panel-body">
      <el-form-item label="主键来源">
        <el-select v-model="fieldOptions.pkValueType" style="width:100%;" @change="changePkValueType">
          <el-option
            v-for="item in valueTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主键值">
        <el-input
          v-if="fieldOptions.pkValueType === 'fixed'"
          v-model="fieldOptions.pkValue"
          placeholder="请输入主键值"
        />
        <el-select
          v-else-if="fieldOptions.pkValueType==='bo'"
          v-model="fieldOptions.pkValue"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            v-for="item in boFields"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
            <span class="ibps-fl">{{ item.name }}</span>
            <span class="casade-field__desc">{{ item.key }}</span>
          </el-option>
        </el-select>
        <el-input
          v-else-if="fieldOptions.pkValueType === 'script'"
          v-model="fieldOptions.pkValue"
          type="textarea"
          placeholder="请输入主键值"
        />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
const valueTypeOptions = [
  {
    value: 'fixed',
    label: '固定值'
  }, {
    value: 'bo',
    label: '业务对象'
  }, {
    value: 'script',
    label: '动态脚本'
  }
]
export default {
  mixins: [EditorMixin],
  props: {
    boData: Array
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    valueTypeOptions() {
      return this.$utils.isEmpty(this.boData) ? valueTypeOptions.filter((item) => item.value !== 'bo') : valueTypeOptions
    }
  },
  methods: {
    changePk(val) {
      if (val) {
        this.$set(this.fieldItem.field_options, 'pkValueType', 'fixed')
      } else {
        this.$set(this.fieldItem.field_options, 'pkValueType', null)
      }
    },
    changePkValueType() {
      this.$set(this.fieldItem.field_options, 'pkValue', '')
    }
  }
}
</script>
