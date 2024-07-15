<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <span><i :class="icon" />{{ label }}</span>
      </div>
      <div class="panel-body">
        <el-form-item>
          <template slot="label">左右间隔<help-tip prop="gutter" /></template>
          <el-input-number
            v-model="fieldOptions.gutter"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" class="ibps-ml-10">像素(px)</el-tag>
        </el-form-item>
        <el-form-item>
          <template slot="label">上下间隔<help-tip prop="udGutter" /></template>
          <el-input-number
            v-model="fieldOptions.ud_gutter"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" class="ibps-ml-10">像素(px)</el-tag>
        </el-form-item>
        <el-form-item label-width="100px">
          <template slot="label">高度间隔<help-tip prop="heightInterval" /></template>
          <el-input-number
            v-model="fieldOptions.height_interval"
            size="mini"
            :min="0"
            :max="500"
            :precision="0"
            :step="1"
          />
          <el-tag type="info" size="medium" class="ibps-ml-10">像素(px)</el-tag>
        </el-form-item>
        <el-form-item>
          <template slot="label">布局模式<help-tip prop="layoutType" /></template>
          <el-select v-model="fieldOptions.type" placeholder="请选择布局模式" style="width:100%">
            <el-option value="" label="默认布局" />
            <el-option value="flex" label="Flex布局" />
          </el-select>
        </el-form-item>
        <template v-if="$utils.isNotEmpty(fieldOptions.type) || fieldOptions.type==='flex'">
          <el-form-item>
            <template slot="label">
              <ibps-ellipsis :length="8">水平对齐方式</ibps-ellipsis>
              <help-tip prop="justify" />
            </template>
            <el-select v-model="fieldOptions.justify" style="width:100%;">
              <el-option value="start" label="居左" />
              <el-option value="end" label="居右" />
              <el-option value="center" label="居中" />
              <el-option value="space-around" label="两侧间隔相等" />
              <el-option value="space-between" label="两端对齐" />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <template slot="label">
              <ibps-ellipsis :length="8">垂直对齐方式</ibps-ellipsis>
              <help-tip prop="align" />
            </template>
            <el-select v-model="fieldOptions.align" style="width:100%;">
              <el-option value="top" label="顶部对齐" />
              <el-option value="middle" label="垂直居中对齐" />
              <el-option value="bottom" label="底部对齐" />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="响应式布局">
          <template slot="label">响应式布局<help-tip prop="responsive" /></template>
          <el-switch v-model="fieldOptions.responsive" @change="changeResponsive" />
        </el-form-item>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">列配置项</div>
      <div class="panel-body">
        <el-alert
          title="注意：栅格的之和不能大于24 分栏"
          type="warning"
          :closable="false"
        />
        <vuedraggable
          v-model="fieldItem.field_options.columns"
          v-bind="draggableOptions"
          class="list-group ibps-mt-5"
          @start="isDragging = true"
          @end="()=>{isDragging= false}"
        >
          <div
            v-for="(item,i) in fieldItem.field_options.columns"
            :key="i"
            class="list-group-item list-group-item_border"
          >
            <!--响应布局-->
            <template v-if="fieldOptions.responsive">
              <div class="responsive-actions-left">
                <div v-for="res in responsives" :key="res.key">
                  <div class="label">{{ res.label }}：</div>
                  <el-input v-model.number="item[res.key]" size="mini" type="number" :placeholder="res.label+'栅格值'" />
                  <div class="desc"> {{ res.desc }}</div><br>
                </div>
                <div v-if="overspread" class="ibps-mt-5"><span class="ibps-pr-10">取消铺满</span><el-switch v-model="item['cancel_overspread_responsive']" /></div>
                <!-- <div class="label">sm：</div><el-input v-model.number="item.sm" size="mini" type="number" placeholder="sm栅格值" /> ≥768px <br>
                <div class="label">md：</div><el-input v-model.number="item.md" size="mini" type="number" placeholder="md栅格值" /> ≥992px <br>
                <div class="label">lg：</div><el-input v-model.number="item.lg" size="mini" type="number" placeholder="lg栅格值" /> ≥1200px <br>
                <div class="label">xl：</div><el-input v-model.number="item.xl" size="mini" type="number" placeholder="xs栅格值" /> ≥1920px -->
              </div>
              <el-button-group class="responsive-actions">
                <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addColumn(i)" />
                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
                <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </template>
            <template v-else>
              <div class="actions-left">
                <el-input v-model.number="item.span" size="mini" type="number" placeholder="栅格值" />
                <div v-if="overspread" class="ibps-mt-5"><span class="ibps-pr-10">取消铺满</span><el-switch v-model="item.cancel_overspread" /></div>
              </div>
              <el-button-group class="actions">
                <el-button size="small" type="text" title="添加" icon="ibps-icon-add" @click="addColumn(i)" />
                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
                <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </template>
          </div>
        </vuedraggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn">添加列 </div>
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
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      responsives: [
        { key: 'xs',
          label: 'xs',
          desc: '<768px'
        },
        { key: 'sm',
          label: 'sm',
          desc: '≥768px'
        },
        { key: 'md',
          label: 'md',
          desc: '≥992px'
        },
        { key: 'lg',
          label: 'lg',
          desc: '≥1200px'
        },
        { key: 'xl',
          label: 'xl',
          desc: '≥1920px'
        }
      ]
    }
  },
  computed: {
    overspread() {
      return this.fieldItem.field_options.overspread
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.responsives = null
  },
  methods: {
    addColumn(i = -1, type) {
      const newColumn = {
        id: new Ids([32, 36, 1]).next(),
        span: null,
        fields: []
      }
      if (i > -1) {
        this.fieldItem.field_options.columns.splice(i + 1, 0, newColumn)
      } else {
        this.fieldItem.field_options.columns.push(newColumn)
      }
    },
    removeColumn(i) {
      this.fieldItem.field_options.columns.splice(i, 1)
    },
    changeResponsive(val) {
      const columns = JSON.parse(JSON.stringify(this.fieldItem.field_options.columns))
      if (val) {
        columns.forEach((column, c) => {
          const span = column.span
          for (let i = 0; i < this.responsives.length; i++) {
            const el = this.responsives[i]
            column[el.key] = span
          }
          this.$set(this.fieldItem.field_options.columns, c, column)
        })
      } else {
        columns.forEach((column, c) => {
          column.span = column.xs
          for (let i = 0; i < this.responsives.length; i++) {
            const el = this.responsives[i]
            column[el.key] = null
          }
          this.$set(this.fieldItem.field_options.columns, c, column)
        })
      }
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
    .list-group-item_border{
      margin-bottom: 5px!important;
      border: 1px #e6a23c solid;
      border-radius: 4px;
    }
    .list-group-item_border:last-child{
      margin-bottom: 0!important;
    }
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin-bottom: -1px;
    .actions-left{
      // height: 24px;
      // line-height: 24px;
      .el-input {
          display: inline-block;
          width: 80%;
          vertical-align: middle;
      }
    }
    .actions {
      position: absolute;
      width: 60px;
      // top: 2px;
      bottom: 2px;
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
      .responsive-actions-left{
        .label{
            display: inline-block;
            width: 40px;
        }
        .desc{
           display: inline-block;
           margin-left: 5px;
           color: #999999;
        }
        .el-input {
          display: inline-block;
          width: 150px;
          vertical-align: middle;
      }
    }
    .responsive-actions{
       position: absolute;
      width: 60px;
      // top: 2px;
      bottom: 2px;
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
