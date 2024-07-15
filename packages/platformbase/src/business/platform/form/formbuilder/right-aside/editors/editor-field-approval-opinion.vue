<template>
  <div class="panel panel-default bowen-options">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">常用语</template>
        <el-switch
          v-model="fieldOptions.common_statment"
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label"> <ibps-ellipsis :length="10">审批意见展示布局方式</ibps-ellipsis></template>
        <el-radio-group v-model="fieldOptions.arrangement">
          <el-radio-button label="horizontal">横向</el-radio-button>
          <el-radio-button label="vertical">纵向</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0">
        <div>审批意见展示字段:</div>
        <div class="panel-body bowen-options">
          <div class="choices">
            <vuedraggable v-model="options" v-bind="draggableOptions" @start=" isDragging = true" @end=" isDragging = false">
              <div v-for="(option,i) in options" :key="i" class="option draggable">
                <div class="actions-left">
                  <el-tooltip content="是否显示">
                    <el-checkbox v-model="option.checked" />
                  </el-tooltip>
                  <el-tooltip :content="option.value|optionsFilter(opinionOptions)" placement="right-start">
                    <el-input v-model="option.label" size="mini" rows="2" :placeholder="option.value|optionsFilter(opinionOptions)" />
                  </el-tooltip>
                </div>
                <el-button-group class="actions">
                  <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
                </el-button-group>
              </div>
            </vuedraggable>
          </div>
        </div>
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
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      opinionOptions: [{
        value: 'auditorName',
        label: '审批人'
      }, {
        value: 'completeTime',
        label: '审批时间'
      }, {
        value: 'statusName',
        label: '审批状态'
      }, {
        value: 'opinion',
        label: '审批意见'
      }]
    }
  },
  computed: {
    options: {
      get() {
        return this.fieldOptions ? this.fieldOptions.options || [] : []
      },
      set(value) {
        this.fieldOptions.options = value || []
      }
    }
  }
}
</script>
<style lang="scss">
.bowen-options {
  .choices {
    .option {
      position: relative;
      margin-bottom: 5px;
      border: 1px solid transparent;
      .actions-left{
        height: 24px;
        line-height: 24px;
      }
      .el-input {
        display: inline-block;
        width: 60%;
        vertical-align: middle;
      }
      .el-checkbox{
          margin-right: 10px;
      }
      .actions {
        position: absolute;
        width: 60px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 1px;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
           cursor: move
        }
      }
    }
  }
  .more-actions {
    text-align: right;
    margin-top: 10px;
    margin-right:10px;
    .el-button {
      border-right: 1px solid #D9D9D9;
      padding-right: 4px;
      margin-right: 2px;
    }
  }
  .sortable-ghost{
  border: 1px dashed #C3C9D0;
  margin-bottom: 5px
}
}
</style>
