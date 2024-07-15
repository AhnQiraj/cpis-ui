<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span><i :class="icon" />{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item label="风格类型">
          <el-radio-group v-model="fieldItem.field_options.type">
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="card">卡片化</el-radio-button>
            <el-radio-button label="border-card">选项卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            选项卡位置
          </template>
          <el-select v-model="fieldItem.field_options.position">
            <el-option
              v-for="item in positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <ibps-ellipsis :length="10">
              标签的宽度是否自撑开
            </ibps-ellipsis>
          </template>
          <el-switch v-model="fieldItem.field_options.stretch" />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <ibps-ellipsis :length="10">
              标签是否延迟渲染
            </ibps-ellipsis>
          </template>
          <el-switch v-model="fieldItem.field_options.lazy" />
        </el-form-item>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">标签配置项</div>
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
              <el-tooltip content="设为选中选项卡项">
                <el-radio v-model="defaultValue" :label="i" @click.native.prevent="handleDefaultValue(i)"><span>&nbsp;</span></el-radio>
              </el-tooltip>
              <el-input v-model="item.name" size="mini" placeholder="标签key" />
              <el-input v-model="item.label" size="mini" placeholder="标签名" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addColumn(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </vuedraggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn">添加标签页 </div>
        </div>
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
      positionOptions: [
        {
          value: 'left',
          label: '左对齐'
        },
        {
          value: 'top',
          label: '顶部对齐'
        },
        {
          value: 'bottom',
          label: '底部对齐'
        },
        {
          value: 'right',
          label: '右对齐'
        }
      ],
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      }
    }
  },
  computed: {
    defaultValue: {
      get() {
        const defaultColumn = this.fieldOptions.columns.findIndex((option) => option.checked === true)
        return defaultColumn !== -1 ? defaultColumn : void 0
      },
      set(value) {
        this.fieldItem.field_options.columns.forEach((column, i) => {
          column.checked = i === value
        })
        this.fieldItem.field_options.columns = JSON.parse(JSON.stringify(this.fieldOptions.columns))
      }
    }
  },
  beforeDestroy() {
    this.positionOptions = null
    this.draggableOptions = null
  },
  methods: {
    addColumn(i = -1, type) {
      const j = this.fieldItem.field_options.columns.length + 1
      const newColumn = {
        id: new Ids([32, 36, 1]).next(),
        checked: false,
        name: 'tab' + j,
        label: '标签页' + j,
        fields: []
      }
      if (i > -1) {
        this.fieldItem.field_options.columns.splice(i + 1, 0, newColumn)
      } else {
        this.fieldItem.field_options.columns.push(newColumn)
      }
    },
    removeColumn(i) {
      if (this.fieldItem.field_options.columns.length <= 1) {
        this.$message.warning('至少保留一个选项卡')
        return
      }
      this.fieldItem.field_options.columns.splice(i, 1)
    },
    handleDefaultValue(value) {
      const defaultColumn = this.fieldItem.field_options.columns.findIndex((column) => column.checked === true)
      this.defaultValue = defaultColumn !== value ? value : void 0
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
        width: 35%;
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
