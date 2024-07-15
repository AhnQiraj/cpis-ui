<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span><i :class="icon" />{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item>
          <template slot="label">简洁风格 <help-tip prop="stepsSimple" /></template>
          <el-switch v-model="fieldItem.field_options.simple" />
        </el-form-item>
        <template v-if="!fieldItem.field_options.simple">
          <el-form-item>
            <template slot="label">间距<help-tip prop="stepsSpace" /></template>
            <el-input
              v-model="fieldItem.field_options.space"
              placeholder="支持百分比,不填写将自适应间距。"
            />
          </el-form-item>
          <el-form-item label="显示方向">
            <el-radio-group v-model="fieldItem.field_options.direction">
              <el-radio-button label="horizontal">横向</el-radio-button>
              <el-radio-button label="vertical">纵向</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <template slot="label">居中对齐</template>
            <el-switch v-model="fieldItem.field_options.align_center" />
          </el-form-item>
        </template>
        <el-form-item>
          <template slot="label">
            <ibps-ellipsis :length="10">允许结束步骤点击</ibps-ellipsis></template>
          <el-switch v-model="fieldItem.field_options.finish_click" />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <ibps-ellipsis :length="10">
              当前步骤的状态
            </ibps-ellipsis>
          </template>
          <el-select v-model="fieldItem.field_options.process_status">
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
              :label="status.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <ibps-ellipsis :length="10">
              结束步骤的状态
            </ibps-ellipsis>
          </template>
          <el-select v-model="fieldItem.field_options.finish_status">
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
              :label="status.label"
            />
          </el-select>
        </el-form-item>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">步骤条配置项</div>
      <div class="panel-body">
        <vuedraggable
          v-model="fieldItem.field_options.columns"
          v-bind="draggableOptions"
          class="list-group"
          @start="isDragging = true"
          @end="()=>{isDragging= false}"
        >
          <div
            v-for="(item,i) in fieldItem.field_options.columns"
            :key="i"
            class="list-group-item"
          >
            <div class="actions-left">
              <el-input v-model="item.label" size="mini" placeholder="步骤名" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addColumn(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </vuedraggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn()">添加步骤</div>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">步骤条按钮配置</div>
      <div class="panel-body">
        <el-form label-position="top">
          <el-form-item v-for="(button) in buttons" :key="button.key">
            <template slot="label">{{ button.key==='prev'?'上一步':'下一步' }}按钮</template>
            <el-input v-model="button.label" :placeholder="button.key==='prev'?'上一步按钮名':'下一步按钮名'">
              <ibps-icon-select slot="prepend" v-model="button.icon" :show-label="false" />
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
import Ids from 'ids'
export default {
  mixins: [BaseMixin, EditorMixin],
  data() {
    return {
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      statusOptions: [
        { value: 'wait', label: '等待' },
        { value: 'process', label: '进行中' },
        { value: 'finish', label: '完成' },
        { value: 'error', label: '错误' },
        { value: 'success', label: '成功' }
      ],
      defaultButtons: [
        {
          key: 'prev',
          icon: 'angle-left',
          label: '上一步'
        },
        {
          key: 'next',
          icon: 'angle-right',
          label: '下一步'
        }
      ],
      buttons: []
    }
  },
  watch: {
    'fieldItem.field_options.buttons': {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(val)) {
          this.buttons = JSON.parse(JSON.stringify(this.defaultButtons))
        }
        if (val !== oldVal) {
          this.buttons = val
        }
      },
      immediate: true
    },
    buttons: {
      handler(val, oldVal) {
        this.fieldItem.field_options.buttons = val
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.statusOptions = null
    this.defaultButtons = null
    this.buttons = null
  },
  methods: {
    addColumn(i = -1) {
      const j = this.fieldItem.field_options.columns.length + 1
      const newColumn = {
        id: new Ids([32, 36, 1]).next(),
        label: '步骤' + j,
        fields: []
      }
      if (i > -1) {
        this.fieldItem.field_options.columns.splice(i + 1, 0, newColumn)
      } else {
        this.fieldItem.field_options.columns.push(newColumn)
      }
    },
    removeColumn(i) {
      if (this.fieldItem.field_options.columns.length <= 2) {
        this.$message.warning('步骤不得少于 2 步')
        return
      }
      this.fieldItem.field_options.columns.splice(i, 1)
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
      .el-input {
        display: inline-block;
        width: 80%;
        vertical-align: middle;
      }
      .el-checkbox,.el-radio{
          margin-right: 10px;
      }
      .el-radio{
        margin-right: -5px;
      }
    }
    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
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
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: left;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }
</style>
