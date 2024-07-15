<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      级联设置
      <div class="ibps-fr">
        <span class="el-dropdown-link" @click="editCascade()">
          <i class="el-icon-circle-plus-outline" />
          添加级联
        </span>
      </div>
    </div>
    <div class="panel-body">
      <div
        v-if="$utils.isNotEmpty(fieldItem.field_options.cascades)"
        class="list-group"
      >
        <div v-for="(item,i) in fieldItem.field_options.cascades" :key="i" class="list-group-item">
          <div class="actions-left">
            <span>{{ item.label }}</span>
          </div>
          <el-button-group class="actions">
            <el-tooltip content="设置" placement="top">
              <el-button size="small" type="text" icon="el-icon-setting" @click="editCascade(i)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button size="small" type="text" icon="el-icon-delete" @click="removeCascade(i)" />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div
        v-else
        class=" el-table__empty-block"
      >
        <span class="el-table__empty-text">未设置级联</span>
      </div>
    </div>
    <cascade-setting
      :visible="dialogVisible"
      :title="cascadeTitle"
      :data="cascadeData"
      :fields="fields"
      :field-item="fieldItem"
      @callback="settingCascade"
      @close="visible => dialogVisible = visible"
    />
  </div>
</template>
<script>
import CascadeSetting from '../components/cascade-setting'
import EditorMixin from '../mixins/editor'
export default {
  components: {
    CascadeSetting
  },
  mixins: [EditorMixin],
  props: {
    boData: Array
  },
  data() {
    return {
      dialogVisible: false,
      cascadeTitle: '',
      cascadeData: {},
      editIndex: -1
    }
  },
  computed: {
    fieldType() {
      return this.fieldItem.field_type
    },
    fieldOptions() {
      return this.fieldItem.field_options
    }
  },
  methods: {
    settingCascade(data) {
      if (this.editIndex === -1) {
        if (!this.$utils.isArray(this.fieldItem.field_options.cascades)) {
          this.$set(this.fieldItem.field_options, 'cascades', [])
        }
        this.fieldItem.field_options.cascades.push(data)
      } else {
        this.fieldItem.field_options.cascades.splice(this.editIndex, 1, data)
        this.editIndex = -1
      }
    },
    editCascade(index) {
      if (this.fieldType === 'onlineForm' || this.fieldType === 'detailForm') {
        if (this.$utils.isEmpty(this.fieldOptions.formKey)) {
          this.$message({
            message: '请先选择表单',
            type: 'warning'
          })
          return
        }
      } else if (this.fieldType === 'dataTemplate') {
        if (this.$utils.isEmpty(this.fieldOptions.bind_template_key)) {
          this.$message({
            message: '请先选择数据模版',
            type: 'warning'
          })
          return
        }
      }
      if (this.$utils.isNotEmpty(index)) {
        this.cascadeTitle = '修改级联'
        this.cascadeData = JSON.parse(JSON.stringify(this.fieldItem.field_options.cascades[index]))
        this.editIndex = index
      } else {
        this.cascadeTitle = '新增级联'
        this.cascadeData = {}
        this.editIndex = -1
      }
      this.dialogVisible = true
    },
    removeCascade(i) {
      this.fieldItem.field_options.cascades.splice(i, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin-bottom: -1px;
    .actions-left{
      height: 24px;
      line-height: 24px;
    }
    .actions {
      position: absolute;
      width: 40px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
    }
  }
}
</style>
