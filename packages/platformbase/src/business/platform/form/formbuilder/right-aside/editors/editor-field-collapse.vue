<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span><i :class="icon" />{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item>
          <template slot="label">手风琴模式<help-tip prop="accordion" /></template>
          <el-switch v-model="fieldOptions.accordion" />
        </el-form-item>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">面板配置项</div>
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
              <el-tooltip content="设为默认展开">
                <el-checkbox v-model="item.checked" />
              </el-tooltip>
              <el-input v-model="item.name" size="mini" placeholder="面板标识(key)" />
              <el-input v-model="item.label" size="mini" placeholder="面板标题" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addColumn(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </vuedraggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn">添加折叠面板</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseMixin from '../mixins/base'
import EditorMixin from '../mixins/editor'
import vuedraggable from 'vuedraggable'
import Ids from 'ids'
export default {
  components: {
    vuedraggable
  },
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
    this.draggableOptions = null
  },
  methods: {
    addColumn(i = -1, type) {
      const j = this.fieldItem.field_options.columns.length + 1
      const newColumn = {
        id: new Ids([32, 36, 1]).next(),
        checked: true,
        name: 'collapse' + j,
        label: '折叠面板' + j,
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
