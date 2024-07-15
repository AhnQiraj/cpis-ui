<template>
  <div
    v-if="element && element.id"
    :id="element.id"
    :key="element.id"
    class="widget-collapse widget-view el-collapse"
    :class="{active: selectWidget&&selectWidget.id == element.id}"
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <div
      v-for="(col, colIndex) in element.field_options.columns"
      :key="col.id?col.id:'_'+colIndex"
      class="el-collapse-item"
      :class="{'is-active':isActive(col.name)}"
    >
      <div
        class="el-collapse-item__header focusing"
        :class="{'is-active': isActive(col.name)}"
      >&nbsp;&nbsp;&nbsp;&nbsp;{{ col.label }}
        <i
          class="el-collapse-item__arrow el-icon-arrow-right"
          :class="{'is-active': isActive(col.name)}"
          @click="onCollapseClick(col)"
        />
      </div>
      <div v-show="isActive(col.name)" class="el-collapse-item__wrap">
        <vuedraggable
          v-model="col.fields"
          no-transition-on-drag
          v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          @end="handleWidgetNestedMoveEnd($event, element, colIndex)"
          @add="handleWidgetNestedAdd($event, element, colIndex)"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(el, i) in col.fields">
              <template v-if="el&& el.id">
                <!--嵌套布局-->
                <component
                  :is="'ibps-widget-form-'+el.field_type"
                  v-if="isNestedField(el.field_type)"
                  :key="el.id"
                  :element="el"
                  :select.sync="selectWidget"
                  :index="i"
                  :data="col"
                  :code="code"
                  :is-sub="isSub"
                  :params="params"
                />
                <!--其他字段-->
                <ibps-widget-form-item
                  v-else
                  :key="el.id"
                  :element="el"
                  :select.sync="selectWidget"
                  :index="i"
                  :data="col"
                  :code="code"
                  :is-sub="isSub"
                  :params="params"
                />
              </template>
            </template>
          </transition-group>
        </vuedraggable>
      </div>
    </div>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-collapse-action">
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-collapse-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin],
  data() {
    return {
      activeNames: []
    }
  },
  beforeDestroy() {
    this.activeNames = null
  },
  methods: {
    isActive(name) {
      return this.activeNames.indexOf(name) === -1
    },
    onCollapseClick(item) {
      const activeNames = this.activeNames.slice(0)
      const index = activeNames.indexOf(item.name)
      if (index > -1) {
        activeNames.splice(index, 1)
      } else {
        activeNames.push(item.name)
      }
      this.activeNames = [].concat(activeNames)
    }
  }
}
</script>
