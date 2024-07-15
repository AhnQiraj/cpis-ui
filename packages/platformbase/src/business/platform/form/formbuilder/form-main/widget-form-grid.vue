<template>
  <el-row
    v-if="element && element.id"
    :id="element.id"
    :key="element.id"
    :class="{active: selectWidget&&selectWidget.id == element.id,['data-'+element.field_type]:true}"
    :gutter="element.field_options.gutter ? element.field_options.gutter : 0"
    :justify="element.field_options.justify"
    :align="element.field_options.align"
    :type="element.field_options.type||'flex'"
    class="widget-col widget-view widget-col_margin"
    :style="getPadding('grid')"
    @click.native.stop="handleSelectWidget(index)"
  >
    <el-col
      v-for="(col, colIndex) in element.field_options.columns"
      :key="col.id?col.id:'_'+colIndex"
      :span="!element.field_options.responsive?($utils.isNotEmpty(col.span) ? col.span : 24):24"
      :xs="element.field_options.responsive?col.xs:undefined"
      :sm="element.field_options.responsive?col.sm:undefined"
      :md="element.field_options.responsive?col.md:undefined"
      :lg="element.field_options.responsive?col.lg:undefined"
      :xl="element.field_options.responsive?col.xl:undefined"
      :style="getUDGutter()"
    >
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
                :style="i < col.fields.length - 1 ? getHeightInterval() : ''"
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
                :style="i < col.fields.length - 1 ? getHeightInterval() : ''"
                :params="params"
              />
            </template>
            <div v-else :key="i">未知组件</div>
          </template>
        </transition-group>
      </vuedraggable>
    </el-col>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-col-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetCloneBasics(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-col-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </el-row>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  mixins: [NestedMixin]
}
</script>
