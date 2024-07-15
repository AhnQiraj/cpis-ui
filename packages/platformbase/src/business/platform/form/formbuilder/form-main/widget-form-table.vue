<template>
  <div
    v-if="element && element.id"
    :key="element.id"
    :class="{active: selectWidget&&selectWidget.id === element.id}"
    class="widget-table widget-view "
    :style="getPadding()"
    @click.stop="handleSelectWidget(index)"
  >
    <div class="panel panel-info">
      <div
        v-if="!(element.field_options.hidden_header || $utils.isEmpty(element.label)) ||
          (element.field_options.buttons && element.field_options.buttons.length >0)"
        class="panel-heading ibps-clearfix"
        style="border-bottom:0;"
      >
        <div v-if="!element.field_options.hidden_header" class="ibps-fl">{{ element.label }}</div>
        <div class="ibps-fr">
          <el-button-group disabled>
            <el-button
              v-for="(button,i) in element.field_options.buttons"
              :key="i"
              :type="button.style"
              :icon="'ibps-icon-'+button.icon"
              disabled
            >
              {{ button.label }}
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="panel-body ibps-p-0">
        <div class="widget-table-wrapper ">
          <div class="widget-table-content">
            <vuedraggable
              v-model="columns"
              :no-transition-on-drag="true"
              v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
              @end="handleWidgetTableMoveEnd($event, element)"
              @add="handleWidgetTableAdd($event, element)"
            >
              <template v-if="mode === 'inner'">
                <!---表内--->
                <transition-group
                  name="fade"
                  tag="div"
                  class="widget-table-col"
                  :style="{width: columns.length>0?'calc('+((columns.length+1) *200)+'px)':'200px'}"
                >
                  <div
                    v-for="(el, i) in columns"
                    :key="el.id+i"
                    class="widget-table-view"
                    style="width:200px;"
                    :class="{active: selectWidget &&selectWidget.id == el.id}"
                    @click.stop="handleTableSelectWidget(index,i)"
                  >
                    <ibps-widget-form-table-inner
                      :element="el"
                      :select.sync="selectWidget"
                      :index="i"
                      :data="element"
                      :code="code"
                      :is-sub="isSub"
                      :params="params"
                    />
                  </div>
                </transition-group>
              </template>
              <!---表内end--->
              <template v-else>
                <!---其他模式--->
                <transition-group
                  name="fade"
                  tag="div"
                  class="widget-table-list"
                >
                  <div
                    v-for="(el, i) in columns"
                    :key="el.id+i"
                    @click.stop="handleTableSelectWidget(index,i)"
                  >
                    <template v-if="el&& el.id">
                      <!--嵌套布局-->
                      <component
                        :is="'ibps-widget-form-'+el.field_type"
                        v-if="isNestedField(el.field_type)"
                        :key="el.id"
                        :element="el"
                        :select.sync="selectWidget"
                        :index="i"
                        :data="element"
                        :code="code"
                        :is-sub="isSub"
                        :params="params"
                      />
                      <!--其他类型-->
                      <template v-else>
                        <ibps-widget-form-item
                          :key="el.id"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="element"
                          :code="code"
                          :is-sub="isSub"
                          :params="params"
                        />
                      </template>
                    </template>
                  </div>
                </transition-group>
              </template>
            </vuedraggable>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="selectWidget&&selectWidget.id == element.id"
      class="widget-view-action widget-table-action"
    >
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>
    <div
      v-if="selectWidget&&selectWidget.id == element.id"
      class="widget-view-drag widget-table-drag"
    >
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>
<script>
import IbpsWidgetFormTableInner from './widget-form-table-inner'
// import IbpsWidgetFormTableOther from './widget-form-table-other'
import TableMixin from './mixins/table'
export default {
  components: {
    IbpsWidgetFormTableInner
  },
  mixins: [TableMixin]
}
</script>
