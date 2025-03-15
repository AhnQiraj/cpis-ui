<template>
  <CpisDialogTreeTable
    ref="dialog"
    :multiple="multiple"
    size="medium"
    :title="title"
    append-to-body
    :selected-data="selectedData"
    :modal="false"
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
  name: 'CpisEquipTypeSelectDialog',
  props: {
    selectedData: {
      type: Array,
      default: null
    },
    selectDataKey: {
      type: String,
      default: 'id'
    },
    selectDataLabel: {
      type: String,
      default: 'name'
    },
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择设备类型'
    }
  },
  data() {
    return {
      otherParams: null,
      treeProps: {
        props: {
          label: 'title',
          value: 'key',
          isLeaf: 'isLeaf'
        },
        lazy: true,
        load: (node, resolve) => {
          const { level, data } = node
          if (level === 0) {
            window.apiList['equipment/index'].eqTypeTopTree('').then(res => {
              let arr = res.data
              for (let i = 0; i < res.data.length; i++) {
                arr[i].isLeaf = res.data[i].data.isLeaf
              }
              return resolve(arr)
            })
          }
          if (level !== 0) {
            let id = node.data.key
            window.apiList['equipment/index'].eqTypeSubTree(id).then(res => {
              let arr = res.data
              for (let i = 0; i < res.data.length; i++) {
                arr[i].isLeaf = res.data[i].data.isLeaf
              }
              resolve(arr)
            })
          }
        }
      },
      treeEvents: {
        'node-click': node => {
          this.otherParams = {
            path: node.data.path,
            pathEqTypeId: node.key
          }
          this.$refs.dialog.getTable().reset()
        }
      },
      tableProps: {
        paramaterMode: 'flat',
        request: ({ requestPage, ...parameters }) => {
          return window.apiList['equipment/index']
            .eqTypePage({ requestPage, parameters: { ...parameters, isOn: 'Y' } })
            .then(res => {
              return {
                data: res?.data?.records ?? [],
                total: res?.data?.total ?? 0
              }
            })
        },
        search: [
          {
            label: '关键字',
            prop: 'key'
          }
        ],
        columns: [
          {
            label: '序号',
            prop: 'index',
            valueType: 'index'
          },
          {
            label: '设备类型编码',
            prop: 'eqTypeNo'
          },
          {
            label: '设备类型名称',
            prop: 'eqTypeName'
          },
          {
            label: '上级设备类型',
            prop: 'parentEqTypeName'
          },
          {
            label: '备注',
            prop: 'memo'
          }
        ]
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
