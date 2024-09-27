<template>
  <div class="container">
    <div>
      <ElCascader
        v-bind="cascaderProps"
        ref="cascader"
        v-model="localValue"
        :options="options"
        :props="{
          ...props,
          emitPath: false,
          checkStrictly: true,
          expandTrigger: 'hover'
        }"
        @visible-change="handleVisibleChange"
        :popper-class="this.props.mode === 'dialog' ? 'hidden' : ''"
        :filterable="true"
        :collapse-tags="true"
        :show-all-levels="false"
      />
    </div>

    <ElDialog
      :visible.sync="dialogVisible"
      destroy-on-close
      v-bind="dialogProps"
    >
      <div>
        <ElInput
          size="small"
          :placeholder="dialogProps.placeholder"
          v-model="filterText"
        />
        <ElTree
          :default-checked-keys="
            Array.isArray(localValue) ? localValue : [localValue]
          "
          :default-expanded-keys="
            Array.isArray(localValue) ? localValue : [localValue]
          "
          ref="tree"
          :node-key="props.value"
          :data="options"
          :props="props"
          check-strictly
          show-checkbox
          style="margin-top: 20px"
          :filter-node-method="filterNode"
          @check="handleTreeCheck"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <ElButton type="primary" size="small" @click="okClick">
          {{ dialogProps.okText }}</ElButton
        >
        <ElButton size="small" @click="dialogVisible = false">
          {{ dialogProps.cancelText }}
        </ElButton>
      </span>
    </ElDialog>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import { Cascader, Dialog, Tree, Button, Input } from 'element-ui'

export default {
  name: 'CpisProCascader',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    value(val) {
      this.localValue = val
    },
    localValue(val) {
      this.$emit('input', val)
    }
  },
  components: {
    ElCascader: Cascader,
    ElDialog: Dialog,
    ElTree: Tree,
    ElButton: Button,
    ElInput: Input
  },
  data: function () {
    return {
      filterText: '',
      dialogVisible: false,
      localValue: this.value
    }
  },
  methods: {
    okClick() {
      this.dialogVisible = false
      const keys = this.$refs.tree.getCheckedKeys()
      this.$emit('input', this.props.multiple ? keys : (keys?.[0] ?? null))
    },
    handleVisibleChange() {
      if (this.props.mode === 'dialog') {
        this.dialogVisible = true
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.$props.props.label].indexOf(value) !== -1
    },
    handleTreeCheck(data) {
      // 如果单选的，控制treeList的选中状态
      if (!this.props.multiple) {
        this.$refs.tree.setCheckedKeys([data[this.props.value]], true)
      }
    }
  },
  props: {
    options: {
      type: Array,
      default: () => [],
      comment: '数据源'
    },
    props: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label',
        value: 'value',
        multiple: false,
        mode: 'inline'
      })
    },
    dialogProps: {
      type: Object,
      default: () => ({
        title: '请选择',
        okText: '确定',
        cancelText: '取消',
        placeholder: '请输入关键字进行过滤',
        center: false,
        width: '30%'
      })
    },
    cascaderProps: {
      type: Object,
      default: () => ({
        placeholder: '请选择',
        clearable: true,
        size: 'large'
      })
    },
    value: {
      type: [String, Number, Array],
      default: ''
    }
  }
}
</script>
<style>
.hidden {
  display: none;
}
</style>
