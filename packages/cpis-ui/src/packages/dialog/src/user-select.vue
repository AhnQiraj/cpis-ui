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
  name: 'CpisUserSelectDialog',
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
      default: '用户选择'
    }
  },
  data() {
    return {
      otherParams: null,
      treeProps: {
        props: {
          label: 'name',
          value: 'id'
        },
        lazy: true,
        load: (node, resolve) => {
          const { level, data } = node
          const userInfo = JSON.parse(sessionStorage.getItem('INFO'))
          if (level === 0) {
            return resolve([
              {
                id: userInfo.company.companyId,
                name: userInfo.company.companyName
              }
            ])
          }
          const _param = {
            parameters: [
              {
                key: 'orgId',
                value: data.id
              },
              {
                key: 'depth',
                value: level + 1
              }
            ]
          }
          window.apiList['common/index'].findEntityAllByCond(_param).then(res => {
            return resolve(res?.data?.dataResult ?? [])
          })
        }
      },
      treeEvents: {
        'node-click': node => {
          this.otherParams = {
            key: 'Q^GROUP_ID_^S',
            value: node.id
          }
          this.$refs.dialog.getTable().reset()
        }
      },
      tableProps: {
        paramaterMode: 'structured',
        request: ({ parameters = [], requestPage }) => {
          const _parameters = Array.isArray(parameters) ? [...parameters] : [parameters]
          if (this.otherParams) {
            _parameters.push(this.otherParams)
          }
          return window.apiList['org/employee']
            .queryUserList({ requestPage, ...(_parameters.length > 0 ? { parameters: _parameters } : {}) })
            .then(res => {
              return {
                data: res?.data?.dataResult ?? [],
                total: res?.data?.pageResult?.totalCount ?? 0
              }
            })
        },
        search: [
          {
            label: '姓名',
            prop: 'Q^NAME_^SL'
          },
          {
            label: '部门',
            prop: 'Q^ORG_NAME_^SL'
          },
          {
            label: '工号',
            prop: 'Q^ACCOUNT_^SL'
          }
        ],
        columns: [
          {
            label: '序号',
            prop: 'index',
            valueType: 'index'
          },
          {
            label: '用户账户',
            prop: 'account'
          },
          {
            label: '姓名',
            prop: 'name'
          },
          {
            label: '部门',
            prop: 'orgName'
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
