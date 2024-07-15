<template>
  <el-row
    v-show="ruleDisplay !== 'hidden'"
    :gutter="field.field_options.gutter ? field.field_options.gutter : 0"
    :justify="field.field_options.justify"
    :align="field.field_options.align"
    :type="field.field_options.type||'flex'"
    :class="field.field_options.custom_class"
    :style="getRuleStyle()+getPadding('grid')"
  >
    <el-col
      v-for="(col, colIndex) in field.field_options.columns"
      :key="col.id?col.id:'_'+colIndex"
      v-loadCol="handelLoadCol"
      :data-overspread="overspread"
      :span="!field.field_options.responsive?($utils.isNotEmpty(col.span) ? col.span : 24):24"
      :xs="field.field_options.responsive?col.xs:undefined"
      :sm="field.field_options.responsive?col.sm:undefined"
      :md="field.field_options.responsive?col.md:undefined"
      :lg="field.field_options.responsive?col.lg:undefined"
      :xl="field.field_options.responsive?col.xl:undefined"
      :style="getUDGutter()"
      :class="getClassByOverspread(col,colIndex)"
    >
      <template v-for="(item,i) in col.fields">
        <!--嵌套布局-->
        <component
          :is="'ibps-dynamic-form-'+item.field_type"
          v-if="isNestedField(item.field_type)"
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :form-data="formData"
          :params="params"
          :table-params="tableParams"
          :style="i < col.fields.length - 1 ? getHeightInterval() : ''"
          v-on="$listeners"
        />
        <!--其他类型-->
        <ibps-dynamic-form-item
          v-else
          :ref="'formItem'+item.name"
          :key="item.name"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :main-code="mainCode"
          :form-data="formData"
          :params="params"
          :table-params="tableParams"
          :style="i < col.fields.length - 1 ? getHeightInterval() : ''"
          v-on="$listeners"
        />
      </template>
    </el-col>
  </el-row>
</template>
<script>
import NestedMixin from './mixins/nested'
export default {
  directives: {
    loadCol: {
      componentUpdated: function(el, binding, vnode, oldVnode) {
        const overspread = vnode.data.attrs['data-overspread']
        // 当不存在铺满整行的配置时，取消下面的操作
        if (!overspread) {return}
        // 设置隐藏函数
        let timeout = false
        const _key = vnode.data.key
        const setRowDisableNone = function(bool, binding) {
          if (timeout) {
            clearTimeout(timeout)
          }
          timeout = setTimeout(() => {
            binding.value.call(null, bool, _key)
          })
        }
        if (vnode && vnode.elm && vnode.elm.children && vnode.elm.children.length > 0) {
          const _arrs = vnode.elm.children
          for (let i = 0; i < _arrs.length; i++) {
            if ((_arrs[i].clientHeight && _arrs[i].clientHeight !== 0) || (_arrs[i].clientWidth && _arrs[i].clientWidth !== 0)) {
              setRowDisableNone(false, binding)
              return
            }
          }
          setRowDisableNone(true, binding)
        } else {
          setRowDisableNone(true, binding)
        }
      }
    }
  },
  mixins: [NestedMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      configure: {}
    }
  },
  computed: {
    fieldOptions() {
      if (this.$utils.isEmpty(this.field) ||
      this.$utils.isEmpty(this.field.field_options)) {
        return {}
      }
      return this.field.field_options
    },
    // 获取是否覆盖隐藏的列
    overspread() {
      if (this.$utils.isEmpty(this.fieldOptions) ||
      !this.fieldOptions.overspread) {
        return false
      }
      return true
    }
  },
  created() {
    this.configure = {}
  },
  methods: {
    // 获取flex布局的自动伸缩的类选择器
    getClassByOverspread(item, index) {
      const _class = {}
      _class['ibps-hide-width'] = this.configure[this.field.name + (item.id ? item.id : '_' + index)]
      if (!this.overspread) {return _class}
      if (this.fieldOptions.responsive) {
        _class['ibps-el-col-responsive'] = !item.cancel_overspread_responsive
      } else {
        _class['ibps-el-col'] = !item.cancel_overspread
      }
      return _class
    },
    handelLoadCol(bool, key) {
      const _name = this.field.name + key
      if (this.$utils.isEmpty(this.configure[_name]) || this.configure[_name] !== bool) {
        this.$set(this.configure, _name, bool)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-hide-width{
  max-width: 0;
  overflow: hidden;
}
.ibps-el-col,.ibps-el-col-responsive{
  flex: 1;
}
</style>
