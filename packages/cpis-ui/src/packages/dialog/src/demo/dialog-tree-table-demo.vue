<template>
  <CpisDialogTreeTable
    ref="dialog"
    :multiple="multiple"
    size="size"
    :title="title"
    :append-to-body="appendToBody"
    :selected-data="selectedData"
    :modal="modal"
    destory-on-close
    :tree-props="treeProps"
    :table-props="tableProps"
    :tree-events="treeEvents"
    :visible="localVisible"
    v-on="$listeners"
    @update:visible="$emit('update:visible', $event)"
  />
</template>

<script>
export default {
  name: 'CpisUserSelectDialog',
  props: {
    selectedData: {
      // 已选数据的数据
      type: Array,
      default: null
    },
    size: {
      type: String,
      default: 'medium' // 根据设计图设定默认尺寸
    },
    appendToBody: {
      type: Boolean,
      default: false // 根据设计图和需求设定是否默认添加到body
    },
    modal: {
      type: Boolean,
      default: false // 根据设计图和需求设定是否有遮照
    },
    selectDataKey: {
      // 已选数据的数据的key，如果不是id 这里设置默认值
      type: String,
      default: 'id'
    },
    selectDataLabel: {
      // 已选数据的数据的label，如果不是name 这里设置默认值
      type: String,
      default: 'name'
    },
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false // 是否支持多选，根据设计图和需求设置默认值
    },
    title: {
      // 标题，根据设计图和需求设置默认值
      type: String,
      default: '用户选择'
    }
  },
  data() {
    return {
      otherParams: null,
      treeProps: {
        props: {
          label: 'name', //指定tree 的label
          value: 'id' // 指定tree 的value
        },
        lazy: true,
        load: (node, resolve) => {
          const { level, data } = node

          if (level === 0) {
            // 这里一般是初始化， resolve(xxx)  xxx为返回数据数据
          } else {
            // 这里是处理初始化和顶层的事件 resolve(xxx)  xxx为返回数据数据
          }
        }
      },
      treeEvents: {
        // 这里透传一些tree的事件， cpitree 和eltree 支持的事件他都支持
        'node-click': node => {
          // 一般在点击某个节点会，会拿节点的数据去请求表格。 例如人员选择， 点击部门节点，会拿部门id去请求人员列表
          this.otherParams = {}
          this.$refs.dialog.getTable().reset()
        }
      },
      tableEvents: {
        // 这里透传一些table的事件， cpitable 支持的事件他都支持
      },
      tableProps: {
        // 这里的一些参数 将会透传给 cpistable， cpistable支持的props 这里都可以用
        request: () => {
          //   表格的请求
        },
        search: [], // 这里是表格搜索区域
        columns: [] // 这里的表格的列配置
      }
    }
  },
  computed: {
    localVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  }
}
</script>
